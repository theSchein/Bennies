// pages/api/verifySiweMessage.js
import { withIronSession } from 'next-iron-session';
import { SiweMessage } from 'siwe';
import { ironOptions } from '@/lib/utils/ironOptions';

const handler = async (req, res) => {
  const { method } = req;
  switch (method) {
    case 'POST':
      try {
        const { message, signature } = req.body;
        const siweMessage = new SiweMessage(message);
        const fields = await siweMessage.verify({ signature });

        if (fields.nonce !== req.session.nonce)
          return res.status(422).json({ message: 'Invalid nonce.' });

        req.session.siwe = fields;
        await req.session.save();
        res.json({ ok: true });
      } catch (_error) {
        res.status(401).json({ ok: false, message: 'Verification failed.' });
      }
      break;
    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

export default withIronSession(handler, ironOptions);
