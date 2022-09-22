import { useEffect, useState, useRef } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Paper, Grid, Typography, Box, Zoom, Container, useMediaQuery, Button, Checkbox } from "@material-ui/core";
import { FormControl, RadioGroup, FormControlLabel, Radio } from "@material-ui/core";
import { NotificationManager } from "react-notifications";
import { Skeleton } from "@material-ui/lab";
import CardHeader from "../../components/CardHeader/CardHeader";
import axios from "axios";

import { useTheme } from "@material-ui/core/styles";
import "./stake.scss";
import { useContractContext } from "src/utils/ContractProvider";
import { useWeb3Context } from "src/utils/web3Context";
import { stakeNft } from "src/contracts/contractHelpers";
import { showNotification } from "src/utils";


function TokenList({ setLoadingStatus, refreshFlag, updateRefreshFlag, tokenHoldingList }) {
  const { address } = useWeb3Context(0);
  const { web3, stakingContract } = useContractContext();

  const smallerScreen = useMediaQuery("(max-width: 650px)");
  const verySmallScreen = useMediaQuery("(max-width: 379px)");

  const poolID = useRef("0");
  const [selectedList, setSelectedList] = useState([]);

  useEffect(() => {
    const list = [];
    for(let i = 0;i<tokenHoldingList.length;i++)
      list.push(false)
    setSelectedList(list);
  }, [tokenHoldingList])

  const onTokenSelected = (event, id) => {
    const list = [];
    for(let i = 0;i<selectedList.length;i++) {
      if(i != id) list.push(false)
      else list.push(!selectedList[i]);
    }
    setSelectedList(list);
  }

  const onStake = async () => {
    if(!stakingContract || !address) {
      showNotification("Please connect wallet!", "error");
      return;
    }
    setLoadingStatus(true);
    let selIndex = selectedList.indexOf(true);
    if (selIndex == -1) {
      NotificationManager.error("Please select NFT!");
    } else {
      const poolId = poolID.current;
      console.log("stake selected index = ", selIndex);
      console.log("stake poolId=", poolId);
        console.log("tokenHoldingList=", tokenHoldingList)
      try {
        const res = await stakeNft(web3, stakingContract, address, poolId, tokenHoldingList[selIndex].token_address, tokenHoldingList[selIndex].token_id);
        console.log("stakeNFT res=", res);
        showNotification(res.message, res.success ? "success" : "error");
        updateRefreshFlag();
        // if (res.result == "success") {
        //   NotificationManager.success('Transaction succeed');
        //   updateRefreshFlag();
        // } else {
        //   NotificationManager.error('Transaction failed');
        // }
      } catch (err) {
        console.log("stakeNFT err=", err);
        NotificationManager.error(err.message);
      }
    }

    setLoadingStatus(false);
  };

  const RowRadioButtonsGroup = () => {
    const [selVal, setSelVal] = useState(poolID.current);

    const onChangePool = (event) => {
      poolID.current = event.target.value;
      setSelVal(event.target.value);
    };

    return (
      <FormControl>
        <RadioGroup
          row
          aria-labelledby="demo-row-radio-buttons-group-label"
          name="row-radio-buttons-group"
          value={selVal}
          onChange={onChangePool}
        >
          <FormControlLabel value="0" control={<Radio />} label="Pool 1" />
          <FormControlLabel value="1" control={<Radio />} label="Pool 2" />
          <FormControlLabel value="2" control={<Radio />} label="Pool 3" />
          {/* <FormControlLabel value="5" control={<Radio />} label="Pool 6" /> */}

        </RadioGroup>
      </FormControl>
    );
  }

  const NFTItemView = ({ nft_item, index, isSelected, onSelected }) => {
    const metadata = nft_item.metadata ? JSON.parse(nft_item.metadata) : null;
    return (
      <Grid item lg={3}>
        <div className="pool-card" onClick={e => onSelected(e, index)}>
          <Grid container className="data-grid" alignContent="center">
            <Grid item lg={9}  >
              <Typography variant="h6" >
                {metadata ? metadata.name : nft_item.name}
              </Typography>
            </Grid>
            <Grid item lg={3} style={{ display: "flex", justifyContent: "center" }}>
              <Checkbox style={{ marginTop: '-10px' }}
                checked={isSelected} />
            </Grid>
          </Grid>

          <Grid container className="data-grid" alignContent="center">
            <img src={nft_item.imageUrl} className="nft-list-item-image" width={"100%"} />
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
            <CardHeader title="My NFT List" />
          </Box>
          <div className="token-list-container">
            <Grid container spacing={2} className="data-grid" alignContent="center">
              {
                (tokenHoldingList && tokenHoldingList.length > 0) ?
                tokenHoldingList.map((item, index) => {
                    return <NFTItemView 
                      nft_item={tokenHoldingList[index]} index={index}
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
            <div style={{ display: "flex", justifyContent: "center" }}>
              <RowRadioButtonsGroup />
            </div>
            <Grid container spacing={2} className="data-grid" style={{ padding: '10px' }} alignContent="center">
              <Grid item className="stake-button-container">
                <Button
                  className="normal-button"
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    onStake();
                  }}
                >
                  Stake
                </Button>

              </Grid>
            </Grid>
          </div>

        </Paper>
      </Zoom>

    </Container >
  );
}

const queryClient = new QueryClient();

export default ({ setLoadingStatus, refreshFlag, updateRefreshFlag, tokenHoldingList }) => (
  <QueryClientProvider client={queryClient}>
    <TokenList setLoadingStatus={setLoadingStatus} refreshFlag={refreshFlag} updateRefreshFlag={updateRefreshFlag} tokenHoldingList={tokenHoldingList}/>
  </QueryClientProvider>
);