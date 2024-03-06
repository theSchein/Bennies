// uploadFileToSpaces.js
// this function takes a media image url and uploads it according to the parameters passed to it

import axios from 'axios';
import s3 from '../../../lib/s3';

async function uploadFileToSpaces(imageUrl, destFileName) {
    console.log("Uploading file to spaces:", imageUrl, destFileName);
    try {
        // Replace IPFS URL with a gateway URL if necessary
        const gatewayUrl = imageUrl.replace("ipfs://", "https://ipfs.io/ipfs/");

        // Download the image using axios
        const response = await axios({
            method: 'get',
            url: gatewayUrl,
            responseType: 'arraybuffer'
        });

        const fileContent = Buffer.from(response.data, 'binary');

        // Setting up S3 upload parameters
        const params = {
            Bucket: "shuk",
            Key: destFileName,
            Body: fileContent,
            ACL: "public-read", // Make the file publicly accessible
        };

        // Uploading files to the bucket
        return new Promise((resolve, reject) => {
            s3.upload(params, function (err, data) {
                if (err) {
                    console.error("Error uploading file to spaces:", err);
                    return reject(err);
                }
                console.log("File uploaded successfully:", data.Location);
                resolve(data);
            });
        });
    } catch (error) {
        console.error("Error downloading or uploading the file:", error);
        throw error; // Rethrow or handle error as needed
    }
}

export default uploadFileToSpaces;
