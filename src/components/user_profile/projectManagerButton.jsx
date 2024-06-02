// components/user_profile/ProjectManagerButton.jsx
import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import AdminForm from './adminForm';
import { useSession } from 'next-auth/react';

export default function ProjectManagerButton({ userId }) {
    const { data: session } = useSession();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isProjectManager, setIsProjectManager] = useState(false);

    useEffect(() => {
        // Check if the user is a project manager
        const checkProjectManagerStatus = async () => {
            try {
                const response = await fetch(`/api/user_profile/checkProjectManagerStatus?userId=${userId}`);
                const data = await response.json();
                setIsProjectManager(data.isProjectManager);
            } catch (error) {
                console.error('Error checking project manager status:', error);
            }
        };

        if (userId) {
            checkProjectManagerStatus();
        }
    }, [userId]);

    const handleButtonClick = () => {
        if (isProjectManager) {
            // Redirect to the onboarding template
            // You can replace this with the actual navigation logic
            alert('Redirecting to onboarding template...');
        } else {
            setIsModalOpen(true);
        }
    };

    return (
        <div className="mt-4 w-full items-center">
            <button
                onClick={handleButtonClick}
                className="px-8 py-6 btn w-full text-3xl flex-auto p-7 sm:p-8 lg:p-8 sm:text-2xl lg:text-3xl"
            >
                {isProjectManager ? 'Manage Project' : 'Become Project Manager'}
            </button>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <AdminForm userId={userId} />
            </Modal>
        </div>
    );
}
