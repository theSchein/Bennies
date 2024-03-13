// nodeCalls.js
// This is a helper api that takes a contract address and returns the token ids for that contract.
// This also grabs all the metadata we need for a given contract and token id.

import web3 from "../../../lib/ethersProvider";
import getContractCreationBlock from "@/components/utils/getContractCreationBlock";

// ABI for ERC-721 metadata function
const erc721MetadataAbi = [
    // Existing tokenURI function definition
    {
        constant: true,
        inputs: [{ name: "tokenId", type: "uint256" }],
        name: "tokenURI",
        outputs: [{ name: "", type: "string" }],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
    // Add the ownerOf function definition
    {
        constant: true,
        inputs: [{ name: "tokenId", type: "uint256" }],
        name: "ownerOf",
        outputs: [{ name: "", type: "address" }],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
];

const erc721TransferEventAbi = [
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "from",
                type: "address",
            },
            { indexed: true, internalType: "address", name: "to", type: "address" },
            {
                indexed: true,
                internalType: "uint256",
                name: "tokenId",
                type: "uint256",
            },
        ],
        name: "Transfer",
        type: "event",
    },
];

// ABI for ERC-1155 metadata function
const erc1155MetadataAbi = [
    {
        constant: true,
        inputs: [{ name: "tokenId", type: "uint256" }],
        name: "uri",
        outputs: [{ name: "", type: "string" }],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
];

const erc1155TransferSingleEventAbi = [
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "operator",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "from",
                type: "address",
            },
            { indexed: true, internalType: "address", name: "to", type: "address" },
            { indexed: false, internalType: "uint256", name: "id", type: "uint256" },
            {
                indexed: false,
                internalType: "uint256",
                name: "value",
                type: "uint256",
            },
        ],
        name: "TransferSingle",
        type: "event",
    },
];

const proxyAbi = [
    {
        constant: true,
        name: "implementation",
        outputs: [{ name: "", type: "address" }],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
];

async function fetchEvents(contractInstance, fromBlock, toBlock) {
    const MAX_RESULTS = 10000;
    let events = [];
    let range = toBlock - fromBlock;
    let midBlock;

    while (range > 0) {
        try {
            const fetchedEvents = await contractInstance.getPastEvents("Transfer", {
                fromBlock,
                toBlock: fromBlock + range,
            });

            if (fetchedEvents.length < MAX_RESULTS) {
                events = events.concat(fetchedEvents);
                fromBlock += range + 1; // Move to the next range
                range = toBlock - fromBlock; // Calculate remaining range
            } else {
                // Halve the range if the result set is too large
                range = Math.floor(range / 2);
            }
        } catch (error) {
            if (error.message.includes("query returned more than 10000 results")) {
                // Halve the range if the result set is too large
                range = Math.floor(range / 2);
            } else {
                console.error(`Error fetching events: ${error.message}`);
                break; // Exit on unexpected errors
            }
        }
    }

    return events;
}

async function tokenIdFinder(contractAddress, contractType) {
    if (!contractAddress) {
        console.error("Missing contract address");
        return null;
    }

    const creationDetails = await getContractCreationBlock(contractAddress);
    if (!creationDetails) {
        console.error("Could not determine contract deployment block.");
        return null;
    }

    const currentBlock = await web3.eth.getBlockNumber();
    const MAX_RANGE = 10000;
    let allTokenIds = new Set();

    const abi =
        contractType === "ERC-721"
            ? erc721TransferEventAbi
            : erc1155TransferSingleEventAbi;
    const contractInstance = new web3.eth.Contract(abi, contractAddress);

    // Ensure block numbers are handled as Numbers
    const startBlockNumber = Number(creationDetails.blockNumber);
    const currentBlockNumber = Number(currentBlock);

    for (
        let startBlock = startBlockNumber;
        startBlock <= currentBlockNumber;
        startBlock += MAX_RANGE
    ) {
        const endBlock = Math.min(startBlock + MAX_RANGE - 1, currentBlockNumber);
        const events = await fetchEvents(contractInstance, startBlock, endBlock);

        events.forEach((event) => {
            const tokenId = event.returnValues.tokenId || event.returnValues.id; // Adjust based on the event structure
            allTokenIds.add(tokenId);
        });
    }

    if (allTokenIds.size > 0) {
        return Array.from(allTokenIds); // Convert the Set to an Array
    } else {
        console.log("No token IDs found for the given contract address.");
        return null;
    }
}

// Adjust the function signature to accept contractType
async function fetchTokenMetadata(contractAddress, tokenId, contractType) {
    let metadata = {};

    if (contractType === "ERC-721") {
        try {
            const contract721 = new web3.eth.Contract(
                erc721MetadataAbi,
                contractAddress,
            );
            const tokenURI = await contract721.methods.tokenURI(tokenId).call();
            const owner = await contract721.methods.ownerOf(tokenId).call();
            if (tokenURI) {
                metadata = { ...metadata, tokenURI, owner, contractType: "ERC-721" };
            }
        } catch (error) {
            console.error("ERC-721 fetch failed:", error.message);
        }
    } else if (contractType === "ERC-1155") {
        try {
            const contract1155 = new web3.eth.Contract(
                erc1155MetadataAbi,
                contractAddress,
            );
            const tokenURI = await contract1155.methods.uri(tokenId).call();
            // ERC-1155 does not have a direct ownerOf method; ownership might need to be determined differently.
            if (tokenURI) {
                metadata = { ...metadata, tokenURI, contractType: "ERC-1155" };
            }
        } catch (error) {
            console.error("ERC-1155 uri fetch failed:", error.message);
        }
    } else {
        console.error("Unsupported contract type:", contractType);
        return null;
    }

    // Fetch additional metadata from the tokenURI if available
    if (metadata.tokenURI) {
        try {
            const response = await fetch(
                metadata.tokenURI.startsWith("ipfs://")
                    ? metadata.tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/")
                    : metadata.tokenURI,
            );
            const tokenMetadata = await response.json();
            metadata = { ...metadata, ...tokenMetadata };
        } catch (error) {
            console.error("Failed to fetch token metadata from URI:", error.message);
        }
    }

    return metadata;
}

export { tokenIdFinder, fetchTokenMetadata };
