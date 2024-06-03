// pages/api/search/tokensSearch.js
const { Alchemy, Network } = require("alchemy-sdk");
import web3 from "../../../lib/ethersProvider";

const config = {
    apiKey: process.env.ALCHEMY_API_KEY,
    network: Network.ETH_MAINNET,
};
const alchemy = new Alchemy(config);

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

        const balances = await alchemy.core.getTokenBalances(address);
        console.log("Token balances:", balances);

        const nonZeroBalances = balances.tokenBalances.filter((token) => {
            const tokenBalance = BigInt(token.tokenBalance);
            console.log(`Token ${token.contractAddress} balance: ${tokenBalance}`);
            return tokenBalance > 0;
        });

        console.log("Non-zero token balances:", nonZeroBalances);

        const tokensData = await Promise.all(
            nonZeroBalances.map(async (token) => {
                const metadata = await alchemy.core.getTokenMetadata(token.contractAddress);
                const tokenBalance = parseFloat(BigInt(token.tokenBalance).toString()) / Math.pow(10, metadata.decimals);
                console.log(`Metadata for ${token.contractAddress}:`, metadata);
                return {
                    contractAddress: token.contractAddress,
                    balance: tokenBalance.toFixed(2),
                    ...metadata
                };
            })
        );

        console.log("Tokens data:", tokensData);

        return res.status(200).json({ tokens: tokensData });
    } catch (error) {
        console.error("Token search API error:", error);
        return res
            .status(500)
            .json({ message: "Internal Server Error", error: error.message });
    }
}
