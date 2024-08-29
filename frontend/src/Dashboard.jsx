import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [orderedItems, setOrderedItems] = useState([
    { name: 'Rice', quantity: 5 } // Example of rice ordered
  ]);

  const availableItems = [
    { name: 'Rice', price: 3, maxQuantity: 15 },
    { name: 'Wheat', price: 5, maxQuantity: 10 },
    { name: 'Sugar', price: 6, maxQuantity: 5 },
  ];

  // Calculate total available quantity
  const calculateAvailableQuantity = (itemName) => {
    const orderedItem = orderedItems.find(item => item.name === itemName);
    const availableItem = availableItems.find(item => item.name === itemName);
    return availableItem ? Math.max(availableItem.maxQuantity - (orderedItem ? orderedItem.quantity : 0), 0) : 0;
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-heading">Dashboard</h1>
      <div className="info-card">
        <h2>User Information</h2>
        <p><strong>Name:</strong> John Doe</p>
        <p><strong>Ration Card Number:</strong> ABC123456</p>
        <p><strong>Number of Family Members:</strong> 4</p>
        <p><strong>Family Income:</strong> ₹50,000</p>
      </div>
      <Link to="/order" className="order-button">Order Now</Link>
      <div className="order-summary">
        <div className="ordered-items">
          <h3>Ordered Items</h3>
          <ul>
            {orderedItems.length > 0 ? (
              orderedItems.map((item, index) => (
                <li key={index}>{item.name} - {item.quantity} kg</li>
              ))
            ) : (
              <li>No items ordered yet</li>
            )}
          </ul>
        </div>
        <div className="in-your-cart">
          <h3>In Your Cart</h3>
          <ul>
            {orderedItems.length > 0 ? (
              orderedItems.map((item, index) => (
                <li key={index}>{item.name} - {item.quantity} kg</li>
              ))
            ) : (
              <li>No items in your cart</li>
            )}
          </ul>
        </div>
      </div>
      <div className="available-items">
        <h3>Available Quantity</h3>
        <ul>
          {availableItems.map(item => (
            <li key={item.name}>
              {item.name} - Price: ₹{item.price} per kg
              <br />
              Available Quantity: {calculateAvailableQuantity(item.name)} kg
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
