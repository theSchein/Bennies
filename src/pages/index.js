// pages/index.js
// This is the homepage for the App and is the first page that is loaded when the app is opened.

import SearchHomepage from "@/components/search/SearchHomePage";
import logo from '../../public/logo.png'

export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-light dark:bg-gradient-dark flex flex-col items-center justify-center p-2">
            <div className="bg-light-secondary dark:bg-dark-secondary bg-opacity-90 py-10 px-4 sm:px-6 lg:px-8 rounded-xl shadow-xl max-w-xl mb-10 flex justify-center">
                <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl text-light-font dark:text-dark-font text-center leading-tight flex items-center">
                    <Image
                        src={logo}
                        alt="Bennies Logo"
                        width={40}
                        height={40}
                        className="inline-block"
                    />
                    <span style={{ fontSize: "inherit", marginLeft: "0.2em" }}>ennies</span>
                </h1>
            </div>

            <div className="bg-light-secondary dark:bg-dark-secondary bg-opacity-90 py-3 px-2 sm:px-6 lg:px-3 rounded-xl shadow-xl max-w-xl mb-3">
                <h3 className="italic bold text-light-font dark:text-dark-font">Find the Benefits of your NFTs</h3>
            </div>

            <SearchHomepage />
        </div>
    );
}