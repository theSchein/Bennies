// uploadFileToSpaces.js
// this function takes a media image url and uploads it according to the parameters passed to it

import axios from "axios";
import s3 from "../../../lib/s3";

async function uploadFileToSpaces(imageUrl, destFileName) {
    if (imageUrl === "Blank") {
        console.error("Image URL is 'Blank', skipping upload.");
        return "Blank";
    }
    console.log("Checking if file exists in Spaces:", destFileName);
    try {
        // Attempt to retrieve file metadata
        await s3
            .headObject({
                Bucket: "shuk",
                Key: destFileName,
            })
            .promise();

        console.log("File already exists at:", destFileName);
        // Construct the URL of the existing file
        const existingFileUrl = `https://shuk.nyc3.cdn.digitaloceanspaces.com/${destFileName}`;
        return existingFileUrl;
    } catch (error) {
        if (error.code === "NotFound") {
            console.log("File does not exist, proceeding with upload.");
        } else {
            console.error("Error checking file existence:", error);
            throw error;
        }
    }
    try {
        let gatewayUrl = imageUrl;
        if (imageUrl.startsWith("ipfs://")) {
            gatewayUrl = imageUrl.replace("ipfs://", "https://ipfs.io/ipfs/");
        } else if (
            !imageUrl.startsWith("http://") &&
            !imageUrl.startsWith("https://")
        ) {
            console.error("Unsupported URL scheme:", imageUrl);
            return "Blank"; // Or return a placeholder image URL
        }

        // Download the image using axios
        const response = await axios.get(gatewayUrl, {
            responseType: "arraybuffer",
        });
        const fileContent = response.data;

        // Setting up S3 upload parameters
        const params = {
            Bucket: "shuk",
            Key: destFileName,
            Body: fileContent,
            ACL: "public-read",
        };

        // Uploading files to the bucket
        const { Location } = await s3.upload(params).promise();
        console.log("File uploaded successfully at:", Location);
        const cdnUrl = `https://shuk.nyc3.cdn.digitaloceanspaces.com/${destFileName}`;
        console.log("CDN URL:", cdnUrl);
        return cdnUrl;    } catch (error) {
        console.error("Error uploading file to Spaces:", error);
        throw error; // Rethrow to handle it in the calling code
    }
}

export default uploadFileToSpaces;
