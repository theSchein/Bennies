import Link from "next/link";
import Search from "../components/Search";
import ResponsiveAppBar from "../components/navbar/navbar";

export default function Home() {
    return (
        <>
        <ResponsiveAppBar/>
            <h1 className="bg-primary text-quaternary font-heading text-4xl">{"Ben's cute lil app"}</h1>
            <Link href="/signin">Login</Link>

            <div> Search</div>

            <Search />

            <h2>About</h2>
            <p>   
                {"This is a cute lil app that I made, the goal is for this repo to mature into the IMbD of NFTs"}
            </p>

            <h2>{"Things that work"}</h2>
            <p> {"- Authentication"}</p>
            <p>{" - Connecting your wallet and collecting nft data"}</p>
            <p>{" - Creating an artist page (if you deployed an nft)"}</p>
            <p>{" - NFT pages"}</p>

            <h2>{"Things that don't work"}</h2>
            <p>{" - The UI is nonexistant (clearly)"}</p>
            <p>{" - No real links to artist pages/nft pages"}</p>
            <p>{" - No fuzzy search functionality"}</p>
            <p>{" - everything else.... "}</p>
        </>
    );
}
