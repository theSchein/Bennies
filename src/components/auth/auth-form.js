// components/auth/auth-form.js
// Presentation and logic for the app login and signup forms.

import { useState, useRef } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

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

function AuthForm() {
    const emailInputRef = useRef();
    const usernameInputRef = useRef();
    const passwordInputRef = useRef();

    const [isLogin, setIsLogin] = useState(true);
    const router = useRouter();

    function switchAuthModeHandler() {
        setIsLogin((prevState) => !prevState);
    }

    async function submitHandler(event) {
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
    }

    return (
        <section className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-400 to-gray-600 py-6 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-6 bg-white p-6 rounded-lg shadow-xl">
                <h1 className="text-center text-4xl font-bold text-gray-800 mb-6">
                    {isLogin ? "Login" : "Sign Up"}
                </h1>
                <form onSubmit={submitHandler} className="space-y-6">
                    <div className="flex flex-col">
                        <label
                            htmlFor="emailOrUsername"
                            className="font-medium text-gray-600 mb-2"
                        >
                            {isLogin ? "Email/Username" : "Your Email"}
                        </label>
                        <input
                            type="text"
                            id="emailOrUsername"
                            required
                            ref={emailInputRef}
                            placeholder="Enter Email or Username"
                            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-700 focus:ring-1 focus:ring-gray-700"
                        />
                    </div>
                    {!isLogin && (
                        <div className="flex flex-col">
                            <label
                                htmlFor="username"
                                className="font-medium text-gray-600 mb-2"
                            >
                                Your Username
                            </label>
                            <input
                                type="username"
                                id="username"
                                required
                                ref={usernameInputRef}
                                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-700 focus:ring-1 focus:ring-gray-700"
                            />
                        </div>
                    )}
                    <div className="flex flex-col">
                        <label
                            htmlFor="password"
                            className="font-medium text-gray-600 mb-2"
                        >
                            Your Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            required
                            ref={passwordInputRef}
                            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-700 focus:ring-1 focus:ring-gray-700"
                        />
                    </div>
                    <div className="flex flex-col space-y-4">
                        <button className="p-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition duration-300">
                            {isLogin ? "Login" : "Create Account"}
                        </button>
                        <button
                            type="button"
                            onClick={switchAuthModeHandler}
                            className="p-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-300"
                        >
                            {isLogin
                                ? "Create new account"
                                : "Login with existing account"}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}

export default AuthForm;
