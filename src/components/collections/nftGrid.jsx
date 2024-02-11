import React from "react";
import Image from "next/image";
import Link from "next/link";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";

const NftGrid = ({ nftData, query }) => {

    return (
<Box sx={{ flexGrow: 1, padding: 2 }}>
    <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
        {nftData.map((nft, index) => (
            <Link key={nft.nft_id} href={`/nft/${nft.nft_id}/${nft.nft_name}`} passHref legacyBehavior>
                <Grid item xs={2} sm={4} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 2 }}>
                    <Box sx={{ width: '100%', height: 200, position: 'relative', marginBottom: 1 }}>
                        <Image
                            src={nft.media_url ? nft.media_url : fallbackImageUrl}
                            alt={nft.nft_name}
                            layout="fill"
                            objectFit="cover"
                        />
                    </Box>
                    <p style={{ textAlign: 'center', marginTop: 0 }}>{nft.nft_name}</p>
                </Grid>
            </Link>
        ))}
    </Grid>
</Box>
    );
};

export default NftGrid;
