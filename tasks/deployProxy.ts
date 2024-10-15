import { task } from "hardhat/config";
import { easConfig, getRoles } from "./constants/config/eas.config";
import { Deployments, verifyContract } from "./utils/scripts";

task(
  "deployPermissionedProxy",
  "deploys PermissionedEIP712Proxy Contract",
).setAction(async (_, hre) => {
  const { ethers } = hre;
  const [account] = await ethers.getSigners();
  const network = await account.provider.getNetwork();
  const networkName = hre.network.name;
  const chainId = Number(network.chainId);
  const deployerAddress = await account.getAddress();
  const balance = await account.provider.getBalance(deployerAddress);

  // TODO : Store on Deployments the proxy address
  console.log(`
////////////////////////////////////////////////////
Deploys PermissionedEIP712Proxy.sol on ${networkName}
////////////////////////////////////////////////////
  `);

  const roles = getRoles(networkName);

  const easParams = easConfig[chainId];
  if (!easParams) {
    throw new Error(
      `GitcoinGrantsResolver params not found for chainId: ${chainId}`,
    );
  }

  console.table({
    contract: "Deploy PermissionedEIP712Proxy.sol",
    chainId: chainId,
    network: networkName,
    owner: roles.owner,
    treasury: roles.treasury,
    deployerAddress: deployerAddress,
    balance: ethers.formatEther(balance),
  });

  console.log("Deploying PermissionedEIP712Proxy.sol...");

  const PermissionedEIP712ProxyFactory = await ethers.getContractFactory(
    "PermissionedEIP712Proxy",
  );

  const PermissionedEIP712Proxy = await PermissionedEIP712ProxyFactory.deploy(
    easParams.eas,
    "PermissionedEIP712Proxy",
    {
      from: deployerAddress,
    },
  );

  const PermissionedEIP712ProxyAddress =
    await PermissionedEIP712Proxy.getAddress();

  console.log(
    "PermissionedEIP712Proxy.sol deployed to: ",
    PermissionedEIP712ProxyAddress,
  );
  if (PermissionedEIP712Proxy) {
    await verifyContract(
      PermissionedEIP712ProxyAddress,
      [easParams.eas, "PermissionedEIP712Proxy"],
      hre,
    );
  }
});
