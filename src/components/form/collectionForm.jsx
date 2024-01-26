// components/form/collectionForm.jsx
// UI for the Collection form

import React from "react";
import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import TextInput from "./textInput";
import useCollectionForm from "../hooks/useCollectionForm";
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

const CollectionForm = ({ role, collection, isOpen, onClose }) => {
    const methods = useForm({
        defaultValues: collection,
    });

    const { editableFields, onSubmit, isSuccessful, error } = useCollectionForm(
        role,
        collection,
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
                    className="bg-light-tertiary dark:bg-dark-secondary "
                >
                    <h1 className="text-center text-2xl font-bold mb-4">
                        Edit Collection Page
                    </h1>
                    <FormProvider {...methods}>
                        <form onSubmit={methods.handleSubmit(handleSubmit)}>
                            {isFieldEditable("media_url") && (
                                <TextInput
                                    name="media_url"
                                    label="Collection Image"
                                    as="textarea"
                                />
                            )}

                            {isFieldEditable("nft_licence") && (
                                <TextInput
                                    name="nft_licence"
                                    label="Ownership License"
                                    as="textarea"
                                />
                            )}

                            {isFieldEditable("collection_description") && (
                                <TextInput
                                    name="collection_description"
                                    label="Description"
                                    as="textarea"
                                />
                            )}

                            {isFieldEditable("collection_utility") && (
                                <TextInput
                                    name="collection_utility"
                                    label="Utility"
                                    as="textarea"
                                />
                            )}

                            {isFieldEditable("category") && (
                                <TextInput name="category" label="Category" />
                            )}

                            <input
                                type="submit"
                                value="Update Collection"
                                className="btn"
                            />
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

export default CollectionForm;
