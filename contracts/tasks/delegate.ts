import { task } from "hardhat/config";
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
task("delegate", "").setAction(async (_, hre) => {
  const { ethers } = hre;
  const [wallet] = await ethers.getSigners();
  const address = await wallet.getAddress();

  console.log("Wallet+ Ethereum Address:", address);

  const EAS_OPTIMISM_SEPOLIA = "0x4200000000000000000000000000000000000021";
  const GITCOIN_GRANTS_SCHEMA_UID = process.env.GITCOIN_GRANTS_SCHEMA_UID!;
  const SCHEMA = process.env.SCHEMA!;
  const eas = new EAS(EAS_OPTIMISM_SEPOLIA, {
    signer: wallet,
  });

  const schemaEncoder = new SchemaEncoder(SCHEMA);
  const encodedData = schemaEncoder.encodeData([
    { name: "eventId", value: 1, type: "uint256" },
    { name: "voteIndex", value: 1, type: "uint8" },
  ]);

  eas.connect(wallet);

  const delegated = await eas.getDelegated();

  const signer = wallet;

  // This will happen serverside on the backend handled by Gitcoin
  const response = await delegated.signDelegatedAttestation(
    {
      schema: GITCOIN_GRANTS_SCHEMA_UID,
      recipient: "0xFD50b031E778fAb33DfD2Fc3Ca66a1EeF0652165",
      expirationTime: 0n,
      revocable: false,
      refUID:
        "0x0000000000000000000000000000000000000000000000000000000000000000",
      data: encodedData,
      deadline: 0n,
      value: 1000n,
    },
    signer
  );

  // This will happen from the user side that wants to mint their attestation that gitcoin signed
  // This ensures that only gitcoin signed attestation can be minted as we are using a custom schemaResolver that also adds a attestationFee

  try {
    const transaction = await eas.attestByDelegation({
      schema: GITCOIN_GRANTS_SCHEMA_UID,
      data: {
        recipient: "0xFD50b031E778fAb33DfD2Fc3Ca66a1EeF0652165",
        expirationTime: 0n,
        revocable: false,
        refUID:
          "0x0000000000000000000000000000000000000000000000000000000000000000",
        data: encodedData,
        value: 1000n,
      },
      signature: response.signature,
      attester: signer.address,
      deadline: 0n,
    });

    const receipt = await transaction.wait();

    console.log("DegatedAttestation Transaction receipt:", receipt);
  } catch (error) {
    console.error("Error:", error);
  }
});
