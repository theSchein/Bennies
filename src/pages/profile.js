// pages/profile.js
// This page displays the profile of the user, it is password protected and pulls their specific session data
// Features to be added in components and rendered here

import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Profile } from "../components/Profile";
import WagmiWallet from "../components/WagmiWallet";
import WalletNFTs from "@/components/walletNfts";

function ProfilePage() {
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (!session) {
            router.push("/signin");
        }
    }, [session, router]);

    if (!session) {
        return <div>Loading...</div>; // or render a loading spinner
    }

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center py-6 px-4 sm:px-6 lg:px-8">
            <WagmiWallet>
                <div className="max-w-4xl w-full bg-white rounded-lg shadow-xl p-8">
                    <div className="border-b pb-4 mb-6">
                        <h1 className="font-heading text-4xl text-gray-800">
                            Welcome, {session.username}
                        </h1>
                        <p className="text-lg leading-relaxed pt-4">
                            {`On this profile page you can connect your wallet and if
                            you have used it to deploy any of the NFTs on our platorm
                            than you can create your own artist page to showcase and
                            discuss your work.`}
                        </p>
                        <div className="mb-5 pt-4">
                            <h2 className="font-bold text-2xl mb-4 text-tertiary">
                                {`Current Features`}
                            </h2>
                            <ul className="list-disc pl-6 text-lg">
                                <li>{`Comment on NFTs`}</li>
                                <li>{`Check eligibilty to create Artist Page`}</li>
                            </ul>
                        </div>
                        <div className="mb-10">
                            <h2 className="font-bold text-2xl mb-4 text-tertiary">
                                {`Upcoming Features`}
                            </h2>
                            <ul className="list-disc pl-8 text-lg">
                                <li>
                                    {`Favoriting NFTs that will show in your Profile`}
                                </li>
                                <li>{`Creating/updating an artist page`}</li>
                                <li>
                                    {`Notifications for comments to your work and
                                    replies to your comments`}
                                </li>
                                <li>{`Reach out if you have any ideas!!`}</li>
                            </ul>
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
