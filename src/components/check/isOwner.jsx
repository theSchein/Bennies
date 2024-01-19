// components/check/isOwner.js

import { useSession } from "next-auth/react";

const IsOwner = (owners) => {
    const { data: session } = useSession();
    let isOwner = false;

    if (session && session.wallets && owners) {
        const lowerCaseWallets = session.wallets.map(wallet => wallet.toLowerCase());
        const lowerCaseOwners = owners.map(owner => owner.toLowerCase());

        isOwner = lowerCaseWallets.some(wallet => lowerCaseOwners.includes(wallet));
    }

    return isOwner;
};

export default IsOwner;
