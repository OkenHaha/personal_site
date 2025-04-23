import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

function Header({ theme, toggleTheme, toggleMobileMenu }) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isHidden, setIsHidden] = useState(false);
    const [lastScrollTop, setLastScrollTop] = useState(0);
    const location = useLocation(); // Add this to track current route
    const isMainPage = location.pathname === '/';

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            if (scrollTop > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }

            if (scrollTop > lastScrollTop && scrollTop > 300) {
                setIsHidden(true);
            } else {
                setIsHidden(false);
            }

            setLastScrollTop(scrollTop <= 0 ? 0 : scrollTop);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [lastScrollTop]);

    const handleNavClick = (e, targetId) => {
        const href = e.currentTarget.getAttribute('href');
        if (href.startsWith('http') || href.includes('.html')) {
            return;
        }

        e.preventDefault();
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
        <>
        <header>
            <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`} style={{ top: isHidden ? '-100px' : '0' }}>
                <div className="logo">
                    <Link to="/">OK</Link>
                </div>
                <div className="nav-links">
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
                        <Link to="/">Home</Link>
                    )}
                    {/* These links are always visible */}
                    <Link to="/certificates">Certifications</Link>
                    <Link to="/blog">Blog</Link>
                </div>
                <div className="theme-toggle" onClick={toggleTheme} role="button" aria-label="Toggle theme">
                    {theme === 'dark' ? (
                      <FontAwesomeIcon icon={faSun}  />
                    ) : (
                      <FontAwesomeIcon icon={faMoon}  />
                    )}
                </div>
                <div className="mobile-menu-btn" onClick={toggleMobileMenu} role="button" aria-label="Open menu">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </nav>
        </header>
        </>
    );
}

export default Header;