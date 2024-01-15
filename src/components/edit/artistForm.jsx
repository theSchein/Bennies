// components/edit/artistForm.jsx
// Component to handle a lot of the logic for creating a new artist page.
// Much of this got rescoped so this page needs to be drasitcally upated

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
};

export default function ArtistForm({ open, handleClose }) {
    const [artistName, setArtistName] = useState("");
    const [artistBio, setArtistBio] = useState("");
    const [artistPicture, setArtistPicture] = useState("");
    const [artistSales, setArtistSales] = useState("");
    const [artistSocial, setArtistSocial] = useState("");

    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = {
            artistName,
            artistBio,
            artistPicture,
            artistSales,
            artistSocial,
        };

        try {
            const response = await fetch("/api/artist/updateArtist", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            setSuccess(true);
            fetchArtistId().then(artistId => {
                if (artistId) {
                    setTimeout(() => {
                        router.push(`/artist/${artistId}/${encodeURIComponent(artistName)}`);
                    }, 2000); // Redirect after 2 seconds
                }
            });
        } catch (error) {
            console.error("There was a problem with the fetch operation:", error.message);
        }
    };

    const fetchArtistId = async () => {
        try {
            const response = await fetch("/api/artist/fetchArtistId", { // Corrected API endpoint
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const responseData = await response.json();
            return responseData.artistId;
        } catch (error) {
            console.error("Error fetching artist ID:", error.message);
            return null; // Corrected syntax error
        }
    };

    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Create your Artist Page
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        {success ? (
                            <div>
                                <p>Update successful! Redirecting...</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="name">Name:</label>
                                    <textarea
                                        id="name"
                                        value={artistName}
                                        onChange={(e) =>
                                            setArtistName(e.target.value)
                                        }
                                        rows="4"
                                        placeholder="Tell us your Artist Name"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="bio">Bio:</label>
                                    <textarea
                                        id="bio"
                                        value={artistBio}
                                        onChange={(e) =>
                                            setArtistBio(e.target.value)
                                        }
                                        rows="4"
                                        placeholder="Tell the world about yourself"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="photos">Photo URL:</label>
                                    <input
                                        type="text"
                                        id="photos"
                                        value={artistPicture}
                                        onChange={(e) =>
                                            setArtistPicture(e.target.value)
                                        }
                                        placeholder="Enter a link to your photos"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="sales_link">Sales Link:</label>
                                    <input
                                        type="text"
                                        id="photos"
                                        value={artistSales}
                                        onChange={(e) =>
                                            setArtistSales(e.target.value)
                                        }
                                        placeholder="Enter a link to your sales page"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="social_media_link">
                                        Social Media Link:
                                    </label>
                                    <input
                                        type="text"
                                        id="photos"
                                        value={artistSocial}
                                        onChange={(e) =>
                                            setArtistSocial(e.target.value)
                                        }
                                        placeholder="Enter a link to your sales page"
                                        required
                                    />
                                </div>

                                <button type="submit">Create Artist Page</button>
                            </form>
                        )}
                    </Typography>
                </Box>
            </Modal>
        </div>
    );
}
