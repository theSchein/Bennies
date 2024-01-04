import React from "react";
import Image from "next/image";
import Link from "next/link";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";

const NftGrid = ({ nftData }) => {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid
                container
                spacing={{ xs: 2, md: 3 }}
                columns={{ xs: 4, sm: 8, md: 12 }}
            >
                {nftData.map((nft, index) => (
                    <Link
                        href={`/nft/${nft.nft_id}/${nft.nft_name}`}
                        passHref
                        legacyBehavior
                    >
                        <Grid xs={2} sm={4} md={4} key={index}>
                        {nft.media_url ? (
                            <Image
                                src={nft.media_url}
                                alt={nft.nft_name}
                                width={200}
                                height={200}
                            />
                        ) : (
                            <Image
                                src={fallbackImageUrl}
                                alt="Fallback Image"
                                width={200}
                                height={200}
                            />
                        )}
                            <p>{nft.nft_name}</p>
                        </Grid>
                    </Link>
                ))}
            </Grid>
        </Box>
    );
};

export default NftGrid;
