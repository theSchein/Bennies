// components/layout.js
// This file is used to wrap all pages in the app with the Navbar and Footer components.
// TODO: add some comditionals for the aggressive footer

import Footer from "./footer";

export default function Layout({ children }) {
    return (
        <>
            <main>{children}</main>
            <Footer />
        </>
    );
}
