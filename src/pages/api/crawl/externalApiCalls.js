import retry from "async-retry";

const { Alchemy, Network } = require("alchemy-sdk");

const config = {
    apiKey: process.env.ALCHEMY_API_KEY,
    network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(config);

async function fetchCollectionData(contract) {
    try {
        const response = await alchemy.nft.getContractMetadata(contract);
        const collectionData = {
            contract_address: response.address,
            collection_name: response.name,
            token_type: response.tokenType,
            num_collection: response.totalSupply,
            deployer: response.contractDeployer,
        };
        return collectionData;
    } catch (error) {
        console.error("Error fetching collection data:", error);
        return null;
    }
}

async function fetchNftMetadata(contract, tokenId, contractType) {
    return await retry(
        async () => {
            return await alchemy.nft.getNftMetadata(
                String(contract),
                String(tokenId),
                String(contractType),
            );
        },
        {
            retries: 100,
            factor: 3,
            minTimeout: 3000,
            maxTimeout: 60000,
            onRetry: (error, attempt) => {
                console.log(
                    `Retry attempt ${attempt} for getNftMetadata due to error: ${error.message}`,
                );
            },
        },
    );
}

async function fetchNftOwners(contract, tokenId) {
    return await retry(
        async () => {
            return await alchemy.nft.getOwnersForNft(
                String(contract),
                String(tokenId),
            );
        },
        {
            retries: 100,
            factor: 3,
            minTimeout: 3000,
            maxTimeout: 60000,
            onRetry: (error, attempt) => {
                console.log(
                    `Retry attempt ${attempt} for getNftOwners due to error: ${error.message}`,
                );
            },
        },
    );
}

export { fetchCollectionData, fetchNftMetadata, fetchNftOwners };
