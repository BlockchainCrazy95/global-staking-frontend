import React, { useState, useContext, useMemo, useCallback, useEffect } from "react";
import Web3Modal from "web3modal";
import { StaticJsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { CHAIN_ID, MAINNET_ID, RPC_URL, TESTNET_ID } from "./data";
import { changeNetwork } from "./hooks";
import { ethers } from "ethers";

function getTestnetURI() {
  return RPC_URL[TESTNET_ID];
}

function getMainnetURI() {
  return RPC_URL[MAINNET_ID]
}

const web3Modal = new Web3Modal({
  // network: "mainnet", // optional
  cacheProvider: true, // optional
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        rpc: {
          32520: getMainnetURI(),
          64668: getTestnetURI(),
        },
      },
    },
  },
})

const Web3Context = React.createContext(null);

export const useWeb3Context = () => {
  const web3Context = useContext(Web3Context);
  if (!web3Context) {
    throw new Error(
      "useWeb3Context() can only be used inside of <Web3ContextProvider />, please declare it at a higher level.",
    );
  }
  const { onChainProvider } = web3Context;
  return useMemo(() => {
    return { ...onChainProvider };
  }, [web3Context]);
};

export const useAddress = () => {
  const { address } = useWeb3Context();
  return address;
};

export const Web3ContextProvider = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const [chainID, setChainID] = useState(CHAIN_ID);
  const [address, setAddress] = useState("");
  const [provider, setProvider] = useState(new StaticJsonRpcProvider(RPC_URL[CHAIN_ID]));

  const hasCachedProvider = () => {
    if (!web3Modal) return false;
    if (!web3Modal.cachedProvider) return false;
    return true;
  };
  
  const subscribeProvider = useCallback((provider) => {
    setProvider(provider);

    provider.on("disconnect", (err) => {
      setChainID(0);
      setAddress("");
    });
    provider.on("accountsChanged", (accounts) => {
      setAddress(accounts[0]);
    });
    provider.on("chainChanged", async(chainId) => {
      const isValid = _checkNetwork(chainId);
      if(!isValid) {
        disconnect();
        changeNetwork();
      }
    })
  }, [provider]);

  /**
   * throws an error if networkID is not 1 (mainnet) or 4 (rinkeby)
   */
  const _checkNetwork = (otherChainID) => {
    if (chainID !== otherChainID) {
      console.warn("You are switching networks", otherChainID);
      if (otherChainID === CHAIN_ID) {
        setChainID(otherChainID);
        return true;
      }
      return false;
    }
    return true;
  };

  // connect - only runs for WalletProviders
  const connect = useCallback(async () => {
    const _rawProvider = await web3Modal.connect();
    // new _initListeners implementation matches Web3Modal Docs
    // ... see here: https://github.com/Web3Modal/web3modal/blob/2ff929d0e99df5edf6bb9e88cff338ba6d8a3991/example/src/App.tsx#L185
    subscribeProvider(_rawProvider);

    const connectedProvider = new Web3Provider(_rawProvider, "any");

    const chainId = await connectedProvider.getNetwork().then(network => network.chainId);
    const connectedAddress = await connectedProvider.getSigner().getAddress();
    const validNetwork = _checkNetwork(chainId);
    if (!validNetwork) {
      // console.error("Wrong network, please switch to mainnet");
      disconnect();
      changeNetwork();
      return;
    }
    // Save everything after we've validated the right network.
    // Eventually we'll be fine without doing network validations.
    setAddress(connectedAddress);

    // Keep this at the bottom of the method, to ensure any repaints have the data we need
    setConnected(true);

    return connectedProvider;
  }, [provider, web3Modal, connected]);

  const disconnect = useCallback(async () => {
    console.log("disconnecting");
    await web3Modal.clearCachedProvider();
    setConnected(false);
    setAddress("");
  }, [provider, web3Modal, connected]);

  useEffect(() => {
    if(web3Modal.cachedProvider) {
      connect();
    } else {
      const _provider = new ethers.providers.StaticJsonRpcProvider(RPC_URL[CHAIN_ID], CHAIN_ID);
      setProvider(_provider);
      subscribeProvider(_provider);
    }
  }, []);

  const onChainProvider = useMemo(
    () => ({ connect, disconnect, hasCachedProvider, provider, connected, address, chainID }),
    [connect, disconnect, hasCachedProvider, provider, connected, address, chainID],
  );

  return <Web3Context.Provider value={{ onChainProvider }}>{children}</Web3Context.Provider>;
};
