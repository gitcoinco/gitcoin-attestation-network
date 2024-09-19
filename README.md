# Gitcoin Attestation Network

This repository contains a Proof of Concept for the Gitcoin Attestation Network. This feature allows users to mint on-chain attestations as proof of their donations. Attestations are created using delegated signing and stored on-chain to ensure transparency and verifiable records of contributions.

## Table of Contents

1. [Overview](#overview)
2. [Supported Networks](#supported-networks)
3. [How It Works](#how-it-works)
4. [Pros and Cons](#pros-and-cons)
5. [Getting Started](#getting-started)
6. [Attestation Schema](#attestation-schema)

## Overview

The Gitcoin Attestation Network enables users to mint attestations tied to their donations across multiple networks. Using the **Ethereum Attestation Service (EAS)**, Gitcoin can delegate the signing process to trusted validators. After completing a donation, users are prompted to mint these attestations on the network of their choice, leveraging **Custom EAS SchemaResolver** to validate the process.

## Supported Networks

The Gitcoin Attestation Network currently supports the following networks natively via **Ethereum Attestation Service (EAS)**:

- **Mainnets**: Ethereum, Optimism, Base, Arbitrum One, Arbitrum Nova, Scroll, Linea, Polygon, Blast, Celo
- **Testnets**: Sepolia, Optimism Sepolia, Optimism Goerli, Base Sepolia, Base Goerli, Polygon Amoy, Linea Goerli, Scroll Sepolia
---

>> `Additional networks support requires hosting custom infrastructure, including contract deployment and indexer services.`
---

## How It Works

1. **Donation**: Users donate to one or more projects, potentially across multiple networks.
   
2. **Checkout**: After completing their donations, users are given the option to mint attestation proofs of their contributions. 
`WIP: Decide whether to issue one attestation per donation or one attestation for the entire checkout.`

3. **Network Selection**: The user selects an EAS-supported network (see the full list above) on which they wish to mint their attestations.

4. **Attestation Signing**: Once the user selects the network, Gitcoin’s whitelisted delegator signs the attestation data, ensuring that only valid donations are attested.

5. **Minting**: After the signature is generated, the user is prompted to mint the attestations using either the `multiDelegateAttestation` or `delegateAttestation` functionality provided by EAS. This ensures the attestation is recorded on-chain and serves as a verifiable proof of contribution.

## Pros and Cons

### Pros

- **Modular Attestation Fee**: Fees are dynamically adjusted based on the network’s native token prices, ensuring flexibility in different market conditions.
- **Security**: The use of Gitcoin's custom `SchemaResolver` ensures that only attestations signed by authorized Gitcoin delegators are valid, preserving the integrity of the attestation process.

### Cons

- **Private Key Storage**: The server that stores the private key of Gitcoin’s delegators may present a security risk if not properly managed.
- **Limited Network Support**: Additional networks can only be supported by hosting custom infrastructure, including smart contract deployment and indexers.

## Getting Started

### Prerequisites

- Node.js & npm installed
- Hardhat environment set up
- EAS SDK installed

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/gitcoinco/gitcoin-attestation-network.git
   ```

2. Install dependencies:

   ```bash
   cd gitcoin-attestation-network/contracts
   bun install
   ```

3. Set up environment variables for:

    ```bash
   cp .env.example .env
   ```

   - Update with `your private key`

4. Deploy the `GitcoinGrantsResolver` contract after executing the script. Copy the logged transaction hash from the schema creation transaction and paste it into the [EAS scanner](https://optimism-sepolia.easscan.org/). Copy the schemaUID and update the `.env GITCOIN_GRANTS_SCHEMA_UID`, then you can test the delegate attestation workflow in the next step:

   ```bash
   bun deployResolver
   ```

5. Test the attestation delegation workflow using the included Hardhat task:

   ```bash
   bun delegate
   ```

## Attestation Schema

_The attestation schema is a Work in Progress (WIP)._ The schema will capture key attributes such as the donation amount, project name, expected match, and round details to ensure that all donation data is transparently and verifiably stored on-chain.

---
