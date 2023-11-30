// pages/_app.js
// This file is used to wrap all pages in the app with the SessionProvider from next-auth/react.

import { SessionProvider } from "next-auth/react";
import Layout from "@/components/layout";
import "../styles/globals.css";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
    return (
        <SessionProvider session={pageProps.session}>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </SessionProvider>
    );
}

export default MyApp;
