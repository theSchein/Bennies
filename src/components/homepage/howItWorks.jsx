// components/HowItWorks.jsx
export default function HowItWorks() {
    return (
        <div className="text-center w-full">
            <h2 className="font-heading text-left italic text-2xl sm:text-3xl lg:text-4xl text-light-font dark:text-light-ennies mb-10">
                How It Works
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-gradient-to-r from-light-tertiary to-light-quaternary dark:from-dark-secondary dark:to-dark-tertiary p-4 rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-xl">
                    <h3 className="font-bold text-xl mb-2">Register</h3>
                    <p className="text-lg">
                        Sign up with an email and password, then register your NFTs with your wallet. <span className="italic">No KYC</span> 
                    </p>
                </div>
                <div className="bg-gradient-to-r from-light-tertiary to-light-quaternary dark:from-dark-secondary dark:to-dark-tertiary p-4 rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-xl">
                    <h3 className="font-bold text-xl mb-2">Explore</h3>
                    <p className="text-lg">
                        Explore the utility, perks, and events associated with your assets or any using the search feature.
                    </p>
                </div>
                <div className="bg-gradient-to-r from-light-quaternary to-light-tertiary dark:from-dark-tertiary dark:to-dark-secondary p-4 rounded-lg shadow-lg relative opacity-60 transform transition duration-300 hover:scale-105 hover:shadow-xl">
                    <h3 className="font-bold text-xl mb-2">Integrate</h3>
                    <p className="text-lg">
                        Engage with the communities behind your NFTs and stay updated on the latest news.
                    </p>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold">Coming Soon</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
