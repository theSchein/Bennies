# config.py
import os
from dotenv import load_dotenv

def load_config():
    load_dotenv(dotenv_path='.env.local')
    return {
        'dbname': os.getenv('POSTGRES_DATABASE'),
        'user': os.getenv('POSTGRES_USER'),
        'password': os.getenv('POSTGRES_PASSWORD'),
        'host': os.getenv('POSTGRES_HOST')
    }
