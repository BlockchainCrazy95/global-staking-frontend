/** GLOBAL CONSTANT */

export const Networks = {
    MAINNET: 56,
    DEVNET: 97
}
// export const DEFAULT_NETWORK = Networks.MAINNET;
export const DEFAULT_NETWORK = Networks.DEVNET;
export const IS_MAINNET = DEFAULT_NETWORK == Networks.MAINNET;
export const NETWORK = IS_MAINNET ? "mainnet-beta" : "devnet";

export const SECONDS_PER_DAY = 24 * 60 * 60;

export const RS_PREFIX = "rs-nft-staking";
export const RS_STAKEINFO_SEED = "rs-stake-info";
export const RS_STAKE_SEED = "rs-nft-staking";
export const RS_VAULT_SEED = "rs-vault";

export const CLASS_TYPES = [65, 50, 43, 35, 27, 14, 9, 7, 4];
export const LOCK_DAY = 20;
export const TOKEN_DECIMALS = 9;

/** NFT Staking Constant */