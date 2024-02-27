import React from "react";
import Likes from "../likes/likes";
import Image from "next/image";
import Link from "next/link";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import CommentIcon from "@mui/icons-material/Comment";
import {getImageSource} from "@/components/utils/getImageSource";
import fallbackImageUrl from "../../../public/placeholder.png";

const NftGrid = ({ nftData, query }) => {
    return (
        <Box sx={{ flexGrow: 1, padding: 2 }}>
            <Grid
                container
                spacing={{ xs: 2, md: 2 }}
                columns={{ xs: 4, sm: 8, md: 12 }}
            >
                {nftData.map((nft, index) => (
                    <Link
                        key={nft.nft_id}
                        href={`/nft/${nft.nft_id}/${nft.nft_name}`}
                        passHref
                        legacyBehavior
                    >
                        <Grid
                            item
                            xs={2}
                            sm={4}
                            md={3} // Adjust based on desired layout
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                p: { xs: 1, md: 2 }, // Adjust padding
                                m: 1, // Adjust margin
                            }}
                            className="transition duration-300 ease-in-out transform hover:scale-120 hover:shadow-lg rounded-lg"
                        >
                            <Box
                                sx={{
                                    width: "100%",
                                    pt: "125%", // Aspect ratio hack (height: 0, paddingBottom: percentage of width)
                                    position: "relative",
                                }}
                            >
                                <Image
                                    src={getImageSource(
                                        nft.media_url,
                                        fallbackImageUrl,
                                    )}
                                    alt={nft.nft_name}
                                    layout="fill"
                                    objectFit="contain"
                                />
                            </Box>
                            <div className="bg-light-primary dark:bg-dark-secondary rounded-md p-2 w-full text-center text-dark-quaternary font-bold">
                                <p className="mb-3">{nft.nft_name}</p>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center">
                                        <Likes nft_id={nft.nft_id} />
                                    </div>
                                    <div className="flex items-center">
                                        <CommentIcon className="mr-2" />
                                        <span>{nft.comment_count}</span>
                                    </div>
                                </div>
                            </div>
                        </Grid>
                    </Link>
                ))}
            </Grid>
        </Box>
    );
};

export default NftGrid;
