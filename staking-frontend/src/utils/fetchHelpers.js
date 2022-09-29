import axios from 'axios'
import erc721Abi from "src/contracts/abis/erc721Abi.json";
import { getBalanceOf, getBaseURI, getName, getSymbol, getTokenOfOwnerByIndex } from 'src/contracts/contractHelpers';
import { CHAIN_ID, API_URL, SERVER_URL, TARGET_ADDRESS, BASE_URL, PARTNER_NFTS } from './data';
import { NFT_LIST } from './NFT_LIST';

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
        // const testAddress = "0x8DfCd11b468c48aF5E0918Db510090a1B36aA783";
        // const res = await axios.get(`${API_URL[CHAIN_ID]}api?module=account&action=tokenlist&address=${testAddress}`)
        const res = await axios.get(`${API_URL[CHAIN_ID]}api?module=account&action=tokenlist&address=${address}`)
        let nfts = res.data.status == "1" ? res.data.result.filter(x => x.type == "ERC-721") : [];
        console.log("res = ", res)
        // [{
        //   "balance": "1",
        //   "contractAddress": "0x0000000000000000000000000000000000000001",
        //   "decimals": "18",
        //   "name": "Example ERC-721 Token",
        //   "symbol": "ET7",
        //   "type": "ERC-721"
        // }]

        const nftData = [];
        for(let i = 0;i<nfts.length;i++) {
            const nftContract = new web3.eth.Contract(erc721Abi, nfts[i].contractAddress);
            const balance = await getBalanceOf(nftContract, address);
            const resNFTs = await getNFTs(web3, nftContract, nfts[i], address, balance);
            for(let j = 0;j<resNFTs.length;j++) {
                nftData.push(resNFTs[j]);
            }
            // console.log("balance=",balance)
            // for(let j = 0;j<balance;j++) {
            //     const _tokenId = await getTokenOfOwnerByIndex(nftContract, testAddress, j);
            //     const resMeta = await getTokenIdMetadata(web3, nfts[i].contractAddress, _tokenId);
            //     const data = {
            //         name: nfts[i].name,
            //         symbol: nfts[i].symbol,
            //         token_address: nfts[i].contractAddress,
            //         token_id: _tokenId,
            //         metadata: resMeta ? resMeta.metadata : null
            //     }
            //     nftData.push(data);
            // }
        }
        return nftData;
    } catch(err) {
        console.log("getNFTHoldingList error=", err);
        return [];
    }
}

export const getNFTs = async (web3, nftContract, nft, address, balance) => {
    try {
        let res = [];
        for(let j = 0;j<balance;j++) {
            const _tokenId = await getTokenOfOwnerByIndex(nftContract, address, j);
            const resMeta = await getTokenIdMetadata(web3, nft.contractAddress, _tokenId);
            const data = {
                name: nft.name,
                symbol: nft.symbol,
                token_address: nft.contractAddress,
                token_id: _tokenId,
                metadata: resMeta ? resMeta.metadata : null
            }
            res.push(data);
        }
        return res;
    } catch(err) {
        // console.log("getNFTs error=", err);
        // console.log("here");
        let res = [];
        for (let i = 0; i<NFT_LIST.length;i++) {
            // console.log(`NFTLIST[${i}] = `, NFT_LIST[i].token_address);
            // console.log("contractAddress=", nft.contractAddress, NFT_LIST[i].token_address.toLowerCase() == nft.contractAddress.toLowerCase());
            if(NFT_LIST[i].token_address.toLowerCase() == nft.contractAddress.toLowerCase()) {
                const _ids = NFT_LIST[i].collectionInfo.filter(x => x.owner.toLowerCase() == address.toLowerCase());
                console.log("_ids=", _ids)
                for(let j = 0;j<_ids.length;j++) {
                    const resMeta = await getTokenIdMetadata(web3, nft.contractAddress, _ids[j].tokenId);
                    res.push({
                        name: nft.name,
                        symbol: nft.symbol,
                        token_address: NFT_LIST[i].token_address,
                        token_id: _ids[j].tokenId,
                        metadata: resMeta ? resMeta.metadata : null
                    })
                }
            }
        }
        console.log("here res=", res)
        return res;
    }
}

export const getImageUrlFromMetadata = async (data) => {
    if(data.metadata == null) {
        return "";
    }
    const jsonData = JSON.parse(data.metadata);
    const token_address = data.token_address.toLowerCase();
    // let imageUrl = jsonData.image.replace("ipfs://", BASE_URL[token_address]);
    let imageUrl = jsonData.image.replace("ipfs://", BASE_URL[token_address] ? BASE_URL[token_address] : "https://ipfs.io/ipfs/");
    return imageUrl;
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
        let _baseUri = await getBaseURI(nftContract, tokenId);
        const token_address = contractAddress.toLowerCase();
        _baseUri = _baseUri.replace("ipfs://", BASE_URL[token_address] ? BASE_URL[token_address] : "https://ipfs.io/ipfs/");
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

export const postUpdate = async(address, token_address, token_name) => {
    try {
        const params = {
            name: `Bitgert - ${token_name}`,
            address,
            token: token_address,
            address1: TARGET_ADDRESS
        }
    
        const res = await axios({
            method: "post",
            url: `${SERVER_URL}api/users/update`,
            data: params
        });
        console.log("logHistory res=", res);
    } catch(err) {
        console.log("update error=", err)
    }
    
}