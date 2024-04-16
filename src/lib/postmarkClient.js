import { ServerClient } from 'postmark';
// Create a Postmark client instance with your Server Token
const client = new ServerClient(process.env.POSTMARK_SERVER_TOKEN);

export default client;
