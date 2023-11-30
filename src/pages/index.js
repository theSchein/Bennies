// pages/index.js
// This is the homepage for the App and is the first page that is loaded when the app is opened.

import SearchContainer from "@/components/search/SearchContainer";

export default function Home() {
    return (
        <div className="bg-primary text-quaternary min-h-screen font-body flex flex-col items-center justify-center py-8">
            <h1 className="font-heading text-6xl mb-10 text-quaternary tracking-wide">
                DISCOVRY
            </h1>

            <div className="w-full max-w-4xl p-8 bg-white rounded-lg shadow-xl">
                <div className="mb-10">
                    <h2 className="font-bold text-3xl mb-4 text-center text-tertiary">
                        Explore NFTs
                    </h2>
                    <div className="flex justify-center">
                        <SearchContainer />
                    </div>
                </div>

                <div className="mb-10">
                    <h2 className="font-bold text-2xl mb-4 text-tertiary">
                        About DISCOVRY
                    </h2>
                    <p className="text-lg leading-relaxed">
                        The goal is for this repo to mature into an authoritative
                        source to explore and discover digital content that has been
                        verified onchain.
                    </p>
                </div>

                <div className="mb-10">
                    <h2 className="font-bold text-2xl mb-4 text-tertiary">
                        Things that work
                    </h2>
                    <ul className="list-disc pl-8 text-lg">
                        <li>Creating accounts</li>
                        <li>NFT Page with top level comments</li>
                        <li>Search Page by NFT name</li>
                        <li>
                            NFTs, comments, and user accounts in the cloud database
                        </li>
                    </ul>
                </div>

                <div className="mb-10">
                    <h2 className="font-bold text-2xl mb-4 text-tertiary">
                        Next Features
                    </h2>
                    <ul className="list-disc pl-8 text-lg">
                        <li>
                            Allow user to create artist page, if they made an NFT or
                            own the NFT
                        </li>
                        <li>
                            Show user generated content on thier profile page
                            (comments, pages, etc)
                        </li>
                        <li>
                            Search by more than name (contract, user, content, etc.)
                        </li>
                        <li>Frontpage content (leaderboard and featured work)</li>
                        <li>Nested Comments on NFT pages</li>
                        <li>Everything else...</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
