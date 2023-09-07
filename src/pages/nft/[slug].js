// pages/nft/[slug].js
import db from '../../lib/db';
import CommentSection from '../../components/comment/Comments';

export default function NftPage({ nft }) {
    return (
        <div>
            <h1>{nft.nft_name}</h1>
            <p>Description: {nft.nft_description}</p>
            {/* Render other NFT details */}
            <CommentSection nft={nft} />
        </div>
    );
}

export async function getServerSideProps({ params }) {
    const { slug } = params;
    // Fetch the NFT data based on the slug from your database/API
    const nft = await db.one('SELECT * FROM nfts WHERE nft_name = $1', [slug]);
    return { props: { nft } };
}

