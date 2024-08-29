import React from 'react';
import { Link } from 'react-router-dom';
import './Signup.css';

const Signup = () => {
  const handleSignup = (event) => {
    event.preventDefault();
    // Handle signup logic here
  };

  return (
    <div className="signup-container">
      <h2 className="signup-heading">Signup</h2>
      <form onSubmit={handleSignup} className="signup-form">
        <div className="input-group-name">
          <label className="label-name" htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            className="input-name"
            placeholder="Enter your Name"
            required
          />
        </div>
        <div className="input-group-email">
          <label className="label-email" htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            className="input-email"
            placeholder="Enter your Email"
            required
          />
        </div>
        <div className="input-group-password">
          <label className="label-password" htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            className="input-password"
            placeholder="Enter your Password"
            required
          />
        </div>
        <div className="input-group-confirm-password">
          <label className="label-confirm-password" htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            className="input-confirm-password"
            placeholder="Confirm your Password"
            required
          />
        </div>
        <button type="submit" className="signup-button">Signup</button>
      </form>
      <div className="login-redirect-container">
        <p className="login-redirect-text">Already have an account?</p>
        <Link to="/" className="login-redirect-link">Login</Link>
      </div>
    </div>
  );
};

export default Signup;
