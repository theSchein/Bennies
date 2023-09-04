// make a signin page using next-auth and nextjs
import AuthForm from "@/components/auth/auth-form";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";


export default function SignInPage() {

    
    return (
        <>
        <AuthForm />
        </>
    );
    };


