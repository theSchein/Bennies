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
            <footer className="bg-light-tertiary dark:bg-dark-secondary text-light-quaternary dark:text-dark-quaternary">
                <div className="container mx-auto">
                    <div className="flex justify-between items-center">
                        <div className="text-xl font-body">
                            <h1 className="font-subheading font-bold">
                                {"Let's get in touch"}
                            </h1>
                            <p>Benjamin Scheinberg</p>
                            <p>ben@discovry.xyz</p>
                            <p>(814)-215-3331</p>
                        </div>

                        <div className="mt-10 bg-light-primary dark:bg-dark-primary p-4 sm:p-6 lg:p-8 rounded-2xl bg-opacity-50 shadow-xl max-w-md w-full">
                            <h3 className="text-xl sm:text-2xl lg:text-2xl mb-4 text-secondary font-subheading font-bold text-center">
                                {"Sign up for our Newsletter"}
                            </h3>
                            <form onSubmit={handleSubmit}>
                                <input
                                    className="w-full p-2 sm:p-3 mb-3 border-2 border-light-tertiary dark:border-dark-secondary rounded-lg"
                                    type="text"
                                    placeholder="Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
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
                                    className="w-full py-2 sm:py-3 bg-gradient-to-r from-light-primary to-light-quaternary dark:from-dark-secondary dark:to-dark-tertiary text-white rounded-lg font-body hover:from-yellow-600 hover:to-amber-950 dark:hover:from-yellow-600 dark:hover:to-amber-950 transition duration-300"
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
