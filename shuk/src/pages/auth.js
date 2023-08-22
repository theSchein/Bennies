import { signIn, signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

export default function Home() {
    const { data: session, status } = useSession();
    console.log(session);
    const router = useRouter();
    return ( "successful login" );
    
    {session ? <button onClick={() => signOut()}>Sign out</button> : <button onClick={() => signIn()}>Sign in</button>}

}   