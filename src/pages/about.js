export default function About() {
    return (
        <div className="min-h-screen bg-gradient-light dark:bg-gradient-dark flex flex-col items-center justify-center p-4 text-light-font dark:text-dark-font">
            <div className="bg-light-secondary dark:bg-dark-secondary bg-opacity-90 py-10 px-6 sm:px-10 lg:px-12 rounded-2xl shadow-xl max-w-4xl mb-10 space-y-8">
                <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl text-center leading-tight mb-8">
                    Bennies
                </h1>
                <p className="text-xl sm:text-2xl text-center">
                    Finding out what your NFT does is hard, and I want to make it easy.
                    Marketplaces only show you how much they cost and not what can be done with them.
                    When a new holder buys an NFT they usually do not know much about the 
                    community that they just have joined. 
                </p>
                <p className="text-xl sm:text-2xl text-center mt-4">
                    Bennies shows you the benefits and utility of owning a given digital asset and help integrate you into your community of holders.  
                </p>

                <div className="mt-8">
                    <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl text-center mb-6">
                        How it (Currently) Works
                    </h2>
                    <ul className="space-y-4 text-lg sm:text-xl">
                        <li>
                            1. Type in an Ethereum address into the search bar and register, to find 
                            all NFTs associated with that address.
                        </li>
                        <li>
                            2. See what sort of perks and events the holder of each NFT has. 
                            Click on the NFT to go to its page and see and what people are saying about it!
                        </li>
                        <li>
                            3. Go to the collection page to see upcoming events for
                            the public or just for holders.
                        </li>
                    </ul>
                </div>

                <div className="mt-8">
                    <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl text-center mb-6">
                        Upcoming Features
                    </h2>
                    <ul className="space-y-4 text-lg sm:text-xl">
                        <li>
                        <span className="font-bold">Register you NFTs:</span>  Get a onboarding email from the NFT community that you just joined by becoming a holder, telling you all the new things that you can do with your digital asset.
	    </li>
                        <li>
                        <span className="font-bold">More Data More Chains:</span> We will have not just ETH ecosystem NFTs but
                            also support Bitcoin ordinals and Solana.
                        </li>
                        <li>
                        <span className="font-bold">Community Features:</span>  Bring community outreach to this app with features like email updates, memeber map, moderation, event calendar and more!
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
