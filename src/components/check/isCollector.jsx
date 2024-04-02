// components/check/isCollector.jsx

import { useSession } from "next-auth/react";

const IsCollector = (owners) => {
    const { data: session } = useSession();
    let isCollector = false;

    // Ensure owners is an array and filter out any null or undefined values
    owners = owners ? owners.filter(owner => owner != null) : [];

    if (session && session.wallets && owners.length > 0) {
        const lowerCaseWallets = session.wallets.map(wallet => wallet.toLowerCase());
        // Now safe to assume all owners are non-null and can be converted to lowercase
        const lowerCaseOwners = owners.map(owner => owner.toLowerCase());

        // Create a map to count occurrences of each wallet in the owners array
        const walletCounts = lowerCaseOwners.reduce((acc, owner) => {
            if (lowerCaseWallets.includes(owner)) {
                acc[owner] = (acc[owner] || 0) + 1;
            }
            return acc;
        }, {});

        // Check if any wallet has 5 or more occurrences
        isCollector = Object.values(walletCounts).some(count => count >= 5);
    }

    return isCollector;
};

export default IsCollector;