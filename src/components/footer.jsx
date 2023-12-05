// components/footer.jsx
// Footer style component. There is no logic to actually handle anything here.
// The footer should be revisted and updated to be more useful.

import React from 'react';
import Link from 'next/link'

function Footer() {
    return (
<footer className="bg-teal-900 text-white py-8">
    <div className="container mx-auto px-4">

            <div className="footer-section text-center sm:text-left">
                <a href="pitchdeck.pdf" download="Discovry.pdf" className="text-blue-400 hover:text-blue-500 transition-colors duration-300 text-xl font-semibold mb-2">Download Pitchdeck</a>

                <p className="mb-4"></p>
            </div>
        </div>
</footer>
    );
}

export default Footer;

