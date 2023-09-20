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
        throw new Error(data.message || "Something went wrong!");
    }

    return data;
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

        const enteredEmail = emailInputRef.current.value;
        const enteredPassword = passwordInputRef.current.value;

        // optional: Add validation

        if (isLogin) {
            const result = await signIn("credentials", {
                redirect: false,
                identifier: enteredEmail,
                password: enteredPassword,
            });

            if (!result.error) {
                // set some auth state
                router.replace("/profile");
            }
        } else {
            try {
                const enteredUsername = usernameInputRef.current.value;
                const result = await createUser(
                    enteredEmail,
                    enteredUsername,
                    enteredPassword,
                );
            } catch (error) {}
        }
    }

    return (
        <section className="min-h-screen flex items-center justify-center bg-primary py-6 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-4 bg-secondary p-6 rounded shadow-md">
                <h1 className="text-center text-3xl font-heading text-quaternary mb-4">
                    {isLogin ? "Login" : "Sign Up"}
                </h1>
                <form onSubmit={submitHandler} className="space-y-4">
                    <div className="flex flex-col">
                        <label
                            htmlFor="email"
                            className="font-body mb-1 text-quaternary"
                        >
                            Your Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            required
                            ref={emailInputRef}
                            className="p-2 border border-quaternary rounded focus:outline-none focus:border-tertiary"
                        />
                    </div>
                    {!isLogin && (
                        <div className="flex flex-col">
                            <label
                                htmlFor="username"
                                className="font-body mb-1 text-quaternary"
                            >
                                Your Username
                            </label>
                            <input
                                type="username"
                                id="username"
                                required
                                ref={usernameInputRef}
                                className="p-2 border border-quaternary rounded focus:outline-none focus:border-tertiary"
                            />
                        </div>
                    )}
                    <div className="flex flex-col">
                        <label
                            htmlFor="password"
                            className="font-body mb-1 text-quaternary"
                        >
                            Your Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            required
                            ref={passwordInputRef}
                            className="p-2 border border-quaternary rounded focus:outline-none focus:border-tertiary"
                        />
                    </div>
                    <div className="flex flex-col space-y-2">
                        <button className="p-2 bg-tertiary text-quaternary rounded hover:bg-quaternary hover:text-tertiary">
                            {isLogin ? "Login" : "Create Account"}
                        </button>
                        <button
                            type="button"
                            onClick={switchAuthModeHandler}
                            className="p-2 bg-quaternary text-tertiary rounded hover:bg-tertiary hover:text-quaternary"
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
