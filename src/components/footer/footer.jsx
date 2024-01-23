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
            <footer className="bg-quaternary text-primary font-heading p-6">
                <div className="container mx-auto">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-xl font-heading font-bold">
                                {"Let's get in touch"}
                            </h3>
                            <p>Email: ben@scheinberg.xyz</p>
                            <p>Phone: (814) 215-3331</p>
                        </div>

                        <div className="mt-10 bg-primary p-4 sm:p-6 lg:p-8 rounded-2xl bg-opacity-90 shadow-xl max-w-md w-full">
                            <h3 className="font-bold text-xl sm:text-2xl lg:text-2xl mb-4 text-secondary text-center">
                                Join Waitlist for Beta
                            </h3>
                            <form onSubmit={handleSubmit}>
                                <input
                                    className="w-full p-2 sm:p-3 mb-3 border-2 border-cyan-500 rounded-lg"
                                    type="text"
                                    placeholder="Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <input
                                    className="w-full p-2 sm:p-3 mb-3 border-2 border-cyan-500 rounded-lg"
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    className="w-full py-2 sm:py-3 bg-gradient-to-r from-cyan-600 to-yellow-950 text-white rounded-lg font-bold hover:from-yellow-600 hover:to-cyan-700 transition duration-300"
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
