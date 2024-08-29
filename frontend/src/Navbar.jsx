import React from 'react';
import './Navbar.css';

function Navbar() {
    return (
        <nav className="navbar">
            <div className="logo">Digital Ration</div>

            <ul className="nav-links">
                <li><a href="#features">Features</a></li>
                <li><a href="#about">About Us</a></li>
<<<<<<< Updated upstream
                <li><a href="/Inventory">Inventory</a></li>
=======
                <li><a href="#inventory">Inventory</a></li>
                <li><a href="#Dashboard">Dashboard</a></li>
>>>>>>> Stashed changes
                <li><a href="#contact">Contact Us</a></li>



            </ul>

            <div className="nav-buttons">
                <a href="/login" className="login-btn">Log In</a>
                <a href="/Register" className="apply-btn">Sign Up</a>
            </div>
        </nav>
    );
}

export default Navbar;
