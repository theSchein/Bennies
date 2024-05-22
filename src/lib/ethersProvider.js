// lib/ethersProvider.js
// This file is used to create a web3 instance that connects to the Ethereum mainnet.

import Web3 from 'web3';

const drpcApiKey = process.env.DRPC_ETHEREUM_API_KEY;
console.log("DRPC_ETHEREUM_API_KEY: ", drpcApiKey);

if (!drpcApiKey) {
    throw new Error("DRPC_ETHEREUM_API_KEY is not set in environment variables.");
}

const provider = `https://lb.drpc.org/ogrpc?network=ethereum&dkey=${drpcApiKey}`;

const web3Provider = new Web3.providers.HttpProvider(provider);
const web3 = new Web3(web3Provider);


export default web3;
