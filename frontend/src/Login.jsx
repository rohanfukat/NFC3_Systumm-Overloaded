import React, { useState, useEffect } from 'react';
import './Login.css';

const endpoint = "http://localhost:8000/data"; // Endpoint for fetching data

const LoginPage = () => {
  // State to manage input values
  const [rationCardNumber, setRationCardNumber] = useState('');
  const [password, setPassword] = useState('');
  const [data, setData] = useState(null); // State to store fetched data

  // Function to fetch data and update the content
  const fetchData = async () => {
    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      setData(result); // Update state with fetched data
      console.log(result)
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
    }
  };

  // Function to handle URL changes
  const handleUrlChange = () => {
    fetchData(); // Fetch data for the fixed URL endpoint
  };

  // Use useEffect to manage side effects
  useEffect(() => {
    // Add event listeners
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);

    // Initial data fetch
    fetchData();

    // Clean up event listeners on component unmount
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    // Create a FormData object with login credentials
    const loginData = new FormData();
    loginData.append("rationCardNumber", rationCardNumber);
    loginData.append("password", password);
    console.log(loginData);

    try {
      // Send POST request to the backend API
      const response = await fetch('http://127.0.0.1:8000/login', { 
        method: 'POST',
        body: loginData
      });

      if (response.ok) {
        const data = await response.json(); // Assuming the backend sends a JSON response

        // Handle successful login (e.g., set cookies, redirect, etc.)
        alert('Login successful!');
        const expireDate = new Date();
        expireDate.setTime(expireDate.getTime() + (7 * 24 * 60 * 60 * 1000)); // 7 days from now
        const expires = "expires=" + expireDate.toUTCString();
        document.cookie = "id=" + data["id"] + "; " + expires + "; path=/";
      } else {
        // Handle login failure
        const errorData = await response.json(); // Fetch error message from response
        alert(`Login failed: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Error logging in. Please try again.',error);
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
      <div id="content">
        {/* Render fetched data here */}
        {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : 'Loading data...'}
      </div>
    </div>
  );
};

export default LoginPage;
