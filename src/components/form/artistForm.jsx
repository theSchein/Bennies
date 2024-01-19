// components/form/artistForm.jsx
// UI for the Artist form

import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import TextInput from "./textInput";
import useNftForm from "../hooks/useNftForm";

const ArtistForm = ({ role, artist }) => {
    const methods = useForm({
        defaultValues: artist,
    });

    const { editableFields, onSubmit, isSuccessful, error } = useArtistForm(role, artist);

    // Function to check if a field is editable
    const isFieldEditable = (fieldName) => editableFields.includes(fieldName);

    // // Watch specific fields IMPLEMENT LATER
    // const watchedFields = methods.watch();

    // // You can also watch individual fields like this:
    // // const watchedName = methods.watch('name')

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
                {isFieldEditable("name") && (
                    <TextInput name="name" label="NFT Name" />
                )}

                {isFieldEditable("nft_licence") && (
                    <TextInput
                        name="nft_licence"
                        label="Ownership License"
                        as="textarea"
                    />
                )}

                {isFieldEditable("nft_context") && (
                    <TextInput
                        name="nft_context"
                        label="Item Background"
                        as="textarea"
                    />
                )}

                {isFieldEditable("nft_utility") && (
                    <TextInput
                        name="nft_utility"
                        label="Utility"
                        as="textarea"
                    />
                )}

                {isFieldEditable("nft_category") && (
                    <TextInput
                        name="nft_category"
                        label="Category"
                    />
                )}

                <input type="submit" value="Update NFT" />
                {isSuccessful && <div>Update successful!</div>}
                {error && <div>Error: {error}</div>}
            </form>
        </FormProvider>
    );
};

export default ArtistForm;