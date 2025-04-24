import React from 'react';
import { activitiesData } from '../data/activitiesData';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';


function Activities({ onOpenVideoModal }) { // Receive the handler prop
    return (
        <section id="activities" className="section">
            <div className="section-container">
                <div className="section-title">
                    <span className="section-number">05</span>
                    <h2>Activities & Engagements</h2>
                </div>
                <div className="activities-container">
                    {activitiesData.map((activity, index) => (
                        <div className="activity-card" key={index}>
                            <div className="activity-icon">
                                <FontAwesomeIcon icon={activity.iconClass} />
                            </div>
                            <div className="activity-content">
                                <h3>{activity.title}</h3>
                                <p dangerouslySetInnerHTML={{ __html: activity.description.replace(/\n/g, '<br />') }}></p> {/* Handle links/newlines in description */}
                                <span className="activity-date">{activity.date}</span>
                                {(activity.links || activity.hasVideo) && (
                                    <div className="activity-links">
                                        {activity.links?.map((link, lIndex) => (
                                            <a href={link.url} target="_blank" rel="noopener noreferrer" key={lIndex} title={link.text}>
                                                {link.type === 'github' && <FontAwesomeIcon icon={faGithub} />}
                                                {link.type === 'website' && <FontAwesomeIcon icon={faGlobe} />}
                                                {link.type === 'huggingface' && <img style={{ width: '18px', height: '18px', verticalAlign: 'middle' }} src="https://huggingface.co/front/assets/huggingface_logo-noborder.svg" alt="Hugging Face" /> }
                                                {' '}{link.text}
                                            </a>
                                        ))}
                                        {activity.hasVideo && (
                                            <button className="video-btn" onClick={onOpenVideoModal}>
                                                 Watch Review
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Activities;