// pages/api/search/tokensSearch.js
import { Alchemy, Network } from "alchemy-sdk";
import db from "../../../lib/db";

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
        console.log("Token balances:", balances);

        const nonZeroBalances = balances.tokenBalances.filter((token) => {
            const tokenBalance = BigInt(token.tokenBalance);
            return tokenBalance > 0;
        });

        console.log("Non-zero token balances:", nonZeroBalances);

        const tokensData = await Promise.all(
            nonZeroBalances.map(async (token) => {
                const metadata = await alchemy.core.getTokenMetadata(token.contractAddress);
                const tokenBalance = parseFloat(token.tokenBalance) / Math.pow(10, metadata.decimals);
                return {
                    contractAddress: token.contractAddress,
                    balance: tokenBalance.toFixed(2),
                    ...metadata
                };
            })
        );

        return res.status(200).json({ tokens: tokensData });
    } catch (error) {
        console.error("Token search API error:", error);
        return res
            .status(500)
            .json({ message: "Internal Server Error", error: error.message });
    }
}
