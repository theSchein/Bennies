// lib/ethersProvider.js
// This file is used to create a web3 instance that connects to the Ethereum mainnet.

import Web3 from 'web3';

const web3 = new Web3(new Web3.providers.HttpProvider(`https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`));


export default web3;