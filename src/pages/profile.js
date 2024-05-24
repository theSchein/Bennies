// pages/profile.js
// This page displays the profile of the user, it is password protected and pulls their specific session data
// Features to be added in components and rendered here

import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Profile } from "../components/Profile";
import WagmiWallet from "../components/WagmiWallet";
import WalletNFTs from "@/components/user_profile/walletNfts";
import CreatorButton from "@/components/edit/creatorButton";
import SignOutButton from "@/components/auth/signOutButton";
import ResendVerificationButton from "@/components/user_profile/resendVerificationButton";

function ProfilePage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/signin");
        }
    }, [status, session, router]);

    if (status === "loading") {
        return <div>Loading...</div>;
    }

    if (status === "unauthenticated") {
        return null;
    }

    if (!session) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-light dark:bg-gradient-dark flex flex-col items-center justify-center p-2">
            <WagmiWallet>
                <div className="max-w-6xl w-full bg-light-secondary dark:bg-dark-primary rounded-lg shadow-xl p-8">
                    <div className="border-b pb-4 mb-6 text-light-font dark:text-dark-quaternary">
                        <div className="flex justify-between items-center w-full">
                            <h1 className="font-heading text-5xl">
                                Welcome, {session.username}
                            </h1>
                            <div>
                                <SignOutButton />
                                <div>
                                    {!session.verified && (
                                        <ResendVerificationButton
                                            email={session.email_address}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                        {session.verified && (
                            <div className="text-light-font dark:text-dark-quaternary flex items-center gap-2 mt-4">
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M5 13l4 4L19 7"
                                    ></path>
                                </svg>
                                Email verified
                            </div>
                        )}
                        <p className="text-xl leading-relaxed pt-4">
                            You can connect your wallet and register your NFTs. You can expect a welcome email
                            from your owned projects detailing how to get more involved. 
                        </p>
                        <div className="mb-10 mt-5 pt-4">
                            <h2 className="font-bold text-3xl mb-4">
                                Upcoming Features
                            </h2>
                            <ul className="list-disc pl-8 text-xl">
                                <li>
                                    Earn rewards for adding content, earn more rewards for adding content on the projects that you own.
                                </li>
                                <li>
                                    Community management tools for your projects as a holder or creator. 
                                </li>
                                <li>Memecoin and multichain support</li>
                            </ul>
                        </div>
                        {/* <WalletNFTs /> */}
                    </div>
                    {session.verified ? (
                        <Profile />
                    ) : (
                        <div className="text-red-500 bg-red-100 border border-red-400 rounded p-4 mt-4">
                            Please verify your email address before registering your
                            assets.
                        </div>
                    )}
                </div>
             </WagmiWallet>
        </div>
    );
}

export default ProfilePage;
