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
        <div className="flex justify-center items-center m-5">
            {isEligible && (
                <Button
                    className="p-3 font-bold text-light-quaternary dark:text-dark-quaternary flex space-y-4 flex-col bg-light-primary dark:bg-dark-primary rounded-lg hover:bg-light-tertiary hover:text-light-primary dark:hover:bg-dark-tertiary dark:hover:text-dark-primary transition duration-300"
                    onClick={handleOpenArtistForm}
                >
                    Create Artist Page
                </Button>
            )}
            <NewArtistForm
                open={showArtistForm}
                handleClose={handleCloseArtistForm}
            />
            {isEligible === false && <p></p>}
        </div>
    );
}
