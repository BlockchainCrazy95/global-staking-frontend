import { Button } from "@material-ui/core";
import { ellipseAddress } from "src/utils";
import { useWeb3Context } from "src/utils/web3Context";

const ConnectButton = () => {
  const { connect, disconnect, connected, address } = useWeb3Context();

  const onHandleConnect = () => {
    if( connected ) {
      disconnect();
    } else {
      connect();
    }
  }

  return (
    <Button variant="contained" color="primary" className="connect-button" onClick={onHandleConnect} style={{width: "185px"}}>
      { connected ? ellipseAddress(address) : "Connect Wallet"}
    </Button>
  );
};

export default ConnectButton;
