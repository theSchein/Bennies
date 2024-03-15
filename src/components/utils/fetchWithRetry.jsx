//fetchWithRetry.jsx
// Helper function for exponential backoff to get around rate limits    

// Helper function for exponential backoff


// Improved fetch with retry mechanism
async function fetchWithRetry(sall, attempts = 5, delay = 1000) {
    for (let i = 0; i < attempts; i++) {
        try {
            return await call();
        } catch (error) {
            if (i === attempts - 1 || !error.message.includes('project ID request rate exceeded')) {
                throw error;
            }
            console.log(`Rate limit exceeded, retrying... Attempt ${i + 1} of ${attempts}`);
            await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
        }
    }
}

export default fetchWithRetry;