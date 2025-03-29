import React from 'react';
import { skillsData } from '../data/skillsData'; // Adjust path

function Skills() {
    return (
        <section id="skills" className="section">
            <div className="section-container">
                <div className="section-title">
                    <span className="section-number">04</span>
                    <h2>Skills & Tools</h2>
                </div>
                <div className="skills-container">
                    {skillsData.map((category, index) => (
                        <div className="skills-category" key={index}>
                            <h3>{category.category}</h3>
                            <div className="skills-tags">
                                {category.tags.map((tag, tIndex) => (
                                    <span className="skill-tag" key={tIndex}>{tag}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Skills;