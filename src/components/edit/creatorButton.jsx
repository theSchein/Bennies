// components/edit/creatorButton.jsx
// Button that appears on the profile page to allow deployers to create an artist page.

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import NewArtistForm from "./newArtistForm";
import Button from "@mui/material/Button";

export default function CreatorButton() {
    const [isEligible, setIsEligible] = useState(null);
    const [showArtistForm, setShowArtistForm] = useState(false);
    const { data: session } = useSession();

    const handleOpenArtistForm = () => setShowArtistForm(true);
    
    const handleCloseArtistForm = () => setShowArtistForm(false);

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
                <Button onClick={handleOpenArtistForm}>Create Artist Page</Button>
            )}
            <NewArtistForm open={showArtistForm} handleClose={handleCloseArtistForm} />
            {isEligible === false && (
            <p></p>
            )}
        </div>
    );
}
