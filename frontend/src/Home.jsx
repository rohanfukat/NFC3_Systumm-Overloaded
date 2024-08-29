import React from 'react';
import './Home.css';
import './Navbar';

function Home() {
    return (
        
        <div className="home-container">
            <header className="hero-section">
                <div className="hero-content">
                    <h1>Welcome to the Digital Ration System</h1>
                    <p>Enhancing the efficiency, transparency, and security of the ration card system in urban slum areas.</p>
                </div>
                <div className="apply-form">
                    <h3>Start Using the System!</h3>
                    <form>
                        <input type="text" placeholder="Your Name" />
                        <input type="email" placeholder="Email Address" />
                        <input type="text" placeholder="Ration Card Number" />
                        <button type="submit">Apply Now</button>
                    </form>
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

            <footer className="footer">
                <p>© 2024 Digital Ration System. All rights reserved. Made by Group No 48</p>
            </footer>
        </div>
    );
}

export default Home;
