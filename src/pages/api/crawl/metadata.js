import web3 from "../../../lib/ethersProvider";
import tokenIdFinder from "./nodeCalls";

// Minimal ABIs for different checks and interactions
const erc721Abi = [
    {
        constant: true,
        inputs: [{ name: "tokenId", type: "uint256" }],
        name: "tokenURI",
        outputs: [{ name: "", type: "string" }],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
];
const erc1155Abi = [
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

async function getImplementationAddress(contractAddress) {
    try {
        const implementationAddress = new web3.eth.Contract(proxyAbi, contractAddress);
        console.log("Fetching implementation address for", contractAddress);
        return implementationAddress;
        } catch (error) {
        console.error("Error fetching implementation address:", error);
        return null;
    }
}

export default async function handler(req, res) {
    const { contractAddress, tokenId } = req.query;
    console.log("Fetching metadata for", contractAddress, tokenId);

    if (!contractAddress || !tokenId) {
        return res
            .status(400)
            .json({ error: "Missing contract address or token ID" });
    }

    try {
        // // Fetch and log the contract's bytecode
        // const bytecode = await web3.getCode(contractAddress);
        // console.log(`Bytecode for contract at ${contractAddress}: ${bytecode.substring(0, 100)}...`);
        tokenIdFinder(contractAddress);

        // Attempt with ERC-721 ABI
        try {
            const contract721 = new web3.eth.Contract(erc721Abi, contractAddress);
            const uri721 = await contract721.methods.tokenURI(tokenId).call();
            const response721 = await fetch(
                uri721.startsWith("ipfs://")
                    ? uri721.replace("ipfs://", "https://ipfs.io/ipfs/")
                    : uri721,
            );
            const metadata721 = await response721.json();
            console.log("Metadata fetched 721:", metadata721);
            return res.status(200).json(metadata721);
        } catch (erc721Error) {
            console.error("ERC-721 tokenURI call failed:", erc721Error.message);
        }

        // Attempt with ERC-1155 ABI
        try {
            const contract1155 = new web3.eth.Contract(erc1155Abi, contractAddress);
            const uri1155 = await contract1155.methods.uri(tokenId).call();
            const response1155 = await fetch(
                uri1155.startsWith("ipfs://")
                    ? uri1155.replace("ipfs://", "https://ipfs.io/ipfs/")
                    : uri1155,
            );
            const metadata1155 = await response1155.json();
            console.log("Metadata fetched 1155:", metadata1155);
            return res.status(200).json(metadata1155);
        } catch (erc1155Error) {
            console.error("ERC-1155 uri call failed:", erc1155Error.message);
        }

        // If both attempts fail, respond with an error
        res.status(500).json({
            error: "Failed to fetch NFT metadata using standard ERC-721 or ERC-1155 functions",
        });
    } catch (error) {
        console.error("Error occurred:", error.message);
        console.error("Detailed error:", error);
        return res.status(500).json({ error: error.message });
    }
}
