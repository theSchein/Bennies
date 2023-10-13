const Moralis = require("moralis").default;
const { EvmChain } = require("@moralisweb3/common-evm-utils");

const init = async () => {
  const address = "0x025B0A638768B49901565c39A0C141BDB52CC06f"; //Cryptopunks contract address
  const chain = EvmChain.ETHEREUM;
  await Moralis.start({
    apiKey: "YF3b7r01KWRAWzttcrmY67PHGvpaYAEp0YYnL0yT2uYQaqgUztrOIOMSQg0qfY1f",
  });

  let cursor = null;
  do {
    const response = await Moralis.EvmApi.nft.getContractNFTs({
      address,
      chain,
      cursor: cursor,
    });
    
    console.log(
      `Got page ${response.page} of ${Math.ceil(
        response.pagination.total / response.pagination.pageSize
      )}, ${response.pagination.total} total`
    );

    //console.log(JSON.stringify(response.result, null, 2));

    for (const NFT of response.result) {

        const metadata = typeof NFT.metadata === 'string' ? JSON.parse(NFT.metadata) : NFT.metadata;
        const name = NFT && NFT.metadata ? NFT.metadata.name : "Unknown";
        let image = NFT && NFT.metadata ? NFT.metadata.image : "Blank";
        if (image.startsWith("ipfs://")) {
            image = image.replace("ipfs://", "https://ipfs.io/ipfs/");
        }

        console.log('-------------------------'); // Separator for clarity
        console.log(`contract_address: ${address}`);
        console.log(`token_id: ${NFT.token_id}`);
        console.log(`nft_name: ${name}`);
        console.log(`token_type: ${NFT.contractType}`);
        console.log(`token_uri: ${NFT.tokenUri}`);
        console.log(`media_link: ${image}`);
        console.log(`Spam: ${NFT.possibleSpam}`);
        console.log('-------------------------'); // Separator for clarity

    }
    cursor = response.pagination.cursor;
  } while (cursor != "" && cursor != null);

};

init();