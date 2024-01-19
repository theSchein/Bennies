// components/check/isDeployer.js

import { useSession } from "next-auth/react";

const IsDeployer = (deployer) => {
    const { data: session } = useSession();
    let isDeployer = false;

    if (session && session.wallets && deployer) {
        const lowerCaseWallets = session.wallets.map(wallet => wallet.toLowerCase());
        const lowerCaseDeployer = deployer.toLowerCase();

        isDeployer = lowerCaseWallets.some(wallet => lowerCaseDeployer.includes(wallet));
    }

    return isDeployer;
};

export default IsDeployer;
