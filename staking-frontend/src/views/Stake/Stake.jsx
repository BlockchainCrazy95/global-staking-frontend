import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { QueryClient, QueryClientProvider } from "react-query";
import { Paper, Grid, Typography, Box, Zoom, Container, useMediaQuery, Button } from "@material-ui/core";
import axios from 'axios';
import Web3 from "web3";
import { ethers } from "ethers";
import { Contract, Provider } from "ethers-multicall";
import Loading from "../../components/Loading";

import TokenList from "./TokenList";
import StakedTokenList from "./StakedTokenList";
import PoolList from "./PoolList";
import "./stake.scss";
import { useWeb3Context } from "src/utils/web3Context";
import { getImageUrlFromMetadata, getNFTHoldingList } from "src/utils/fetchHelpers";
import { useContractContext } from "src/utils/ContractProvider";
import { CHAIN_ID, MULTICALL_ADDRESS, PARTNER_NFTS, POOL_COUNT, RPC_URL } from "src/utils/data";
import { getPoolInfo } from "src/contracts/contractHelpers";
import erc721Abi from "src/contracts/abis/erc721Abi.json";
import multicallAbi from "src/contracts/abis/multicallAbi.json";

function Stake() {

  const smallerScreen = useMediaQuery("(max-width: 650px)");
  const verySmallScreen = useMediaQuery("(max-width: 379px)");

  const { connected, address } = useWeb3Context();
  const { web3, stakingContract } = useContractContext();

  const [loadingStatus, setLoadingStatus] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(false);

  const [ tokenHoldingList, setTokenHoldingList ] = useState([]);
  const [ poolList, setPoolList ] = useState([]);
  const [ isLoaded, setIsLoaded ] = useState(false);

  const updateRefreshFlag = () => {
    setRefreshFlag(!refreshFlag);
  }

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await getNFTHoldingList(web3, address);
        const myList = [];
        for(let i = 0;i<res.length;i++) {
          /*
          amount : "1" , block_number : "11389283", block_number_minted: "11389283", contract_type: "ERC721", last_metadata_sync: "2022-09-16T07:53:07.529Z"
          last_token_uri_sync: "2022-09-16T07:52:59.026Z", metadata: "{\"name\":\"Cannarillaz #3\",\"description\":\"The Cannabis Gorillaz.\",\"image\":\"https://cannarillaz.mypinata.cloud/ipfs/QmSmGGHvE3UbgYBDQAuR1Y5BWdTjdbodTDui19kSWsFzDk/3.png\",\"dna\":\"d430406cee945c4503add38f79fa34334040990b\",\"edition\":3,\"date\":1652045734977,\"attributes\":[{\"trait_type\":\"Background\",\"value\":\"green simple 2\"},{\"trait_type\":\"core details\",\"value\":\"natural white body, blue eyes ,cigar, smoke, hat1, shirt orange 2,necklace golden, earring golden, logo canabis 1, logo canabis 4\"}],\"compiler\":\"HashLips Art Engine\"}"
          name: "Cannarillaz", owner_of: "0x2ca62cf3f7d24a31d7125962b55809a61e05560a",symbol: "Cannarillaz",token_address: "0xa7bf683e5761adbaa95389dac8becc117d65ac8e"
          token_hash: "889d93e571d3e31323bbb1b1f17099a8",token_id: "2", token_uri: "https://ipfs.moralis.io:2053/ipfs/QmSZnFWcXYVriwX8uLTCSkmDsna5v49ubg7NCHoPfq9mEX/3.json"
          */
          const _nftData = res[i];
          const imageUrl = await getImageUrlFromMetadata(_nftData);
          myList.push({
            name: _nftData.name,
            symbol: _nftData.symbol,
            token_id: _nftData.token_id,
            token_address: _nftData.token_address,
            metadata: _nftData.metadata,
            imageUrl
          })
        }
        setTokenHoldingList(myList);
      } catch (err) {
        console.log("loadData error=", err)
      }
      
      setLoadingStatus(false);
    }
    const getPools = async () => {
      try {
        let poolInfos = [];
        for(let i = 0;i<POOL_COUNT;i++) {
          const resPoolInfo = await getPoolInfo(stakingContract, i);
          poolInfos.push({
            rewardToken: resPoolInfo.rewardToken,
            rewardPerBlock: resPoolInfo.rewardPerBlock,
            lockTime: resPoolInfo.lockTime,
            sell: resPoolInfo.sell
          });
        }
        setPoolList(poolInfos);
      } catch(err) {
        console.log("getPools error=", err);
      }
    }
    const getPartnerNFTStatus = async () => {
      // console.log("web3=", web3)
      const _web3 = new Web3(RPC_URL[CHAIN_ID]);
      // console.log("_web3=", _web3)
      let totalInfo = [];
      try {
        setIsLoaded(true);
        // const _provider = new ethers.providers.StaticJsonRpcProvider(RPC_URL[CHAIN_ID], CHAIN_ID);
        // const _multicallContract = new ethers.Contract(MULTICALL_ADDRESS, multicallAbi, _provider);
        // console.log("_multicallContract=", _multicallContract)
        for(let i = 0;i<PARTNER_NFTS.length;i++) {
          // let calls = [];
          // const _nftContract = new ethers.Contract(PARTNER_NFTS[i].address, erc721Abi, _provider);
          const _nftContract = new _web3.eth.Contract(erc721Abi, PARTNER_NFTS[i].address);
          // console.log("_nftContract=", _nftContract)
          const _totalSupplyWei = await _nftContract.methods.totalSupply().call();
          const _totalSupply = parseInt(_totalSupplyWei);
          console.log(PARTNER_NFTS[i].name, " totalSupply=", _totalSupply);
          let _collection = []
          for(let j = 0;j<_totalSupply;j++) {
            const _owner = await _nftContract.methods.ownerOf(j + 1).call();
            _collection.push({
              owner: _owner,
              tokenId: j + 1
            });
            // calls.push({
            //   address: PARTNER_NFTS[i].address,
            //   name: "ownerOf",
            //   params: [j+1]
            // });
          }
          // console.log("calls=", calls)
          // const itf = new ethers.utils.Interface(erc721Abi);
          // const calldata = calls.map((call) => ({
          //   target: call.address.toLowerCase(),
          //   callData: itf.encodeFunctionData(call.name, call.params)
          // }))
          // console.log("calldata=", calldata);
          
          // const { returnData } = await _multicallContract.aggregate(calldata);
          // console.log("_collection=", returnData);
          totalInfo.push({
            token_address: PARTNER_NFTS[i].address,
            collectionInfo: _collection
          })
        }
        console.log("totalInfo=", totalInfo);
        console.log("totalInfo=", JSON.stringify(totalInfo));
      } catch(err) {
        console.log("getPartnerNFTStatus err=", err);
      }
    }
    // if(stakingContract) {
    //   getPools();
    // }
    // if(web3)
    // if(!isLoaded)
    //   getPartnerNFTStatus();
    if(connected && address) { 
      setLoadingStatus(true);
      loadData();
    } else {
      setTokenHoldingList([]);
    }
  }, [web3, address, connected, refreshFlag, stakingContract])

  return (
    <div id="stake-view" className={`${smallerScreen && "smaller"} ${verySmallScreen && "very-small"}`}>
      <Container
        style={{
          paddingLeft: smallerScreen || verySmallScreen ? "0" : "2.3rem",
          paddingRight: smallerScreen || verySmallScreen ? "0" : "2.3rem",
        }}
      >
        <TokenList setLoadingStatus={setLoadingStatus} refreshFlag={refreshFlag} updateRefreshFlag={updateRefreshFlag} tokenHoldingList={tokenHoldingList} />
        <StakedTokenList setLoadingStatus={setLoadingStatus} refreshFlag={refreshFlag} updateRefreshFlag={updateRefreshFlag} />
        <PoolList />

      </Container >

      <Loading
        open={loadingStatus}
      />
    </div >
  );
}

const queryClient = new QueryClient();

export default () => (
  <QueryClientProvider client={queryClient}>
    <Stake />
  </QueryClientProvider>
);