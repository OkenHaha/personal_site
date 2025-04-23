import React from 'react';
import { Outlet, Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faLinkedin, faXTwitter} from '@fortawesome/free-brands-svg-icons';

function MobileMenu({ isOpen, toggleMenu }) {
    const location = useLocation();
    const isMainPage = location.pathname === '/';

    const handleNavClick = (e, targetId) => {
        const href = e.currentTarget.getAttribute('href');
        if (href.startsWith('http') || href.includes('.html')) {
             toggleMenu();
            return;
        }

        e.preventDefault();
        toggleMenu();
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
                <b>X</b>
            </div>
            <div className="mobile-links">
                {isMainPage ? (
                    // Show these links only on the main page
                    <>
                        <a href="#about" onClick={(e) => handleNavClick(e, '#about')}>About</a>
                        <a href="#experience" onClick={(e) => handleNavClick(e, '#experience')}>Experience</a>
                        <a href="#projects" onClick={(e) => handleNavClick(e, '#projects')}>Projects</a>
                        <a href="#skills" onClick={(e) => handleNavClick(e, '#skills')}>Skills</a>
                    </>
                ) : (
                    // Show only Home link on other pages
                    <Link to="/" onClick={toggleMenu}>Home</Link>
                )}
                {/* These links are always visible */}
                <Link to="/certificates" onClick={toggleMenu}>Certifications</Link>
                <Link to="/blog" onClick={toggleMenu}>Blog</Link>
            </div>
            <div className="mobile-social">
                <a 
                    href="https://github.com/OkenHaha" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    aria-label="GitHub Profile"
                    onClick={toggleMenu}
                >
                    <FontAwesomeIcon icon={faGithub} />
                </a>
                <a 
                    href="https://www.linkedin.com/in/okenk" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    aria-label="LinkedIn Profile"
                    onClick={toggleMenu}
                >
                    <FontAwesomeIcon icon={faLinkedin} />
                </a>
                <a 
                    href="https://www.x.com/okenk19" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    aria-label="X Profile"
                    onClick={toggleMenu}
                >
                    <FontAwesomeIcon icon={faXTwitter} />
                </a>
            </div>
        </div>
    );
}

export default MobileMenu;