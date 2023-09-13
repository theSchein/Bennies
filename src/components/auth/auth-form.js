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
                console.log(result);
            } catch (error) {
                console.log(error);
            }
        }
    }

    return (
        <section>
            <h1>{isLogin ? "Login" : "Sign Up"}</h1>
            <form onSubmit={submitHandler}>
                <div>
                    <label htmlFor="email">Your Email</label>
                    <input type="email" id="email" required ref={emailInputRef} />
                </div>
                {!isLogin ? (
                    <div>
                        <label htmlFor="username">Your Username</label>
                        <input
                            type="username"
                            id="username"
                            required
                            ref={usernameInputRef}
                        />
                    </div>
                ) : null}
                <div>
                    <label htmlFor="password">Your Password</label>
                    <input
                        type="password"
                        id="password"
                        required
                        ref={passwordInputRef}
                    />
                </div>
                <div>
                    <button>{isLogin ? "Login" : "Create Account"}</button>
                    <button type="button" onClick={switchAuthModeHandler}>
                        {isLogin
                            ? "Create new account"
                            : "Login with existing account"}
                    </button>
                </div>
            </form>
        </section>
    );
}

export default AuthForm;
