// components/form/collectionForm.jsx
// UI for the Collection form

import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import TextInput from "./textInput";
import useCollectionForm from "../hooks/useCollectionForm";

const CollectionForm = ({ role, collection }) => {
    const methods = useForm({
        defaultValues: collection,
    });

    const { editableFields, onSubmit, isSuccessful, error } = useCollectionForm(
        role,
        collection,
    );

    // Function to check if a field is editable
    const isFieldEditable = (fieldName) => editableFields.includes(fieldName);

    // // Watch specific fields IMPLEMENT LATER
    // const watchedFields = methods.watch();

    // // You can also watch individual fields like this:
    // // const watchedName = methods.watch('name')

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
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
                    <TextInput name="collection_utility" label="Utility" as="textarea" />
                )}

                {isFieldEditable("category") && (
                    <TextInput name="category" label="Category" />
                )}

                <input type="submit" value="Update Collection" />
                {isSuccessful && <div>Update successful!</div>}
                {error && <div>Error: {error}</div>}
            </form>
        </FormProvider>
    );
};

export default CollectionForm;
