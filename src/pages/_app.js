import { SessionProvider } from "next-auth/react";
import Layout from "@/components/layout";
import "../styles/globals.css";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
    return (
        <Layout>
        <SessionProvider session={pageProps.session}>
            <Component {...pageProps} />
        </SessionProvider>
        </Layout>
    );
}

export default MyApp;
