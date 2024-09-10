import { task } from "hardhat/config";
import { SchemaRegistry } from "@ethereum-attestation-service/eas-sdk";
task(
  "deployResolver",
  "deploys the custom EAS_Schema_Resolver and then creates the schema"
).setAction(async (_, hre) => {
  const { ethers } = hre;
  const [wallet] = await ethers.getSigners();

  const address = await wallet.getAddress();
  console.log("Wallet+ Ethereum Address:", address);

  const schema = process.env.SCHEMA!;

  const EAS_OPTIMISM_SEPOLIA = "0x4200000000000000000000000000000000000021";
  const REGISTRY_OPTIMISM_SEPOLIA =
    "0x4200000000000000000000000000000000000020";

  const GitcoinGrantsResolverFactory = await ethers.getContractFactory(
    "GitcoinGrantsResolver"
  );
  const GitcoinGrantsResolver = await GitcoinGrantsResolverFactory.deploy(
    EAS_OPTIMISM_SEPOLIA,
    [address]
  );

  const GitcoinGrantsResolverAddress = await GitcoinGrantsResolver.getAddress();

  const registry = new SchemaRegistry(REGISTRY_OPTIMISM_SEPOLIA, {
    signer: wallet,
  });

  const createSchema = await registry.register({
    schema,
    resolverAddress: GitcoinGrantsResolverAddress,
    revocable: false,
  });
  const txHash = await createSchema.wait();
  console.log("Schema Creation TxHash:", txHash);
});
