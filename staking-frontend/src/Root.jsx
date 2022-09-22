/* eslint-disable global-require */
import { Component } from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import store from "./store";
import { ContractProvider } from "./utils/ContractProvider";
import { Web3ContextProvider } from "./utils/web3Context";

export default class Root extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Provider store={store}>
        <BrowserRouter basename={"/#"}>
          <Web3ContextProvider>            
            <ContractProvider>
              <App />
            </ContractProvider>
          </Web3ContextProvider>
        </BrowserRouter>
      </Provider>
    );
  }
}
