// pages/artist/[...slug].js
import db from '../../lib/db';

export async function getServerSideProps({ params }) {
  const { slug } = params;
  // Fetch the Artist data based on the slug from your database/API
  const artist = await db.one('SELECT * FROM artists WHERE artist_id = $1', [slug[0]]);

  return { props: { artist } };
}

function ArtistPage({ artist }) {


  return (
    <div>
      <h1>{artist.artist_name}</h1>
      <img src={artist.artist_picture} alt={artist.name} />
      <p>{artist.artist_bio}</p>
      <p>{artist.artist_sales_link}</p>
      <p>{artist.artist_media_link}</p>
          </div>
  );
}

export default ArtistPage;