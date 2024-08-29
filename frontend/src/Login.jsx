import React from 'react';
import './Login.css'

const LoginPage = () => {
  const handleLogin = (event) => {
    event.preventDefault();
    // Handle login logic here
  };

  const handleResetPassword = () => {
    // Redirect to reset password page or handle reset logic
  };

  const handleSignupRedirect = () => {
    // Redirect to signup page
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
