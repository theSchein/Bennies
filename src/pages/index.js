// pages/index.js
// This is the homepage for the App and is the first page that is loaded when the app is opened.

import SearchHomepage from "@/components/search/SearchHomePage";

export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-light dark:bg-gradient-dark flex flex-col items-center justify-center p-2">
            <div className="bg-light-secondary dark:bg-dark-secondary bg-opacity-90 py-10 px-4 sm:px-6 lg:px-8 rounded-xl shadow-xl max-w-xl mb-10">
                <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl text-light-quaternary dark:text-dark-quaternary text-center leading-tight">
                    DISCOVRY.XYZ
                </h1>
            </div>

            <div className="bg-light-secondary dark:bg-dark-secondary g-opacity-90 py-3 px-2 sm:px-6 lg:px-3 rounded-xl shadow-xl max-w-xl mb-3">
                <h3 className="italic bold text-light-quaternary dark:text-dark-quaternary">Find the value, not just the price, of NFTs</h3>
                </div>

            <SearchHomepage />

        </div>
    );
}
