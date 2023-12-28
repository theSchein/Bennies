// pages/api/user_profile/nfts.js
// WIP: this api is used to fetch user nfts from the database, recently implemented and needs improvemnt.

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
                const load = await db.oneOrNone(
                    "SELECT contract_address_token_id, nft_id, nft_name, media_url FROM nfts WHERE contract_address_token_id = $1",
                    [nft.contract.address + nft.tokenId],
                );
                if (load) {
                    nftData.push(load);
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
