from utils.config import load_db 
import requests


def fetch_erc20(contract_address):
    """
    Fetches token data from Alchemy for a given contract address.

    Args:
        contract_address (str): The contract address to query.

    Returns:
        dict: The token data as a dictionary, or None if an error occurs or it's an NFT contract.
    """
    config = load_db()
    api_key = config['alchemy_api_key']
    base_url = "https://eth-mainnet.g.alchemy.com/v2/"
    url = f"{base_url}{api_key}/gettoken/contract"

    params = {'contractAddress': contract_address}

    try:
        response = requests.get(url, params=params)
        response.raise_for_status()  # Raises an HTTPError for bad responses
        return response.json()  # Return the full token data as JSON
    except requests.RequestException as e:
        print(f"Error fetching token data: {e}")
        return None
    
def fetch_collection_data(contract_address):
    """
    Fetches collection data from Alchemy for a given contract address.
    This is only called if the contract_address is not a token contract.

    Args:
        contract_address (str): The contract address to query.

    Returns:
        dict: The collection data as a dictionary, or None if an error occurs.
    """
    config = load_db()
    api_key = config['alchemy_api_key']
    base_url = "https://eth-mainnet.g.alchemy.com/nft/v3/"
    url = f"{base_url}{api_key}/getContractMetadata"

    params = {'contractAddress': contract_address}

    try:
        response = requests.get(url, params=params)
        response.raise_for_status()  # Raises an HTTPError for bad responses
        return response.json()  # Return the full collection data as JSON
    except requests.RequestException as e:
        print(f"Error fetching collection data: {e}")
        return None