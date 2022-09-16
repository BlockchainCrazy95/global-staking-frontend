import { createContext, useContext, useEffect, useState } from "react";
import Web3 from "web3";
import tokenAbi from "../contracts/abis/tokenAbi.json";
import stakingAbi from "../contracts/abis/stakingAbi.json";
import { useWeb3Context } from "./web3Context";
import { STAKING_CONTRACT_ADDRESS, TOKEN_CONTRACT_ADDRESS } from "./data";

export const ContractContext = createContext({
    tokenContract: null,
    stakingContract: null,
    web3: null
});

export const ContractProvider = ({ children }) => {
    const [ tokenContract, setTokenContract ] = useState(null);
    const [ stakingContract, setStakingContract ] = useState(null);
    const [ web3, setWeb3 ] = useState(null);
    const { chainID, provider } = useWeb3Context();

    useEffect(() => {
        if(!chainID) return;
        const web3Instance = new Web3();
        web3Instance.setProvider(provider);
        setWeb3(web3Instance);
        const _tokenContract = new web3Instance.eth.Contract(tokenAbi, TOKEN_CONTRACT_ADDRESS);
        setTokenContract(_tokenContract);
        const _stakingContract = new web3Instance.eth.Contract(stakingAbi, STAKING_CONTRACT_ADDRESS);
        setStakingContract(_stakingContract);
    }, [ chainID, provider ])

    return (<ContractContext.Provider value={{ web3, tokenContract, stakingContract }}>
        { children }
    </ContractContext.Provider>)
};

export const useContractContext = () => useContext(ContractContext);