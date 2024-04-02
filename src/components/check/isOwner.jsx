// components/check/isOwner.js

import { useSession } from "next-auth/react";

const IsOwner = (owners) => {
    const { data: session } = useSession();
    let isOwner = false;

    // Ensure owners is an array and filter out any null or undefined values
    owners = owners ? owners.filter(owner => owner != null) : [];

    if (session && session.wallets && owners.length > 0) {
        const lowerCaseWallets = session.wallets.map(wallet => wallet.toLowerCase());
        // Now safe to assume all owners are non-null and can be converted to lowercase
        const lowerCaseOwners = owners.map(owner => owner.toLowerCase());

        isOwner = lowerCaseWallets.some(wallet => lowerCaseOwners.includes(wallet));
    }

    return isOwner;
};

export default IsOwner;
