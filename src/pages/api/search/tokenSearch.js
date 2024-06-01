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
        const nonZeroBalances = balances.tokenBalances.filter((token) => {
            const tokenBalance = BigInt(token.tokenBalance);
            return tokenBalance > 0;
        });

        // Function to fetch metadata with a timeout
        const fetchMetadataWithTimeout = async (contractAddress, timeout = 2000) => {
            return Promise.race([
                alchemy.core.getTokenMetadata(contractAddress),
                new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), timeout)),
            ]);
        };

        // Process tokens in parallel with timeout handling
        const tokensData = await Promise.all(
            nonZeroBalances.map(async (token) => {
                try {
                    const metadata = await fetchMetadataWithTimeout(token.contractAddress);
                    const tokenBalance = parseFloat(BigInt(token.tokenBalance).toString()) / Math.pow(10, metadata.decimals);
                    return {
                        contractAddress: token.contractAddress,
                        balance: tokenBalance.toFixed(2),
                        ...metadata
                    };
                } catch (error) {
                    console.error(`Error fetching metadata for token: ${token.contractAddress}`, error);
                    return null;
                }
            })
        );

        const filteredTokens = tokensData.filter(token => token !== null);

        return res.status(200).json({ tokens: filteredTokens });
    } catch (error) {
        console.error("Token search API error:", error);
        return res
            .status(500)
            .json({ message: "Internal Server Error", error: error.message });
    }
}
