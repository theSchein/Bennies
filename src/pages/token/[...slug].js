// pages/token/[...slug].js
// This file is used to display the token page.
// It grabs the token metadata by slug from the database.

import db from "../../lib/db";
import TokenDetails from "../../components/TokenDetails";

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

    try {
        let token = await db.one(tokenDataQuery, [slug[0]]);
        
        return { props: { token } };
    } catch (error) {
        console.error("Error fetching token data:", error);
        return { props: { error: "Token not found" } };
    }
}

export default function TokenPage({ token, error }) {
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
            <TokenDetails token={token} />
        </div>
    );
}
