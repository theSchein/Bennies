async function fetchMetadata(uri) {
    // Check if the URI is a string and not empty
    if (typeof uri !== 'string' || uri.trim() === '') {
        console.error(`Invalid or missing URI: ${uri}`);
        return null;
    }

    let url;

    if (uri.startsWith('ipfs://')) {
        const ipfsPath = uri.replace('ipfs://', '');
        url = `https://ipfs.io/ipfs/${ipfsPath}`;
    } else if (uri.startsWith('ar://') || uri.startsWith('arweave://')) {
        const arweavePath = uri.replace(/^arweave?:\/\//, '');
        url = `https://arweave.net/${arweavePath}`;
    } else if (uri.startsWith('http://') || uri.startsWith('https://')) {
        url = uri;
    } else {
        console.error(`Unsupported URI format: ${uri}`);
        return null;
    }

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch metadata: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching metadata from ${url}:`, error);
        return null;
    }
}

export default fetchMetadata;
