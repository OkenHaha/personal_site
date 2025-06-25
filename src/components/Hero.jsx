import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faChevronDown} from '@fortawesome/free-solid-svg-icons';
import { faGithub, faLinkedin, faXTwitter} from '@fortawesome/free-brands-svg-icons';

function Hero() {
     // Smooth scroll handler
    const handleNavClick = (e, targetId) => {
        e.preventDefault();
        const targetElement = document.getElementById(targetId.substring(1));
        if (targetElement) {
            const headerOffset = 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
             window.scrollTo({ top: offsetPosition, behavior: "smooth" });
        }
    };

    return (
        <section id="hero" className="hero-section">
             {/* Use public folder path for profile picture */}
            <div className="hero-content">
                <div className="hero-text">
                    <h1>Hi, I'm <span className="highlight">Oken Keithellakpam</span></h1>
                    {/* Removed typing animation for now, add back if needed */}
                    <h2>AI Engineer & Full Stack Developer</h2>
                    <p>Specializing in machine learning, computer vision, and web development with a passion for AGI Safety.</p>
                    <div className="hero-cta">
                        <a href="#projects" className="btn primary-btn" onClick={(e) => handleNavClick(e, '#projects')}>View Projects</a>
                        {/* Ensure resume path is correct in public folder */}
                        <a
                           href="https://drive.google.com/file/d/1jZjN2ePRto7oOkjJkxJWugD81Zbbh8C8/view?usp=sharing"
                           target="_blank"
                           rel="noopener noreferrer"
                           className="btn secondary-btn"
                        >
                            Download Resume
                        </a>
                    </div>
                </div>
                <div className="hero-image">
                     {/* Set background image via style prop - ensure path is correct */}
                    <div className="profile-picture" style={{ backgroundImage: `url('/profile.jpg')` }}></div>
                    <div className="social-icons">
                        <a href="https://github.com/OkenHaha" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="GitHub Profile"><FontAwesomeIcon icon={faGithub} /></a>
                        <a href="https://www.linkedin.com/in/okenk" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="LinkedIn Profile"><FontAwesomeIcon icon={faLinkedin} /></a>
                        <a href="https://www.x.com/okenk19" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="X Profile"><FontAwesomeIcon icon={faXTwitter} /></a>
                        <a href="mailto:keithellakpamoken@gmail.com" className="social-icon" aria-label="Email Me"><FontAwesomeIcon icon={faEnvelope} /></a>
                    </div>
                </div>
            </div>
            <div className="scroll-indicator">
                <a href="#about" onClick={(e) => handleNavClick(e, '#about')} aria-label="Scroll to About section">
                    <div className="mouse">
                        <div className="wheel"></div>
                    </div>
                    <div>
                        <FontAwesomeIcon icon={faChevronDown} className="arrow-down" />
                    </div>
                </a>
            </div>
        </section>
    );
}

export default Hero;