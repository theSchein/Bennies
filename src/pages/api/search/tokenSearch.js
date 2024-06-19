import Moralis from 'moralis';
import web3 from "../../../lib/ethersProvider";
import db from "../../../lib/db";

const moralisApiKey = process.env.MORALIS_API_KEY;

if (!Moralis.Core.isStarted) {
    Moralis.start({
        apiKey: moralisApiKey,
    });
}

export default async function handler(req, res) {
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

        address = web3.utils.toChecksumAddress(address);

        // Fetch token balances using Moralis
        const response = await Moralis.EvmApi.token.getWalletTokenBalances({
            chain: "0x1",
            address: address,
        });

        const balances = response?.raw || [];

        // Filter out tokens with zero balance
        const nonZeroBalances = balances.filter((token) => {
            const tokenBalance = parseFloat(token.balance) / Math.pow(10, token.decimals);
            return tokenBalance > 0;
        });

        // Get token details from database
        const tokenAddresses = nonZeroBalances.map((token) => web3.utils.toChecksumAddress(token.token_address));
        const query = `
            SELECT contract_address, token_name, token_symbol, logo_media, decimals, description, deployer_address, supply, token_utility 
            FROM public.tokens 
            WHERE contract_address = ANY($1)
        `;
        const dbResult = await db.query(query, [tokenAddresses]);
        const dbTokens = dbResult?.rows || [];
        const dbTokenMap = new Map();

        let i = 0;
        while (i < dbTokens.length) {
            const token = dbTokens[i];
            if (token && token.contract_address) {
                dbTokenMap.set(token.contract_address, token);
            }
            i++;
        }

        const tokensData = nonZeroBalances.map((token) => {
            const contractAddress = web3.utils.toChecksumAddress(token.token_address);
            const dbToken = dbTokenMap.get(contractAddress);
            const tokenBalance = parseFloat(token.balance) / Math.pow(10, token.decimals);

            return {
                contractAddress,
                balance: tokenBalance.toFixed(2),
                name: dbToken?.token_name || token.name,
                symbol: dbToken?.token_symbol || token.symbol,
                logo: dbToken?.logo_media || token.logo || '',
                decimals: dbToken?.decimals || token.decimals,
                description: dbToken?.description || '',
                deployerAddress: dbToken?.deployer_address || '',
                supply: dbToken?.supply || '',
                utility: dbToken?.token_utility || '',
            };
        });

        return res.status(200).json({ tokens: tokensData });
    } catch (error) {
        console.error("Token search API error:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}
