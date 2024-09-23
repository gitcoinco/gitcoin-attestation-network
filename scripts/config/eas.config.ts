// NOTE: Update this file anytime a new allo is deployed.

import { AddressLike } from "ethers";
import * as dotenv from "dotenv";
dotenv.config();
type EASConfig = {
  eas: AddressLike;
  schemaRegistry: AddressLike;
  version?: string;
};

type Roles = {
  owner: AddressLike;
  treasury: AddressLike;
  manager: AddressLike;
  delegators: AddressLike[];
};

type DeployParams = Record<number, EASConfig>;

// TODO add real addresses here
export const MainnetRoles: Roles = {
  owner: "0x3CB79Ae4b3442990A491e356de26F4D8B244954d",
  treasury: "0x3CB79Ae4b3442990A491e356de26F4D8B244954d",
  manager: "0x3CB79Ae4b3442990A491e356de26F4D8B244954d",
  delegators: ["0x3CB79Ae4b3442990A491e356de26F4D8B244954d"],
};
// TODO add real addresses here
export const TestnetRoles: Roles = {
  owner: "0x3CB79Ae4b3442990A491e356de26F4D8B244954d",
  treasury: "0x3CB79Ae4b3442990A491e356de26F4D8B244954d",
  manager: "0x3CB79Ae4b3442990A491e356de26F4D8B244954d",
  delegators: ["0x3CB79Ae4b3442990A491e356de26F4D8B244954d"],
};

const testnets = ["localhost", "sepolia", "optimism-sepolia"];

export const getRoles = (networkName: string) => {
  return testnets.includes(networkName) ? TestnetRoles : MainnetRoles;
};
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
export const easConfig: DeployParams = {
  /* ----------- Mainnets ---------- */

  // Mainnet
  1: {
    eas: "0xA1207F3BBa224E2c9c3c6D5aF63D0eb1582Ce587",
    schemaRegistry: "0xA7b39296258348C78294F95B872b282326A97BDF",

    version: "v0.26",
  },
  // Optimism
  10: {
    eas: "0x4200000000000000000000000000000000000021",
    schemaRegistry: "0x4200000000000000000000000000000000000020",

    version: "v1.0.1",
  },
  // BASE Mainnet
  8453: {
    eas: "0x4200000000000000000000000000000000000021",
    schemaRegistry: "0x4200000000000000000000000000000000000020",

    version: "v1.0.1",
  },
  // Arbitrum One
  42161: {
    eas: "0xbD75f629A22Dc1ceD33dDA0b68c546A1c035c458",
    schemaRegistry: "0xA310da9c5B885E7fb3fbA9D66E9Ba6Df512b78eB",

    version: "v0.26",
  },
  // Polygon Mainnet
  137: {
    eas: "0x5E634ef5355f45A855d02D66eCD687b1502AF790",
    schemaRegistry: "0x7876EEF51A891E737AF8ba5A5E0f0Fd29073D5a7",

    version: "v1.3.0",
  },

  // Scroll
  534352: {
    eas: "0xC47300428b6AD2c7D03BB76D05A176058b47E6B0",
    schemaRegistry: "0xD2CDF46556543316e7D34e8eDc4624e2bB95e3B6",

    version: "v1.3.0",
  },
  // Celo Mainnet
  42220: {
    eas: "0x72E1d8ccf5299fb36fEfD8CC4394B8ef7e98Af92",
    schemaRegistry: "0x5ece93bE4BDCF293Ed61FA78698B594F2135AF34",

    version: "v1.3.0",
  },

  // Blast
  81457: {
    eas: "0x4200000000000000000000000000000000000021",
    schemaRegistry: "0x5ece93bE4BDCF293Ed61FA78698B594F2135AF34",
    version: "v1.3.0",
  },

  // Linea
  81458: {
    eas: "0xaEF4103A04090071165F78D45D83A0C0782c2B2a",
    schemaRegistry: "0x55D26f9ae0203EF95494AE4C170eD35f4Cf77797",
    version: "v1.2.0",
  },

  /* ----------- Testnets ---------- */

  // Sepolia
  11155111: {
    eas: "0xC2679fBD37d54388Ce493F1DB75320D236e1815e",
    schemaRegistry: "0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0",
    version: "v0.26",
  },
  // Optimism Sepolia
  11155420: {
    eas: "0x4200000000000000000000000000000000000021",
    schemaRegistry: "0x4200000000000000000000000000000000000020",
    version: "v1.0.2",
  },
};

export const schema = process.env.SCHEMA!;
