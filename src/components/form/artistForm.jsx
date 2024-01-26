// components/form/artistForm.jsx
// UI for the Artist form

import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import TextInput from "./textInput";
import useArtistForm from "../hooks/useArtistForm";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
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

    // Function to check if a field is editable
    const isFieldEditable = (fieldName) => editableFields.includes(fieldName);

    // // Watch specific fields IMPLEMENT LATER
    // const watchedFields = methods.watch();

    // // You can also watch individual fields like this:
    // // const watchedName = methods.watch('name')

    return (
        <Modal open={isOpen} onClose={onClose}>
            <Box sx={style}>
                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(onSubmit)}>
                        {isFieldEditable("artist_name") && (
                            <TextInput name="artist_name" label="Artist Name" />
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
                        
                        <input type="submit" value="Submit" />
                        {isSuccessful && <div>Update successful!</div>}
                        {error && <div>Error: {error}</div>}
                    </form>
                </FormProvider>
            </Box>
        </Modal>
    );
};

export default ArtistForm;
