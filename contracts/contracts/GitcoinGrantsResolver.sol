// SPDX-License-Identifier: MIT
pragma solidity 0.8.27;

import {IEAS, Attestation} from "@ethereum-attestation-service/eas-contracts/contracts/IEAS.sol";
import {SchemaResolver} from "@ethereum-attestation-service/eas-contracts/contracts/resolver/SchemaResolver.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title GitcoinGrantsResolver
 * @notice A schema resolver that facilitates attestation resolution for Gitcoin Grants.
 * @dev The contract is designed to be used with the Gitcoin Grants schema and delegate attestations 
    to Gitcoin Donors by delegating the attestations and assigning a attestation fee.
 */
contract GitcoinGrantsResolver is SchemaResolver, Ownable {

    error InvalidAttester();

    mapping(address => bool) public validDelegators;

    /**
     * @dev Constructor to initialize the contract with essential parameters.
     * @param eas The Extended Attestation Schema contract.
     */
    constructor(
        IEAS eas,
        address[] memory _validDelegators
    ) SchemaResolver(eas) Ownable(msg.sender) {
        for (uint256 i = 0; i < _validDelegators.length; i++) {
            validDelegators[_validDelegators[i]] = true;
        }
    }


    /**
    * @dev Handles attestation by validating the attester and bond value.
    * @param attestation The attestation data.
    * @return Boolean indicating the success of the attestation.
    */
    function onAttest(
        Attestation calldata attestation,
        uint256 /* value */
    ) internal view override returns (bool) {
        address attester = attestation.attester;
        if (!validDelegators[attester]) {
            revert InvalidAttester();
        }
       
        return true;
    }

    /**
    * @dev Checks if an attestation can be revoked based on resolution status and time.
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
    function addValidDelegator(address delegator) external onlyOwner {
        validDelegators[delegator] = true;
    }

    /**
     * @notice Removes a valid delegator.
     * @param delegator The address of the valid delegator to be removed.
     */ 
    function removeValidDelegator(address delegator) external onlyOwner {
        validDelegators[delegator] = false;
    }
}