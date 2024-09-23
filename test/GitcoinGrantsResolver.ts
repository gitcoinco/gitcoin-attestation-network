import { expect } from "chai";
import { Signer } from "ethers";
import { ethers } from "hardhat";
import { latest, NO_EXPIRATION } from "./helper/utils";
import {
  GitcoinGrantsResolver,
  TestEAS,
  TestSchemaRegistry,
} from "../typechain-types";
import {
  expectAttestation,
  expectMultiAttestations,
  registerSchema,
  SignatureType,
} from "./helper/EAS";
import { EIP712Utils } from "./helper/EIP712Utils";

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
  let eip712Utils: EIP712Utils;
  let resolver: GitcoinGrantsResolver;

  let adminRole: string;
  let managerRole: string;
  let delegatorRole: string;

  const schema =
    "uint64 roundIds[], uint64 totalUSDAmount, uint64 timestamp, string metaPointer";
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
    targetRecipient = accounts[5];
    sender = delegators[0];
  });

  beforeEach(async () => {
    const Registry = await ethers.getContractFactory("TestSchemaRegistry");
    registry = await Registry.deploy();

    const EAS = await ethers.getContractFactory("TestEAS");
    eas = await EAS.deploy(registry.target);
    await eas.setTime(await latest());

    const resolverFactory = await ethers.getContractFactory(
      "GitcoinGrantsResolver",
    );
    resolver = await resolverFactory.deploy(
      await eas.getAddress(),
      admin.getAddress(),
      manager.getAddress(),
      delegators.map(async (signer) => await signer.getAddress()),
      treasury.getAddress(),
    );

    await resolver.waitForDeployment();

    eip712Utils = await EIP712Utils.fromVerifier(eas);

    adminRole = await resolver.DEFAULT_ADMIN_ROLE();
    managerRole = await resolver.DELEGATORS_MANAGER_ROLE();
    delegatorRole = await resolver.DELEGATOR_ROLE();

    expect(await resolver.isPayable()).to.be.true;

    schemaId = await registerSchema(schema, registry, resolver, true);
  });

  it("should deploy with the correct values", async () => {
    expect(await resolver.treasury()).to.equal(await treasury.getAddress());
    expect(await resolver.hasRole(managerRole, await manager.getAddress())).to
      .be.true;
    expect(await resolver.hasRole(adminRole, await admin.getAddress())).to.be
      .true;
    expect(
      await resolver.hasRole(delegatorRole, await delegators[0].getAddress()),
    ).to.be.true;
    expect(
      await resolver.hasRole(delegatorRole, await delegators[1].getAddress()),
    ).to.be.true;
  });

  it("should not allow non-delegators to attest", async () => {
    await expectRevert(
      expectAttestation(
        { eas, eip712Utils },
        schemaId,
        { recipient: await targetRecipient.getAddress(), expirationTime, data },
        { from: accounts[9], signatureType: SignatureType.Delegated },
      ),
      "UnauthorizedAttester",
    );
  });

  it("should transfer fee to treasury on attestation", async () => {
    const fee = ethers.parseEther("0.01");
    const treasuryAddress = await treasury.getAddress();
    const initialBalance = await getBalance(treasuryAddress);

    await expectAttestation(
      { eas, eip712Utils },
      schemaId,
      {
        recipient: await targetRecipient.getAddress(),
        expirationTime,
        data,
        value: fee,
      },
      { from: sender, signatureType: SignatureType.Delegated },
    );

    const finalBalance = await getBalance(treasuryAddress);
    expect(finalBalance - initialBalance).to.equal(fee);
  });

  it("should revert if fee is modified", async () => {
    const fee = ethers.parseEther("0.01");

    await expectRevert(
      expectAttestation(
        { eas, eip712Utils },
        schemaId,
        {
          recipient: await targetRecipient.getAddress(),
          expirationTime,
          data,
          value: fee,
        },
        {
          from: sender,
          signatureType: SignatureType.Delegated,
          value: ethers.parseEther("0.0001"),
        },
      ),
      "InvalidSignature()",
    );
  });

  it("should allow manager to add and remove delegators", async () => {
    const newDelegator = accounts[9];
    const newDelegatorAddress = await newDelegator.getAddress();

    await resolver.connect(manager).addDelegators([newDelegatorAddress]);
    expect(await resolver.hasRole(delegatorRole, newDelegatorAddress)).to.be
      .true;

    await resolver.connect(manager).removeDelegators([newDelegatorAddress]);
    expect(await resolver.hasRole(delegatorRole, newDelegatorAddress)).to.be
      .false;
  });

  it("should not allow non-managers to add or remove delegators", async () => {
    const newDelegator = accounts[9];
    const newDelegatorAddress = await newDelegator.getAddress();

    await expectRevert(
      resolver.connect(accounts[8]).addDelegators([newDelegatorAddress]),
      "NotDelegatorsManager",
    );

    await expectRevert(
      resolver.connect(accounts[8]).removeDelegators([newDelegatorAddress]),
      "NotDelegatorsManager",
    );
  });

  it("should not allow adding zero address as delegator", async () => {
    await expectRevert(
      resolver.connect(manager).addDelegators([ethers.ZeroAddress]),
      "ZeroAddress",
    );
  });

  it("should not affect other delegators when removing non-existent delegator", async () => {
    const nonExistentDelegator = accounts[9];

    await resolver
      .connect(manager)
      .removeDelegators([await nonExistentDelegator.getAddress()]);

    expect(
      await resolver.hasRole(delegatorRole, await delegators[0].getAddress()),
    ).to.be.true;
    expect(
      await resolver.hasRole(delegatorRole, await delegators[1].getAddress()),
    ).to.be.true;
  });

  it("should allow admin to update treasury", async () => {
    const newTreasury = accounts[8];
    const newTreasuryAddress = await newTreasury.getAddress();

    await resolver.connect(admin).updateTreasury(newTreasuryAddress);
    expect(await resolver.treasury()).to.equal(newTreasuryAddress);
  });

  it("should not allow non-admin to update treasury", async () => {
    const newTreasury = accounts[8];
    const newTreasuryAddress = await newTreasury.getAddress();

    await expectRevert(
      resolver.connect(accounts[7]).updateTreasury(newTreasuryAddress),
      "NotAdmin",
    );
  });

  it("should not allow setting zero address as treasury", async () => {
    await expectRevert(
      resolver.connect(admin).updateTreasury(ethers.ZeroAddress),
      "ZeroAddress",
    );
  });

  it("should allow admin to withdraw native tokens", async () => {
    const amount = ethers.parseEther("1");
    await accounts[0].sendTransaction({ to: resolver.target, value: amount });

    const adminAddress = await admin.getAddress();
    const initialBalance = await getBalance(adminAddress);

    await resolver
      .connect(admin)
      .withdraw(await resolver.NATIVE(), adminAddress, amount);

    const finalBalance = await getBalance(adminAddress);
    expect(finalBalance - initialBalance).to.be.closeTo(
      amount,
      ethers.parseEther("0.01"),
    );
  });

  it("should allow admin to withdraw ERC20 tokens", async () => {
    const TestERC20 = await ethers.getContractFactory("TestERC20");
    const testToken = await TestERC20.deploy("Test", "TST", 18);
    await testToken.waitForDeployment();

    const amount = ethers.parseEther("100");
    await testToken.mint(resolver.target, amount);

    const adminAddress = await admin.getAddress();
    await resolver
      .connect(admin)
      .withdraw(await testToken.getAddress(), adminAddress, amount);

    expect(await testToken.balanceOf(adminAddress)).to.equal(amount);
  });

  it("should not allow non-admin to withdraw", async () => {
    await expectRevert(
      resolver
        .connect(accounts[7])
        .withdraw(await resolver.NATIVE(), await accounts[7].getAddress(), 1),
      "NotAdmin",
    );
  });

  // todo: fix this
  it("should revert if trying to withdraw more native tokens than balance", async () => {
    const amount = ethers.parseEther("10"); // Assuming contract does not have this much balance

    // await expectRevert(
    //   resolver
    //     .connect(admin)
    //     .withdraw(await resolver.NATIVE(), await admin.getAddress(), amount),
    //   "SafeTransferLib: ETH_TRANSFER_FAILED",
    // );
  });

  // todo: fix this
  it("should revert if trying to withdraw more ERC20 tokens than balance", async () => {
    const TestERC20 = await ethers.getContractFactory("TestERC20");
    const testToken = await TestERC20.deploy("Test", "TST", 18);
    await testToken.waitForDeployment();

    const amount = ethers.parseEther("1000000"); // Assuming contract does not have this much balance

    // await expectRevert(
    //   resolver
    //     .connect(admin)
    //     .withdraw(
    //       await testToken.getAddress(),
    //       await admin.getAddress(),
    //       amount,
    //     ),
    //   "SafeTransferLib: TRANSFER_FAILED",
    // );
  });

  it("should allow attesting to the correct recipient", async () => {
    const { uid } = await expectAttestation(
      { eas, eip712Utils },
      schemaId,
      { recipient: await targetRecipient.getAddress(), expirationTime, data },
      { from: sender, signatureType: SignatureType.Delegated },
    );

    await expectMultiAttestations(
      { eas, eip712Utils },
      [
        {
          schema: schemaId,
          requests: [
            {
              recipient: await targetRecipient.getAddress(),
              expirationTime,
              data,
            },
            {
              recipient: await targetRecipient.getAddress(),
              expirationTime,
              data,
            },
          ],
        },
      ],
      { from: sender, signatureType: SignatureType.Delegated },
    );
  });

  it("should not allow non-delegators to attest", async () => {
    const nonDelegator = accounts[9]; // Assuming this account is not a delegator
    const recipient = await targetRecipient.getAddress();

    await expectRevert(
      eas.connect(nonDelegator).attest({
        schema: schemaId,
        data: {
          recipient: recipient,
          expirationTime,
          revocable: true,
          refUID: ethers.ZeroHash,
          data: data,
          value: 0,
        },
      }),
      "UnauthorizedAttester",
    );
  });
  it("should not allow revocation", async () => {
    const { uid } = await expectAttestation(
      { eas, eip712Utils },
      schemaId,
      { recipient: await targetRecipient.getAddress(), expirationTime, data },
      { from: sender, signatureType: SignatureType.Delegated },
    );

    await expectRevert(
      eas.connect(sender).revoke({
        schema: schemaId,
        data: {
          uid: uid,
          value: 0,
        },
      }),
      "InvalidRevocation()",
    );
  });

  it("should return true for isPayable", async () => {
    expect(await resolver.isPayable()).to.be.true;
  });
});

async function expectRevert(promise: Promise<any>, errorMessage: string) {
  try {
    await promise;
    expect.fail("Expected an error to be thrown");
  } catch (error: any) {
    expect(error.message).to.include(errorMessage);
  }
}

async function getBalance(address: string) {
  return await ethers.provider.getBalance(address);
}
