import React from 'react';
import './AboutUs.css';  // Create this CSS file to style the About Us page
import Navbar from './Navbar'; // Import your Navbar component

function AboutUs() {
    return (
        <div className="about-container">
            <Navbar />

            <header className="about-header">
                <h1>About Us</h1>
                <p>Discover who we are and what we stand for</p>
            </header>

            <section className="about-info">
                <div className="about-text">
                    <h2>Our Mission</h2>
                    <p>
                        At Digital Ration System, our mission is to revolutionize the ration card system, making it more efficient, transparent, and secure. We aim to enhance the lives of individuals in urban slum areas by providing them with a reliable system for accessing essential supplies.
                    </p>
                </div>
                <div className="about-text">
                    <h2>Our Vision</h2>
                    <p>
                        We envision a future where technology bridges the gap between resources and those in need. By integrating cutting-edge technology into the ration distribution system, we strive to ensure that every individual has access to the support they require with the utmost transparency and efficiency.
                    </p>
                </div>
                <div className="about-text">
                    <h2>Our Values</h2>
                    <ul>
                        <li><strong>Integrity:</strong> We operate with transparency and honesty in everything we do.</li>
                        <li><strong>Innovation:</strong> We embrace new technologies and ideas to continuously improve our services.</li>
                        <li><strong>Empathy:</strong> We prioritize the needs and well-being of the communities we serve.</li>
                        <li><strong>Excellence:</strong> We are committed to delivering high-quality solutions and services.</li>
                    </ul>
                </div>
            </section>

            <section className="team-section">
                <h2>Meet the Team</h2>
                <div className="team-members">
                    <div className="team-member">
                        <img src="/path/to/image1.jpg" alt="Team Member 1" />
                        <h3>John Doe</h3>
                        <p>CEO & Founder</p>
                        <p>John is passionate about leveraging technology to create impactful solutions. With over 15 years of experience, he leads the team with vision and dedication.</p>
                    </div>
                    <div className="team-member">
                        <img src="/path/to/image2.jpg" alt="Team Member 2" />
                        <h3>Jane Smith</h3>
                        <p>CTO</p>
                        <p>Jane oversees the technology strategy and implementation, ensuring our systems are both innovative and reliable.</p>
                    </div>
                    <div className="team-member">
                        <img src="/path/to/image3.jpg" alt="Team Member 3" />
                        <h3>Emily Johnson</h3>
                        <p>COO</p>
                        <p>Emily manages the day-to-day operations, focusing on operational efficiency and process improvements.</p>
                    </div>
                </div>
            </section>

            <footer className="footer">
                <p>© 2024 Digital Ration System. All rights reserved. Made by Group No 48</p>
            </footer>
        </div>
    );
}

export default AboutUs;
