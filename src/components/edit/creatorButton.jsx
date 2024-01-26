// components/edit/creatorButton.jsx
// Button that appears on the profile page to allow deployers to create an artist page.

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import EditForm from "./editForm";
import Button from "@mui/material/Button";

export default function CreatorButton() {
    const [isEligible, setIsEligible] = useState(null);
    const [hasArtistPage, setHasArtistPage] = useState(false);
    const [artistPageData, setArtistPageData] = useState(null);
    const [showEditForm, setShowEditForm] = useState(false);
    const { data: session } = useSession();

    useEffect(() => {
        if (session?.wallets && session.wallets.length > 0) {
            fetchArtist(session.wallets);
        }
    }, [session]);

    const fetchArtistEligibility = async (wallets) => {
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

    const fetchArtist = async () => {
        try {
            const response = await fetch("/api/artist/fetchArtist", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });
            const data = await response.json();
            if (response.ok && data.artist_id) {
                setArtistPageData(data);
                setHasArtistPage(true);
                setIsEligible(false);
            } else {
                setHasArtistPage(false);
                fetchArtistEligibility(session.wallets);
            }
        } catch (error) {
            console.error("Failed to fetch artist ID:", error);
        }
    };

    const handleEditFormOpen = () => {
        setShowEditForm(true);
    };

    const handleCloseEditForm = () => {
        setShowEditForm(false);
    };

    return (
        <div className="flex justify-center items-center m-5">
            {isEligible && !hasArtistPage && (
                <Button className="btn" onClick={handleEditFormOpen}>
                    Create Artist Page
                </Button>
            )}
            {!isEligible && hasArtistPage && (
                <Button className="btn" onClick={handleEditFormOpen}>
                    Edit your Artist Page
                </Button>
            )}
            {(isEligible || hasArtistPage) && artistPageData && (
                <EditForm
                    role="artist"
                    pageData={artistPageData}
                    isOpen={showEditForm}
                    onClose={handleCloseEditForm}
                />
            )}
    
            {isEligible === false && !hasArtistPage && <p></p>}
        </div>
    );
}
