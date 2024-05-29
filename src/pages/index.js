// pages/index.js
import SearchHomepage from "@/components/search/SearchHomePage";
import Image from "next/image";
import logo from "../../public/logo.png";
import HowItWorks from "@/components/homepage/howItWorks";
import SignupButton from "@/components/homepage/signupButton";

export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-light dark:bg-gradient-dark flex flex-col items-center justify-center p-2 gap-10">
            <div className="bg-light-secondary dark:bg-dark-secondary bg-opacity-90 py-16 px-10 sm:px-20 lg:px-28 rounded-xl shadow-xl w-full max-w-6xl mb-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 items-center">
                    <div className="flex flex-col items-center sm:items-start w-full">
                        <div className="flex items-center w-full">
                            <Image
                                src={logo}
                                alt="Bennies Logo"
                                width={100}
                                height={100}
                                className="inline-block"
                            />
                            <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl text-light-font dark:text-light-ennies leading-tight ml-4">
                                ENNIES
                            </h1>
                        </div>
                    </div>
                    <SignupButton />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full mt-5">
                    <h3 className="italic bold text-light-font dark:text-dark-font text-center sm:text-left text-3xl">
                        Find the Benefits, not Price
                    </h3>
                </div>
            </div>

            <div className="bg-light-secondary dark:bg-dark-secondary bg-opacity-90 py-10 px-6 sm:px-14 lg:px-20 rounded-xl shadow-xl max-w-4xl w-full mb-8">
                <HowItWorks />
            </div>

            <SearchHomepage />
        </div>
    );
}
