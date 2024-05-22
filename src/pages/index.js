// pages/index.js
import SearchHomepage from "@/components/search/SearchHomePage";
import Image from "next/image";
import logo from "../../public/logo.png";
import HowItWorks from "@/components/homepage/howItWorks";
import SignupButton from "@/components/homepage/signupButton";

export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-light dark:bg-gradient-dark flex flex-col items-center justify-center p-2 gap-10">
            <div className="bg-light-secondary dark:bg-dark-secondary bg-opacity-90 py-10 px-6 sm:px-10 lg:px-14 rounded-xl shadow-xl max-w-4xl mb-10 w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 items-center">
                    <div className="flex flex-col items-center sm:items-start">
                        <div className="flex items-center">
                            <Image
                                src={logo}
                                alt="Bennies Logo"
                                width={75}
                                height={75}
                                className="inline-block"
                            />
                            <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl text-light-font dark:text-light-ennies leading-tight ml-2">
                                ENNIES
                            </h1>
                        </div>
                        <h3 className="italic bold text-light-font dark:text-dark-font mt-4 text-center sm:text-left lg:text-xl sm:text-lg">
                            Find the Benefits in your Community
                        </h3>
                        <SignupButton />
                    </div>
                    <div className="text-center sm:text-left bg-light-tertiary dark:bg-dark-tertiary p-5 rounded-xl shadow-xl">
                        <p className="text-lg text-light-font dark:text-light-ennies">
                            Bennies aggregates NFT and token holder benefits,
                            allowing users to verify and earn rewards for attesting
                            to the accuracy. Discover your community and
                            get welcomed as a true member.
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-light-secondary dark:bg-dark-secondary bg-opacity-90 py-8 px-4 sm:px-10 lg:px-14 rounded-xl shadow-xl max-w-4xl w-full mb-8">
                <HowItWorks />
            </div>

            <SearchHomepage />
        </div>
    );
}
