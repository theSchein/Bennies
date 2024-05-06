import os
from dotenv import load_dotenv

def load_config():
    # This adjusts the path to go two levels up from the current script's directory
    dotenv_path = os.path.join(os.path.dirname(__file__), '..', '..', '.env.local')
    load_dotenv(dotenv_path=dotenv_path)

    config = {
        'dbname': os.getenv('POSTGRES_DATABASE'),
        'user': os.getenv('POSTGRES_USER'),
        'password': os.getenv('POSTGRES_PASSWORD'),
        'host': os.getenv('POSTGRES_HOST'),
        'alchemy_api_key': os.getenv('ALCHEMY_API_KEY') 
    }
    return config
