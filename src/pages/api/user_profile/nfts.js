// pages/api/user_profile/nfts.js
// This api is used to fetch user nfts from the database
// If the NFT is owned by the user and in the database it makes sure the owner is correct in the db and grabs the nfts to render

import db from "../../../lib/db";
const { Alchemy, Network } = require("alchemy-sdk");
import { getToken } from "next-auth/jwt";

const config = {
    apiKey: process.env.ALCHEMY_API_KEY,
    network: Network.ETH_MAINNET,
};
const alchemy = new Alchemy(config);

export default async (req, res) => {
    if (req.method === "GET") {
        const session = await getToken({ req });

        if (!session) {
            return res.status(401).json({ error: "Not authenticated" });
        }

        const address = req.query.address; // Assuming address is passed as a query parameter

        if (!address) {
            return res.status(400).json({ error: "Missing address" });
        }

        try {
            let nfts = await alchemy.nft.getNftsForOwner(address);

            if (!Array.isArray(nfts.ownedNfts)) {
                return res.status(500).json({ error: "Data is not an array." });
            }

            const nftData = [];
            for (let nft of nfts.ownedNfts) {
                const contractAddressTokenId = nft.contract.address + nft.tokenId;

                const load = await db.oneOrNone(
                    "SELECT contract_address_token_id, nft_id, nft_name, media_url FROM nfts WHERE LOWER(contract_address_token_id) = $1",
                    [nft.contract.address + nft.tokenId],
                );
                if (load) {
                    nftData.push(load);

                    await db.none(
                        "UPDATE nfts SET owners = array_append(owners, $1) WHERE contract_address_token_id = $2",
                        [address, contractAddressTokenId],
                    );
                }
            }

            res.status(200).json(nftData);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        }
    } else {
        res.setHeader("Allow", ["GET"]);
        res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
};
