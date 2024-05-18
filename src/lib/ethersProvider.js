// lib/ethersProvider.js
// This file is used to create a web3 instance that connects to the Ethereum mainnet.

import Web3 from 'web3';

const infuraApiKey = process.env.INFURA_API_KEY;

// https://rpc.dexosphere.xyz/
const web3 = new Web3(new Web3.providers.HttpProvider(`https://mainnet.infura.io/v3/81b0c120b79f481299158c5718b96e17`)); //https://rough-spring-frog.quiknode.pro/${process.env.QUIKNODE_API_KEY}`));
// const web3 = new Web3(new Web3.providers.HttpProvider(`https://rough-spring-frog.quiknode.pro/${process.env.QUIKNODE_API_KEY}`));


export default web3;