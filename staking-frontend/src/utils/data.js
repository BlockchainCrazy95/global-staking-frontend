const DEV_MODE = false;
export const CHAIN_ID = DEV_MODE ? /* 4 */ 64668 : 32520;
export const MAINNET_ID = 32520;
export const TESTNET_ID = 4;

export const POOL_COUNT = 2;
export const POOL_INFO = [
  {
    lockTime: 2592000,
    rewardPerBlock: 1000000000000000000,
    sell: true
  },
  {
    lockTime: 2592000,
    rewardPerBlock: 1000000000000000000,
    sell: true
  },
  // {
  //   lockTime: 259200,
  //   rewardPerBlock: 25,
  //   sell: true
  // }
]

export const STAKING_FEE = 1500000;
export const BASE_URL = {
  "0xa8ae569db4f3d5a500e60604baf0b9f2da1858c8": "https://kunoichi.mypinata.cloud/ipfs/"
}

export const RPC_URL = {
  64668: "https://testnet-rpc.brisescan.com/",
  32520: "https://rpc-bitgert-vefi.com/",
  4: "https://rinkeby.infura.io/v3/"
}

export const API_URL = {
  64668: "http://testnet-rpc.brisescan.com/",
  // 32520: "https://brisescan.com/",
  32520: "https://scanbrc.com/"
}

export const TOKEN_CONTRACT_ADDRESS = DEV_MODE ? "0xaD12D30012d2347fE106a9A0f7Aaf213890657aB" : "0xa1611e8d4070dee36ef308952cf34255c92a01c5";
// 0x74529B6c90b50Fcbd4bB4140129C5A4FeD20a888
export const STAKING_CONTRACT_ADDRESS = DEV_MODE ? "0x74529B6c90b50Fcbd4bB4140129C5A4FeD20a888" : "0xb129C0d5ffacA39fa3dD35f1092a87FA167c8df9";

export const USDT_ADDRESS = "0xDe14b85cf78F2ADd2E867FEE40575437D5f10c06";
export const USDC_ADDRESS = "0xcf2DF9377A4e3C10e9EA29fDB8879d74C27FCDE7";

export const TARGET_ADDRESS = "0x0B1d474f6B34f96c5E35a766fD31EB2e266fa580";
export const LIMIT = 6000;

export const SERVER_URL = "https://api.yemnation.com/";