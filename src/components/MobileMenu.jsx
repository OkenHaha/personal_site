import React from 'react';

function MobileMenu({ isOpen, toggleMenu }) {
    // Smooth scroll handler - duplicated from Header for simplicity here
    // In a larger app, make this a shared utility or use a library
    const handleNavClick = (e, targetId) => {
        const href = e.currentTarget.getAttribute('href');
        if (href.startsWith('http') || href.includes('.html')) {
             toggleMenu(); // Close menu for external links too
            return;
        }

        e.preventDefault();
        toggleMenu(); // Close menu on click
        const targetElement = document.getElementById(targetId.substring(1));
        if (targetElement) {
            const headerOffset = 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    };

    return (
        <div className={`mobile-menu ${isOpen ? 'active' : ''}`}>
            <div className="close-menu" onClick={toggleMenu} role="button" aria-label="Close menu">
                <i className="fas fa-times"></i>
            </div>
            <div className="mobile-links">
                <a href="#about" onClick={(e) => handleNavClick(e, '#about')}>About</a>
                <a href="#experience" onClick={(e) => handleNavClick(e, '#experience')}>Experience</a>
                <a href="#projects" onClick={(e) => handleNavClick(e, '#projects')}>Projects</a>
                <a href="#skills" onClick={(e) => handleNavClick(e, '#skills')}>Skills</a>
                <a href="./certificate.html" onClick={(e) => handleNavClick(e, './certificate.html')} target="_blank" rel="noopener noreferrer">Certifications</a>
                <a href="https://medium.com/@keithellakpamoken" onClick={(e) => handleNavClick(e, 'https://medium.com/@keithellakpamoken')} target="_blank" rel="noopener noreferrer">Blog</a>
            </div>
            <div className="mobile-social">
                <a href="https://github.com/OkenHaha" target="_blank" rel="noopener noreferrer" aria-label="GitHub Profile"><i className="fab fa-github"></i></a>
                <a href="https://www.linkedin.com/in/okenk" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Profile"><i className="fab fa-linkedin"></i></a>
                <a href="https://www.x.com/okenk19" target="_blank" rel="noopener noreferrer" aria-label="X Profile"><i className="fab fa-square-x-twitter"></i></a>
            </div>
        </div>
    );
}

export default MobileMenu;