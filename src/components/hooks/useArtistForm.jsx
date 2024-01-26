// components/hooks/useCollectionForm.js
// Custom hook to handle logic of the Collection form data

import { useState } from "react";

const useArtistForm = (role, artist) => {
    const [isSuccessful, setIsSuccessful] = useState(false);
    const [error, setError] = useState("");

    const editableFields = determineEditableFields(role);

    function determineEditableFields(role) {
        switch (role) {
            case "artist":
                return [
                    "artist_name",
                    "artist_bio",
                    "artist_picture",
                    "artist_sales_link",
                    "social_media_link",
                ];
            case "owner":
                return ["artist_bio"];
            default:
                return [];
        }
    }
    const onSubmit = async (formData) => {
        try {
            const dataToSend = {};
            editableFields.forEach((field) => {
                dataToSend[field] = formData[field] === "" ? null : formData[field];
            });


            if (artist && artist.artist_id) {
                dataToSend.artist_id = artist.artist_id;
            }

            const response = await fetch("/api/artist/updateArtist", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dataToSend),
            });

            if (!response.ok) {
                throw new Error("Failed to update Artist");
            }

            setIsSuccessful(true);
            setError("");
        } catch (error) {
            console.error("Error updating Artist:", error);
            setError(error.message || "Failed to update Artist");
            setIsSuccessful(false);
        }
    };

    return {
        editableFields,
        onSubmit,
        isSuccessful,
        error,
    };
};

export default useArtistForm;
