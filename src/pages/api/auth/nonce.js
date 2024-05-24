import { withIronSession } from 'next-iron-session';
import { ironOptions } from '../../../lib/utils/ironOptions';
import { generateNonce } from 'siwe';

const nonceHandler = async (req, res) => {
  if (req.method === 'GET') {
    try {
      const nonce = generateNonce();
      req.session.nonce = nonce;
      await req.session.save();
      res.status(200).json({ nonce });
    } catch (error) {
      console.error("Failed to generate nonce:", error);
      res.status(500).json({ error: "Internal Server Error", description: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end('Method Not Allowed');
  }
};

export default withIronSession(nonceHandler, ironOptions);