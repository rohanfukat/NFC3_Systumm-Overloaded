import React, { useEffect } from 'react';
import './Home.css';
import './Navbar';

function Home() {
    useEffect(() => {
        const aboutSection = document.querySelector('.about-section');
        const handleScroll = () => {
            const sectionTop = aboutSection.getBoundingClientRect().top;
            const sectionHeight = aboutSection.offsetHeight;
            const windowHeight = window.innerHeight;

            if (sectionTop < windowHeight && sectionTop + sectionHeight > 0) {
                // Element is in view
                aboutSection.classList.add('highlight');
            } else {
                // Element is out of view
                aboutSection.classList.remove('highlight');
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Call it initially in case the section is already in view

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="home-container">
            <header className="hero-section">
                <div className="hero-content">
                    <h1>Welcome to the Digital Ration System</h1>
                    <p>Enhancing the efficiency, transparency, and security of the ration card system in urban slum areas.</p>
                </div>
            </header>

            <section className="features-section" id="features">
                <h2>Our Features</h2>
                <div className="features">
                    <div className="feature">
                        <h3>User Authentication</h3>
                        <p>Secure login and registration process to ensure authorized access.</p>
                    </div>
                    <div className="feature">
                        <h3>Inventory Management</h3>
                        <p>Real-time tracking of stock levels to prevent shortages.</p>
                    </div>
                    <div className="feature">
                        <h3>Ordering System</h3>
                        <p>Streamlined ordering process for essential food supplies.</p>
                    </div>
                    <div className="feature">
                        <h3>Payment Gateway Integration</h3>
                        <p>Secure and seamless payment options for ease of transactions.</p>
                    </div>
                </div>
            </section>

            {/* Separator line */}
            <hr className="separator" />

            <section className="about-section" id="about">
                <h2>About Us</h2>
                <p>At Digital Ration System, our mission is to revolutionize the ration card system, making it more efficient, transparent, and secure. We aim to enhance the lives of individuals in urban slum areas by providing them with a reliable system for accessing essential supplies.</p>
                <p>We envision a future where technology bridges the gap between resources and those in need. By integrating cutting-edge technology into the ration distribution system, we strive to ensure that every individual has access to the support they require with the utmost transparency and efficiency.</p>
                <p>Our core values include integrity, innovation, empathy, and excellence. We are committed to delivering high-quality solutions and services to improve the quality of life for those we serve.</p>
            </section>

            <section className="contact-section" id="contact">
                <h2>Contact Us</h2>
                <form className="contact-form">
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input type="text" id="name" name="name" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="message">Message</label>
                        <textarea id="message" name="message" rows="4" required></textarea>
                    </div>
                    <button type="submit">Send Message</button>
                </form>
            </section>

            <footer className="footer">
                <p>© 2024 Digital Ration System. All rights reserved. Made by Group No 48</p>
            </footer>
        </div>
    );
}

export default Home;
