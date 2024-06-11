import requests
from botocore.exceptions import NoCredentialsError, PartialCredentialsError
import time
from .connection import connect_s3
from utils.externalApiCalls import fetch_image_with_alchemy

IPFS_GATEWAYS = [
    "https://gateway.pinata.cloud/ipfs/",
    "https://ipfs.io/ipfs/",
    "https://cloudflare-ipfs.com/ipfs/",
    "https://infura-ipfs.io/ipfs/",
    "https://ipfs.infura.io/ipfs/"
]

MAX_RETRIES = 3
RETRY_DELAY = .5  # in seconds
REQUEST_TIMEOUT = 25  # in seconds

s3_client = connect_s3()

def upload_file_to_s3(image_url, dest_file_name, bucket_name):
    if image_url == "Blank":
        print("Image URL is 'Blank', skipping upload.")
        return "Blank"

    # Check if file already exists in S3
    try:
        s3_client.head_object(Bucket=bucket_name, Key=dest_file_name)
        print(f"File already exists at: {dest_file_name}")
        return f"https://{bucket_name}.nyc3.digitaloceanspaces.com/{dest_file_name}"
    except s3_client.exceptions.ClientError as e:
        if e.response['Error']['Code'] != '404':
            raise

    def download_and_upload(attempt=0, gateway_index=0):
        try:
            if attempt == MAX_RETRIES - 1:
                contract_address = image_url.split('/')[4]
                token_id = image_url.split('/')[-1]
                alchemy_url = fetch_image_with_alchemy(contract_address, token_id)
                source_url = alchemy_url if alchemy_url else image_url.replace("ipfs://", IPFS_GATEWAYS[gateway_index])
            else:
                source_url = image_url.replace("ipfs://", IPFS_GATEWAYS[gateway_index])

            response = requests.get(source_url, stream=True, timeout=REQUEST_TIMEOUT)
            response.raise_for_status()

            s3_client.upload_fileobj(
                response.raw,
                bucket_name,
                dest_file_name,
                ExtraArgs={"ACL": "public-read"}
            )
            return f"https://{bucket_name}.nyc3.digitaloceanspaces.com/{dest_file_name}"
        except (requests.RequestException, NoCredentialsError, PartialCredentialsError) as e:
            if attempt < MAX_RETRIES - 1:
                time.sleep(RETRY_DELAY)
                return download_and_upload(attempt + 1, gateway_index)
            else:
                return None
        except Exception as e:
            if gateway_index < len(IPFS_GATEWAYS) - 1:
                return download_and_upload(attempt, gateway_index + 1)
            else:
                return None

    return download_and_upload()