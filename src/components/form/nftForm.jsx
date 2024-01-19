// components/form/nftForm.jsx
// UI for the NFT form

import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import TextInput from "./textInput";
import useNftForm from "../hooks/useNftForm";

const NftForm = ({ role, nft }) => {
    const methods = useForm({
        defaultValues: nft,
    });
    console.log('nftForm nft data:', nft)

    const { editableFields, onSubmit, isSuccessful, error } = useNftForm(role, nft);

    // Function to check if a field is editable
    const isFieldEditable = (fieldName) => editableFields.includes(fieldName);

    // // Watch specific fields IMPLEMENT LATER
    // const watchedFields = methods.watch();

    // // You can also watch individual fields like this:
    // // const watchedName = methods.watch('name')

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
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
                        label="Ownership License"
                        as="textarea"
                    />
                )}

                {isFieldEditable("nft_context") && (
                    <TextInput
                        name="nft_context"
                        label="Item Information"
                        as="textarea"
                    />
                )}

                {isFieldEditable("nft_utility") && (
                    <TextInput name="nft_utility" label="Utility" as="textarea" />
                )}

                {isFieldEditable("category") && (
                    <TextInput name="category" label="Category" />
                )}

                <input type="submit" value="Update NFT" />
                {isSuccessful && <div>Update successful!</div>}
                {error && <div>Error: {error}</div>}
            </form>
        </FormProvider>
    );
};

export default NftForm;
