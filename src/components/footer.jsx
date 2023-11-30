// components/footer.jsx
// Footer style component. There is no logic to actually handle anything here.
// The footer should be revisted and updated to be more useful.

import React, { useState } from "react";

function Footer() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        setEmail("");
        setMessage("");
    };

    return (
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

                    <form onSubmit={handleSubmit} className="w-1/2">
                        <div className="mb-4">
                            <label htmlFor="email" className="block mb-2">
                                Your Email:
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="p-2 w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="message" className="block mb-2">
                                Message (optional):
                            </label>
                            <textarea
                                id="message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                rows="3"
                                className="p-2 w-full"
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            className="bg-tertiary hover:bg-secondary p-2 text-primary rounded"
                        >
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
