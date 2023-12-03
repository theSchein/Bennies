// components/footer.jsx
// Footer style component. There is no logic to actually handle anything here.
// The footer should be revisted and updated to be more useful.

import React from 'react';
import Link from 'next/link'

function Footer() {
    return (
<footer className="bg-teal-900 text-white py-8">
    <div className="container mx-auto px-4">
        <div className="footer-content flex flex-col sm:flex-row justify-between items-center">
            <div className="footer-section mb-4 sm:mb-0">
                <Link href="/team" legacyBehavior>
                    <a className="text-lg font-medium hover:text-gray-300 transition-colors duration-300">Our Team</a>
                </Link>
            </div>
            <div className="footer-section text-center sm:text-left">
                <h4 className="text-xl font-semibold mb-2">Resources</h4>
                <p className="mb-4">Download our pitch deck to get a detailed overview of our project.</p>
                <a href="pitchdeck.pdf" download="pitchdeck.pdf" className="text-blue-400 hover:text-blue-500 transition-colors duration-300">Download Pitch Deck</a>
            </div>
        </div>
    </div>
</footer>
    );
}

export default Footer;

