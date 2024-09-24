// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity 0.8.26;

// External Libraries
import {SchemaResolver} from "@ethereum-attestation-service/eas-contracts/contracts/resolver/SchemaResolver.sol";
import {IEAS, Attestation} from "@ethereum-attestation-service/eas-contracts/contracts/IEAS.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
/**
 * @title GitcoinGrantsResolver
 * @notice A schema resolver that facilitates attestation resolution for the Gitcoin Attestation Network.
 * @dev The contract uses AccessControl for managing roles of valid delegators and delegator managers.
 */
contract GitcoinGrantsResolver is SchemaResolver, AccessControl {
    using Address for address payable;
    using SafeERC20 for IERC20;
    // ===============
    // === Errors ====
    // ===============

    error UnauthorizedAttester();
    error NotDelegatorsManager();
    error NotAdmin();
    error ZeroAddress();

    // ==================
    // === Constants ====
    // ==================

    /// @notice Role for delegators
    bytes32 public constant DELEGATOR_ROLE = keccak256("DELEGATOR_ROLE");

    /// @notice Role for managing the delegators
    bytes32 public constant DELEGATORS_MANAGER_ROLE = keccak256("DELEGATORS_MANAGER_ROLE");

    /// @notice Address of the native token
    address public constant NATIVE = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;

    // ==================
    // === Variables ====
    // ==================

    address public treasury;

    // ==================
    // ===== Events =====
    // ==================

    /// @notice Emitted when the treasury address is updated.
    /// @param treasury The address of the treasury.
    event TreasuryUpdated(address indexed treasury);

    /// @notice Emitted when an attestation happens.
    /// @param uid Attesation ID.
    /// @param recipient The address of the recipient.
    /// @param fee The attestation fee.
    /// @param data The attestation data.
    /// @param refUID The reference attestation ID.
    event OnAttested(bytes32 indexed uid, address indexed recipient, uint256 fee, bytes data, bytes32 refUID);

    /// ====================================
    /// ========== Constructor =============
    /// ====================================

    /**
     * @dev Constructor to initialize the contract with essential parameters.
     * @param _eas The address of the EAS contract.
     * @param _admin The address of the contract admin (owner).
     * @param _manager The manager of the contract delegators.
     * @param _delegators The list of initial valid delegators.
     * @param _treasury The address of the treasury.
     */
    constructor(
        IEAS _eas,
        address _admin,
        address _manager,
        address[] memory _delegators,
        address _treasury
    ) SchemaResolver(_eas) {
        // Set the admin role to the provided admin address
        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(DELEGATORS_MANAGER_ROLE, _manager);

        // Assign the DELEGATOR_ROLE to initial delegators
        _addDelegators(_delegators);

        _updateTreasury(_treasury);
    }

    /// ====================================
    /// ======= External / Public ==========
    /// ====================================

    /**
     * @dev Handles attestation by validating the attester.
     * @param attestation The attestation data.
     * @return Boolean indicating the success of the attestation.
     */
    function onAttest(Attestation calldata attestation, uint256 value) internal override returns (bool) {
        if (!hasRole(DELEGATOR_ROLE, attestation.attester)) {
            revert UnauthorizedAttester();
        }

        (bool success, ) = treasury.call{value: value}("");
        require(success, "Fee transfer failed");

        emit OnAttested(attestation.uid, attestation.recipient, value, attestation.data, attestation.refUID);

        return true;
    }

    /**
     * @dev Checks if an attestation can be revoked.
     * @return Boolean indicating whether the attestation can be revoked.
     */
    function onRevoke(
        Attestation calldata, // attestation
        uint256 //value
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
     * @notice Add delegators.
     * @param _delegators An array of addresses representing the delegators to be added.
     */
    function addDelegators(address[] memory _delegators) public {
        if (!hasRole(DELEGATORS_MANAGER_ROLE, msg.sender)) {
            revert NotDelegatorsManager();
        }

        _addDelegators(_delegators);
    }

    /**
     * @notice Remove delegators.
     * @param _delegators An array of addresses representing the delegators to be removed.
     */
    function removeDelegators(address[] memory _delegators) public {
        if (!hasRole(DELEGATORS_MANAGER_ROLE, msg.sender)) {
            revert NotDelegatorsManager();
        }

        uint256 length = _delegators.length;
        for (uint256 i = 0; i < length; i++) {
            _removeDelegator(_delegators[i]);
        }
    }

    /**
     * @notice Updates the treasury address.
     * @param _treasury The address of the treasury.
     */
    function updateTreasury(address _treasury) external {
        if (!hasRole(DEFAULT_ADMIN_ROLE, msg.sender)) {
            revert NotAdmin();
        }
        _updateTreasury(_treasury);
    }

    /**
     * @notice Withdraws the contract balance to the specified address.
     * @param _token The address to which the balance will be transferred.
     * @param _to The address to which the balance will be transferred.
     * @param _amount The amount to be transferred.
     */
    function withdraw(address _token, address _to, uint256 _amount) external {
        if (!hasRole(DEFAULT_ADMIN_ROLE, msg.sender)) {
            revert NotAdmin();
        }
        transferAmount(_token, _to, _amount);
    }

    /// ====================================
    /// ======= Internal / Private =========
    /// ====================================

    /**
     * @notice Transfer an amount of a token to an address
     * @param _token The token to transfer
     * @param _to The address to transfer to
     * @param _amount The amount to transfer
     */
    function transferAmount(address _token, address _to, uint256 _amount) internal {
        if (_token == NATIVE) {
            payable(_to).sendValue(_amount);
        } else {
            IERC20(_token).safeTransfer(_to, _amount);
        }
    }

    /**
     *
     * @notice Adds a list of valid delegators.
     * @dev Adds a list of valid delegators.
     * @param _delegators An array of addresses representing the delegators to be added.
     *
     */
    function _addDelegators(address[] memory _delegators) private {
        uint256 length = _delegators.length;
        for (uint256 i = 0; i < length; i++) {
            _addDelegator(_delegators[i]);
        }
    }

    /**
     *
     * @notice Updates the treasury address.
     * @param _treasury The address of the treasury.
     * @dev Updates the treasury address.
     *
     */
    function _updateTreasury(address _treasury) private {
        if (_treasury == address(0)) {
            revert ZeroAddress();
        }
        treasury = _treasury;
        emit TreasuryUpdated(treasury);
    }

    /**
     * @notice Adds a new valid delegator.
     * @param _delegator The address of the new valid delegator.
     */
    function _addDelegator(address _delegator) private {
        if (_delegator == address(0)) {
            revert ZeroAddress();
        }
        _grantRole(DELEGATOR_ROLE, _delegator);
    }

    /**
     * @notice Removes a delegator.
     * @param _delegator The address of the valid delegator to be removed.
     */
    function _removeDelegator(address _delegator) private {
        _revokeRole(DELEGATOR_ROLE, _delegator);
    }
}
