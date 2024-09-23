import { task } from "hardhat/config";
import { easConfig, getRoles, schema } from "../scripts/config/eas.config";
import { Deployments, verifyContract } from "../utils/scripts";
import { TestSchemaRegistry } from "../typechain-types";

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
    easConfig[chainId].eas,
    roles.owner,
    roles.manager,
    roles.delegators,
    roles.treasury
  );

  const GitcoinGrantsResolverAddress = await GitcoinGrantsResolver.getAddress();

  const EASRegistry = (await ethers.getContractAt(
    "TestSchemaRegistry",
    easConfig[chainId].schemaRegistry.toString()
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
      resolver.toString(),
      [
        easConfig[chainId].eas.toString(),
        roles.owner.toString(),
        roles.manager.toString(),
        roles.delegators,
        roles.treasury.toString(),
      ],
      hre
    );
  }
});
