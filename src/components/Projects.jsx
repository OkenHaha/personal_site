import React from 'react';
import { projectsData } from '../data/projectsData'; // Adjust path

function Projects() {
    return (
        <section id="projects" className="section">
            <div className="section-container">
                <div className="section-title">
                    <span className="section-number">03</span>
                    <h2>Featured Projects</h2>
                </div>
                <div className="projects-grid">
                    {projectsData.map((project, index) => (
                        <div className="project-card" key={index}> {/* Add unique key */}
                            {/* Use style prop for background image */}
                            <div className="project-image" style={{ backgroundImage: `url(${project.image})` }}>
                                <div className="project-overlay"></div>
                            </div>
                            <div className="project-content">
                                <h3>{project.title}</h3>
                                <p>{project.description}</p>
                                <div className="project-tech">
                                    {project.tech.map((tech, tIndex) => (
                                        <span key={tIndex}>{tech}</span>
                                    ))}
                                </div>
                                <div className="project-links">
                                    {project.links.github && (
                                        <a href={project.links.github} target="_blank" rel="noopener noreferrer" aria-label={`${project.title} GitHub Repository`}>
                                            <i className="fab fa-github"></i>
                                        </a>
                                    )}
                                    {project.links.live && (
                                         <a href={project.links.live} target="_blank" rel="noopener noreferrer" aria-label={`${project.title} Live Demo`}>
                                            <i className="fa fa-globe"></i>
                                        </a>
                                    )}
                                    {project.links.huggingface && (
                                         <a href={project.links.huggingface} target="_blank" rel="noopener noreferrer" aria-label={`${project.title} Hugging Face`}>
                                             {/* Use img tag for HF logo */}
                                             <img
                                                style={{ width: '24px', height: '24px', verticalAlign: 'middle' }} // Adjust size
                                                src="https://huggingface.co/front/assets/huggingface_logo-noborder.svg"
                                                alt="Hugging Face"
                                             />
                                         </a>
                                    )}
                                    {/* Add other link types if needed */}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="view-more-container">
                    <a
                       href="https://github.com/OkenHaha?tab=repositories&q=&type=source&language=&sort="
                       target="_blank"
                       rel="noopener noreferrer"
                       className="btn outline-btn"
                    >
                        View All Projects <i className="fas fa-arrow-right"></i>
                    </a>
                </div>
            </div>
        </section>
    );
}

export default Projects;