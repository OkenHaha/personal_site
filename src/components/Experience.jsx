import React from 'react';
import { experienceData } from '../data/experienceData'; // Adjust path

function Experience() {
    return (
        <section id="experience" className="section">
            <div className="section-container">
                <div className="section-title">
                    <span className="section-number">02</span>
                    <h2>Experience</h2>
                </div>
                <div className="timeline">
                    {experienceData.map((item, index) => (
                        <div className="timeline-item" key={index}> {/* Use index or a unique ID if available */}
                            <div className="timeline-dot"></div>
                            <div className="timeline-date">{item.date}</div>
                            <div className="timeline-content">
                                <h3>{item.title}</h3>
                                <h4>{item.location}</h4>
                                <ul>
                                    {item.points.map((point, pIndex) => (
                                        <li key={pIndex}>{point}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Experience;