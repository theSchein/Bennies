// hooks/getImageSource.jsx
// Helper function to check if the URL is a data URI for SVG

const isDataUri = (url) => {
    return url.startsWith('data:image/svg+xml;base64,');
};

// Helper function to check if the URL is valid
const isValidUrl = (url) => {
    try {
        new URL(url);
        return true; // Valid URL
    } catch (e) {
        return false; // Invalid URL
    }
};

// This is now a regular utility function, not a hook
export const getImageSource = (mediaUrl, fallbackImageUrl) => {
    // Determine if the mediaUrl is a valid SVG data URI or a valid URL
    const isValidSource = isDataUri(mediaUrl) || (mediaUrl && isValidUrl(mediaUrl));

    // If mediaUrl is "Blank" or invalid, use the fallback image
    const imageSource = isValidSource ? mediaUrl : fallbackImageUrl;

    return imageSource;
};
