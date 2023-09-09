// pages/nft/[...slug].js
import db from '../../lib/db';
import CommentSection from '../../components/comment/Comments';


export async function getServerSideProps({ params }) {
    const { slug } = params;
    // Fetch the NFT data based on the slug from your database/API
    const nft = await db.one('SELECT * FROM nfts WHERE nft_id = $1', [slug[0]]);

    console.log('slug:' + slug[1]);

    return { props: { nft } };
}


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






