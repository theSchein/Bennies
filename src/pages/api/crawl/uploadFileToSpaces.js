import axios from "axios";
import s3 from "../../../lib/s3";
import { PassThrough } from "stream";

const MAX_RETRIES = 3; // Adjust based on your preference
const RETRY_DELAY = 1000; // Delay between retries in milliseconds

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
    const downloadAndUpload = async (attempt = 0) => {
        try {
            console.log(`Attempt ${attempt + 1}: Downloading and uploading ${imageUrl}`);
            const response = await axios({
                method: "get",
                url: imageUrl.replace("ipfs://", "https://ipfs.io/ipfs/"),
                responseType: "stream",
            });

            const pass = new PassThrough();
            response.data.pipe(pass);

            const uploadParams = {
                Bucket: "shuk",
                Key: destFileName,
                Body: pass,
                ACL: "public-read",
            };

            await s3.upload(uploadParams).promise();
            return `https://shuk.nyc3.cdn.digitaloceanspaces.com/${destFileName}`;
        } catch (error) {
            if (attempt < MAX_RETRIES - 1) {
                console.log(`Retry ${attempt + 1}: Waiting ${RETRY_DELAY}ms`);
                await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
                return downloadAndUpload(attempt + 1);
            } else {
                console.error("Max retries reached, failed to download and upload:", error.message);
                throw error;
            }
        }
    };

    return downloadAndUpload();
}

export default uploadFileToSpaces;
