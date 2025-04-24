import React from 'react';

function Footer() {
    const currentYear = new Date().getFullYear(); // Dynamic year

    return (
        <footer>
            <div className="footer-container">
                <p>Designed & Built by Oken Keithellakpam © {currentYear}</p>
                <p style={{fontSize: "10px"}}><i>P.S. Most of the code for the website was generated through Vibe Coding</i></p>
            </div>
        </footer>
    );
}

export default Footer;