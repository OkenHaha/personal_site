import React from 'react';

function Contact() {
    return (
        <section id="contact" className="section">
            <div className="section-container">
                <div className="section-title">
                    <span className="section-number">06</span>
                    <h2>Get In Touch</h2>
                </div>
                <div className="contact-content">
                    <p>I'm currently looking for new opportunities and am open to collaborations, especially in AI and machine learning projects.</p>
                    <a href="mailto:keithellakpamoken@gmail.com" className="btn primary-btn">
                        Say Hello <i className="fas fa-paper-plane"></i>
                    </a>
                    <div className="contact-socials">
                        <a href="https://github.com/OkenHaha" target="_blank" rel="noopener noreferrer" className="contact-social-icon" aria-label="GitHub Profile"><i className="fab fa-github"></i></a>
                        <a href="https://www.linkedin.com/in/okenk" target="_blank" rel="noopener noreferrer" className="contact-social-icon" aria-label="LinkedIn Profile"><i className="fab fa-linkedin"></i></a>
                        <a href="https://www.x.com/okenk19" target="_blank" rel="noopener noreferrer" className="contact-social-icon" aria-label="X Profile"><i className="fab fa-square-x-twitter"></i></a>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Contact;