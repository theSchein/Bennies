// nodeCalls.js
// This is a helper api that takes a contract address and returns the token ids for that contract.
// This also grabs all the metadata we need for a given contract and token id.

import web3 from "../../../lib/ethersProvider";

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

async function fetchEventsInBlockRange(
    contractInstance,
    eventName,
    fromBlock,
    toBlock,
) {
    try {
        return await contractInstance.getPastEvents(eventName, {
            fromBlock,
            toBlock,
        });
    } catch (error) {
        console.error(
            `Error fetching events from block ${fromBlock} to ${toBlock}:`,
            error.message,
        );
        throw error; // Rethrow the error to handle it in the calling function
    }
}

async function fetchImplementationAddress(contractAddress) {
    try {
        const implementationAddress = new web3.eth.Contract(
            proxyAbi,
            contractAddress,
        );
        console.log("Fetching implementation address for", contractAddress);
        return implementationAddress;
    } catch (error) {
        console.error("Error fetching implementation address:", error);
        return null;
    }
}

async function tokenIdFinder(contractAddress) {
    if (!contractAddress) {
        console.error("Missing contract address");
        return null;
    }

    let tokenIds = [];
    let contractType = "";

    // Attempt with ERC-721 ABI
    try {
        const contract721 = new web3.eth.Contract(
            erc721TransferEventAbi,
            contractAddress,
        );
        const events721 = await contract721.getPastEvents("Transfer", {
            fromBlock: 0,
            toBlock: "latest",
        });
        tokenIds = events721
            .map((event) => event.returnValues.tokenId)
            .filter((tokenId) => tokenId !== undefined);
        if (tokenIds.length > 0) {
            contractType = "ERC-721";
        }
    } catch (erc721Error) {
        console.error("ERC-721 tokenURI call failed:", erc721Error.message);
    }

    // If no ERC-721 token IDs found, attempt with ERC-1155 ABI
    if (tokenIds.length === 0) {
        console.log("No ERC-721 token IDs found, attempting with ERC-1155 ABI");
        try {
            const contract1155 = new web3.eth.Contract(
                erc1155TransferSingleEventAbi,
                contractAddress,
            );
            const events1155 = await contract1155.getPastEvents("TransferSingle", {
                fromBlock: 0,
                toBlock: "latest",
            });
            tokenIds = events1155
                .map((event) => event.returnValues.id)
                .filter((id) => id !== undefined);
            if (tokenIds.length > 0) {
                contractType = "ERC-1155";
            }
        } catch (erc1155Error) {
            console.error("ERC-1155 uri call failed:", erc1155Error.message);
        }
    }

    if (tokenIds.length > 0) {
        return { type: contractType, tokenIds };
    } else {
        console.log("No token IDs found for the given contract address.");
        return null;
    }
}

// Function to fetch metadata for a given contract address and token ID
async function fetchTokenMetadata(contractAddress, tokenId) {
    let metadata = {};

    // Attempt to fetch as ERC-721
    try {
        const contract721 = new web3.eth.Contract(erc721MetadataAbi, contractAddress);
        const tokenURI = await contract721.methods.tokenURI(tokenId).call();
        const owner = await contract721.methods.ownerOf(tokenId).call();
        if (tokenURI) {
            metadata = { ...metadata, tokenURI, owner, contractType: "ERC-721" };
        }
    } catch (erc721Error) {
        console.error("ERC-721 fetch failed:", erc721Error.message);
    }

    // If ERC-721 fetch failed, attempt to fetch as ERC-1155
    if (!metadata.tokenURI) {
        try {
            const contract1155 = new web3.eth.Contract(erc1155MetadataAbi, contractAddress);
            const tokenURI = await contract1155.methods.uri(tokenId).call();
            // Removed the owner fetching for ERC-1155
            if (tokenURI) {
                metadata = { ...metadata, tokenURI, contractType: "ERC-1155" };
                // Note: We're not fetching owner here because ERC-1155 does not support ownerOf
            }
        } catch (erc1155Error) {
            console.error("ERC-1155 uri fetch failed:", erc1155Error.message);
        }
    }

    // Fetch additional metadata from the tokenURI if available
    if (metadata.tokenURI) {
        try {
            const response = await fetch(metadata.tokenURI.startsWith("ipfs://") ? metadata.tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/") : metadata.tokenURI);
            const tokenMetadata = await response.json();
            metadata = { ...metadata, ...tokenMetadata };
        } catch (fetchError) {
            console.error("Failed to fetch token metadata from URI:", fetchError.message);
        }
    }
    return metadata;
}

export { fetchImplementationAddress, tokenIdFinder, fetchTokenMetadata };
