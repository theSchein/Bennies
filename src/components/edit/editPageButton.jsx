// components/edit/editPageButton.jsx
// reusable button component to edit pages for nfts, artists, and collections
// Button checks if the user's role: user, owner, ore creator to pass to the modal

import React from "react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import Button from "@mui/material/Button";
import EditForm from "./editForm";
import Link from "next/link";
import { useTheme } from "@mui/material/styles";

const EditButton = ({ isOwner, isDeployer, pageData }) => {
    const theme = useTheme();
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
                    <Button
                        onClick={handleOpenEditForm}
                        sx={{
                            backgroundColor:
                                theme.palette.mode === "dark"
                                    ? theme.palette.dark.primary
                                    : theme.palette.light.primary,
                            color:
                                theme.palette.mode === "dark"
                                    ? theme.palette.dark.text.quaternary
                                    : theme.palette.light.text.font,
                            "&:hover": {
                                backgroundColor:
                                    theme.palette.mode === "dark"
                                        ? theme.palette.dark.quaternary
                                        : theme.palette.light.quaternary,
                                color:
                                    theme.palette.mode === "dark"
                                        ? theme.palette.dark.text.primary
                                        : theme.palette.light.text.primary,
                            },
                        }}
                    >
                        Update this Page
                    </Button>
                    {showEditForm && (
                        <EditForm
                            isOpen={showEditForm}
                            onClose={handleCloseEditForm}
                            role={"deployer"} //ONLY FOR ETH DENVER CHANGE BACK TO ROLE LATER
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
