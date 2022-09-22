import { ethers } from "ethers";
import { POOL_INFO, STAKING_CONTRACT_ADDRESS } from "src/utils/data";
import erc721Abi from "src/contracts/abis/erc721Abi.json";

export const stakeNft = async (web3, _stakingContract, addr, pid, nftAddress, tokenId) => {
    try {
        if(POOL_INFO[pid].sell) {
            const nftContract = new web3.eth.Contract(erc721Abi, nftAddress);
            const approveTx = await nftContract.methods.approve(STAKING_CONTRACT_ADDRESS, tokenId).send({value: 0, from: addr});
        }
        const stakeTx = await _stakingContract.methods.stake(pid, nftAddress, [tokenId]).send({value: 0, from: addr});
        return {
            success: true,
            message: "Successfully staked!"
        }
    } catch (err) {
        console.log("stakeNFT error=", err);
        return {
            success: false,
            message: err.message
        }
    }
}

export const claimReward = async(_stakingContract, addr) => {
    try {
        const claimTx = await _stakingContract.methods.claimAll().send({value: 0, from: addr});
        return {
            success: true,
            message: "Successfully claimed!"
        }
    } catch (err) {
        console.log("ClaimAll error = ", err);
        return {
            success: false,
            message: err.message
        }
    }
}

export const unstakeNft = async (_stakingContract, addr, pid, nftAddress, tokenId) => {
    try {
        console.log("unstakeNft address=", addr, "pid=", pid, "nftaddress=", nftAddress, "tokenId=", tokenId);
        const unstakeTx = await _stakingContract.methods.unstake(pid, nftAddress, [tokenId]).send({value: 0, from: addr});
        return {
            success: true,
            message: "Successfully unstaked!"
        }
    } catch (err) {
        console.log("unstakeNFT error=", err);
        return {
            success: false,
            message: err.message
        }
    }
}

export const getStakedList = async(_stakingContract, addr, pid) => {
    const res = await _stakingContract.methods.getUserInfo(pid, addr).call();
    return res;
}

export const getPendingReward = async(_stakingContract, addr, pid, nftAddress, tokenId) => {
    const res = await _stakingContract.methods.pendingReward(pid, addr, nftAddress, tokenId).call();
    return res;
}
/****************** NFT Contract Calls *****************/
export const getBaseURI = async(nftContract, tokenId) => {
    const res = await nftContract.methods.tokenURI(tokenId).call();
    return res;
}

export const getName = async(nftContract) => {
    const res = await nftContract.methods.name().call();
    return res;
}

export const getSymbol = async(nftContract) => {
    const res = await nftContract.methods.symbol().call();
    return res;
}

export const getTokensOfOwner = async (nftContract, address) => {
    const res = await nftContract.methods.tokensOfOwner(address).call();
    return res;
}