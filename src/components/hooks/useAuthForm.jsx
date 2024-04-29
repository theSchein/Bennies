// components/hooks/useAuthForm.js
// logic for signing in and signing up

import { useState, useRef } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

function useAuthForm() {
    const emailInputRef = useRef();
    const usernameInputRef = useRef();
    const passwordInputRef = useRef();
    const [formMode, setFormMode] = useState('login'); // login, signup, or reset
    const router = useRouter();
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

    const closeModal = () => setModalIsOpen(false);

    const switchFormMode = (mode) => setFormMode(mode);

    const submitHandler = async (event) => {
        event.preventDefault();
        const email = emailInputRef.current.value;
        let password = "";
        if (formMode !== 'reset') {
            password = passwordInputRef.current.value; // Only access password when it's available
        }
        
        if (formMode === 'reset') {
            // Handle reset password submission
            const response = await fetch('/api/auth/requestReset', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ email }),
            });
            const data = await response.json();
            setModalMessage(data.message || data.error);
            setModalIsOpen(true);
            return;
        }

        if (formMode === 'login') {
            // Handle login submission
            const result = await signIn('credentials', {
                redirect: false,
                identifier: email,
                password,
                callbackUrl: window.location.href,
            });

            if (result.error) {
                setModalMessage(result.error);
                setModalIsOpen(true);
            } else {
                router.reload();
            }
        } else if (formMode === 'signup') {
            // Handle signup submission
            const username = usernameInputRef.current.value;
            const result = await createUser(email, username, password);

            if (result.error) {
                setModalMessage(result.error);
                setModalIsOpen(true);
            } else {
                const signInResult = await signIn('credentials', {
                    redirect: false,
                    identifier: email,
                    password,
                    callbackUrl: window.location.href,
                });

                if (!signInResult.error) {
                    router.reload();
                } else {
                    setModalMessage(signInResult.error);
                    setModalIsOpen(true);
                }
            }
        }
    };

    async function createUser(email, username, password) {
        const response = await fetch("/api/auth/register", {
            method: "POST",
            body: JSON.stringify({ email, username, password }),
            headers: { "Content-Type": "application/json" },
        });

        return await response.json();
    }

    return {
        emailInputRef,
        usernameInputRef,
        passwordInputRef,
        formMode,
        switchFormMode,
        submitHandler,
        modalIsOpen,
        modalMessage,
        closeModal,
    };
}

export default useAuthForm;