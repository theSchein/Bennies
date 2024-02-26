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
                    className="bg-light-secondary dark:bg-dark-primary text-light-quaternary dark:text-dark-quaternary flex-wrap"
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
                                <div className="flex flex-col text-light-quaternary dar:text-dark-quaternary">
                                    <label
                                        htmlFor="category"
                                        className="mb-2 font-medium text-sm sm:text-base"
                                        
                                    >
                                        Art License
                                    </label>

                                    <select
                                        name="category"
                                        id="category"
                                        className="p-2 border border-light-tertiary dark:border-dark-tertiary rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent mb-2"
                                    >
                                        <option value="">Select a License</option>
                                        <option value="cc0">CC0</option>
                                        <option value="cc_by_nc_4">
                                            CC BY-NC 4.0
                                        </option>
                                        <option value="gnu">
                                            GNU General Public License
                                        </option>
                                        <option value="mit">MIT License</option>
                                        <option value="nft_2">
                                            NFT License 2.0
                                        </option>
                                        <option value="other">Other</option>
                                    </select>
                                    <a
                                        href="https://medium.com/the-link-art-blocks/licensing-cheat-sheet-54223616ea50"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-2 italic text-xs sm:text-sm text-primary hover:underline"
                                    >
                                        Learn more about licensing
                                    </a>
                                </div>
                            )}

                            {isFieldEditable("collection_description") && (
                                <TextInput
                                    name="collection_description"
                                    label="Description: Tell us things about this collection"
                                    as="textarea"
                                />
                            )}

                            {isFieldEditable("collection_utility") && (
                                <TextInput
                                    name="collection_utility"
                                    label="Utility: What can the owner do with this NFT?"
                                    as="textarea"
                                />
                            )}

                            {isFieldEditable("category") && (
                                <div className="flex flex-col text-light-quaternary dar:text-dark-quaternary">
                                    <label
                                        htmlFor="category"
                                        className="mb-2 font-medium text-sm sm:text-base"
                                    >
                                        Category
                                    </label>
                                    <select
                                        name="category"
                                        id="category"
                                        className="p-2 border border-light-tertiary dark:border-dark-tertiary rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent mb-2"
                                    >
                                        <option value="">Select a category</option>
                                        <option value="art">Art</option>
                                        <option value="community">Community</option>
                                        <option value="virtual-world">
                                            Virtual World
                                        </option>
                                        <option value="collectible">
                                            Collectible
                                        </option>
                                        <option value="event">Event Ticket</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
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
