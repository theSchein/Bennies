// pages/api/search/tokenSearch.js
import { Alchemy, Network } from "alchemy-sdk";

const config = {
    apiKey: process.env.ALCHEMY_API_KEY,
    network: Network.ETH_MAINNET,
};
const alchemy = new Alchemy(config);

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        const { address } = req.body;
        if (!address) {
            return res.status(400).json({
                error: "Missing owner address in request body",
            });
        }

        const balances = await alchemy.core.getTokenBalances(address);

        const nonZeroBalances = balances.tokenBalances.filter(token => {
            return token.tokenBalance !== "0";
        });

        const tokensData = [];

        for (let token of nonZeroBalances) {
            const metadata = await alchemy.core.getTokenMetadata(token.contractAddress);
            const tokenBalance = parseFloat(token.tokenBalance) / Math.pow(10, metadata.decimals);
            tokensData.push({
                contractAddress: token.contractAddress,
                balance: tokenBalance.toFixed(2),
                ...metadata
            });
        }

        return res.status(200).json({ tokens: tokensData });
    } catch (error) {
        console.error("Token search API error:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}
