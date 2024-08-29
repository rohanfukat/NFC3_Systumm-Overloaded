import React from 'react';
import {useLocation, BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './Home';
import Login from './Login';
import Signup from './Signup';
import Dashboard from './Dashboard';
import OrderPage from './OrderPage';
import Navbar from './Navbar';
import Inventory from './Inventory';
import RegistrationForm from './Register';
import PaymentGateway from './PaymentGateway';


const AppContent = () => {
  const location = useLocation();

  // Check if the current route is '/payment-gateway'
  const hideNavbar = location.pathname === '/payment-gateway';

  return (
    <div>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/navbar" element={<Navbar />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/order" element={<OrderPage />} />
        <Route path="/payment-gateway" element={<PaymentGateway />} />
        <Route path="/register" element={<RegistrationForm />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}


export default App;
