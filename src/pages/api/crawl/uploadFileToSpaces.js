import axios from "axios";
import s3 from "../../../lib/s3";
import { PassThrough } from "stream";

const MAX_RETRIES = 10; // Adjust based on your preference
const RETRY_DELAY = 1500; // Delay between retries in milliseconds
const REQUEST_TIMEOUT = 30000; // Timeout for the Axios request in milliseconds
const IPFS_GATEWAYS = [
    "https://ipfs.io/ipfs/",
    "https://gateway.pinata.cloud/ipfs/",
    // Add more gateways as needed
];

async function uploadFileToSpaces(imageUrl, destFileName) {
    if (imageUrl === "Blank") {
        console.error("Image URL is 'Blank', skipping upload.");
        return "Blank";
    }

    // Check if file exists in Spaces
    try {
        await s3.headObject({ Bucket: "shuk", Key: destFileName }).promise();
        console.log("File already exists at:", destFileName);
        return `https://shuk.nyc3.cdn.digitaloceanspaces.com/${destFileName}`;
    } catch (error) {
        if (error.code !== "NotFound") {
            throw error;
        }
    }

    // Function to download and upload with retry logic
    const downloadAndUpload = async (attempt = 0, gatewayIndex = 0) => {
        try {
            console.log(
                `Attempt ${attempt + 1}: Downloading and uploading ${imageUrl}`,
            );
            const sourceUrl = imageUrl.replace("ipfs://", "https://ipfs.io/ipfs/");
            const sourceStream = axios({
                method: "get",
                url: sourceUrl,
                responseType: "stream",
            }).then((response) => response.data);

            const pass = new PassThrough();
            const timeoutId = setTimeout(() => {
                console.log(`Request timed out after ${REQUEST_TIMEOUT}ms`);
                pass.emit("error", new Error("Request timed out"));
            }, REQUEST_TIMEOUT);

            sourceStream
                .then((stream) => {
                    stream.pipe(pass);
                    stream.on("end", () => clearTimeout(timeoutId));
                })
                .catch((error) => {
                    clearTimeout(timeoutId);
                    pass.emit("error", error);
                });

            const uploadParams = {
                Bucket: "shuk",
                Key: destFileName,
                Body: pass,
                ACL: "public-read",
            };

            await s3.upload(uploadParams).promise();
            return `https://shuk.nyc3.cdn.digitaloceanspaces.com/${destFileName}`;
        } catch (error) {
            if (error.response && error.response.status === 410 && gatewayIndex < IPFS_GATEWAYS.length - 1) {
                // If content is gone and other gateways are available, try the next gateway
                console.log(`Switching to next IPFS gateway and retrying...`);
                return downloadAndUpload(attempt, gatewayIndex + 1);
            } else if (attempt < MAX_RETRIES - 1) {
                console.log(`Retry ${attempt + 1}: Waiting ${RETRY_DELAY}ms`);
                await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
                return downloadAndUpload(attempt + 1);
            } else {
                console.error(
                    "Max retries reached, failed to download and upload:",
                    error.message,
                );
                throw error;
            }
        }
    };

    return downloadAndUpload();
}

export default uploadFileToSpaces;
