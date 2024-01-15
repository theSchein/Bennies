import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function CreatorButton() {
    const [isEligible, setIsEligible] = useState(null);
    const { data: session } = useSession();

    useEffect(() => {
        if (session?.wallets && session.wallets.length > 0) {
            fetchArtistEligibility(session.wallets);
        }
    }, [session]); 

    const fetchArtistEligibility = async (wallets) => {
        if (!session) {
            return;
        }
        try {
            const response = await fetch("/api/artist/checkArtistEligibility", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ wallets }),
            });
            const data = await response.json();
            setIsEligible(data.isEligible);
        } catch (error) {
            console.error("Failed:", error);
        }
    };
    

    return (
        <div>
            {isEligible && (
                <button className="bg-primary text-white py-2 px-4 rounded">
                    Create Artist Page
                </button>
            )}
            {isEligible === false && (
                <p>You are not eligible to create an artist page.</p>
            )}
        </div>
    );
}
