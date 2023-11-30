// pages/whitepaper.js
// before the pitchdeck we had the whitepaper. The paper sucked so I may just delete this page.

import React from "react";

export default function Whitepaper() {
    return (
        <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
                {"On an Index and Curation Engine for Digital Assets"}
            </h1>

            <div className="bg-white shadow-xl rounded-lg p-8 mx-auto max-w-3xl">
                <section className="mb-12">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                        {"Abstract"}
                    </h2>
                    <p className="text-gray-600">
                        {
                            "In the digital arts, creators grapple with authenticity, exposure, and appropriation. While platforms like IMDb and Github validate their respective fields, digital artists lack a unified, trusted database. This whitepaper proposes a solution using non-fungible tokens (NFTs) to create a definitive registry linking artists with their works. Our platform's phased approach encompasses indexing NFTs, streamlining the minting process, and external integration. With user-centric design and strategic monetization, a platform ensuring artists' rightful recognition and security can be realized."
                        }
                    </p>
                </section>

                <section className="mb-12">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                        {"Under Construction"}
                    </h2>
                    <p className="text-gray-600 mb-4">
                        {
                            "My first whitepaper was too long winded and pretentious. I will be publishing a cleaner paper and pitch deck by November 11th."
                        }
                    </p>
                </section>
            </div>

            <footer className="text-center mt-12">
                <p className="text-gray-600">
                    {"Thank you for reading our whitepaper!"}
                </p>
            </footer>
        </div>
    );
}
