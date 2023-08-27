// pages/api/updateWallet.js
import { getToken } from 'next-auth/jwt';
import db from '../../lib/db';

export default async (req, res) => {
  if (req.method === 'POST') {
  const session = await getToken( {req} );


  if (!session) {
    // Not authenticated
    return res.status(401).json({ error: 'Not authenticated from the session' });
  }

  // User is authenticated, you can access session.user

  // Extract wallet info from request, for instance:
  const { address } = req.body;

  // Database interaction
  try {
    await db.none('INSERT INTO Wallets(user_id, wallet_address) VALUES($1, $2)', [session.user_id, address]);
    res.status(200).json({ success: true, message: 'Wallet added successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Database error: ' + error.message });
  }
} else {
    res.status(405).json({ error: 'Method not allowed.' });
  }

};