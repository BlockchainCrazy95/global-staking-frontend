import { useEffect, useState, useRef } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { NotificationManager } from "react-notifications";

import { Paper, Grid, Typography, Box, Zoom, Container, useMediaQuery, Button, Checkbox } from "@material-ui/core";

import { unstake, emergencyWithdrawal } from "../../slices/NFT";
import CardHeader from "../../components/CardHeader/CardHeader";
import { prettyVestingPeriod2 } from "../../helpers";
import { error, info } from "../../slices/MessagesSlice";

import "./stake.scss";

import UnstakeTimer from "src/components/unstakeTimer/unstakeTimer"
import { useWeb3Context } from "src/utils/web3Context";
import { claimReward, getBaseURI, getPendingReward, getStakedList, unstakeNft } from "src/contracts/contractHelpers";
import { useContractContext } from "src/utils/ContractProvider";
import { POOL_COUNT, POOL_INFO } from "src/utils/data";
import erc721Abi from "src/contracts/abis/erc721Abi.json";
import { getTokenIdMetadata } from "src/utils/fetchHelpers";
import { showNotification } from "src/utils";

const  StakedTokenList = ({ setLoadingStatus, refreshFlag, updateRefreshFlag }) => {
  const smallerScreen = useMediaQuery("(max-width: 650px)");
  const verySmallScreen = useMediaQuery("(max-width: 379px)");
  const { address, connected } = useWeb3Context();
  const { web3, stakingContract } = useContractContext();
  const [ isRefresh, setIsRefresh ] = useState(false);
  const [ stakedItems, setStakedItems ] = useState([]);
  const [ selectedList, setSelectedList ] = useState([]);

  const fetchStakedInfo = async () => {
    const stakedList = [], list = [];
    for(let i = 0;i<POOL_COUNT;i++) {
      const res = await getStakedList(stakingContract, address, i);
      for(let j = 0;j<res.length;j++)
        stakedList.push({...res[j], poolId: i});
    }
    // console.log("fetchStakedInfo stakedList=", stakedList)
    const _selList = [];
    for(let i = 0;i<stakedList.length;i++) {
      _selList.push(false);
      // const _nftContract = new web3.eth.Contract(erc721Abi, stakedList[i].nftAddress);
      // const resBaseUri = await getBaseURI(_nftContract, stakedList[i].tokenId);
      const _nftData = await getTokenIdMetadata(web3, stakedList[i].nftAddress, stakedList[i].tokenId);
      // const resGetBlock = await web3.eth.getBlock(stakedList[i].startBlock);
      // console.log("resGetBlock = ", resGetBlock)
      const pendingReward = await getPendingReward(stakingContract, address, stakedList[i].poolId, stakedList[i].nftAddress, stakedList[i].tokenId);
      // console.log("pendingReward:", pendingReward)
      // const _startTime = resGetBlock.timestamp;
      const _startTime = stakedList[i].startBlock;
      // console.log("stakedList[i]=", stakedList[i]);
      // console.log("_startTime=", _startTime);
      if(_nftData) {
        const jsonMetadata = JSON.parse(_nftData.metadata);
        const imageUrl = jsonMetadata?.image;
        list.push({
          name: _nftData.name,
          symbol: _nftData.symbol,
          token_id: _nftData.token_id,
          token_address: _nftData.token_address,
          stakeTime: _startTime,
          poolId: stakedList[i].poolId,
          metadata: _nftData.metadata,
          reward: web3.utils.fromWei(pendingReward),
          imageUrl
        })
      }
    }
    if(address) {
      setStakedItems(list);
      setSelectedList(_selList);
    } else {
      setStakedItems([]);
      setSelectedList([]);
    }
    
  }

  const toggle = () => {
    setIsRefresh(val => !val);
    setTimeout(toggle, 5000);
  }

  useEffect(() => {
    toggle();
  }, [])

  // useEffect(() => {
  //   let interval = null;
  //   interval = setInterval(async () => {
  //     toggle();
  //   }, 5000)
  //   return () => clearInterval(interval);
  // }, [])

  useEffect(() => {
    const getStakeInfo = async () => {
      await fetchStakedInfo();
    }
    if(connected && address)
      getStakeInfo();
    else{
      setStakedItems([]);
      setSelectedList([]);
    }
  }, [connected, address, refreshFlag, isRefresh]);

  const onTokenSelected = (event, id) => {
    const list = []
    for(let i = 0;i<selectedList.length;i++) {
      if(i != id) list.push(false);
      else list.push(!selectedList[i]);
    }
    setSelectedList(list);
  }

  const onClaim = async () => {
    if(!stakingContract || !address) {
      showNotification("Please connect wallet!", "error");
      return;
    }
    if(selectedList.length == 0) {
      showNotification("No staked Items!", "error");
    } else{
      setLoadingStatus(true);

      try {
        let res = await claimReward(stakingContract, address);
        showNotification(res.message, res.success ? "success" : "error")
        updateRefreshFlag();
      } catch (e) {
        console.log("claimReward catch=", e);
        showNotification(e.message, "error")
      }
      setLoadingStatus(false);
    }
  }

  const onUnstake = async () => {
    if(!stakingContract || !address) {
      showNotification("Please connect wallet!", "error");
      return;
    }
    let selIndex = selectedList.indexOf(true);
    if(selIndex == -1) {
      showNotification("Please select NFT!", "error");
    } else {
      setLoadingStatus(true);
      const poolId = stakedItems[selIndex].poolId;
      console.log("unstake PoolId = ", poolId)
      try {
        let res = await unstakeNft(stakingContract, address, poolId, stakedItems[selIndex].token_address, stakedItems[selIndex].token_id);
        showNotification(res.message, res.success ? "success" : "error");
        updateRefreshFlag();
      } catch (e) {
        console.log("[] => unstaking error: ", e);
        showNotification(e.message, "error");
      }
      setLoadingStatus(false);  
    }
  };

  const onEmergencyWithdrawal = async action => {
    let tokenList = [];
    let poolList = [];

    tokenSelectedList.current.map((item, index) => {
      if (item.selected) {
        tokenList.push(item.id);
      }
    })
  }


  const NFTItemView = ({ item, index, isSelected, onSelected }) => {
  
    const metadata = item.metadata ? JSON.parse(item.metadata) : null;
    // const [ unstakeTime, setUnstaketime ] = useState(item.stakeTime + POOL_INFO[item.poolId].lockTime);
    const [stakeTimeStr, setStakeTimeStr] = useState("-");

    const getStakeTimeStr = async () => {
      let unstakeTime = parseInt(item.stakeTime) + POOL_INFO[item.poolId].lockTime;
      setStakeTimeStr(prettyVestingPeriod2(unstakeTime));
      setTimeout(getStakeTimeStr, 1000);
    }

    useEffect(() => {
      getStakeTimeStr();
    }, [])
    
    // useEffect(() => {
    //   // let unstakeTime = item.stakeTime + POOL_INFO[item.poolId].lockTime;
    //   setUnstaketime(item.stakeTime + POOL_INFO[item.poolId].lockTime);
    //   console.log("NFTItmeView useEffect");
    // }, [])
    // console.log("stakeTime =", item.stakeTime, "unstakeTime=", unstakeTime, "lockTime=", POOL_INFO[item.poolId].lockTime)
    


    return (
      <Grid item lg={3}>
        <div className="pool-card" onClick={e => onSelected(e, index)}>
          <Grid container className="data-grid" alignContent="center">
            <Grid item lg={9}  >
              <Typography variant="h6" >
                {metadata ? metadata.name : item.name}
              </Typography>
            </Grid>
            <Grid item lg={3} style={{ display: "flex", justifyContent: "center" }}>
              <Checkbox style={{ marginTop: '-10px' }}
                checked={isSelected} />
            </Grid>
          </Grid>

          <Grid container className="data-grid" alignContent="center">
            <img src={item.imageUrl} className="nft-list-item-image" width={"100%"} />
          </Grid>
          <Grid container className="data-grid" alignContent="center">
            <Grid item lg={6} md={6} sm={6} xs={6}>
              <Typography variant="h6" className="nft-item-description-title" align={'left'}>
                PoolId:
              </Typography>
            </Grid>
            <Grid item lg={6} md={6} sm={6} xs={6}>
              <Typography variant="h6" className="nft-item-description-value" align={'right'}>
                {item.poolId + 1}
              </Typography>
            </Grid>
          </Grid>
          <Grid container className="data-grid" alignContent="center">
            <Grid item lg={6} md={6} sm={6} xs={6}>
              <Typography variant="h6" className="nft-item-description-title" align={'left'}>
                Reward:
              </Typography>
            </Grid>
            <Grid item lg={6} md={6} sm={6} xs={6}>
              <Typography variant="h6" className="nft-item-description-value" align={'right'}>
                {`${Number(item.reward).toLocaleString()} $VTC`}
              </Typography>
            </Grid>
          </Grid>
          <Grid container className="data-grid" alignContent="center">
            <Grid item lg={12} md={8} sm={8} xs={8}>
              <Typography variant="h6" className="nft-item-description-value" align={'center'}>
                {/* { (item.stakeType == 0) ? "No lockup" : prettyVestingPeriod2(item.depositTime) } */}
                {/* {remainTimes[index]} */}
                {/* <UnstakeTimer unstakeTime={unstakeTime} /> */}
                { stakeTimeStr }
              </Typography>
            </Grid>
            <Grid item lg={12} md={4} sm={4} xs={4}>
              <Typography variant="h6" className="nft-item-description-title" align={'center'}>
                (Remain Lock Time)
              </Typography>
            </Grid>
          </Grid>
        </div>
      </Grid>
    )
  }

  return (
    <Container
      style={{
        paddingLeft: smallerScreen || verySmallScreen ? "0" : "2.3rem",
        paddingRight: smallerScreen || verySmallScreen ? "0" : "2.3rem",
      }}
    >
      <Zoom in={true}>
        <Paper className="ohm-card">
          <Box display="flex">
            <CardHeader title="Staked NFT List" />
          </Box>
          <div className="pool-card-container">
            <Grid container spacing={2} className="data-grid" alignContent="center">
              {
                (stakedItems && stakedItems.length > 0) ?
                  stakedItems.map((item, index) => {
                    return <NFTItemView
                      item={item}
                      index={index}
                      isSelected={selectedList[index]}
                      onSelected={onTokenSelected}
                    />
                  })
                  :
                  <>
                  <div className="unhappy" />
                  <div style={{ padding: '15px', fontSize: '30px' }}>No NFT</div>
                  </>
              }
            </Grid>
            <Grid container spacing={2} className="data-grid" alignContent="center">
              <Grid item className="pool-button-container">
                <Button
                  className="normal-button"
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    onClaim();
                  }}
                >
                  Claim
                </Button>
                <Button
                  className="normal-button"
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    onUnstake();
                  }}
                >
                  Unstake
                </Button>
                {/* <Button
                  className="pool-button"
                  variant="contained"
                  color="primary"
                  style={{ color: 'white', background: 'red', marginLeft: '20px' }}
                  onClick={() => {
                    onEmergencyWithdrawal();
                  }}
                >
                  Emergency Withdrawal
                </Button> */}
              </Grid>
            </Grid>
          </div>

        </Paper>
      </Zoom>

    </Container >
  );
}

const queryClient = new QueryClient();

export default ({ setLoadingStatus, refreshFlag, updateRefreshFlag }) => (
  <QueryClientProvider client={queryClient}>
    <StakedTokenList setLoadingStatus={setLoadingStatus} refreshFlag={refreshFlag} updateRefreshFlag={updateRefreshFlag} />
  </QueryClientProvider>
);