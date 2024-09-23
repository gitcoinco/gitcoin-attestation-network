import "dotenv/config";
import { Addressable } from "ethers";
import fs from "fs";
import readline from "readline";

// --- User verification ---
// Helper method for waiting on user input. Source: https://stackoverflow.com/a/50890409
export async function waitForInput(query: string): Promise<unknown> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans);
    })
  );
}

export async function confirmContinue(params: Record<string, unknown>) {
  console.log("\nPARAMETERS");
  console.table(params);

  const response = await waitForInput("\nDo you want to continue? y/N\n");
  if (response !== "y")
    throw new Error("Aborting script: User chose to exit script");
  console.log("\n");
}

export const verifyContract = async (
  contractAddress: string | Addressable,
  verifyArgs: any[],
  hre: any
): Promise<boolean> => {
  console.log("\nVerifying contract...");
  await new Promise((r) => setTimeout(r, 20000));
  try {
    await hre.run("verify:verify", {
      address: contractAddress,
      contract: "contracts/GitcoinGrantsResolver.sol:GitcoinGrantsResolver",
      constructorArguments: verifyArgs,
      noCompile: true,
    });
  } catch (e) {
    console.log(e);
  }
  return true;
};

export class Deployments {
  contractName: string;
  path: string;
  configObject: any;
  chainId: number;

  constructor(chainId: number, contractName: string) {
    this.contractName = contractName;
    this.chainId = chainId;
    this.path = `tasks/constants/deployments/${contractName}.deployment.json`;
    this.configObject = this.readFile(this.contractName);
  }

  private readFile = (name: string) => {
    let configFile;
    const path = `tasks/constants/deployments/${name}.deployment.json`;
    try {
      configFile = fs.readFileSync(path);
    } catch {
      configFile = "{}";
    }
    return JSON.parse(configFile.toString());
  };

  public write = (objToWrite: Object) => {
    this.configObject[this.chainId] = objToWrite;

    fs.writeFileSync(this.path, JSON.stringify(this.configObject, null, 2));
  };

  public get = (chainId: number) => {
    return this.configObject[chainId];
  };

  public getResolver = (): string => {
    return this.configObject[this.chainId]?.resolver;
  };
}

export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
