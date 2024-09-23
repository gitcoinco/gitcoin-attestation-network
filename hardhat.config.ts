import * as dotenv from "dotenv";
import "@nomicfoundation/hardhat-verify";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "@nomicfoundation/hardhat-toolbox";

import { HardhatUserConfig } from "hardhat/config";
import { NetworkUserConfig } from "hardhat/types";
import "./tasks/index";

dotenv.config();

const chainIds = {
  // local network
  localhost: 31337,
  // testnet
  sepolia: 11155111,
  "optimism-sepolia": 11155420,
  // mainnet
  mainnet: 1,
  "optimism-mainnet": 10,
  "celo-mainnet": 42220,
  "arbitrum-mainnet": 42161,
  base: 8453,
  polygon: 137,
  scroll: 534352,
};

let deployPrivateKey = process.env.DEPLOYER_PRIVATE_KEY as string;
if (!deployPrivateKey) {
  // default first account deterministically created by local nodes like `npx hardhat node` or `anvil`
  throw "No deployer private key set in .env";
}

const infuraIdKey = process.env.INFURA_RPC_ID as string;
const alchemyIdKey = process.env.ALCHEMY_RPC_ID as string;

/**
 * Generates hardhat network configuration the test networks.
 * @param network
 * @param url (optional)
 * @returns {NetworkUserConfig}
 */
function createTestnetConfig(
  network: keyof typeof chainIds,
  url?: string
): NetworkUserConfig {
  if (!url) {
    url = `https://${network}.infura.io/v3/${infuraIdKey}`;
  }
  return {
    accounts: [deployPrivateKey],
    chainId: chainIds[network],
    allowUnlimitedContractSize: true,
    url,
    gasPrice: 30000000000,
  };
}

/**
 * Generates hardhat network configuration the mainnet networks.
 * @param network
 * @param url (optional)
 * @returns {NetworkUserConfig}
 */
function createMainnetConfig(
  network: keyof typeof chainIds,
  url?: string
): NetworkUserConfig {
  if (!url) {
    url = `https://${network}.infura.io/v3/${infuraIdKey}`;
  }
  return {
    accounts: [deployPrivateKey],
    chainId: chainIds[network],
    url,
  };
}

/**
 * Generates hardhat network configuration
 * @type import('hardhat/config').HardhatUserConfig
 */
const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.26",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    // Main Networks
    mainnet: createMainnetConfig("mainnet"),
    "optimism-mainnet": {
      ...createMainnetConfig("optimism-mainnet"),
      url: `https://opt-mainnet.g.alchemy.com/v2/${alchemyIdKey}`,
      // gasPrice: 35000000000,
    },
    "arbitrum-mainnet": createMainnetConfig(
      "arbitrum-mainnet",
      `https://arb-mainnet.g.alchemy.com/v2/${alchemyIdKey}`
    ),
    "celo-mainnet": {
      ...createMainnetConfig("celo-mainnet"),
      url: "https://forno.celo.org",
    },
    base: {
      ...createMainnetConfig("base"),
      url: `https://base-mainnet.g.alchemy.com/v2/${alchemyIdKey}`,
    },
    polygon: {
      ...createMainnetConfig("polygon"),
      url: `https://polygon-pokt.nodies.app`,
      // gasPrice: 450000000000,
    },

    scroll: {
      ...createMainnetConfig("scroll"),
      url: `https://1rpc.io/scroll`,
    },
    // Test Networks
    sepolia: createTestnetConfig(
      "sepolia",
      `https://eth-sepolia.g.alchemy.com/v2/${alchemyIdKey}`
    ),
    "optimism-sepolia": {
      ...createTestnetConfig("optimism-sepolia"),
      url: `https://sepolia.optimism.io`,
    },

    // Local Networks
    localhost: createTestnetConfig("localhost", "http://localhost:8545"),
    hardhat: {
      mining: {
        auto: false,
        interval: 1000,
      },
    },
  },
  gasReporter: {
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: {
      mainnet: process.env.ETHERSCAN_API_KEY || "",
      sepolia: process.env.ETHERSCAN_API_KEY || "",
      optimisticEthereum: process.env.OPTIMISTIC_ETHERSCAN_API_KEY || "",
      "celo-mainnet": process.env.CELOSCAN_API_KEY || "",
      base: process.env.BASESCAN_API_KEY || "",
      polygon: process.env.POLYGONSCAN_API_KEY || "",
      "arbitrum-mainnet": process.env.ARBITRUMSCAN_API_KEY || "",
      "arbitrum-sepolia": process.env.ARBITRUMSCAN_API_KEY || "",
      "optimism-sepolia": process.env.OPTIMISTIC_ETHERSCAN_API_KEY || "",
    },
    customChains: [
      {
        network: "celo-mainnet",
        chainId: chainIds["celo-mainnet"],
        urls: {
          apiURL: "https://api.celoscan.io/api",
          browserURL: "https://celoscan.io",
        },
      },

      {
        network: "base",
        chainId: chainIds["base"],
        urls: {
          apiURL: "https://api.basescan.org/api",
          browserURL: "https://basescan.org/",
        },
      },

      {
        network: "polygon",
        chainId: chainIds["polygon"],
        urls: {
          apiURL: "https://api.polygonscan.com/api",
          browserURL: "https://polygonscan.com",
        },
      },
      {
        network: "arbitrum-mainnet",
        chainId: chainIds["arbitrum-mainnet"],
        urls: {
          apiURL: "https://api.arbiscan.io/api",
          browserURL: "https://arbiscan.io",
        },
      },
      {
        network: "optimism-sepolia",
        chainId: chainIds["optimism-sepolia"],
        urls: {
          apiURL: "https://api-sepolia-optimistic.etherscan.io/api",
          browserURL: "https://sepolia-optimism.etherscan.io",
        },
      },

      {
        network: "scroll",
        chainId: chainIds["scroll"],
        urls: {
          apiURL: "https://api.scrollscan.com/api",
          browserURL: "https://scrollscan.com/",
        },
      },
    ],
  },

  paths: {
    sources: "./contracts",
    cache: "./cache_hardhat",
  },
};

export default config;
