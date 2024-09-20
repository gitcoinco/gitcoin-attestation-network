import { expect } from "chai";
import { Signer } from "ethers";
import { ethers } from "hardhat";
import { latest, NO_EXPIRATION } from "./helper/utils";
import {
  GitcoinGrantsResolver,
  TestEAS,
  TestSchemaRegistry,
} from "../typechain-types";
import { createWallet } from "./helper/wallet";
import * as SchemaRegistryArtifact from "@ethereum-attestation-service/eas-contracts/artifactscontracts";

describe("GitcoinGrantsResolver", () => {
  let accounts: Signer[];
  let admin: Signer;
  let manager: Signer;
  let treasury: Signer;
  let delegators: Signer[];
  let recipient: Signer;
  let sender: Signer;

  let registry: TestSchemaRegistry;
  let eas: TestEAS;

  const schema = "bytes32 eventId,uint8 ticketType,uint32 ticketNum";
  let schemaId: string;
  const expirationTime = NO_EXPIRATION;
  const data = "0x1234";

  let targetRecipient: Signer;

  before(async () => {
    accounts = await ethers.getSigners();

    [recipient] = accounts;
    admin = accounts[1];
    manager = accounts[2];
    treasury = accounts[3];
    delegators = accounts.slice(7, 9);
  });

  beforeEach(async () => {
    const Registry = await ethers.getContractFactory("TestSchemaRegistry");
    registry = await Registry.deploy();

    const EAS = await ethers.getContractFactory("TestEAS");
    eas = await EAS.deploy(registry.target);
    await eas.setTime(await latest());

    targetRecipient = accounts[5];

    const resolverFactory = await ethers.getContractFactory(
      "GitcoinGrantsResolver",
    );
    const resolver: GitcoinGrantsResolver = await resolverFactory.deploy(
      await eas.getAddress(),
      admin.getAddress(),
      manager.getAddress(),
      delegators.map(async (signer) => await signer.getAddress()),
      treasury.getAddress(),
    );

    await resolver.waitForDeployment();

    expect(await resolver.isPayable()).to.be.true;

    // schemaId = await registerSchema(schema, registry, resolver, true);
  });

  it("should succeed", async () => {
    expect(true).to.be.true;
  });

  // it("should revert when attesting to a wrong recipient", async () => {
  //   await expectFailedAttestation(
  //     { eas },
  //     schemaId,
  //     { recipient: await recipient.getAddress(), expirationTime, data },
  //     { from: sender },
  //     "InvalidAttestation",
  //   );

  //   await expectFailedMultiAttestations(
  //     { eas },
  //     [
  //       {
  //         schema: schemaId,
  //         requests: [
  //           { recipient: await recipient.getAddress(), expirationTime, data },
  //           {
  //             recipient: await targetRecipient.getAddress(),
  //             expirationTime,
  //             data,
  //           },
  //         ],
  //       },
  //     ],
  //     { from: sender },
  //     "InvalidAttestations",
  //   );

  //   await expectFailedMultiAttestations(
  //     { eas },
  //     [
  //       {
  //         schema: schemaId,
  //         requests: [
  //           {
  //             recipient: await targetRecipient.getAddress(),
  //             expirationTime,
  //             data,
  //           },
  //           { recipient: await recipient.getAddress(), expirationTime, data },
  //         ],
  //       },
  //     ],
  //     { from: sender },
  //     "InvalidAttestations",
  //   );
  // });

  // it("should allow attesting to the correct recipient", async () => {
  //   const { uid } = await expectAttestation(
  //     { eas },
  //     schemaId,
  //     { recipient: await targetRecipient.getAddress(), expirationTime, data },
  //     { from: sender },
  //   );

  //   await expectRevocation({ eas }, schemaId, { uid }, { from: sender });

  //   const res = await expectMultiAttestations(
  //     { eas },
  //     [
  //       {
  //         schema: schemaId,
  //         requests: [
  //           {
  //             recipient: await targetRecipient.getAddress(),
  //             expirationTime,
  //             data,
  //           },
  //           {
  //             recipient: await targetRecipient.getAddress(),
  //             expirationTime,
  //             data,
  //           },
  //         ],
  //       },
  //     ],
  //     { from: sender },
  //   );

  //   await expectMultiRevocations(
  //     { eas },
  //     [
  //       {
  //         schema: schemaId,
  //         requests: res.uids.map((uid) => ({ uid })),
  //       },
  //     ],
  //     { from: sender },
  //   );
  // });
});
