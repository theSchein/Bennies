export default function About() {
    return (
        <div className="min-h-screen bg-gradient-light dark:bg-gradient-dark flex flex-col items-center justify-center p-2">
            <div className="bg-light-secondary dark:bg-dark-secondary bg-opacity-90 py-10 px-4 sm:px-6 lg:px-8 rounded-xl shadow-2xl max-w-4xl mb-10 space-y-8 ">
                <div className="text-center">
                    <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl text-center leading-tight mb-6">
                        DISCOVRY.XYZ
                    </h1>
                    <p className="text-xl sm:text-2xl">
                        Finding out what your NFT does is hard. Discovry.xyz shows you the
                        utility and rights of each NFT and incentivizes active engagement
                        between the creators and owners.
                    </p>
                </div>
                
                <div>
                    <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl text-center leading-tight mb-4">
                        How it Works
                    </h2>
                    <div className="text-lg sm:text-xl space-y-4">
                        <div className="flex items-center">
                            <span className="font-bold mr-2">1.</span>
                            <p>Sign in and link a wallet to your profile; all your NFTs listed on the app will be here.</p>
                        </div>
                        <div className="flex items-center">
                            <span className="font-bold mr-2">2.</span>
                            <p>Click on an NFT to go to its page and see what utility it may have and what people are saying about it!</p>
                        </div>
                        <div className="flex items-center">
                            <span className="font-bold mr-2">3.</span>
                            <p>Go to the collection page to see upcoming events for the public or (just for holders).</p>
                        </div>
                        <div className="flex items-center">
                            <span className="font-bold mr-2">4.</span>
                            <p>If you are a creator or owner, you can add utility to your NFTs and engage with the community.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
