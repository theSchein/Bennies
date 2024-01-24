import useAuthForm from "../hooks/useAuthForm";
import AuthInputField from "./authInputField";

function AuthForm() {
    const {
        emailInputRef,
        usernameInputRef,
        passwordInputRef,
        isLogin,
        switchAuthModeHandler,
        submitHandler,
    } = useAuthForm();

    return (
        <section className="min-h-screen flex items-center justify-center bg-gradient-light dark:bg-gradient-dark py-6 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-6 bg-light-primary dark:bg-dark-primary p-6 rounded-lg shadow-xl ">
                <h1 className="text-center text-4xl font-bold text-light-quaternary dark:text-dark-quaternary mb-6">
                    {isLogin ? "Login" : "Sign Up"}
                </h1>
                <form onSubmit={submitHandler} className="space-y-6 text-light-quaternary dark:text-dark-quaternary">
                    <AuthInputField
                        type="text"
                        id="emailOrUsername"
                        required
                        ref={emailInputRef}
                        placeholder="Enter Email or Username"
                        label={isLogin ? "Email/Username" : "Your Email"}
                    />
                    {!isLogin && (
                        <AuthInputField
                            type="username"
                            id="username"
                            required
                            ref={usernameInputRef}
                            placeholder="Your Username"
                            label="Your Username"
                        />
                    )}
                    <AuthInputField
                        type="password"
                        id="password"
                        required
                        ref={passwordInputRef}
                        placeholder="Your Password"
                        label="Your Password"
                    />
                    <div className="flex flex-col space-y-4">
                        <button className="p-3 bg-light-secondary dark:bg-dark-secondary rounded-lg hover:bg-light-tertiary dark:hover:bg-dark-tertiary transition duration-300">
                            {isLogin ? "Login" : "Create Account"}
                        </button>
                        <button
                            type="button"
                            onClick={switchAuthModeHandler}
                            className="p-3 bg-light-primary dark:bg-dark-primary text-light-quaternary dark:text-dark-quaternary rounded-lg hover:bg-light-tertiary dark:hover:bg-dark-tertiary transition duration-300"
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
