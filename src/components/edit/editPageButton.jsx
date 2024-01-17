// components/edit/editPageButton.jsx
// reusable button component to edit pages for nfts, artists, and collections
// Button checks if the user's role: user, owner, ore creator to pass to the modal

import React from 'react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import Button from "@mui/material/Button";
import EditForm from './editForm';
import Link from 'next/link';


const EditButton = ({ isOwner, isDeployer }) => {
    const [showEditForm, setShowEditForm] = useState(false);
    const { data: session } = useSession();
    const handleOpenEditForm = () => setShowEditForm(true);
    const handleCloseEditForm = () => setShowEditForm(false);
    let role;

    if (isDeployer) {
        role = 'deployer';
    } else if (isOwner) {
        role = 'owner';
    } else {
        role = 'user';
    }



    return (
        <div className="py-8 w-full max-w-2xl mx-auto">
            {session ? (
                <div className="bg-gray-50 p-6 rounded-lg shadow space-y-4">
                <Button onClick={handleOpenEditForm}>Update this Page</Button>
                <EditForm open={showEditForm} handleClose={handleCloseEditForm} />

                </div>
            ) : (
                <div className="text-center py-4">
                    <Link
                        href="/signin"
                        className="px-6 py-2 bg-primary text-tertiary rounded-full hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-opacity-50 transition ease-in duration-200"
                    >
                        Sign in to Edit
                    </Link>
                </div>
            )}
        </div>

    );
};

export default EditButton;
