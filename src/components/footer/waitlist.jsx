// waitlist.js
// the logic for signing folks up on the waitlist

import { useState } from 'react';

const useWaitlistForm = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Post data to API endpoint
        const response = await fetch("/api/waitlist", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email }),
        });

        if (response.ok) {
            setModalMessage("You've been added to the waitlist!");
            setShowModal(true);
            setName("");
            setEmail("");
        } else {
            setModalMessage("Something went wrong. Please try again.");
            setShowModal(true);
        }
    };

    return { name, setName, email, setEmail, showModal, setShowModal, modalMessage, handleSubmit };
};

export default useWaitlistForm;
