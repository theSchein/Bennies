// components/hooks/useCollectionForm.js
// Custom hook to handle logic of the Collection form data

import { useState } from 'react';

const useCollectionForm = (role, collection) => {
    const [isSuccessful, setIsSuccessful] = useState(false);
    const [error, setError] = useState('');

    const editableFields = determineEditableFields(role);

    function determineEditableFields(role) {
        switch (role) {
            case "deployer":
                return ["media_url", "nft_licence", "collection_description", "collection_utility", "category"]; 
            case "owner":
                return ["collection_description", "nft_utility", "category"]; 
            default:
                return ["category"]; 
        }
    }
    const onSubmit = async (formData) => {
        try {
            const dataToSend = {
                ...formData,
                collection_id: collection.collection_id
            };
            console.log('dataToSend: ', dataToSend);


            const response = await fetch('/api/collection/updateCollection', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });

            if (!response.ok) {
                throw new Error('Failed to update Collection');
            }

            setIsSuccessful(true);
            setError('');
            return true;
        } catch (error) {
            console.error('Error updating Collection:', error);
            setError(error.message || 'Failed to update Collection');
            setIsSuccessful(false);
            return false;
        }
    };

    return {
        editableFields,
        onSubmit,
        isSuccessful,
        error,
    };
};

export default useCollectionForm;