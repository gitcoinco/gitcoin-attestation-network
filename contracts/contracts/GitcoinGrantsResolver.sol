// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

import {SchemaResolver} from "@ethereum-attestation-service/eas-contracts/contracts/resolver/SchemaResolver.sol";
import {IEAS, Attestation} from "@ethereum-attestation-service/eas-contracts/contracts/IEAS.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {SafeTransferLib} from "solady/src/utils/SafeTransferLib.sol";

/**
 * @title GitcoinGrantsResolver
 * @notice A schema resolver that facilitates attestation resolution for the Gitcoin Attestation Network.
 * @dev The contract uses AccessControl for managing roles of valid delegators and delegator managers.
 */
contract GitcoinGrantsResolver is SchemaResolver, AccessControl {
    using SafeTransferLib for address;

    error UnauthorizedAttester();
    error NotDelegatorsManager();
    error NotAdmin();

    /// @notice Role for valid delegators
    bytes32 public constant VALID_DELEGATOR_ROLE = keccak256("VALID_DELEGATOR_ROLE");
    
    /// @notice Role for managing the valid delegators
    bytes32 public constant DELEGATORS_MANAGER_ROLE = keccak256("DELEGATORS_MANAGER_ROLE");
    
    /// @notice Address of the native token
    address public constant NATIVE = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;

    /**
     * @dev Constructor to initialize the contract with essential parameters.
     * @param admin The address of the contract admin (owner).
     * @param manager The manager of the contract delegators.
     * @param delegators The list of initial valid delegators.
     */
    constructor(
        IEAS eas,
        address admin,
        address manager,
        address[] memory delegators
    ) SchemaResolver(eas) {
        // Set the admin role to the provided admin address
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(DELEGATORS_MANAGER_ROLE, manager);

        // Assign the VALID_DELEGATOR_ROLE to initial delegators
        for (uint256 i = 0; i < delegators.length; i++) {
            _grantRole(VALID_DELEGATOR_ROLE, delegators[i]);
        }
    }

    /**
     * @dev Handles attestation by validating the attester.
     * @param attestation The attestation data.
     * @return Boolean indicating the success of the attestation.
     */
    function onAttest(
        Attestation calldata attestation,
        uint256 /* value */
    ) internal view override returns (bool) {
        address attester = attestation.attester;
        if (!hasRole(VALID_DELEGATOR_ROLE, attester)) {
            revert UnauthorizedAttester();
        }

        return true;
    }

    /**
     * @dev Checks if an attestation can be revoked.
     * @return Boolean indicating whether the attestation can be revoked.
     */
    function onRevoke(
        Attestation calldata /* attestation */,
        uint256 /* value */
    ) internal pure override returns (bool) {
        return false;
    }

    /**
     * @notice Indicates whether the contract is designed to handle incoming payments.
     * @return True, indicating that the contract can accept payments.
     */
    function isPayable() public pure override returns (bool) {
        return true;
    }

    /**
     * @notice Adds a new valid delegator.
     * @param delegator The address of the new valid delegator.
     */
    function addValidDelegator(address delegator) external {
        if (!hasRole(DELEGATORS_MANAGER_ROLE, msg.sender)) {
            revert NotDelegatorsManager();
        }
        _grantRole(VALID_DELEGATOR_ROLE, delegator);
    }

    /**
     * @notice Removes a valid delegator.
     * @param delegator The address of the valid delegator to be removed.
     */
    function removeValidDelegator(address delegator) external {
        if (!hasRole(DELEGATORS_MANAGER_ROLE, msg.sender)) {
            revert NotDelegatorsManager();
        }
        _revokeRole(VALID_DELEGATOR_ROLE, delegator);
    }

    /**
     * @notice Withdraws the contract balance to the specified address.
     * @param _token The address to which the balance will be transferred.
     * @param _to The address to which the balance will be transferred.
     * @param _amount The amount to be transferred.
     */
    function withdraw(
        address _token, 
        address _to, 
        uint256 _amount
    ) external {
        if (!hasRole(DEFAULT_ADMIN_ROLE, msg.sender)) {
            revert NotAdmin();
        }
        transferAmount(_token, _to, _amount);
    }

    /**
     * @notice Transfer an amount of a token to an address
     * @param _token The token to transfer
     * @param _to The address to transfer to
     * @param _amount The amount to transfer
     */
    function transferAmount(address _token, address _to, uint256 _amount) internal {
        if (_token == NATIVE) {
            _to.safeTransferETH(_amount);
        } else {
            _token.safeTransfer(_to, _amount);
        }
    }
}
