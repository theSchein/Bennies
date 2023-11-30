// pages/api/auth/[...nextauth].js
// This file is used to configure next-auth.

import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import db from "../../../lib/db";
import bcryptjs from "bcryptjs";

export default NextAuth({
    session: {
        jwt: true,
    },
    providers: [
        CredentialsProvider({
            // The name to display on the sign-in form (e.g. 'Sign in with...')
            name: "Credentials",
            credentials: {
                identifier: { label: "Username/email_address", type: "text" },
                password: { label: "Password", type: "password" },
            },

            async authorize(credentials) {
                const user = await db.oneOrNone(
                    "SELECT * FROM users WHERE username = $1 OR email_address = $1",
                    [credentials.identifier],
                );

                if (!user) {
                    throw new Error("No user found!");
                }
                const isValid = await bcryptjs.compare(
                    credentials.password,
                    user.password,
                );
                if (!isValid) {
                    throw new Error("Invalid Credentials!");
                    //return Promise.resolve(null);
                }

                return Promise.resolve(user);
            },
        }),
    ],
    callbacks: {
        jwt: ({ token, user }) => {
            // first time user logs in
            if (user) {
                token.user = user;
                token.user_id = user.user_id;
                token.username = user.username;
                token.email_address = user.email_address;
            }
            return token;
            //return {...token, ...user};
        },
        session: ({ session, token }) => {
            if (token) {
                session.user = token.user; // Add property to session, like an access_token
                session.username = token.username; // Use token here instead of user
                session.email_address = token.email_address; // Use token here
                session.user_id = token.user_id;
            }
            return session;
            // return {...session, ...token};
        },
    },
    pages: {
        signIn: "/signin",
        signOut: "/signout",
    },
});
