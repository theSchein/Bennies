let isMoralisStarted = false;

export default async function (req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    const Moralis = require("moralis").default;
    const { EvmChain } = require("@moralisweb3/common-evm-utils");
    const chain = EvmChain.ETHEREUM;

    if (!isMoralisStarted) {
        await Moralis.start({
          apiKey: process.env.MORALIS_API_KEY,
        });
        isMoralisStarted = true;
    }

    console.log("Moralis started:" + isMoralisStarted);

    const contract = req.query.contract;

    if (!contract) {
        return res.status(400).json({ message: "contract address query parameter is required." });
    }

    try {
        let cursor = null;
        let nftDetails = [];

        do {
            const response = await Moralis.EvmApi.nft.getContractNFTs({
              address: contract, // Use the contract variable
              chain,
              cursor: cursor,
            });

            for (const NFT of response.result) {
                const metadata = typeof NFT.metadata === 'string' ? JSON.parse(NFT.metadata) : NFT.metadata;
                let image = NFT && NFT.metadata ? NFT.metadata.image : "Blank";
                if (image.startsWith("ipfs://")) {
                    image = image.replace("ipfs://", "https://ipfs.io/ipfs/");
                }

                nftDetails.push({
                    contract_address: contract,
                    token_id: NFT.token_id,
                    nft_name: metadata ? metadata.name : "Unknown",
                    token_type: NFT.contractType,
                    token_uri: NFT.tokenUri,
                    media_link: image,
                    spam: NFT.possibleSpam
                });
            }

            cursor = response.pagination.cursor;
        } while (cursor != "" && cursor != null);

        return res.status(200).json(nftDetails);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error.", error: error.message });
    }
}
