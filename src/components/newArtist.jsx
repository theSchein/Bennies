import * as React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Credentials from "next-auth/providers/credentials";

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

export default function ArtistForm() {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [artistName, setArtistName] = useState("");
    const [artistBio, setArtistBio] = useState("");
    const [artistPicture, setArtistPicture] = useState("");
    const [artistSales, setArtistSales] = useState("");
    const [artistSocial, setArtistSocial] = useState("");

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
            const response = await fetch("/api/artist/createArtist", {
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

            const responseData = await response.json();

            if (responseData.success) {
                setArtistBio("");
                setArtistPicture("");
                setArtistSales("");
                setArtistSocial("");
            } else {
                console.error("Failed to save artist info:", responseData.message);
            }
        } catch (error) {
            console.error(
                "There was a problem with the fetch operation:",
                error.message,
            );
        }
    };

    //onFormSubmit({ user_id, artistBio, artistPicture, artistSales, artistSocial });

    return (
        <div>
            <Button onClick={handleOpen}>Make your page!!1!</Button>
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
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="name">Name:</label>
                                <textarea
                                    id="name"
                                    value={artistName}
                                    onChange={(e) => setArtistName(e.target.value)}
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
                                    onChange={(e) => setArtistBio(e.target.value)}
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
                                    onChange={(e) => setArtistSales(e.target.value)}
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
                                    onChange={(e) => setArtistSocial(e.target.value)}
                                    placeholder="Enter a link to your sales page"
                                    required
                                />
                            </div>

                            <button type="submit">Create Artist Page</button>
                        </form>
                    </Typography>
                </Box>
            </Modal>
        </div>
    );
}
