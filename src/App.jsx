import React, { useState, useEffect } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import './App.css';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';


import Footer from './components/Footer';
import Header from './components/Header';
import MobileMenu from './components/MobileMenu';
import VideoModal from './components/VideoModal'; 
import Home from './pages/Home';
import Certificates from './pages/Certificates'
import Blog from './pages/Blog'
import ScrollToTop from './components/ScrollToTop';
import NotFound from './pages/NotFound'

function Layout({ theme, toggleTheme, toggleMobileMenu, isOpen, toggleMenu, isVideoModalOpen, onClose }) {
  return (
    <>
      {/* Header is part of the layout */}
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        toggleMobileMenu={toggleMobileMenu}
      />

       <MobileMenu
            isOpen={isOpen}
            toggleMenu={toggleMenu}
        />
       {isVideoModalOpen && <VideoModal isOpen={isVideoModalOpen} onClose={onClose} />}

      <main> 
        <Outlet />
      </main>
      <Footer />
      <ScrollToTop /> 
    </>
  );
}


function App() {
    // State management remains here
    const [theme, setTheme] = useLocalStorage('theme', 'light');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

    // Effects remain here
    useEffect(() => {
        document.body.setAttribute('data-theme', theme);
    }, [theme]);

    useEffect(() => {
        if (isMobileMenuOpen || isVideoModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMobileMenuOpen, isVideoModalOpen]);

    // Toggle functions remain here
    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(prev => !prev);
    };

    const openVideoModal = () => setIsVideoModalOpen(true); // Need to pass this down if used in a page
    const closeVideoModal = () => setIsVideoModalOpen(false);


    return (
            <Routes>
                <Route
                    path="/"
                    element={
                        <Layout
                             theme={theme} // Pass props down to Layout
                             toggleTheme={toggleTheme}
                             toggleMobileMenu={toggleMobileMenu}
                             isOpen={isMobileMenuOpen}
                             toggleMenu={toggleMobileMenu} // Pass mobile menu state/toggles
                             isVideoModalOpen={isVideoModalOpen} // Pass modal state/toggles
                             onClose={closeVideoModal}
                        />
                    }
                >
                    
                    <Route index element={<Home />} />
                    
                    <Route path="certificates" element={<Certificates />} />
                    <Route path="Blog" element={<Blog />} />
                    <Route path="*" element={<NotFound />} />
                    
                </Route>
            </Routes>
    );
}

export default App;