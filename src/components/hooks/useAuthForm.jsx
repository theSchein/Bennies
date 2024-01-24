// components/hoks/useAuthForm.js
// logic for signing in and signing up

import { useState, useRef } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

function useAuthForm() {
    const emailInputRef = useRef();
    const usernameInputRef = useRef();
    const passwordInputRef = useRef();
    const [isLogin, setIsLogin] = useState(true);
    const router = useRouter();

    const switchAuthModeHandler = () => {
        setIsLogin((prevState) => !prevState);
    };

    async function createUser(email_address, username, password) {
        const response = await fetch("/api/auth/register", {
            method: "POST",
            body: JSON.stringify({ email_address, username, password }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();

        if (!response.ok) {
            return data;
        }

        return data;
    }

    function validatePassword(password) {
        if (password.length < 8) {
            return "Password should be at least 8 characters.";
        }
        if (!/[A-Z]/.test(password)) {
            return "Password should contain at least one uppercase letter.";
        }
        if (!/[a-z]/.test(password)) {
            return "Password should contain at least one lowercase letter.";
        }
        if (!/[0-9]/.test(password)) {
            return "Password should contain at least one number.";
        }
        return null;
    }

    const submitHandler = async (event) => {
        event.preventDefault();
        const enteredIdentifier = emailInputRef.current.value;
        const enteredPassword = passwordInputRef.current.value;
        const passwordError = validatePassword(enteredPassword);
        if (passwordError) {
            alert(passwordError);
            return;
        }
        if (isLogin) {
            const result = await signIn("credentials", {
                redirect: false,
                identifier: enteredIdentifier,
                password: enteredPassword,
            });

            if (result && result.error) {
                alert(result.error);
            } else {
                router.replace("/profile");
            }
        } else {
            try {
                const enteredUsername = usernameInputRef.current.value;
                const result = await createUser(
                    enteredIdentifier,
                    enteredUsername,
                    enteredPassword,
                );
                if (result.error) {
                    alert(result.error);
                } else {
                    router.replace("/profile");
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    return {
        emailInputRef,
        usernameInputRef,
        passwordInputRef,
        isLogin,
        switchAuthModeHandler,
        submitHandler,
    };
}

export default useAuthForm;
