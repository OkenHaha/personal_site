import React, { useState, useEffect } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import './App.css';

import Header from './components/Header';
import MobileMenu from './components/MobileMenu';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Activities from './components/Activities';
import Contact from './components/Contact';
import Footer from './components/Footer';
import VideoModal from './components/VideoModal'; // Import the modal

function App() {
    // Theme state
    const [theme, setTheme] = useLocalStorage('theme', 'light'); // Default to light

    // Mobile menu state
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Video Modal State
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

    // Effect to update body attribute for theme
    useEffect(() => {
        document.body.setAttribute('data-theme', theme);
    }, [theme]);

    // Effect to handle body scroll when mobile menu or modal is open
    useEffect(() => {
        if (isMobileMenuOpen || isVideoModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        // Cleanup function
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMobileMenuOpen, isVideoModalOpen]);


    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(prev => !prev);
    };

    const openVideoModal = () => setIsVideoModalOpen(true);
    const closeVideoModal = () => setIsVideoModalOpen(false);

    return (
        <> {/* Use Fragment */}
            <Header
                theme={theme}
                toggleTheme={toggleTheme}
                toggleMobileMenu={toggleMobileMenu}
            />
            <MobileMenu
                isOpen={isMobileMenuOpen}
                toggleMenu={toggleMobileMenu}
            />
            <main> {/* Wrap sections in main */}
                <Hero />
                <About />
                <Experience />
                <Projects />
                <Skills />
                <Activities onOpenVideoModal={openVideoModal} /> {/* Pass handler */}
                <Contact />
            </main>
            <Footer />
            <VideoModal
                isOpen={isVideoModalOpen}
                onClose={closeVideoModal}
            /> {/* Render modal */}
        </>
    );
}

export default App;