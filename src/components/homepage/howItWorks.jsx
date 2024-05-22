// components/HowItWorks.jsx
import { useRouter } from "next/router";

export default function HowItWorks() {
    const router = useRouter();

    return (
        <div className="text-center w-full">
            <h2 className="font-heading text-left italic text-2xl sm:text-3xl lg:text-4xl text-light-font dark:text-light-ennies mb-5">
                How It Works
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <button
                    className="btn"
                    onClick={() => router.push('/search')}
                >
                    <h3 className="font-bold text-xl items-center ">Find Bennies</h3>
                    <p className="text-lg">
                        See what each NFT offers in terms of art license, utility, community, events, and more.
                    </p>
                </button>
                <button
                    className="btn"
                    onClick={() => router.push('/profile')}
                >
                    <h3 className="font-bold text-xl items-center">Onboard</h3>
                    <p className="text-lg">
                        Register your NFT to your profile to receive a welcome email and access community features.
                    </p>
                </button>
                <div className="bg-gradient-to-r from-light-quaternary to-light-tertiary dark:from-dark-tertiary dark:to-dark-secondary p-4 rounded-lg shadow-lg relative transform transition duration-300 hover:scale-105 hover:shadow-xl  group">
                    <h3 className="font-bold text-center text-xl mb-2">Earn</h3>
                    <p className="text-lg">
                        Add information, attest to the benefits offered, and review pieces to earn rewards.
                    </p>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-red-500 text-white px-4 py-2 rounded-full text-lg font-bold">
                            COMING SOON
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
