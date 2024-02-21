// components/form/artistForm.jsx
// UI for the Artist form

import React from "react";
import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import TextInput from "./textInput";
import useArtistForm from "../hooks/useArtistForm";
import AlertModal from "../alert";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "auto",
    maxWidth: "500px",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
};

const ArtistForm = ({ role, artist, isOpen, onClose }) => {
    const methods = useForm({
        defaultValues: artist,
    });

    const { editableFields, onSubmit, isSuccessful, error } = useArtistForm(
        role,
        artist,
    );
    const [showAlert, setShowAlert] = useState(false);

    const handleSubmit = async (data) => {
        const success = await onSubmit(data);
        if (success) {
            setShowAlert(true);
            onClose();
        }
    };

    const isFieldEditable = (fieldName) => editableFields.includes(fieldName);

    return (
        <>
            <Modal open={isOpen} onClose={onClose}>
                <Box
                    sx={style}
                    className="bg-light-secondary dark:bg-dark-primary text-light-quaternary dark:text-dark-quaternary flex-wrap"
                >
                    <h1 className="text-center text-2xl font-bold mb-4">
                        Edit Artist Page
                    </h1>
                    <FormProvider {...methods}>
                        <form onSubmit={methods.handleSubmit(handleSubmit)}>
                            {isFieldEditable("artist_name") && (
                                <TextInput label="Artist Name" name="artist_name" />
                            )}

                            {isFieldEditable("artist_bio") && (
                                <TextInput
                                    name="artist_bio"
                                    label="Artist Background and Bio"
                                    as="textarea"
                                />
                            )}

                            {isFieldEditable("artist_picture") && (
                                <TextInput
                                    name="artist_picture"
                                    label="Link to Picture"
                                />
                            )}

                            {isFieldEditable("artist_sales_link") && (
                                <TextInput
                                    name="artist_sales_link"
                                    label="Link to Sales Page"
                                />
                            )}
                            {isFieldEditable("social_media_link") && (
                                <TextInput
                                    name="social_media_link"
                                    label="Social Media Link"
                                />
                            )}

                            <input type="submit" value="Submit" className="btn" />
                        </form>
                    </FormProvider>
                </Box>
            </Modal>
            {showAlert && (
                <AlertModal
                    isOpen={showAlert}
                    message="Update successful!"
                    onClose={() => setShowAlert(false)}
                />
            )}
        </>
    );
};

export default ArtistForm;
