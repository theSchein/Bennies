// pages/_app.js
// This file is used to wrap all pages in the app with the SessionProvider from next-auth/react.

import { SessionProvider } from "next-auth/react";
import Layout from "@/components/layout";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import "../styles/globals.css";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
    return (
        <SessionProvider session={pageProps.session}>
            <Layout>
                <Component {...pageProps} />
                <SpeedInsights/>
                <Analytics/>
            </Layout>
        </SessionProvider>
    );
}

export default MyApp;
