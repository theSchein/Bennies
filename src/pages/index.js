// pages/index.js
import SearchHomepage from "@/components/search/SearchHomePage";
import Image from "next/image";
import logo from "../../public/logo.png";
import HowItWorks from "@/components/homepage/howItWorks";
import SignupButton from "@/components/homepage/signupButton";

export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-light dark:bg-gradient-dark flex flex-col items-center justify-center p-2 gap-10">
            <div className="bg-light-secondary dark:bg-dark-secondary bg-opacity-90 py-10 px-10 sm:px-20 lg:px-28 rounded-xl shadow-xl w-full max-w-6xl mb-10 flex flex-col items-center text-center">
                <div className="flex flex-col items-center w-full">
                    <div className="flex items-center justify-center w-full mb-5">
                        <Image
                            src={logo}
                            alt="Bennies Logo"
                            width={100}
                            height={100}
                            className="inline-block"
                        />
                        <h1 className="font-heading text-5xl lg:text-7xl text-light-font dark:text-light-ennies leading-tight ml-4">
                            ENNIES
                        </h1>
                    </div>
                    <h3 className="italic bold text-light-font dark:text-dark-font text-center text-3xl mt-5">
                        Find the Benefits, not Price of your Tokens and NFTs
                    </h3>
                    <div className="mt-6">
                        <p className="text-xl text-light-font dark:text-dark-font mb-2">
                            Stop buying useless crypto and start finding out what you are getting into.
                        </p>
                        <p className="text-xl text-light-font dark:text-dark-font mb-2">
                            Join your community of holders and get more involved.
                        </p>
                        <p className="text-xl font-bold text-light-font dark:text-dark-font mb-2">
                            Completely free.
                        </p>
                    </div>
                    <div className="mt-6">
                        <SignupButton />
                    </div>
                </div>
            </div>

            <div className="bg-light-secondary dark:bg-dark-secondary bg-opacity-90 py-10 px-6 sm:px-14 lg:px-20 rounded-xl shadow-xl max-w-4xl w-full mb-8">
                <HowItWorks />
            </div>

            <SearchHomepage />
        </div>
    );
}
