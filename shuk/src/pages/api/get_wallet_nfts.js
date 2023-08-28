const { Alchemy, Network } = require("alchemy-sdk");
import { getToken } from 'next-auth/jwt';
import db from '../../lib/db';


const config = {
  apiKey: "KKpcwdH4IZ8mfWdIZdDQtBc9GETkcaoX",
  network: Network.ETH_MAINNET,
};
const alchemy = new Alchemy(config);

export default async function (req, res) {
  if (req.method === 'POST') {
    const session = await getToken( {req} );  

    if (!session) {
        // Not authenticated 
        return res.status(401).json({ error: 'Not authenticated from the session' });
    }

    try {
      const { address } = req.body;

      if (!address) {
        res.status(400).json({ error: "Missing owner address or ENS name in request body" });
        return;
      }
 
      let nfts = await alchemy.nft.getNftsForOwner(address);
      //console.log(nfts.ownedNfts);

      if (!Array.isArray(nfts.ownedNfts)) {
        return res.status(500).json({ error: "Data is not an array." });
    }

      for (let nft of nfts.ownedNfts) {
        console.log(nft.tokenId);
        const existingEntry = await db.oneOrNone('SELECT contract_address_token_id FROM nfts WHERE contract_address_token_id = $1', [nft.contract.address + nft.tokenId]);
        if (!existingEntry) {
        await db.none(`
        INSERT INTO nfts(
            contract_address_token_id,
            contract_address, 
            deployer_address,
            nft_name, 
            token_type, 
            token_uri_gateway,
            nft_description, 
            token_id)
            VALUES($1, $2, $3, $4, $5, $6, $7, $8)
            `, [nft.contract.address + nft.tokenId, 
                nft.contract.address, 
                nft.contractDeployer,
                nft.title,
                nft.tokenType,
                nft.tokenUri,
                nft.description,
                nft.tokenId,
            ]);
        }
      }
      res.status(200).json({ success: true, message: 'NFTs added to database' });


    } catch (err) {
      res.status(500).json({ error: err.message || err.toString() });
    }
  } else {
    res.status(405).end('Method Not Allowed');
  }


};
