// pages/api/search/tokensSearch.js
import Moralis from 'moralis';
import web3 from "../../../lib/ethersProvider";

export default async function handler(req, res) {
    console.log("Token search API request received");
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        let { address } = req.body;
        if (!address) {
            return res.status(400).json({
                error: "Missing owner address or ENS name in request body",
            });
        }

        // Check if the input is an ENS name (ends with .eth)
        if (address.endsWith(".eth")) {
            // Resolve the ENS name to an address
            address = await web3.eth.ens.getAddress(address);
            if (!address) {
                return res
                    .status(404)
                    .json({ error: "ENS name could not be resolved" });
            }
        }

        address = address.toLowerCase();
        console.log(`Fetching token balances for address: ${address}`);

        // Initialize Moralis
        await Moralis.start({
            apiKey: process.env.MORALIS_API_KEY,
        });

        // Fetch token balances using Moralis
        const response = await Moralis.EvmApi.token.getWalletTokenBalances({
            chain: "0x1",
            address: address,
        });

        const balances = response.raw;

        // Filter out tokens with zero balance
        const nonZeroBalances = balances.filter((token) => {
            const tokenBalance = parseFloat(token.balance) / Math.pow(10, token.decimals);
            return tokenBalance > 0;
        });

        const tokensData = nonZeroBalances.map((token) => {
            const tokenBalance = parseFloat(token.balance) / Math.pow(10, token.decimals);
            return {
                contractAddress: token.token_address,
                balance: tokenBalance.toFixed(2),
                name: token.name,
                symbol: token.symbol,
                logo: token.logo || '',
                decimals: token.decimals,
            };
        });

        console.log("Tokens data:", tokensData);

        return res.status(200).json({ tokens: tokensData });
    } catch (error) {
        console.error("Token search API error:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}
