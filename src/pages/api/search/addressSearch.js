import { getToken } from "next-auth/jwt";
import db from "../../../lib/db";
const { Alchemy, Network } = require("alchemy-sdk");
import web3 from "../../../lib/ethersProvider";

const config = {
    apiKey: process.env.ALCHEMY_API_KEY,
    network: Network.ETH_MAINNET,
};
const alchemy = new Alchemy(config);

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const session = await getToken({ req });
    if (!session) {
        return res.status(401).json({ error: "Not authenticated from the session" });
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

        const nfts = await alchemy.nft.getNftsForOwner(address.toLowerCase()); // Ensure address is lowercase
        if (!Array.isArray(nfts.ownedNfts)) {
            return res.status(500).json({ error: "Data is not an array." });
        }

        let nftResults = [];

        for (let nft of nfts.ownedNfts) {
            const contractAddressTokenId = `${nft.contract.address.toLowerCase()}${nft.tokenId}`; // Ensure contract address is lowercase
            const existingEntries = await db.manyOrNone(
                `
                SELECT nfts.*, 
                collections.collection_name, 
                collections.collection_description AS collection_description,
                collections.nft_licence AS collection_licence,
                collections.collection_utility AS collection_utility,
                collections.category AS collection_category
                FROM nfts
                LEFT JOIN collections ON nfts.collection_id = collections.collection_id
                WHERE LOWER(nfts.contract_address_token_id) = LOWER($1)
            `,
                [contractAddressTokenId],
            );

            for (const existingEntry of existingEntries) {
                // Check if the address (in its original case) is already an owner, case-insensitive check
                if (
                    !existingEntry.owners.some(
                        (owner) => owner.toLowerCase() === address.toLowerCase(),
                    )
                ) {
                    await db.none(
                        `UPDATE nfts SET owners = array_append(owners, $1) WHERE contract_address_token_id = $2`, // Case-sensitive update
                        [address, existingEntry.contract_address_token_id], // Use the original case for address and contract_address_token_id
                    );
                }

                nftResults.push(existingEntry);
            }
        }

        return res.status(200).json({ nfts: nftResults });
    } catch (error) {
        console.error("Search API error:", error);
        return res
            .status(500)
            .json({ message: "Internal Server Error", error: error.message });
    }
}
