import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './Home';
import Login from './Login';
import Signup from './Signup';
import Dashboard from './Dashboard';
import OrderPage from './OrderPage';
import Navbar from './Navbar';
<<<<<<< Updated upstream
import RegistrationForm  from './Register';
import Inventory from './Inventory';
=======
import RegistrationForm from './Register';
>>>>>>> Stashed changes

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
<<<<<<< Updated upstream
        <Route path='/Navbar' element={<Navbar />} />
        <Route path='/Inventory' element={<Inventory />} />
=======
        <Route path="/navbar" element={<Navbar />} />
>>>>>>> Stashed changes
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/order" element={<OrderPage />} />
        <Route path="/register" element={<RegistrationForm />} />
      </Routes>
    </Router>
  );
}


export default App;
