import React, { useState } from 'react';
import './Login.css';

const LoginPage = () => {
  // State to manage input values
  const [rationCardNumber, setRationCardNumber] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault();

    // Create a JSON object with login credentials
    const loginData = {
      rationCardNumber: rationCardNumber,
      password: password,
    };

    try {
      // Send POST request to the backend API
      const response = await fetch('http://localhost:8000/login', { // Replace with your backend URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      if (response.ok) {
        const data = await response.json(); // Assuming the backend sends a JSON response

        // Handle successful login (e.g., set cookies, redirect, etc.)
        alert('Login successful!');
        console.log('User data:', data);
        // Optionally, redirect to another page after login
        // window.location.href = '/dashboard';
      } else {
        // Handle login failure
        const errorData = await response.json(); // Fetch error message from response
        alert(`Login failed: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Error logging in. Please try again.');
    }
  };

  const handleResetPassword = () => {
    // Redirect to reset password page or handle reset logic
    window.location.href = '/reset-password'; // Replace with actual route
  };

  const handleSignupRedirect = () => {
    // Redirect to signup page
    window.location.href = '/signup'; // Replace with actual route
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="rationCardNumber">Ration Card Number:</label>
          <input
            type="text"
            id="rationCardNumber"
            name="rationCardNumber"
            placeholder="Enter your Ration Card Number"
            value={rationCardNumber}
            onChange={(e) => setRationCardNumber(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <div>
        <button onClick={handleResetPassword}>Reset Password</button>
        <button onClick={handleSignupRedirect}>Signup</button>
      </div>
    </div>
  );
};

export default LoginPage;
