// pages/profile.js
// This page displays the profile of the user, it is password protected and pulls their specific session data
// Features to be added in components and rendered here

import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Profile } from "../components/Profile";
import WagmiWallet from "../components/WagmiWallet";
import WalletNFTs from "@/components/walletNfts";
import CreatorButton from "@/components/edit/creatorButton";
import Layout from "@/components/layout";

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
        <div className="min-h-screen bg-gradient-light dark:bg-gradient-dark flex flex-col items-center justify-center p-2">
            <WagmiWallet>
                <div className="max-w-6xl w-full bg-white rounded-lg shadow-xl p-8">
                    <div className="border-b pb-4 mb-6">
                        <h1 className="font-heading text-5xl text-light-quaternary dark:text-dark-quaternary">
                            Welcome, {session.username}
                        </h1>
                        <p className="text-xl leading-relaxed pt-4 text-light-quaternary dark:text-dark-quaternary">
                            You can connect your wallet and if you have used it to
                            deploy any of the NFTs on our platform then you can
                            create your own artist page to showcase and discuss your
                            work.
                        </p>
                        <div className="mb-5 pt-4">
                            <h2 className="font-body text-3xl mb-4 text-light-quaternary dark:text-dark-quaternary">
                            </h2>
                            <ul className="list-disc pl-6 text-xl text-light-quaternary dark:text-dark-quaternary">
                                <li>Comment on NFTs</li>
                                <li>Check eligibility to create Artist Page</li>
                            </ul>
                        </div>
                        <div className="mb-10">
                            <h2 className="font-bold text-3xl mb-4 text-light-quaternary dark:text-dark-quaternary">
                                Upcoming Features
                            </h2>
                            <ul className="list-disc pl-8 text-xl text-light-quaternary dark:text-dark-quaternary">
                                <li>
                                    Favoriting NFTs that will show in your Profile
                                </li>
                                <li>Creating/updating an artist page</li>
                                <li>
                                    Notifications for comments to your work and
                                    replies to your comments
                                </li>
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
