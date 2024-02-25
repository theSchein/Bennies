// components/form/nftForm.jsx
// UI for the NFT form

import React from "react";
import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Controller } from "react-hook-form";
import TextInput from "./textInput";
import useNftForm from "../hooks/useNftForm";
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
    whiteSpace: "pre-wrap",
};

const NftForm = ({ role, nft, isOpen, onClose }) => {
    const methods = useForm({
        defaultValues: nft,
    });

    const { editableFields, onSubmit, isSuccessful, error } = useNftForm(role, nft);
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
                        Edit NFT Page
                    </h1>
                    <FormProvider {...methods}>
                        <form onSubmit={methods.handleSubmit(handleSubmit)}>
                            {isFieldEditable("nft_sales_link") && (
                                <TextInput
                                    name="nft_sales_link"
                                    label="Sales Link"
                                    as="textarea"
                                />
                            )}

                            {isFieldEditable("nft_licence") && (
                                <TextInput
                                    name="nft_licence"
                                    label="Ownership License: What rights does the owner have?"
                                    as="textarea"
                                />
                            )}

                            {isFieldEditable("nft_context") && (
                                <TextInput
                                    name="nft_context"
                                    label="NFT Information: Tell us things about this piece"
                                    as="textarea"
                                />
                            )}

                            {isFieldEditable("nft_utility") && (
                                <TextInput
                                    name="nft_utility"
                                    label="Utility: What can the owner do with this NFT?"
                                    as="textarea"
                                />
                            )}

                            {isFieldEditable("category") && (
                                <Controller
                                    name="category"
                                    control={methods.control}
                                    render={({ field }) => (
                                        <div className="flex flex-col">
                                            <label
                                                htmlFor="category"
                                                className="mb-2 font-medium text-sm sm:text-base"
                                            >
                                                Category
                                            </label>
                                            <select
                                                {...field}
                                                id="category"
                                                className="p-2 border border-light-tertiary dark:border-dark-tertiary rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent mb-2"
                                            >
                                                <option value="">
                                                    Select a category
                                                </option>
                                                <option value="art">Art</option>
                                                <option value="community">
                                                    Community
                                                </option>
                                                <option value="virtual-world">
                                                    Virtual World
                                                </option>
                                                <option value="collectible">
                                                    Collectible
                                                </option>
                                                <option value="event">
                                                    Event Ticket
                                                </option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                    )}
                                />
                            )}

                            <input
                                type="submit"
                                value="Update NFT"
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

export default NftForm;
