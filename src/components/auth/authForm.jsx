import useAuthForm from "../hooks/useAuthForm";
import AuthInputField from "./authInputField";
import AlertModal from "../alert";

function AuthForm() {
    const {
        emailInputRef,
        usernameInputRef,
        passwordInputRef,
        formMode,
        switchFormMode,
        submitHandler,
        modalIsOpen,
        modalMessage,
        closeModal,
    } = useAuthForm();

    return (
        <section className="flex items-center justify-center py-6 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-6 bg-light-primary dark:bg-dark-primary p-6 rounded-lg shadow-xl">
                <h1 className="text-center text-4xl font-bold text-light-quaternary dark:text-dark-quaternary mb-6">
                    {formMode === 'login' ? "Welcome Back!" : formMode === 'signup' ? "Get Started" : "Reset Password"}
                </h1>
                <form onSubmit={submitHandler} className="space-y-6 text-light-quaternary dark:text-dark-quaternary">
                    <AuthInputField
                        type="text"
                        id="email"
                        required
                        ref={emailInputRef}
                        placeholder="Enter your email"
                        label="Email"
                    />
                    {formMode !== 'reset' && (
                        <>
                            {formMode === 'signup' && (
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
                                placeholder={formMode === 'login' ? "Enter your password" : "Create a password"}
                                label="Password"
                            />
                        </>
                    )}
                    <div className="flex justify-between items-center">
                        {formMode === 'login' && (
                            <button
                                type="button"
                                onClick={() => switchFormMode('reset')}
                                className="text-sm p-3 italic text-blue-500 hover:underline"
                            >
                                Forgot password?
                            </button>
                        )}
                    </div>
                    <div className="flex flex-col space-y-4">
                        <button className="p-3 p-3 font-bold text-light-quaternary dark:text-dark-secondary flex space-y-4 flex-col bg-light-tertiary dark:bg-dark-tertiary rounded-lg hover:bg-light-quaternary hover:text-light-primary dark:hover:bg-dark-primary dark:hover:text-dark-quaternary transition duration-300">
                            {formMode === 'login' ? "Log In" : formMode === 'signup' ? "Sign Up" : "Reset Password"}
                        </button>
                        {formMode !== 'reset' && (
                            <button
                                type="button"
                                onClick={() => switchFormMode(formMode === 'login' ? 'signup' : 'login')}
                                className="text-sm p-3 bg-light-secondary dark:bg-dark-secondary rounded-lg hover:bg-light-tertiary dark:hover:bg-dark-tertiary dark:hover:text-dark-primary transition duration-300 hover:underline"
                            >
                                {formMode === 'login'
                                    ? "New around here? Sign up"
                                    : "Already have an account? Log in"}
                            </button>
                        )}
                        {formMode === 'reset' && (
                            <button
                                type="button"
                                onClick={() => switchFormMode('login')}
                                className="text-sm p-3 bg-light-secondary dark:bg-dark-secondary rounded-lg hover:bg-light-tertiary dark:hover:bg-dark-tertiary transition duration-300 hover:underline"
                            >
                                Return to Log In
                            </button>
                        )}
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
