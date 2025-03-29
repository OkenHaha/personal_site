import React, { useEffect, useCallback } from 'react';

function VideoModal({ isOpen, onClose }) {
    const iframeSrc = "https://www.youtube.com/embed/XeGJ5-zma1E?si=aMSuHsCGCUDLeUvM&autoplay=1"; // Add autoplay=1

    // Memoize onClose to prevent unnecessary effect re-runs
    const handleClose = useCallback(() => {
        // Stop video by resetting src when closing
        const iframe = document.getElementById('youtubeVideo');
        if (iframe) {
            iframe.src = ''; // Clear src first
        }
        onClose();
    }, [onClose]);


    useEffect(() => {
        const handleEsc = (event) => {
            if (event.key === 'Escape') {
                handleClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
            // Reset iframe src when opening to ensure autoplay works if reopened
             const iframe = document.getElementById('youtubeVideo');
            if (iframe) {
                 iframe.src = iframeSrc;
            }
        } else {
             // Ensure src is cleared when not open
             const iframe = document.getElementById('youtubeVideo');
             if (iframe) {
                 iframe.src = '';
             }
        }

        // Cleanup function
        return () => {
            document.removeEventListener('keydown', handleEsc);
        };
    }, [isOpen, handleClose, iframeSrc]); // Add iframeSrc dependency

    if (!isOpen) {
        return null; // Don't render the modal if it's not open
    }

    return (
        <div id="videoModal" className={`modal1 ${isOpen ? 'show1' : ''}`} onClick={handleClose}> {/* Close on backdrop click */}
            {/* Stop propagation to prevent closing when clicking inside content */}
            <div className="modal-content1" onClick={(e) => e.stopPropagation()}>
                <span className="close-modal1" onClick={handleClose} role="button" aria-label="Close video player">×</span>
                <div className="video-container">
                    <iframe
                        id="youtubeVideo" // Add an ID
                        width="560"
                        height="315"
                        src={isOpen ? iframeSrc : ""} // Set src only when open
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen>
                    </iframe>
                </div>
            </div>
        </div>
    );
}

export default VideoModal;