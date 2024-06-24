// pages/profile.js

import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Profile } from "../components/Profile";
import WagmiWallet from "../components/WagmiWallet";
import RegisterNFTButton from "@/components/user_profile/registerNftButton";
import ProjectManagerButton from "@/components/user_profile/projectManagerButton";
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

    const handleNftsFetched = (nfts) => {
        console.log("Fetched NFTs:", nfts);
        // Handle the fetched NFTs here, e.g., trigger an onboarding email
    };

    return (
        <div className="min-h-screen bg-gradient-light dark:bg-gradient-dark flex flex-col items-center justify-center p-2">
            <WagmiWallet>
                <div className="max-w-6xl w-full bg-light-secondary dark:bg-dark-primary rounded-lg shadow-xl p-8">
                    <div className="border-b pb-4 mb-6 text-light-font dark:text-dark-quaternary">
                        <div className="flex justify-between items-center w-full mb-5">
                            <div className="flex items-center">
                                <h1 className="font-heading text-5xl">
                                    Welcome, {session.username}
                                </h1>
                            </div>
                            <div className="flex flex-col items-end">
                                <SignOutButton />
                                {!session.verified && (
                                    <ResendVerificationButton email={session.email_address} />
                                )}
                                {session.verified && (
                                    <div className="flex items-center gap-2 mt-2 text-green-600">
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
                            </div>
                        </div>
                        <p className="text-xl leading-relaxed pt-4">
                            You can connect your wallet and register your NFTs. Expect a welcome email from your owned projects explaining how to get more involved!
                        </p>
                        <RegisterNFTButton onNftsFetched={handleNftsFetched} />
                    </div>

                    {session.verified ? (
                        <>
                            <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-10">
                                <div className="flex-grow">
                                    <Profile />
                                </div>
                                <div className="bg-light-tertiary dark:bg-dark-tertiary p-4 rounded-lg shadow-lg w-full md:w-1/3">
                                    <ProjectManagerButton userId={session.user_id} />
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="text-red-500 bg-red-100 border border-red-400 rounded p-4 mt-4">
                            Please verify your email address before registering your assets.
                        </div>
                    )}

                    <div className="mb-10">
                        <h2 className="font-bold text-3xl mb-4">Upcoming Features</h2>
                        <ul className="list-disc pl-8 text-xl space-y-2">
                            <li>
                                Multichain support
                            </li>
                            <li>
                                Community management tools for your projects as a holder or creator.
                            </li>
                        </ul>
                    </div>
                </div>
            </WagmiWallet>
        </div>
    );
}

export default ProfilePage;
