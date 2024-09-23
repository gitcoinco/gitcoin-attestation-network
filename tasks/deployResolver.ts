import { task } from "hardhat/config";
import {
  easConfig,
  getRoles,
  isTestnet,
  schema,
} from "./constants/config/eas.config";
import { Deployments, verifyContract } from "./utils/scripts";
import { TestSchemaRegistry } from "../typechain-types";
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";

task(
  "deployResolver",
  "deploys GitcoinAttestationNetworkResover Contract + Creates the schemaUID"
).setAction(async (_, hre) => {
  const { ethers } = hre;
  const [account] = await ethers.getSigners();
  const network = await account.provider.getNetwork();
  const networkName = hre.network.name;
  const chainId = Number(network.chainId);
  const deployerAddress = await account.getAddress();
  const balance = await account.provider.getBalance(deployerAddress);
  const deployments = new Deployments(chainId, "GitcoinResolver");

  console.log(`
////////////////////////////////////////////////////
Deploys GitcoinGrantsResolver.sol on ${networkName}
////////////////////////////////////////////////////
  `);

  const roles = getRoles(networkName);

  const easParams = easConfig[chainId];
  if (!easParams) {
    throw new Error(
      `GitcoinGrantsResolver params not found for chainId: ${chainId}`
    );
  }

  const resolver = deployments.getResolver();

  if (resolver) {
    console.log(
      "GitcoinGrantsResolver already deployed \n\nGitcoin Resolver Address: " +
        resolver
    );
    return;
  }

  console.table({
    contract: "Deploy GitcoinGrantsResolver.sol",
    chainId: chainId,
    network: networkName,
    owner: roles.owner,
    treasury: roles.treasury,
    deployerAddress: deployerAddress,
    balance: ethers.formatEther(balance),
  });

  console.log("Deploying GitcoinGrantsResolver.sol...");

  const GitcoinGrantsResolverFactory = await ethers.getContractFactory(
    "GitcoinGrantsResolver"
  );
  const GitcoinGrantsResolver = await GitcoinGrantsResolverFactory.deploy(
    easParams.eas,
    roles.owner,
    roles.manager,
    roles.delegators,
    roles.treasury
  );

  const GitcoinGrantsResolverAddress = await GitcoinGrantsResolver.getAddress();

  const EASRegistry = (await ethers.getContractAt(
    "TestSchemaRegistry",
    easParams.schemaRegistry.toString()
  )) as TestSchemaRegistry;

  const createSchema = await EASRegistry.register(
    schema,
    GitcoinGrantsResolverAddress,
    false
  );

  const receipt = await createSchema.wait();

  const schemaUID = receipt?.logs[0]?.topics[1];

  const objToWrite = {
    name: "GitcoinGrantsResolver",
    resolver: GitcoinGrantsResolverAddress,
    schemaUID: schemaUID,
    treasury: roles.treasury,
    owner: roles.owner,
    delegators: roles.delegators,
    managers: roles.manager,
    deployerAddress: deployerAddress,
  };

  deployments.write(objToWrite);

  if (GitcoinGrantsResolverAddress) {
    await verifyContract(
      GitcoinGrantsResolverAddress,
      [
        easParams.eas,
        roles.owner,
        roles.manager,
        roles.delegators,
        roles.treasury,
      ],
      hre
    );
  }

  if (isTestnet(networkName)) {
    console.log("Test attestation on testnet...");
    // Create an attestation using the eas sdk
    const eas = new EAS(easParams.eas.toString()).connect(account);
    const schemaEncoder = new SchemaEncoder(schema);

    const schemaData = schemaEncoder.encodeData([
      {
        name: "projectsContributed",
        type: "uint64",
        value: 1,
      },
      {
        name: "roundsContributed",
        type: "uint64",
        value: 1,
      },
      {
        name: "chainIdsContributed",
        type: "uint64",
        value: 1,
      },
      {
        name: "totalUSDAmount",
        type: "uint128",
        value: 60000,
      },
      {
        name: "timestamp",
        type: "uint64",
        value: 1,
      },
      {
        name: "metadataCid",
        type: "string",
        value:
          "bafybeiberlhhvguxx73jhjmxmx2qdgrotriresuqayymtfwnfbyexmgpxu/test.json",
      },
    ]);
    const attestTx = await eas.attest(
      {
        schema: schemaUID as string,
        data: {
          recipient: deployerAddress,
          data: schemaData,
          value: 0n,
          expirationTime: 0n,
          revocable: false,
        },
      },
      {
        value: 0,
        gasLimit: 1000000,
      }
    );
    await attestTx.wait();

    console.log("Attestation created successfully");
  }
});
