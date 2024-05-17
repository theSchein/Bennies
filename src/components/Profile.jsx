// components/Profile.jsx
import {
    useAccount,
    useConnect,
    useDisconnect,
    useEnsName,
} from "wagmi";
import { useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { createContext, useContext } from "react";
import web3 from '../lib/ethersProvider';

const WalletAddressContext = createContext();

export const useWalletAddress = () => {
    return useContext(WalletAddressContext);
};

export function Profile() {
    const { address, connector, isConnected } = useAccount();
    const { data: ensName } = useEnsName({ address });
    const { connect, connectors, error, isLoading, pendingConnector } = useConnect();
    const { disconnect } = useDisconnect();
    const { data: session } = useSession();

    const claimWallet = useCallback(async () => {
        if (!session) {
            return;
        }
        try {
            if (!window.ethereum) {
                console.error("MetaMask is not installed!");
                return;
            }

            const message = "Please sign this message to verify your wallet ownership.";
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const account = accounts[0];
            const signature = await web3.eth.personal.sign(message, account);

            const response = await fetch("/api/wallet/claimWallet", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ address, signature }),
                credentials: "include",
            });

            const data = await response.json();
            if (response.status === 205) {
                window.location.reload();
            } else {
                console.error("Failed to claim wallet: ", data.message);
            }
        } catch (error) {
            console.error("Failed to claim wallet:", error);
        }
    }, [session, address]);

    useEffect(() => {
        if (isConnected && address) {
            claimWallet(address);
        }
    }, [isConnected, address, claimWallet]);

    if (isConnected) {
        return (
            <div>
                <WalletAddressContext.Provider value={address}>
                    <div>
                        <div className="text-center text-lg font-medium">
                            {ensName ? `${ensName} (${address})` : address}
                        </div>
                        <div>
                            {connector ? `Connected to ${connector.name}` : "Not connected"}
                        </div>
                        <div className="space-y-2 flex justify-center mt-4">
                            <button
                                onClick={disconnect}
                                className="bg-red-500 py-2 px-4 rounded hover:bg-red-600 transition duration-300"
                            >
                                {`Disconnect`}
                            </button>
                        </div>
                    </div>
                </WalletAddressContext.Provider>
            </div>
        );
    }

    return (
        <div className="flex justify-center mt-4">
            {connectors.map((connector) => (
                <button
                    disabled={!connector.ready}
                    key={connector.id}
                    onClick={() => connect({ connector })}
                    className={`btn m-2 rounded-full shadow-md transform transition hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                        !connector.ready && "cursor-not-allowed"
                    }`}
                >
                    {connector.name}
                    {!connector.ready && " (Not Available on this Device)"}
                    {isLoading && connector.id === pendingConnector?.id && " (connecting)"}
                </button>
            ))}
            {error && <div>{error.message}</div>}
        </div>
    );
}
