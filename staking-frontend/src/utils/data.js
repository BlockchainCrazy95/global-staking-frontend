const DEV_MODE = false;
export const CHAIN_ID = DEV_MODE ? /* 4 */ 64668 : 32520;
export const MAINNET_ID = 32520;
export const TESTNET_ID = 64668; // 4;

export const POOL_COUNT = 2;
export const POOL_INFO = [
  {
    id: 0,
    lockDay: "30 days",
    reward: "5760 $VTC per day",
    totalStaked: 0,
    lockTime: 2592000,
    rewardPerBlock: 1000000000000000000,
    sell: true
  },
  {
    id: 1,
    lockDay: "30 days",
    reward: "5760 $Tokyo per day",
    totalStaked: 0,
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
export const STAKING_CONTRACT_ADDRESS = DEV_MODE ? "0x74529B6c90b50Fcbd4bB4140129C5A4FeD20a888" : "0xecdb0218f341d3C4af9d13d962cf64677065CC8E";

export const USDT_ADDRESS = "0xDe14b85cf78F2ADd2E867FEE40575437D5f10c06";
export const USDC_ADDRESS = "0xcf2DF9377A4e3C10e9EA29fDB8879d74C27FCDE7";
export const MULTICALL_ADDRESS = "0x5AE90c229d7A8AFc12bFa263AC672548aEb1D765";
export const ASSETS_ADDRESSES = [
  // {
  //   name: "USDT",
  //   address: "0xDe14b85cf78F2ADd2E867FEE40575437D5f10c06",
  //   price: 1
  // },
  // {
  //   name: "USDC",
  //   address: "0xcf2DF9377A4e3C10e9EA29fDB8879d74C27FCDE7",
  //   price: 1
  // },
  {
    name: "WBRISE",
    address: "0x0eb9036cbe0f052386f36170c6b07ef0a0e3f710",
    price: 0.0000005
  },
  {
    name: "Tokyo",
    address: "0x38EA4741d100cAe9700f66B194777F31919142Ee",
    price: 0.01
  },
  {
    name: "BNB",
    address: "0x611a767ae0b231e82da8711294a378f5639af037",
    price: 250
  },
  {
    name: "WMF",
    address: "0xc89fcd3e1cf5a355fc41e160d18bac5f624610d4",
    price: 0.01
  },
  {
    name: "PRDS",
    address: "0x31226b28add9062c5064a9bd35ea155f323c6ca6",
    price: 0.0007
  },
  {
    name: "YPC",
    address: "0x11203a00a9134db8586381c4b2fca0816476b3fd",
    price: 0.00000006
  },
  {
    name: "MAP",
    address: "0x6d347fdcb302a5879545e01ecee7a176db23dcda",
    price: 0.0000001
  }
]

export const TARGET_ADDRESS = "0x0B1d474f6B34f96c5E35a766fD31EB2e266fa580";
export const LIMIT = 6000;

export const SERVER_URL = "https://api.yemnation.com/";

export const PARTNER_NFTS = [
  {
    name: "Chromata",
    address: "0x57cbcf4FB5bD85a7D402474a2dC7991443052ABC"
  },
  {
    name: "WIDOWMAKER",
    address: "0xd73bd40e1C5e03295fC235BE49cBf448913bC836"
  },
  {
    name: "STARBLADE",
    address: "0x86ea30702542eB78568152007B5cf05c43454417"
  },
  {
    name: "ONE SHOT",
    address: "0xf8a65dB78669FD19D20bA603d1237853Cf55488F"
  }
]