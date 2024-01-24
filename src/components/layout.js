// components/layout.js
// This file is used to wrap all pages in the app with the Navbar and Footer components.

import { useRouter } from 'next/router';
import Navbar from './navbar/navbar';
import Footer from './footer/footer';

export default function Layout({ children }) {
    const router = useRouter();

    const noShow = router.pathname === '/profile'; 

    return (
        <>
            <Navbar />
            <main>{children}</main>
            {!noShow && <Footer />}
        </>
    );
}