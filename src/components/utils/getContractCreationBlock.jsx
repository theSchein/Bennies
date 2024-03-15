import axios from "axios";

async function getContractCreationBlock(contractAddress) {
    const url = `https://api.etherscan.io/api?module=account&action=txlist&address=${contractAddress}&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=${process.env.ETHERSCAN_API_KEY}`;

    try {
        const response = await axios.get(url);
        if (response.data.status === "1" && response.data.result.length > 0) {
            // The first transaction of a contract should be its creation transaction.
            const creationTx = response.data.result.find((tx) => tx.to === "");
            if (creationTx) {
                // Return both the hash and the block number of the creation transaction
                console.log("Creation Transaction:", creationTx.blockNumber);

                return {
                    txHash: creationTx.hash,
                    blockNumber: parseInt(creationTx.blockNumber, 10),
                };
            }
        }
    } catch (error) {
        console.error("Error fetching contract creation details:", error);
    }

    return null;
}

export default getContractCreationBlock;
