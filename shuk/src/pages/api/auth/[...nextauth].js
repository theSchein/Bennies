import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import db from "../../../lib/db";
import bcryptjs from "bcryptjs";

export default NextAuth({
    providers: [
        CredentialsProvider({
      // The name to display on the sign-in form (e.g. 'Sign in with...')
      name: 'Credentials',
      credentials: {
        identifier: { label: "Username/email_address", type: "text" },
        password: { label: "Password", type: "password" }
      },

            async authorize(credentials) {  

                const user = await db.oneOrNone('SELECT * FROM users WHERE username = $1 OR email_address = $1', [credentials.identifier]);

                if (!user) {
                    throw new Error("No user found!");
                }
                const isValid = await bcryptjs.compare(credentials.password, user.password);
                if (!isValid) {
                    throw new Error("Could not log you in!");
                    return Promise.resolve(null);
                } 
                
                console.log("login successful");
                  return Promise.resolve(user);

            }
        }),
    ],
    callbacks: {
        jwt:  ({ token, user }) => {
            // first time user logs in
            if(user) {
                token.id = user.id;
                token.username = user.username;
                token.email_address = user.email_address;
            }
            return token;
        },
        session:  ({ session, token }) => {
            if(token) {
                session.username = token.username;  // Use token here instead of user
                session.email_address = token.email_address;  // Use token here
                session.id = token.id;
            } 
            return session;
        },
    },
    secret: "test",
    jwt: {
        secret: "test",
        encryption: true,
    },
    pages: {
        signIn: "/signin",
        signOut: "/signout"
      },
});