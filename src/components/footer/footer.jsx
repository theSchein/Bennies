// components/footer.jsx
// Footer style component
// It uses the waitlist component to handle signups

import React, { useState } from "react";
import useWaitlistForm from "./waitlist";
import AlertModal from "../alert";

function Footer() {
    const {
        name,
        setName,
        email,
        setEmail,
        showModal,
        setShowModal,
        modalMessage,
        handleSubmit,
    } = useWaitlistForm();

    return (
        <>
            <AlertModal
                isOpen={showModal}
                message={modalMessage}
                onClose={() => setShowModal(false)}
            />
            <footer className="bg-light-primary dark:bg-dark-secondary text-light-font dark:text-dark-font">
                <div className="container mx-auto">
                    <div className="flex flex-col lg:flex-row justify-between items-center">
                        <div className="text-xl font-body lg:block hidden">
                            <h1 className="font-subheading font-bold">
                                {"Let's get in touch"}
                            </h1>
                            <p>Ben Scheinberg</p>
                            <p>ben@bennies.fun</p>
                            <p>(814)-215-3331</p>
                        </div>

                        <div className="mt-10 bg-light-tertiary dark:bg-dark-primary dark:text-dark-quaternary p-4 sm:p-6 lg:p-8 rounded-2xl bg-opacity-50 shadow-xl max-w-md mb-5 w-full">
                            <h3 className="text-xl sm:text-2xl lg:text-2xl mb-4 text-secondary font-subheading font-bold text-center">
                                {"Tell me what you think!"}
                            </h3>
                            <form onSubmit={handleSubmit}>
                                <textarea
                                    className="w-full p-2 sm:p-3 mb-3 border-2 border-light-tertiary dark:border-dark-secondary rounded-lg"
                                    type="textarea"
                                    placeholder="Suggestion, Question, or Feedback?"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    rows="3"
                                />
                                <input
                                    className="w-full p-2 sm:p-3 mb-3 border-2 border-light-tertiary dark:border-dark-secondary rounded-lg"
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    className="w-full py-2 sm:py-3  rounded-lg font-body btn"
                                >
                                    Submit
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}

export default Footer;
