// s3.js
// digital ocean spaces s3 connection to upload images

import AWS from 'aws-sdk';

//const spacesEndpoint = new AWS.Endpoint("nyc3.digitaloceanspaces.com"); 
const s3 = new AWS.S3({
    endpoint: "https://nyc3.digitaloceanspaces.com",
    region: "us-east-1", 
    credentials: {
        accessKeyId: process.env.DIGITALOCEAN_SPACES_ACCESS_KEY_ID,
        secretAccessKey: process.env.DIGITALOCEAN_SPACES_SECRET_ACCESS_KEY
      }
});


export default s3;