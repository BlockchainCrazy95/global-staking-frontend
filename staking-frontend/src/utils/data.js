const DEV_MODE = true;
export const CHAIN_ID = DEV_MODE ? 4 : 56;
export const MAINNET_ID = 56;
export const TESTNET_ID = 4;

export const RPC_URL = {
  56: "https://bsc-dataseed1.binance.org",
  4: "https://rinkeby.infura.io/v3/"
}

export const TOKEN_CONTRACT_ADDRESS = DEV_MODE ? "0xaD12D30012d2347fE106a9A0f7Aaf213890657aB" : "0xa1611e8d4070dee36ef308952cf34255c92a01c5";
export const STAKING_CONTRACT_ADDRESS = DEV_MODE ? "0x707dC83da71DFEAf184dE1Db3739d28a6274BC84" : "0x0A4425948C1541336c674290c4FD45D3663994f0";