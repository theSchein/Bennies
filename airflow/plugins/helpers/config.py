import os
from dotenv import load_dotenv

load_dotenv(dotenv_path='/root/shuk/airflow/.env')

def load_db():
    # This adjusts the path to go two levels up from the current script's directory

    config = {
        'dbname': os.getenv('POSTGRES_DB'),
        'user': os.getenv('POSTGRES_USER'),
        'password': os.getenv('POSTGRES_PASSWORD'),
        'host': os.getenv('POSTGRES_HOST'),
        'alchemy_api_key': os.getenv('ALCHEMY_API_KEY') 
    }
    return config

def load_s3():
    # This adjusts the path to go two levels up from the current script's directory
    config = {
        'digitalocean_spaces_access_key_id': os.getenv('DIGITALOCEAN_SPACES_ACCESS_KEY_ID'),
        'digitalocean_spaces_secret_access_key': os.getenv('DIGITALOCEAN_SPACES_SECRET_ACCESS_KEY'),
    }
    return config