// pages/profile.js
// This page displays the profile of the user, it is password protected and pulls their specific session data
// Features to be added in components and rendered here

import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Profile } from "../components/Profile";
import WagmiWallet from "../components/WagmiWallet";
import WalletNFTs from "@/components/user_profile/walletNfts";
import CreatorButton from "@/components/edit/creatorButton";

function ProfilePage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/signin");
        }
    }, [status, router]);

    if (status === "loading") {
        return <div>Loading...</div>;
    }

    if (!session) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-light dark:bg-gradient-dark flex flex-col items-center justify-center p-2 ">
            <WagmiWallet>
                <div className="max-w-6xl w-full bg-light-secondary dark:bg-dark-secondary rounded-lg shadow-xl p-8">
                    <div className="border-b pb-4 mb-6  text-light-quaternary dark:text-dark-quaternary">
                        <h1 className="font-heading text-5xl ">
                            Welcome, {session.username}
                        </h1>
                        <p className="text-xl leading-relaxed pt-4 ">
                            You can connect your wallet and if you have used it to
                            deploy any of the NFTs on our platform then you can
                            create your own artist page to showcase and discuss your
                            work. If you own any NFTs you can also comment on them 
                            and add more informatino about them.
                        </p>
                        <div className="mb-10 mt-5 pt-4">
                            <h2 className="font-bold text-3xl mb-4 ">
                                Upcoming Features
                            </h2>
                            <ul className="list-disc pl-8 text-xl">
                                <li>Likes and Dislikes on NFTs and comments</li>
                                <li>Notifications when others comment on your NFT or reply to you</li>
                                <li>Message holders of your NFTs for news, events, drops, or messages</li>
                            </ul>
                            <CreatorButton />
                        </div>
                        <WalletNFTs />
                    </div>

                    <Profile />
                </div>
            </WagmiWallet>
        </div>
    );
}

export async function getServerSideProps(context) {
    const session = await getSession({ req: context.req });

    if (!session) {
        return {
            redirect: {
                destination: "/signin",
                permanent: false,
            },
        };
    }

    return {
        props: { session },
    };
}

export default ProfilePage;
