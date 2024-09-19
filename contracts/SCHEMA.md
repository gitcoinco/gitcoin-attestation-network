# Donation Attestation Schema (DRAFT)

### **Overview**
This schema records when a user makes one or more donations to different projects during a Gitcoin funding round. It supports multiple donations in the same round and tracks the total amount donated.

### **Schema Details**
- **donor_address**: Ethereum (`address`) of the user who made the donation.
- **round_id**: Unique ID (`uint64`) of the Gitcoin round .
- **project_ids**: List of project IDs (`bytes32[]`) that the user donated to.
- **amounts**: List of donation amounts (`uint128[]`), matching the order of `project_ids`.
- **total_contribution**: Total amount donated (`uint128`) by the user across all projects.
- **timestamp**: Time when the donations were made (`uint64`).
- **currency**: Type of currency used (e.g., ETH, DAI) (`string`).
- **network**: Network ID (`uint16`) where the donations were made (e.g., Ethereum, Polygon).
- **fee**: 
- **signature**:

### **Description**
This schema works across any EAS-supported blockchain network, making it future-proof. Attestations are network-agnostic, so as Gitcoin expands to more chains, an aggregator can easily gather them across networks.

If a user donates to multiple rounds, they can use **multiattest** to attest for all rounds in one transaction, simplifying the process and reducing transaction costs.