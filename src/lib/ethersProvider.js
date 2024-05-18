// lib/ethersProvider.js
// This file is used to create a web3 instance that connects to the Ethereum mainnet.

import Web3 from 'web3';

const drpcApiKey = process.env.DRPC_API_KEY;

if (!drpcApiKey) {
    throw new Error("DRPC_API_KEY is not set in environment variables.");
}

const provider = `https://lb.drpc.org/ogrpc?network=ethereum&dkey=${drpcApiKey}`;
console.log("Using DRPC Provider URL:", provider);

const web3Provider = new Web3.providers.HttpProvider(provider);
const web3 = new Web3(web3Provider);

web3.eth.net.isListening()
    .then(() => console.log('Web3 is connected'))
    .catch(e => console.log('Something went wrong', e));

export default web3;
