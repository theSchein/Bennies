import db from "../../lib/db";
import TokenDetails from "../../components/token/TokenDetails";

export async function getServerSideProps({ params }) {
    const { slug } = params;
    const tokenDataQuery = `
    SELECT 
        token_id,
        token_name,
        token_symbol,
        logo_media,
        creation_date,
        contract_address,
        deployer_address,
        supply,
        decimals,
        token_utility,
        description,
        universe_id,
        category
    FROM public.tokens
    WHERE contract_address = $1
    `;

    const twitterDataQuery = `
    SELECT * FROM twitters
    WHERE contract_address = $1;
    `;

    try {
        let token = await db.one(tokenDataQuery, [slug[0]]);
        const twitterData = await db.oneOrNone(twitterDataQuery, [token.contract_address]);

        if (twitterData && twitterData.last_tweet_date) {
            twitterData.last_tweet_date = twitterData.last_tweet_date.toISOString();
        }

        return { props: { token, twitterData } };
    } catch (error) {
        console.error("Error fetching token data:", error);
        return { props: { error: "Token not found" } };
    }
}

export default function TokenPage({ token, twitterData, error }) {
    if (error) {
        return (
            <div className="text-center p-6 bg-light-primary dark:bg-dark-primary">
                <h1 className="text-4xl font-bold">Token not found</h1>
                <p className="text-lg mt-4">{error}</p>
            </div>
        );
    }

    return (
        <div
            className="bg-gradient-light dark:bg-gradient-dark text-light-font dark:text-dark-quaternary"
        >
            <TokenDetails token={token} twitterData={twitterData} />
        </div>
    );
}
