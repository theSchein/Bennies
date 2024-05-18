// lib/ethersProvider.js
// This file is used to create a web3 instance that connects to the Ethereum mainnet.

import Web3 from 'web3';

console.log('drpc key:', process.env.DRPC_API_KEY)

// https://rpc.dexosphere.xyz/
const web3 = new Web3(new Web3.providers.HttpProvider(`https://lb.drpc.org/ogrpc?network=ethereum&dkey=${process.env.DRPC_API_KEY}`)); //https://rough-spring-frog.quiknode.pro/${process.env.QUIKNODE_API_KEY}`));
// const web3 = new Web3(new Web3.providers.HttpProvider(`https://rough-spring-frog.quiknode.pro/${process.env.QUIKNODE_API_KEY}`));


export default web3;