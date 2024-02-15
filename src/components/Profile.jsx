// components/Profile.jsx
// This component handles much of the logic for the profile page.

import {
    useAccount,
    useConnect,
    useDisconnect,
    useEnsName,
} from "wagmi";
import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { createContext, useContext } from "react";

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
            const response = await fetch("/api/wallet/claimWallet", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ address }),
                credentials: "include",
            });

            if (response.status === 205) {
                // If the API call returned a 205 status, reload the page
                window.location.reload();
            } else {
                // Handle non-205 responses, including success and error statuses
                const data = await response.json();
                if (!response.ok) {
                    // Log or handle the error case if the API did not succeed
                    console.error("Failed to claim wallet: ", data.message);
                }
                // Optionally handle other success statuses (e.g., 200) if needed
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
            <>
                <div>
                    <WalletAddressContext.Provider value={address}>
                        <div>
                            <div className="text-center text-lg font-medium">
                                {ensName ? `${ensName} (${address})` : address}
                            </div>
                            <div>
                                {connector
                                    ? `Connected to ${connector.name}`
                                    : "Not connected"}
                            </div>

                            <div className="space-y-2">
                                <button
                                    onClick={disconnect}
                                    className="w-full bg-red-500 py-2 px-4 rounded hover:bg-red-600 transition duration-300"
                                >
                                    {`Disconnect`}
                                </button>

                            </div>

                        </div>
                    </WalletAddressContext.Provider>
                </div>
            </>
        );
    }

    return (
        <div>
            {connectors.map((connector) => (
                <button
                    disabled={!connector.ready}
                    key={connector.id}
                    onClick={() => connect({ connector })}
                    className={`bg-rainbow-gradient text-white font-bold py-2 px-4 mr-5 rounded-full shadow-md transform transition hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed {
                        !connector.ready && "cursor-not-allowed"
                    }`}
                >
                    {connector.name}
                    {!connector.ready && " (Not Available on this Device)"}
                    {isLoading &&
                        connector.id === pendingConnector?.id &&
                        " (connecting)"}
                </button>
            ))}

            {error && <div>{error.message}</div>}
        </div>
    );
}
