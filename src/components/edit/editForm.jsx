// components/edit/editForm.jsx
// Modal to come up on page and handle updates/edits
// Should take in user role and determine what allow to edit

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
};

export default function EditForm({ open, handleClose }) {



    return (
        <div>
           
        </div>
    );

}

