from web3 import Web3
import os
import requests
from utils.ethersProvider import web3

# Supported ERC standards
SUPPORTED_STANDARDS = {"ERC-721", "ERC-1155"}

# ABI definitions for ERC-721 and ERC-1155
erc721MetadataAbi = [
    {
        "constant": True,
        "inputs": [{"name": "tokenId", "type": "uint256"}],
        "name": "tokenURI",
        "outputs": [{"name": "", "type": "string"}],
        "payable": False,
        "stateMutability": "view",
        "type": "function",
    },
    {
        "constant": True,
        "inputs": [{"name": "tokenId", "type": "uint256"}],
        "name": "ownerOf",
        "outputs": [{"name": "", "type": "address"}],
        "payable": False,
        "stateMutability": "view",
        "type": "function",
    },
]

erc721TransferEventAbi = [
    {
        "anonymous": False,
        "inputs": [
            {
                "indexed": True,
                "internalType": "address",
                "name": "from",
                "type": "address",
            },
            {
                "indexed": True,
                "internalType": "address",
                "name": "to",
                "type": "address",
            },
            {
                "indexed": True,
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256",
            },
        ],
        "name": "Transfer",
        "type": "event",
    }
]

erc1155MetadataAbi = [
    {
        "constant": True,
        "inputs": [{"name": "tokenId", "type": "uint256"}],
        "name": "uri",
        "outputs": [{"name": "", "type": "string"}],
        "payable": False,
        "stateMutability": "view",
        "type": "function",
    },
]

erc1155TransferSingleEventAbi = [
    {
        "anonymous": False,
        "inputs": [
            {"indexed": True, "internalType": "address", "name": "operator", "type": "address"},
            {"indexed": True, "internalType": "address", "name": "from", "type": "address"},
            {"indexed": True, "internalType": "address", "name": "to", "type": "address"},
            {"indexed": False, "internalType": "uint256", "name": "id", "type": "uint256"},
            {"indexed": False, "internalType": "uint256", "name": "value", "type": "uint256"},
        ],
        "name": "TransferSingle",
        "type": "event",
    },
]

proxyAbi = [
    {
        "constant": True,
        "name": "implementation",
        "outputs": [{"name": "", "type": "address"}],
        "payable": False,
        "stateMutability": "view",
        "type": "function",
    }
]

def fetch_events(contract_instance, from_block, to_block):
    MAX_RESULTS = 10000
    events = []
    range_ = to_block - from_block

    while range_ > 0:
        try:
            event_filter = contract_instance.events.Transfer.create_filter(
                fromBlock=from_block,
                toBlock=from_block + range_
            )
            fetched_events = event_filter.get_all_entries()

            if len(fetched_events) < MAX_RESULTS:
                events.extend(fetched_events)
                from_block += range_ + 1  # Move to the next range
                range_ = to_block - from_block  # Calculate remaining range
            else:
                # Halve the range if the result set is too large
                range_ = range_ // 2
        except Exception as error:
            if "query returned more than 10000 results" in str(error):
                # Halve the range if the result set is too large
                range_ = range_ // 2
            else:
                print(f"Error fetching events: {error}")
                break  # Exit on unexpected errors

    return events


def get_contract_creation_block(contract_address):
    etherscan_api_key = os.getenv("ETHERSCAN_API_KEY")
    
    url = f"https://api.etherscan.io/api?module=account&action=txlist&address={contract_address}&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey={etherscan_api_key}"

    try:
        response = requests.get(url)
        data = response.json()
        if data["status"] == "1" and len(data["result"]) > 0:
            # The first transaction of a contract should be its creation transaction.
            creation_tx = next((tx for tx in data["result"] if tx["to"] == ""), None)
            if creation_tx:
                # Return both the hash and the block number of the creation transaction
                print("Creation Transaction:", creation_tx["blockNumber"])

                return {
                    "txHash": creation_tx["hash"],
                    "blockNumber": int(creation_tx["blockNumber"]),
                }
    except Exception as error:
        print("Error fetching contract creation details:", error)

    return None

def token_id_finder(contract_address, contract_type):
    if not contract_address:
        print("Missing contract address")
        return None

    creation_details = get_contract_creation_block(contract_address)
    if not creation_details:
        print("Could not determine contract deployment block.")
        return None

    current_block = web3.eth.get_block_number() 
    MAX_RANGE = 10000
    all_token_ids = set()

    abi = erc721TransferEventAbi if contract_type == "ERC-721" else erc1155TransferSingleEventAbi
    contract_instance = web3.eth.contract(abi=abi, address=contract_address)

    # Ensure block numbers are handled as Numbers
    start_block_number = int(creation_details["blockNumber"])
    current_block_number = int(current_block)

    for start_block in range(start_block_number, current_block_number + 1, MAX_RANGE):
        end_block = min(start_block + MAX_RANGE - 1, current_block_number)
        events = fetch_events(contract_instance, start_block, end_block)

        for event in events:
            token_id = event["args"]["tokenId"] if "tokenId" in event["args"] else event["args"]["id"]
            all_token_ids.add(token_id)

    if all_token_ids:
        print('token ids:', all_token_ids)  
        return list(all_token_ids)  # Convert the Set to a list
    else:
        print("No token IDs found for the given contract address.")
        return None


def fetch_token_metadata(contract_address, token_id, contract_type):
    metadata = {}

    if contract_type == "ERC-721":
        try:
            # Assuming web3 is properly initialized
            contract_721 = web3.eth.contract(abi=erc721MetadataAbi, address=contract_address)
            print(f"Fetching metadata for ERC-721 token ID {token_id} on contract {contract_address}")
            token_uri = contract_721.functions.tokenURI(token_id).call()
            owner = contract_721.functions.ownerOf(token_id).call()
            if token_uri:
                metadata = {"tokenURI": token_uri, "owner": owner, "contractType": "ERC-721", "token_id": token_id, "contract_address": contract_address}
        except Exception as error:
            print(f"ERC-721 fetch failed for token ID {token_id}:", error)
            return None
    elif contract_type == "ERC-1155":
        try:
            # Assuming web3 is properly initialized
            contract_1155 = web3.eth.contract(abi=erc1155MetadataAbi, address=contract_address)
            token_uri = contract_1155.functions.uri(token_id).call()
            if token_uri:
                metadata = {"tokenURI": token_uri, "contractType": "ERC-1155", "token_id": token_id, "contract_address": contract_address}
        except Exception as error:
            print(f"ERC-1155 fetch failed for token ID {token_id}:", error)
            return None
    else:
        print("Unsupported contract type:", contract_type)
        return None

    # Fetch additional metadata from the tokenURI if available
    if metadata.get("tokenURI"):
        try:
            print(f"Fetching additional metadata from URI: {metadata['tokenURI']}")
            response = requests.get(
                metadata["tokenURI"].replace("ipfs://", "https://ipfs.io/ipfs/")
                if metadata["tokenURI"].startswith("ipfs://")
                else metadata["tokenURI"]
            )
            token_metadata = response.json()
            metadata.update(token_metadata)
        except Exception as error:
            print("Failed to fetch token metadata from URI:", error)
            return None

    return metadata