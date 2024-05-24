import {
    useAccount,
    useConnect,
    useDisconnect,
    useEnsName,
    useSignMessage,
} from "wagmi";
import { useEffect, useState, useCallback, createContext, useContext } from "react";
import { SiweMessage } from 'siwe';

const WalletAddressContext = createContext();

export const useWalletAddress = () => useContext(WalletAddressContext);

export function Profile() {
    const { address, connector, isConnected } = useAccount();
    const { data: ensName } = useEnsName({ address });
    const { connect, connectors, error, isLoading, pendingConnector } = useConnect();
    const { disconnect } = useDisconnect();
    const { signMessageAsync } = useSignMessage();
    const [nonce, setNonce] = useState('');
    const [signedIn, setSignedIn] = useState(false);

    const fetchNonce = async () => {
        const response = await fetch('/api/auth/nonce');
        if (response.ok) {
            const data = await response.json();
            setNonce(data.nonce);
        } else {
            console.error('Failed to fetch nonce');
        }
    };

    const signInWithEthereum = useCallback(async () => {
        if (!address || !nonce) {
            return;
        }

        const message = new SiweMessage({
            domain: window.location.host,
            address,
            statement: 'Please sign this message to verify your wallet ownership.',
            uri: window.location.origin,
            version: '1',
            chainId: 1,
            nonce,
        });

        try {
            const signature = await signMessageAsync({ message: message.prepareMessage() });

            const verifyResponse = await fetch('/api/auth/verifySignature', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: message.prepareMessage(), signature })
            });

            if (verifyResponse.ok) {
                // Perform any further actions like claiming the wallet
            } else {
                throw new Error('Verification failed');
            }
        } catch (error) {
            console.error("Failed to sign or verify message:", error);
        }
    }, [address, nonce, signMessageAsync]);

    useEffect(() => {
        if (isConnected && address && !nonce) {
            fetchNonce();
        }
    }, [isConnected, address]);

    useEffect(() => {
        if (address && nonce && !signedIn) {
            signInWithEthereum();
        }
    }, [address, nonce, signInWithEthereum, signedIn]);

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
