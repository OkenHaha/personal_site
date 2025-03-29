import React, { useState, useEffect } from 'react';

function Header({ theme, toggleTheme, toggleMobileMenu }) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isHidden, setIsHidden] = useState(false);
    const [lastScrollTop, setLastScrollTop] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            // Scrolled class logic
            if (scrollTop > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }

            // Hide/show navbar logic
            if (scrollTop > lastScrollTop && scrollTop > 300) { // Hide only after scrolling down a bit
                setIsHidden(true);
            } else {
                setIsHidden(false);
            }

            setLastScrollTop(scrollTop <= 0 ? 0 : scrollTop); // For Mobile or negative scrolling
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll); // Cleanup listener
        };
    }, [lastScrollTop]); // Rerun effect if lastScrollTop changes

    // Smooth scroll handler (if needed, CSS might suffice)
    const handleNavClick = (e, targetId) => {
        // Check if it's an external link or certificate link
        const href = e.currentTarget.getAttribute('href');
        if (href.startsWith('http') || href.includes('.html')) {
            return; // Allow default browser behavior
        }

        e.preventDefault();
        const targetElement = document.getElementById(targetId.substring(1)); // Remove #
        if (targetElement) {
             // Consider navbar height offset if CSS scroll-padding-top isn't enough
             const headerOffset = 80; // Adjust as needed
             const elementPosition = targetElement.getBoundingClientRect().top;
             const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

             window.scrollTo({
                 top: offsetPosition,
                 behavior: "smooth"
             });
        }
    };


    return (
        <header>
            <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`} style={{ top: isHidden ? '-100px' : '0' }}>
                <div className="logo">
                    {/* Use onClick for smooth scroll */}
                    <a href="#hero" onClick={(e) => handleNavClick(e, '#hero')}>OK</a>
                </div>
                <div className="nav-links">
                     {/* Use onClick for smooth scroll */}
                    <a href="#about" onClick={(e) => handleNavClick(e, '#about')}>About</a>
                    <a href="#experience" onClick={(e) => handleNavClick(e, '#experience')}>Experience</a>
                    <a href="#projects" onClick={(e) => handleNavClick(e, '#projects')}>Projects</a>
                    <a href="#skills" onClick={(e) => handleNavClick(e, '#skills')}>Skills</a>
                    {/* Keep target blank for external/other pages */}
                    <a href="./certificate.html" target="_blank" rel="noopener noreferrer">Certifications</a>
                    <a href="https://medium.com/@keithellakpamoken" target="_blank" rel="noopener noreferrer">Blog</a>
                </div>
                <div className="theme-toggle" onClick={toggleTheme} role="button" aria-label="Toggle theme">
                    <i className={`fas ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`}></i>
                </div>
                <div className="mobile-menu-btn" onClick={toggleMobileMenu} role="button" aria-label="Open menu">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </nav>
        </header>
    );
}

export default Header;