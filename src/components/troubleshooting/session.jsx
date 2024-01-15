import React, { useState, useEffect } from 'react';

function CheckSessionComponent() {
    const [sessionData, setSessionData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('/api/auth/checkSession')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch session data');
                }
                return response.json();
            })
            .then(data => {
                setSessionData(data);
                setIsLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setIsLoading(false);
            });
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h2>Session Data:</h2>
            {sessionData ? (
                <pre>{JSON.stringify(sessionData, null, 2)}</pre>
            ) : (
                <p>No active session found.</p>
            )}
        </div>
    );
}

export default CheckSessionComponent;
