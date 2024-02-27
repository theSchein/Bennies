export default function About() {
    return (
        <div className="min-h-screen bg-gradient-light dark:bg-gradient-dark flex flex-col items-center justify-center p-4 text-light-quaternary dark:text-dark-quaternary">
            <div className="bg-light-secondary dark:bg-dark-secondary bg-opacity-90 py-10 px-6 sm:px-10 lg:px-12 rounded-2xl shadow-xl max-w-4xl mb-10 space-y-8">
                <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl text-center leading-tight mb-8">
                    DISCOVRY.XYZ
                </h1>
                <p className="text-xl sm:text-2xl text-center">
                    Finding out what your NFT does is hard, and marketplaces only
                    show you how much they cost and not what to do with them.
                </p>
                <p className="text-xl sm:text-2xl text-center mt-4">
                    Discovry.xyz shows you not just what people think of your NFT,
                    but what you can do with it, whether it is rights over the image
                    artwork, access to events, membership to a club, and more!
                </p>

                <div className="mt-8">
                    <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl text-center mb-6">
                        How it Works
                    </h2>
                    <ul className="space-y-4 text-lg sm:text-xl">
                        <li>
                            1. Sign in and link a wallet to your profile; all your
                            NFTs listed on the app will be here.
                        </li>
                        <li>
                            2. Click on an NFT to go to its page and see what utility
                            it may have and what people are saying about it!
                        </li>
                        <li>
                            3. Go to the collection page to see upcoming events for
                            the public or (just for holders).
                        </li>
                        <li>
                            4. If you are an NFT creator or owner, you can add
                            utility to your NFTs and engage with the community.
                        </li>
                    </ul>
                </div>

                <div className="mt-8">
                    <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl text-center mb-6">
                        Upcoming Features
                    </h2>
                    <ul className="space-y-4 text-lg sm:text-xl">
                        <li>
                        <span className="font-bold">Improved Notifications:</span>  Soon NFT communities will be able
                            to notify all of their holders of new perks and upcoming
                            events.
                        </li>
                        <li>
                        <span className="font-bold">More Data More Chains:</span> We will have not just ETH NFTs but
                            also support L2s like polygon, base as well as other
                            layer 1&apos;s like Solana.
                        </li>
                        <li>
                        <span className="font-bold">Profiles:</span>  Integration with platforms like Farcaster and
                            Lens to bring more value to your profiles and NFT
                            reviews.
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
