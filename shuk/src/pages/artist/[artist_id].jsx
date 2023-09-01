import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

function ArtistPage() {
  const router = useRouter();
  const [artistData, setArtistData] = useState(null);
  const { artist_id } = router.query; 

  useEffect(() => {
    if (!artist_id) return;

    async function fetchArtistData() {
      try {
        const response = await fetch(`/api/artist/fetchArtist?artist_id=${artist_id}`);
        const data = await response.json();

        if (data) {
          setArtistData(data);
        } else {
          console.error("Error retrieving artist data");
        }
      } catch (error) {
        console.error("There was an error fetching the artist's data", error);
      }
    }

    fetchArtistData();
  }, [artist_id]);

  console.log(artistData);

  if (!artistData) return <div>Loading...</div>;

  return (
    <div>
      <h1>{artistData.artist_name}</h1>
      <img src={artistData.artist_picture} alt={artistData.name} />
      <p>{artistData.artist_bio}</p>
      <p>{artistData.artist_sales_link}</p>
      <p>{artistData.artist_media_link}</p>
          </div>
  );
}

export default ArtistPage;