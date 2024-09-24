// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity 0.8.26;

import { SchemaRegistry } from "@ethereum-attestation-service/eas-contracts/contracts/SchemaRegistry.sol";

contract TestSchemaRegistry is SchemaRegistry {
    constructor() SchemaRegistry() {}
}
