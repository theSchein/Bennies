import { useState, useRef } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

function useAuthForm() {
    const emailInputRef = useRef();
    const usernameInputRef = useRef();
    const passwordInputRef = useRef();
    const confirmPasswordRef = useRef();
    const [formMode, setFormMode] = useState('signup'); // login, signup, or reset
    const router = useRouter();
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

    const closeModal = () => setModalIsOpen(false);
    const switchFormMode = (mode) => setFormMode(mode);

    const submitHandler = async (event) => {
        event.preventDefault();
        const email_address = emailInputRef.current.value;
        const password = passwordInputRef.current.value;

        if (formMode === 'reset') {
            // Handle reset password submission
        } else if (formMode === 'login') {
            // Handle login submission
            const result = await signIn('credentials', {
                redirect: false,
                identifier: email_address,
                password,
                callbackUrl: window.location.href,
            });

            if (result.error) {
                setModalMessage(result.error);
                setModalIsOpen(true);
            } else {
                router.push('/profile');
            }
        } else if (formMode === 'signup') {
            // Handle signup submission
            const username = usernameInputRef.current.value;
            const confirmPassword = confirmPasswordRef.current.value;

            if (password !== confirmPassword) {
                setModalMessage("Passwords do not match.");
                setModalIsOpen(true);
                return;
            }

            const result = await createUser(email_address, username, password);

            if (result.error) {
                setModalMessage(result.error);
                setModalIsOpen(true);
            } else {
                // Attempt to log the user in immediately after sign up
                const signInResult = await signIn('credentials', {
                    redirect: false,
                    identifier: email_address,
                    password,
                    callbackUrl: window.location.href,
                });

                if (!signInResult.error) {
                    router.push('/profile');
                } else {
                    setModalMessage(signInResult.error);
                    setModalIsOpen(true);
                }
            }
        }
    };

    async function createUser(email_address, username, password) {
        const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email_address, username, password }),
        });
        return await response.json();
    }

    return {
        emailInputRef,
        usernameInputRef,
        passwordInputRef,
        confirmPasswordRef,
        formMode,
        switchFormMode,
        submitHandler,
        modalIsOpen,
        modalMessage,
        closeModal,
    };
}

export default useAuthForm;
