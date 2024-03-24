// Helper function to check if the URL is a data URI for SVG
const isDataUri = (url) => {
    if (!url) return false; // Return false if url is null or empty
    return url.startsWith('data:image/svg+xml;base64,');
};

// Helper function to check if the URL is an IPFS URL
const isIpfsUrl = (url) => {
    return url.startsWith('ipfs://');
};

// Function to convert IPFS URL to HTTP URL using an IPFS gateway
const ipfsToHttpUrl = (ipfsUrl) => {
    const cid = ipfsUrl.replace('ipfs://', '');
    return `https://ipfs.io/ipfs/${cid}`; // You can change the gateway URL if needed
};

// Helper function to check if the URL is valid
const isValidUrl = (url) => {
    if (!url) return false; // Return false if url is null or empty
    try {
        new URL(url);
        return true; // Valid URL
    } catch (e) {
        return false; // Invalid URL
    }
};

// This is now a regular utility function, not a hook
export const getImageSource = (mediaUrl, fallbackImageUrl) => {
    // Check if mediaUrl is an IPFS URL and convert it
    if (isIpfsUrl(mediaUrl)) {
        return ipfsToHttpUrl(mediaUrl);
    }

    // Determine if the mediaUrl is a valid SVG data URI or a valid URL
    const isValidSource = isDataUri(mediaUrl) || (mediaUrl && isValidUrl(mediaUrl));

    // If mediaUrl is "Blank" or invalid, use the fallback image
    const imageSource = isValidSource ? mediaUrl : fallbackImageUrl;

    return imageSource;
};
