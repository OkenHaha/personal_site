import React, { useState, useEffect } from 'react';
import './certificates.css';
import { certificateData } from '../data/certificateData';

const Certificates = () => {
    // State for modal
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');

    // Base URL for assets
    const asset_url = 'https://okenhaha.github.io/portfolio';

    // Function to handle modal open
    const openModal = (imgSrc) => {
        setSelectedImage(imgSrc);
        setModalOpen(true);
        document.body.style.overflow = 'hidden';
    };

    // Function to handle modal close
    const closeModal = () => {
        setModalOpen(false);
        document.body.style.overflow = '';
    };
     const getFilteredCertificates = () => {
        if (activeFilter === 'all') {
            return certificateData;
        }
        return certificateData.filter(cert => cert.category === activeFilter);
    };

    // Handle escape key press
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                closeModal();
            }
        };

        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, []);

    // Filter functionality
    const [activeFilter, setActiveFilter] = useState('all');

    const filterCertificates = (category) => {
        setActiveFilter(category);
    };

    return (
        <section className="certificates-section">
            <div className="container">
                <div className="section-title">
                    <span className="section-number">01</span>
                    <h2>Certificates & Achievements</h2>
                </div>

                <div className="filter-container">
                    <button 
                        className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
                        onClick={() => filterCertificates('all')}
                    >
                        All
                    </button>
                    <button 
                        className={`filter-btn ${activeFilter === 'udemy' ? 'active' : ''}`}
                        onClick={() => filterCertificates('udemy')}
                    >
                        Udemy
                    </button>
                    <button 
                        className={`filter-btn ${activeFilter === 'coursera' ? 'active' : ''}`}
                        onClick={() => filterCertificates('coursera')}
                    >
                        Coursera
                    </button>
                    <button 
                        className={`filter-btn ${activeFilter === 'amity' ? 'active' : ''}`}
                        onClick={() => filterCertificates('amity')}
                    >
                        Amity
                    </button>
                    <button 
                        className={`filter-btn ${activeFilter === 'icsi' ? 'active' : ''}`}
                        onClick={() => filterCertificates('icsi')}
                    >
                        ICSI
                    </button>
                    <button 
                        className={`filter-btn ${activeFilter === 'nielit' ? 'active' : ''}`}
                        onClick={() => filterCertificates('nielit')}
                    >
                        Nielit
                    </button>
                    <button 
                        className={`filter-btn ${activeFilter === 'sololearn' ? 'active' : ''}`}
                        onClick={() => filterCertificates('sololearn')}
                    >
                        Solo Learn
                    </button>
                    <button 
                        className={`filter-btn ${activeFilter === 'others' ? 'active' : ''}`}
                        onClick={() => filterCertificates('others')}
                    >
                        Others
                    </button>
                </div>

                <div className="certificates-grid">
                {getFilteredCertificates().map((certificate, index) => (
                    <div 
                        key={index}
                        className={`certificate-card ${certificate.category}`}
                    >
                        <span className={`certificate-badge badge-${certificate.badge.type}`}>
                            {certificate.badge.text}
                        </span>
                        <div 
                            className="certificate-img" 
                            onClick={() => openModal(`${asset_url}${certificate.image}`)}
                        >
                            <img 
                                src={`${asset_url}${certificate.image}`}
                                alt={certificate.alt}
                                loading="lazy"
                                onError={(e) => {
                                    e.target.src = `${asset_url}/assets/images/placeholder.jpg`;
                                }}
                            />
                            <div className="hover-overlay">
                                <i className="fas fa-search-plus"></i>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            </div>

            {/* Modal */}
            {modalOpen && (
                <div 
                    className={`modal ${modalOpen ? 'show' : ''}`}
                    onClick={(e) => e.target === e.currentTarget && closeModal()}
                >
                    <span className="close-modal" onClick={closeModal}>
                        <i className="fas fa-times"></i>
                    </span>
                    <img className="modal-content" src={selectedImage} alt="Certificate" />
                </div>
            )}
        </section>
    );
};

export default Certificates;