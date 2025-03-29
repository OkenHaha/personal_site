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
                    <p>I have a passion for coding and believe that technology and science, coupled with human creativity, can transform the world. My journey in coding began in 2014, and since then I've explored various domains across computer science, starting with web development, diving into cybersecurity, mastering Linux, and understanding the depths of the internet's architecture.</p>
                    <p>Now, I'm focused on the field of AI, particularly drawn to the concept of <span className="highlight">Artificial General Intelligence (AGI)</span>. I believe that aligning AI intelligence with human values and ethics will bring about meaningful advancement for humanity. Beyond my technical pursuits, I maintain a balanced life through activities that challenge both mind and body. Whether it's solving Rubik's cubes to sharpen my problem-solving skills, engaging in strategic games like chess, or playing basketball to stay active, I believe in continuous growth across different dimensions. I also find creative expression through journaling and poetry, which helps me approach technical challenges with a fresh perspective and innovative mindset.</p>
                    <p>This combination of technical expertise and diverse interests allows me to bring a unique, well-rounded approach to my work in AI and software development, always striving to create solutions that are not just technically sound but also thoughtfully designed with human factors in mind.</p>
                </div>
            </div>
        </section>
    );
}

export default About;