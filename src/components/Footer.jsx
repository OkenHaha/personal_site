import React from 'react';

function Footer() {
    const currentYear = new Date().getFullYear(); // Dynamic year

    return (
        <footer>
            <div className="footer-container">
                <p>Designed & Built by Oken Keithellakpam</p>
                <p>© {currentYear}</p> {/* Use dynamic year */}
            </div>
        </footer>
    );
}

export default Footer;