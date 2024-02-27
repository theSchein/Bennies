// components/form/collectionForm.jsx
// UI for the Collection form

import React from "react";
import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Controller } from "react-hook-form";
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
    // bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    // color: "text.quaternary",
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
                    className="bg-light-quaternary dark:bg-dark-quaternary text-light-primary dark:text-dark-primary flex-wrap"
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
                                <div className="flex flex-col text-light-secondary dark:text-dark-secondary">
                                    <label
                                        htmlFor="nft_licence"
                                        className="mb-2 font-medium text-sm sm:text-base"
                                    >
                                        Art License
                                    </label>
                                    <Controller
                                        name="nft_licence"
                                        control={methods.control}
                                        render={({ field }) => (
                                            <select
                                                {...field}
                                                id="nft_licence"
                                                className="p-2 border text-light-quaternary dark:text-dark-quaternary rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent mb-2"
                                            >
                                                <option value="">
                                                    Select a License
                                                </option>
                                                <option value="CC0">CC0</option>
                                                <option value="CC BY-NC 4.0">
                                                    CC BY-NC 4.0
                                                </option>
                                                <option value="Holder Has Total Rights">
                                                    Holder Has Total Rights
                                                </option>
                                                <option value="MIT License">
                                                    MIT License
                                                </option>
                                                <option value="NFT License 2.0">
                                                    NFT License 2.0
                                                </option>
                                                <option value="Other">Other</option>
                                            </select>
                                        )}
                                    />
                                    <a
                                        href="https://medium.com/the-link-art-blocks/licensing-cheat-sheet-54223616ea50"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-2 italic text-xs sm:text-sm text-light-tertiary dark:text-dark-secondary hover:underline"
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
                                <div className="flex flex-col text-light-secondary dark:text-dark-secondary">
                                    <label
                                        htmlFor="category"
                                        className="mb-2 font-medium text-sm sm:text-base"
                                    >
                                        Category
                                    </label>
                                    <Controller
                                        name="category"
                                        control={methods.control}
                                        render={({ field }) => (
                                            <select
                                                {...field}
                                                id="category"
                                                className="p-2 border text-light-quaternary dark:text-dark-quaternary rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent mb-2"
                                            >
                                                <option value="">
                                                    Select a category
                                                </option>
                                                <option value="Art">Art</option>
                                                <option value="Community">
                                                    Community
                                                </option>
                                                <option value="Virtual World">
                                                    Virtual World
                                                </option>
                                                <option value="Collectible">
                                                    Collectible
                                                </option>
                                                <option value="Event">
                                                    Event Ticket
                                                </option>
                                                <option value="Other">Other</option>
                                            </select>
                                        )}
                                    />
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
