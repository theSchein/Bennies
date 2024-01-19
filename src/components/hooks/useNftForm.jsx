// components/hooks/useNftForm.js
// Custom hook to handle logic of the NFT form data

import { useState } from 'react';

const useNftForm = (role, nft) => {
    const [isSuccessful, setIsSuccessful] = useState(false);
    const [error, setError] = useState('');

    const editableFields = determineEditableFields(role);

    function determineEditableFields(role) {
        switch (role) {
            case "deployer":
                return ["nft_sales_link", "nft_licence", "nft_context", "nft_utility", "nft_category"]; 
            case "owner":
                return ["nft_context", "nft_utility", "category"]; 
            default:
                return ["category"]; 
        }
    }
    const onSubmit = async (formData) => {
        try {
            // Include nft_id in the data to be sent
            const dataToSend = {
                ...formData,
                nft_id: nft.nft_id
            };

            const response = await fetch('/api/nft/updateNft', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });

            if (!response.ok) {
                throw new Error('Failed to update NFT');
            }

            setIsSuccessful(true); // Set success state
            setError(''); // Clear any previous errors
        } catch (error) {
            console.error('Error updating NFT:', error);
            setError(error.message || 'Failed to update NFT');
            setIsSuccessful(false);
        }
    };

    return {
        editableFields,
        onSubmit,
        isSuccessful,
        error,
    };
};

export default useNftForm;