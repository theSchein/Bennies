import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Profile } from "../components/Profile";
import WagmiWallet from "../components/WagmiWallet";

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
        <div className="min-h-screen bg-primary flex items-left justify-center py-6 px-4 sm:px-6 lg:px-8">
            <WagmiWallet>
                <div className="text-quaternary font-heading text-2xl mb-4">
                    Welcome, {session.username}
                </div>

                <Profile />
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
