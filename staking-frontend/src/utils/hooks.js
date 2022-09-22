import { useContext } from "react";
import Web3 from 'web3';

import { RefreshContext } from "./refreshContext";
import { RPC_URL, CHAIN_ID } from "./data";

export const changeNetwork = async () => {
    if(window.ethereum) {
        console.log("changeNetwork: chainId = ", CHAIN_ID)
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: Web3.utils.toHex(`${CHAIN_ID}`)}]
            })
        } catch(err) {
            if(err.code === 4902) {
                console.log("add")
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                        {
                            chainName: 'Polygon',
                            chainId: Web3.utils.toHex(`${CHAIN_ID}`),
                            nativeCurrency: {
                                name: 'MATIC',
                                decimals: 18,
                                symbol: 'MATIC'
                            },
                            rpcUrls: [RPC_URL[CHAIN_ID]]
                        }
                    ]
                })
            }
        }
    }
}

export const useRefresh = () => {
    const { fast, slow } = useContext(RefreshContext);
    return { fastRefresh: fast, slowRefresh: slow }
}

export const getWeb3 = (provider) => {
    return new Web3(provider);
}