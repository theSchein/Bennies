import boto3
from botocore.config import Config
from utils.config import load_s3

def connect_s3():
    """Creates a connection to the DigitalOcean Spaces using configuration loaded from the environment."""
    config = load_s3()
    try:
        s3_client = boto3.client(
            's3',
            endpoint_url="https://nyc3.digitaloceanspaces.com",
            region_name="us-east-1",
            aws_access_key_id=config['digitalocean_spaces_access_key_id'],
            aws_secret_access_key=config['digitalocean_spaces_secret_access_key'],
            config=Config(signature_version='s3v4')
        )
        return s3_client
    except Exception as e:
        print(f"Failed to connect to S3: {e}")
        return None

if __name__ == "__main__":
    connect_s3()
