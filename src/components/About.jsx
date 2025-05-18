import React from 'react';
// Import Intersection Observer hook if you add scroll animations later
// import { useInView } from 'react-intersection-observer';

function About() {
    // Example using react-intersection-observer (install it first: npm install react-intersection-observer)
    // const { ref, inView } = useInView({
    //     triggerOnce: true, // Only trigger once
    //     threshold: 0.1, // Trigger when 10% of the element is visible
    // });

    return (
        <section id="about" className="section">
            <div className="section-container">
                <div className="section-title">
                    <span className="section-number">01</span>
                    <h2>About Me</h2>
                </div>
                {/* Add ref={ref} and className={inView ? 'fade-in-up' : ''} if using observer */}
                {/* Define 'fade-in-up' animation in CSS */}
                <div className="about-content">
                     {/* Add animation classes/logic if desired */}
                    <p>I'm Oken, a self-taught developer and AI enthusiast with a passion for blending technology with human emotion. Since 2014, I've been on a journey of continuous learning, from building web applications to exploring the depths of Artificial General Intelligence.</p>
                    <p>My work is a reflection of my diverse interests—be it coding, writing poetry, or delving into the mysteries of the universe. Let's connect and create something meaningful together.</p>
                </div>
            </div>
        </section>
    );
}

export default About;