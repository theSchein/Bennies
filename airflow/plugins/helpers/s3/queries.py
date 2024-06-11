import requests
from botocore.exceptions import NoCredentialsError, PartialCredentialsError
import time
from helpers.s3.connection import connect_s3

IPFS_GATEWAYS = [
    "https://gateway.pinata.cloud/ipfs/",
    "https://ipfs.io/ipfs/",
]

MAX_RETRIES = 5
RETRY_DELAY = 1.5  # in seconds
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
            print(f"Attempt {attempt + 1}: Downloading and uploading {image_url}")
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
                print(f"Retry {attempt + 1}: Waiting {RETRY_DELAY} seconds before retrying")
                time.sleep(RETRY_DELAY)
                return download_and_upload(attempt + 1, gateway_index)
            else:
                print(f"Max retries reached, failed to download and upload: {e}")
        except Exception as e:
            if gateway_index < len(IPFS_GATEWAYS) - 1:
                print(f"Switching to next IPFS gateway and retrying...")
                return download_and_upload(attempt, gateway_index + 1)
            else:
                print(f"Failed after trying all IPFS gateways: {e}")

        # Continue to next item after max retries
        print(f"Skipping image due to max retries reached: {image_url}")
        return None

    return download_and_upload()