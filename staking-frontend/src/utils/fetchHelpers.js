import axios from 'axios'
import erc721Abi from "src/contracts/abis/erc721Abi.json";
import { getBaseURI, getName, getSymbol, getTokensOfOwner } from 'src/contracts/contractHelpers';
import { CHAIN_ID, API_URL } from './data';

export const getNFTHoldingList = async (web3, address) => {
    /*
    name: _nftData.name,
            symbol: _nftData.symbol,
            token_id: _nftData.token_id,
            token_address: _nftData.token_address,
            metadata: _nftData.metadata,
    */
      // https://deep-index.moralis.io/api/v2/0x2cA62Cf3F7D24A31D7125962b55809A61e05560a/nft?chain=rinkeby&format=decimal&limit=10

    // const res = await axios.get(`https://deep-index.moralis.io/api/v2/${address}/nft?chain=rinkeby&format=decimal&limit=10`, {
    //     headers: { "X-API-Key": "iea1xCsNT6edUc6Xfu8ZqUorCRnshpsaC66IUaHOqbEnVFDK04qfeNsmGKikqJkn" }
    // });
    // return res.status == 200 ? res.data.result.filter(x => x.contract_type == "ERC721") : [];
    try {
        const res = await axios.get(`${API_URL[CHAIN_ID]}api?module=account&action=tokenlist&address=${address}`)
        const nfts = res.status == "1" ? res.result.filter(x => x.type == "ERC-721") : [];
        /*
        [{
          "balance": "1",
          "contractAddress": "0x0000000000000000000000000000000000000001",
          "decimals": "18",
          "name": "Example ERC-721 Token",
          "symbol": "ET7",
          "type": "ERC-721"
        }]
        */
        const nftData = [];
        for(let i = 0;i<nfts.length;i++) {
            const nftContract = new web3.eth.Contract(erc721Abi, nfts[i].contractAddress);
            const _tokensOfOwner = await getTokensOfOwner(nftContract, address);
            for(let j = 0;j<_tokensOfOwner.length;j++) {
                const resMeta = await getTokenIdMetadata(web3, nfts[i].contractAddress, _tokensOfOwner[j]);
                const data = {
                    name: nfts[i].name,
                    symbol: nfts[i].symbol,
                    token_address: nfts[i].contractAddress,
                    token_id: _tokensOfOwner[j],
                    metadata: resMeta ? resMeta.metadata : null
                }
                nftData.push(data);
            }
        }
        return nftData;
    } catch(err) {
        console.log("getNFTHoldingList error=", err);
        return [];
    }
}

export const getImageUrlFromMetadata = async (data) => {
    if(data.metadata == null) {
        return "";
    }
    const jsonData = JSON.parse(data.metadata);
    return jsonData.image;
}

export const getTokenIdMetadata = async(web3, contractAddress, tokenId) => {
    // https://deep-index.moralis.io/api/v2/nft/0xa7bf683e5761ADbaA95389DAc8BeCC117D65ac8e/2?chain=rinkeby&format=decimal
    // const res = await axios.get(`https://deep-index.moralis.io/api/v2/nft/${contractAddress}/${tokenId}?chain=rinkeby&format=decimal`, {
    //     headers: { "X-API-Key": "iea1xCsNT6edUc6Xfu8ZqUorCRnshpsaC66IUaHOqbEnVFDK04qfeNsmGKikqJkn" }
    // });
    // return res.status == 200 ? res.data : null;
    try {
        const nftContract = new web3.eth.Contract(erc721Abi, contractAddress);
        const _name = await getName(nftContract);
        const _symbol = await getSymbol(nftContract);
        const data = {
            name: _name,
            symbol: _symbol,
            token_id: tokenId,
            token_address: contractAddress,
        };
        const _baseUri = await getBaseURI(nftContract, tokenId);
        try {
            const resMeta = await axios.get(_baseUri);
            data.metadata = JSON.stringify(resMeta.data);
        } catch (err) {
            // console.log("getMetadataFromBaseUri = ", err);
            data.metadata = null;
        }        
        return data
    } catch (err) {
        // console.log("getTokenIdMetadata error=", err);
        return null;
    }
    
}