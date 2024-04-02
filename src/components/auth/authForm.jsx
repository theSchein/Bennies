import useAuthForm from "../hooks/useAuthForm";
import AuthInputField from "./authInputField";
import AlertModal from "../alert";

function AuthForm() {
    const {
        emailInputRef,
        usernameInputRef,
        passwordInputRef,
        isLogin,
        switchAuthModeHandler,
        submitHandler,
        modalIsOpen,
        modalMessage,
        closeModal,
    } = useAuthForm();

    return (
        <section className="flex items-center justify-center py-6 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-6 bg-light-primary dark:bg-dark-primary p-6 rounded-lg shadow-xl">
                <h1 className="text-center text-4xl font-bold text-light-quaternary dark:text-dark-quaternary mb-6">
                    {isLogin ? "Welcome Back!" : "Get Started"}
                </h1>
                <p className="text-center text-light-quaternary dark:text-dark-quaternary mb-6">
                    {isLogin ? "Please login to continue." : "Create your account"}
                </p>
                <form
                    onSubmit={submitHandler}
                    className="space-y-6 text-light-quaternary dark:text-dark-quaternary"
                >
                    <AuthInputField
                        type="text" // Changed to text to allow non-email input for usernames
                        id="email"
                        required
                        ref={emailInputRef}
                        placeholder={
                            isLogin ? "Enter your Username or Email" : "Enter your Email" // Made the placeholder more concise
                        }
                        label={
                            isLogin ? "Username / Email" : "Email" // Adjusted spacing for consistency
                        }
                    />
                    {!isLogin && (
                        <AuthInputField
                            type="text"
                            id="username"
                            required
                            ref={usernameInputRef}
                            placeholder="Choose a Username"
                            label="Username"
                        />
                    )}
                    <AuthInputField
                        type="password"
                        id="password"
                        required
                        ref={passwordInputRef}
                        placeholder={
                            isLogin ? "Enter your password" : "Create a password"
                        }
                        label="Password"
                    />
                    <div className="flex flex-col space-y-4">
                        <button className="p-3 btn">
                            {isLogin ? "Log In" : "Sign Up"}
                        </button>
                        <button
                            type="button"
                            onClick={switchAuthModeHandler}
                            className="text-sm p-3 bg-light-secondary dark:bg-dark-secondary rounded-lg hover:bg-light-tertiary dark:hover:bg-dark-tertiary transition duration-300 hover:underline"
                        >
                            {isLogin
                                ? "New around here? Sign up"
                                : "Already have an account? Log in"}
                        </button>
                    </div>
                </form>
            </div>
            <AlertModal
                isOpen={modalIsOpen}
                message={modalMessage}
                onClose={closeModal}
            />
        </section>
    );
}

export default AuthForm;
