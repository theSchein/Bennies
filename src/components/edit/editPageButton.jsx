// components/edit/editPageButton.jsx
// reusable button component to edit pages for nfts, artists, and collections
// Button checks if the user's role: user, owner, ore creator to pass to the modal

import React from "react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import Button from "@mui/material/Button";
import EditForm from "./editForm";
import Link from "next/link";

const EditButton = ({ isOwner, isDeployer, pageData }) => {
    const [showEditForm, setShowEditForm] = useState(false);
    const { data: session } = useSession();
    const handleOpenEditForm = () => setShowEditForm(true);
    const handleCloseEditForm = () => setShowEditForm(false);
    let role;

    if (isDeployer) {
        role = "deployer";
    } else if (isOwner) {
        role = "owner";
    } else {
        role = "user";
    }

    return (
        <div className=" max-w-2xl mx-auto">
            {session ? (
                <div className="btn">
                    <Button onClick={handleOpenEditForm} className="btn">
                        Update this Page
                    </Button>
                    {showEditForm && (
                        <EditForm
                            isOpen={showEditForm}
                            onClose={handleCloseEditForm}
                            role={role}
                            pageData={pageData}
                        />
                    )}
                </div>
            ) : (
                <div className="text-center py-4">
                    <Link href="/signin" className="btn">
                        Sign in to Edit
                    </Link>
                </div>
            )}
        </div>
    );
};

export default EditButton;
