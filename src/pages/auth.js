// pages/auth.js
// I do not think this is used anymore, needs review.

import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function Home() {
    const { data: session, status } = useSession();
    const router = useRouter();
    return "successful login";

    {
        session ? (
            <button onClick={() => signOut()}>Sign out</button>
        ) : (
            <button onClick={() => signIn()}>Sign in</button>
        );
    }
}
