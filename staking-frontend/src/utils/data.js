const DEV_MODE = true;
export const CHAIN_ID = DEV_MODE ? /* 4 */ 64668 : 32520;
export const MAINNET_ID = 32520;
export const TESTNET_ID = 4;

export const POOL_COUNT = 3;
export const POOL_INFO = [
  {
    lockTime: 0,
    rewardPerBlock: 10,
    sell: true
  },
  {
    lockTime: 172800,
    rewardPerBlock: 15,
    sell: true
  },
  {
    lockTime: 259200,
    rewardPerBlock: 25,
    sell: true
  }
]


export const RPC_URL = {
  64668: "https://testnet-rpc.brisescan.com/",
  32520: "https://mainnet-rpc.brisescan.com/",
  4: "https://rinkeby.infura.io/v3/"
}

export const API_URL = {
  64668: "http://testnet-rpc.brisescan.com/",
  32520: "http://mainnet-rpc.brisescan.com/",
}

export const TOKEN_CONTRACT_ADDRESS = DEV_MODE ? "0xaD12D30012d2347fE106a9A0f7Aaf213890657aB" : "0xa1611e8d4070dee36ef308952cf34255c92a01c5";
// 0x74529B6c90b50Fcbd4bB4140129C5A4FeD20a888
export const STAKING_CONTRACT_ADDRESS = DEV_MODE ? "0x74529B6c90b50Fcbd4bB4140129C5A4FeD20a888" : "0x0A4425948C1541336c674290c4FD45D3663994f0";