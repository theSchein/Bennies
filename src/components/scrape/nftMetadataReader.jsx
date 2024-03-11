import React, { useState, useEffect } from 'react';
import provider from '../../lib/ethersProvider';
import { ethers } from 'ethers';

// Assuming you have an ABI for your NFT contract that includes the tokenURI function
const nftAbi = [
  // Minimal ABI to include only the function we care about
  "function tokenURI(uint256 tokenId) external view returns (string memory)",
];

const NftMetadataReader = ({ contractAddress, tokenId }) => {
  const [metadataUri, setMetadataUri] = useState('');
  const [metadata, setMetadata] = useState(null);

  useEffect(() => {
    const fetchNftMetadata = async () => {
      try {
        const contract = new ethers.Contract(contractAddress, nftAbi, provider);
        const uri = await contract.tokenURI(tokenId);
        setMetadataUri(uri);

        // Fetch the metadata from the URI
        const response = await fetch(uri.replace("ipfs://", "https://ipfs.io/ipfs/"));
        const metadata = await response.json();
        setMetadata(metadata);
      } catch (error) {
        console.error("Failed to fetch NFT metadata:", error);
      }
    };

    fetchNftMetadata();
  }, [contractAddress, tokenId]);

  return (
    <div>
      <h2>NFT Metadata</h2>
      {metadata ? (
        <div>
          <p>Metadata URI: {metadataUri}</p>
          <p>Name: {metadata.name}</p>
          <p>Description: {metadata.description}</p>
          <img src={metadata.image.replace("ipfs://", "https://ipfs.io/ipfs/")} alt={metadata.name} style={{ width: '100px', height: '100px' }} />
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default NftMetadataReader;
