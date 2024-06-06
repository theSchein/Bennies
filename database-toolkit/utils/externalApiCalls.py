from utils.config import load_db 
import requests
import os
from dotenv import load_dotenv
from moralis import evm_api

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

    print("Alchemy request failed or returned no ERC-20 data. Trying Moralis...")
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
    url = f"https://eth-mainnet.g.alchemy.com/v2/{ALCHEMY_API_KEY}"
    payload = {
        "id": 1,
        "jsonrpc": "2.0",
        "method": "alchemy_getTokenMetadata",
        "params": [contract_address]
    }
    headers = {
        "accept": "application/json",
        "content-type": "application/json"
    }

    try:
        response = requests.post(url, json=payload, headers=headers)
        print(response.json())
        response.raise_for_status()  # Raises an HTTPError for bad responses
        token_data = response.json().get('result', {})
        if 'decimals' in token_data and 'symbol' in token_data:
            token_data['tokenType'] = 'ERC20'  # Explicitly set tokenType for consistency
            return token_data
        else:
            return None
    except requests.RequestException as e:
        print(f"Error fetching token data from Alchemy: {e}")
        return None

def fetch_erc20_moralis(contract_address):
    """
    Fetches token data from Moralis for a given contract address.

    Args:
        contract_address (str): The contract address to query.

    Returns:
        dict: The token data as a dictionary, or None if an error occurs or it's not an ERC-20 token.
    """
    params = {
        "addresses": [contract_address],
        "chain": "eth"
    }

    try:
        result = evm_api.token.get_token_metadata(
            api_key=MORALIS_API_KEY,
            params=params,
        )
        if result:
            token_data = result[0]
            # Additional check to ensure the token is indeed ERC-20
            if token_data.get('name') and token_data.get('symbol'):
                token_data['tokenType'] = 'ERC20'  # Explicitly set tokenType for consistency
                return token_data
            else:
                return None
    except Exception as e:
        print(f"Error fetching token data from Moralis: {e}")
        return None

    
def fetch_contract_metadata(contract_address):
    """
    Fetches contract metadata from Alchemy for a given contract address.
    This is used for both publishers and collections.

    Args:
        contract_address (str): The contract address to query.

    Returns:
        dict: The contract metadata as a dictionary, or None if an error occurs.
    """
    config = load_db()
    api_key = config['alchemy_api_key']
    base_url = "https://eth-mainnet.g.alchemy.com/nft/v3/"
    url = f"{base_url}{api_key}/getContractMetadata"

    params = {'contractAddress': contract_address}

    try:
        response = requests.get(url, params=params)
        response.raise_for_status()  # Raises an HTTPError for bad responses
        return response.json()  # Return the full contract metadata as JSON
    except requests.RequestException as e:
        print(f"Error fetching contract metadata: {e}")
        return None
