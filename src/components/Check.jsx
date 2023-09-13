import { useState, useEffect } from "react";

function CheckSessionComponent() {
    const [sessionData, setSessionData] = useState(null);

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const response = await fetch("/api/checkSession");
                const data = await response.json();

                if (response.status === 200) {
                    setSessionData(data);
                } else {
                    console.error("No active session:", data.error);
                }
            } catch (error) {
                console.error("Failed to fetch session:", error);
            }
        };

        fetchSession();
    }, []);

    return (
        <div>
            {sessionData ? (
                <div>
                    <h1>Session Data</h1>
                    <pre>{JSON.stringify(sessionData, null, 2)}</pre>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default CheckSessionComponent;
