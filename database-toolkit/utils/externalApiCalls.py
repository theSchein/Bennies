from utils.config import load_db 
import requests
import os
from dotenv import load_dotenv

load_dotenv()

ALCHEMY_API_KEY = os.getenv("ALCHEMY_API_KEY")
MORALIS_API_KEY = os.getenv("MORALIS_API_KEY")


def fetch_erc20(contract_address):
    """
    Fetches token data from Alchemy for a given contract address.
    Falls back to Moralis if Alchemy request fails.

    Args:
        contract_address (str): The contract address to query.

    Returns:
        dict: The token data as a dictionary, or None if an error occurs or it's not an ERC-20 token.
    """
    alchemy_data = fetch_erc20_alchemy(contract_address)
    if alchemy_data:
        return alchemy_data

    print("Alchemy request failed or returned no data. Trying Moralis...")
    moralis_data = fetch_erc20_moralis(contract_address)
    if moralis_data:
        return moralis_data

    print("Failed to fetch ERC-20 token data from both Alchemy and Moralis.")
    return None

def fetch_erc20_alchemy(contract_address):
    """
    Fetches token data from Alchemy for a given contract address.

    Args:
        contract_address (str): The contract address to query.

    Returns:
        dict: The token data as a dictionary, or None if an error occurs.
    """
    base_url = "https://eth-mainnet.g.alchemy.com/v2/"
    url = f"{base_url}{ALCHEMY_API_KEY}/getContractMetadata"

    params = {'contractAddress': contract_address}

    try:
        response = requests.get(url, params=params)
        response.raise_for_status()  # Raises an HTTPError for bad responses
        return response.json()  # Return the full token data as JSON
    except requests.RequestException as e:
        print(f"Error fetching token data from Alchemy: {e}")
        return None

def fetch_erc20_moralis(contract_address):
    """
    Fetches token data from Moralis for a given contract address.

    Args:
        contract_address (str): The contract address to query.

    Returns:
        dict: The token data as a dictionary, or None if an error occurs.
    """
    base_url = "https://deep-index.moralis.io/api/v2/erc20/metadata"
    url = f"{base_url}"

    headers = {
        'x-api-key': MORALIS_API_KEY
    }

    params = {'chain': 'eth', 'addresses': contract_address}

    try:
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()  # Raises an HTTPError for bad responses
        return response.json()[0]  # Return the first element of the JSON response
    except requests.RequestException as e:
        print(f"Error fetching token data from Moralis: {e}")
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