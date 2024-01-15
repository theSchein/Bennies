// pages/artist/[...slug].js
// This file is used to display the artist page.
// It grabs the artist metadata by slug from the database.

import db from "../../lib/db";
import Image from "next/image";
import Link from "next/link";
import fallbackImageUrl from "../../../public/placeholder.png";

export async function getServerSideProps({ params }) {
    const { slug } = params;
    // Fetch the Artist data based on the slug from your database/API
    const artist = await db.one("SELECT * FROM artists WHERE artist_id = $1", [
        slug[0],
    ]);

    return { props: { artist } };
}

function ArtistPage({ artist }) {
    const defaultWidth = 600; 
    const defaultHeight = 400; 

    // Check if the artist's image URL is valid
    const artistImage =
        artist.artist_picture && artist.artist_picture.startsWith("http")
            ? artist.artist_picture
            : fallbackImageUrl;

    return (
        <div className="min-h-screen bg-primary flex items-center justify-center py-6 px-4 sm:px-6 lg:px-8">
            <div className="bg-secondary p-6 rounded shadow-md space-y-4 w-full max-w-2xl">
                <h1 className="text-quaternary font-heading text-3xl mb-4">
                    {artist.artist_name}
                </h1>
                <Image
                    src={artistImage}
                    alt={artist.name}
                    width={defaultWidth}
                    height={defaultHeight}
                />
                <p className="text-quaternary font-body text-lg">
                    {artist.artist_bio}
                </p>
                <Link href={artist.artist_sales_link || "#"} legacyBehavior>
                    <a className="text-tertiary hover:underline">Sales Link</a>
                </Link>
                <Link href={artist.artist_media_link || "#"} legacyBehavior>
                    <a className="text-tertiary hover:underline">Media Link</a>
                    
                </Link>
            </div>
        </div>
    );
}

export default ArtistPage;
