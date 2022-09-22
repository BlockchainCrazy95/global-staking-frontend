import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { QueryClient, QueryClientProvider } from "react-query";
import { Paper, Grid, Typography, Box, Zoom, Container, useMediaQuery, Button } from "@material-ui/core";
import axios from 'axios';
import Loading from "../../components/Loading";

import TokenList from "./TokenList";
import StakedTokenList from "./StakedTokenList";
import PoolList from "./PoolList";
import "./stake.scss";
import { useWeb3Context } from "src/utils/web3Context";
import { getImageUrlFromMetadata, getNFTHoldingList } from "src/utils/fetchHelpers";
import { useContractContext } from "src/utils/ContractProvider";

function Stake() {

  const smallerScreen = useMediaQuery("(max-width: 650px)");
  const verySmallScreen = useMediaQuery("(max-width: 379px)");

  const { connected, address } = useWeb3Context();
  const { web3 } = useContractContext();

  const [loadingStatus, setLoadingStatus] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(false);

  const [ tokenHoldingList, setTokenHoldingList ] = useState([]);

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
    if(connected && address) { 
      setLoadingStatus(true);
      loadData();
    } else {
      setTokenHoldingList([]);
    }
  }, [address, connected, refreshFlag])

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