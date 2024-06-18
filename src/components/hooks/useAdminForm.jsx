// components/hooks/useAdminForm.js
import { useState } from 'react';

const useAdminForm = (userId) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const submitHandler = async (e, { projectName, contractAddresses, affiliation }) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/user_profile/applyProjectAdmin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    projectName,
                    contractAddresses,
                    affiliation,
                }),
            });

            if (response.ok) {
                setModalMessage('Application submitted successfully.');
            } else {
                setModalMessage('Failed to submit application.');
            }
        } catch (error) {
            console.error('Error submitting application:', error);
            setModalMessage('An error occurred. Please try again.');
        }

        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    return {
        submitHandler,
        modalIsOpen,
        modalMessage,
        closeModal,
    };
};

export default useAdminForm;
