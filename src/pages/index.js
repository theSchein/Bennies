//import Search from "../components/Search";

import SearchContainer from "@/components/search/SearchContainer";

export default function Home() {
    return (
        <div className="bg-primary text-quaternary min-h-screen font-body flex flex-col items-center justify-start py-8">
            <h1 className="font-heading text-4xl mb-6">{"DISCOVRY"}</h1>

            <div className="w-full max-w-2xl p-4 bg-primary rounded shadow-lg">
                <div className="text-center mb-6">
                    <div className="font-bold text-2xl mb-2">Search</div>
                    <SearchContainer />
                </div>

                <div className="mb-6">
                    <h2 className="font-bold text-xl mb-2">About</h2>
                    <p>
                        {
                            "This is a cute lil app that I made, the goal is for this repo to mature into the IMbD of NFTs"
                        }
                    </p>
                </div>

                <div className="mb-6">
                    <h2 className="font-bold text-xl mb-2">{"Things that work"}</h2>
                    <ul className="list-disc pl-5">
                        <li>{"Authentication"}</li>
                        <li>{"Connecting your wallet and collecting nft data"}</li>
                        <li>{"Creating an artist page (if you deployed an nft)"}</li>
                        <li>{"NFT pages"}</li>
                    </ul>
                </div>

                <div className="mb-6">
                    <h2 className="font-bold text-xl mb-2">{"Next Steps"}</h2>
                    <ul className="list-disc pl-5">
                        <li>{"Building a database of nfts"}</li>
                        <li>{"Better search functionilty"}</li>
                        <li>{"everything else.... "}</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
