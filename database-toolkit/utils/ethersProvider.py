from web3 import Web3
import os
import dotenv

dotenv.load_dotenv()

# Retrieve DRPC_ETHEREUM_API_KEY and INFURA_API_KEY from environment variables
drpc_api_key = os.getenv("DRPC_ETHEREUM_API_KEY")
infura_api_key = os.getenv("INFURA_API_KEY")

# Check if INFURA_API_KEY is set
if infura_api_key:
    infura_provider = f"https://mainnet.infura.io/v3/{infura_api_key}"
    try:
        web3_provider = Web3.HTTPProvider(infura_provider)
        web3 = Web3(web3_provider)
    except Exception as e:
        print(f"Error connecting to Infura provider: {e}")
        # If Infura connection fails, try connecting with DRPC
        if drpc_api_key:
            provider = f"https://lb.drpc.org/ogrpc?network=ethereum&dkey={drpc_api_key}"
            try:
                web3_provider = Web3.HTTPProvider(provider)
                web3 = Web3(web3_provider)
            except Exception as e:
                print(f"Error connecting to DRPC provider: {e}")
        else:
            print("DRPC_ETHEREUM_API_KEY is not set in environment variables. Unable to connect to DRPC provider.")
else:
    print("INFURA_API_KEY is not set in environment variables. Unable to connect to Infura provider.")
