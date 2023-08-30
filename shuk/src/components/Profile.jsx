import { useAccount, useConnect, useDisconnect, useEnsAvatar, useEnsName} from 'wagmi'
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { createContext, useContext } from 'react';


const WalletAddressContext = createContext();

export const useWalletAddress = () => {
  return useContext(WalletAddressContext);
};


export function Profile() {
  const { address, connector, isConnected } = useAccount()
  const { data: ensAvatar } = useEnsAvatar({ address })
  const { data: ensName } = useEnsName({ address })
  const { connect, connectors, error, isLoading, pendingConnector } = useConnect()
  const { disconnect } = useDisconnect()
  const { data: session } = useSession();
  const [isEligible, setIsEligible] = useState(null);





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

  const fetchNFTs = async () => {
    if (!session) {
      console.log("No active session found!");
      return;
  }
    try {
      const response = await fetch('/api/get_wallet_nfts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address }),
        credentials: 'include'
      });
      const data = await response.json();

    } catch (error) {
      console.error("Failed to claim wallet:", error);
    }
  };

  const fetchArtistEligibility = async () => {
    if (!session) {
      console.log("No active session found!");
      return;
  }
    try {
      const response = await fetch('/api/checkArtistEligibility', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address })
      });
      const data = await response.json();
      setIsEligible(data.isEligible);

    } catch (error) {
      console.error("Failed:", error);
    };
  };




  useEffect(() => {
    if (isConnected && address) {

      claimWallet(address);
    }
  }, [isConnected, address]);

  if (isConnected) {

    return (
      <>
      <div>
          <WalletAddressContext.Provider value={address}>
        <img src={ensAvatar} alt="ENS Avatar" />
        <div>{ensName ? `${ensName} (${address})` : address}</div>
        <div>Connected to {connector.name}</div>


        <button onClick={disconnect}>Disconnect</button>

        <button onClick={fetchNFTs}>Fetch NFTs</button>

        <button onClick={fetchArtistEligibility}>Check Eligibility</button>

        <div>
      {isEligible ? <button onCLick={null}>You're eligible to create an artist page!</button>  : "You're not eligible to create an artist page."}
    </div>

        </WalletAddressContext.Provider>
      </div>
      </>
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
