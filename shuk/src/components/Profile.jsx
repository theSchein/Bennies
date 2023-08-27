import { useAccount, useConnect, useDisconnect, useEnsAvatar, useEnsName} from 'wagmi'
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';


export function Profile() {
  const { address, connector, isConnected } = useAccount()
  const { data: ensAvatar } = useEnsAvatar({ address })
  const { data: ensName } = useEnsName({ address })
  const { connect, connectors, error, isLoading, pendingConnector } = useConnect()
  const { disconnect } = useDisconnect()
  const { data: session } = useSession();



  const claimWallet = async () => {
    if (!session) {
      console.log("No active session found!");
      return;
  }
    try {
      const response = await fetch('/api/claimWallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ address }),
        credentials: 'include'
      });
      
      const data = await response.json();

    } catch (error) {
      console.error("Failed to claim wallet:", error);
    }
  };

  useEffect(() => {
    if (isConnected && address) {

      claimWallet(address);
    }
  }, [isConnected, address]);

  if (isConnected) {

    return (
      <div>
        <img src={ensAvatar} alt="ENS Avatar" />
        <div>{ensName ? `${ensName} (${address})` : address}</div>
        <div>Connected to {connector.name}</div>


        <button onClick={disconnect}>Disconnect</button>
      </div>
    )
  }

  return (

    <div>
      {connectors.map((connector) => (
        <button
          disabled={!connector.ready}
          key={connector.id}
          onClick={() => connect({ connector })}
        >
          {connector.name}
          {!connector.ready && ' (unsupported)'}
          {isLoading &&
            connector.id === pendingConnector?.id &&
            ' (connecting)'}
        </button>


      ))}

      {error && <div>{error.message}</div>}
    </div>
    
  )
}
