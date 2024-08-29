import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const endpoint = "http://localhost:8000/data"; // Endpoint for fetching data

const Dashboard = () => {
  const [orderedItems, setOrderedItems] = useState([
    { name: 'Rice', quantity: 5 } // Example of rice ordered
  ]);
  const [data, setData] = useState(null); // State to store fetched data
  const [loading, setLoading] = useState(true); // Loading state

  // Function to fetch data from the API
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
      setLoading(false);
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
      setLoading(false); // Stop loading on error
    }
  };

  // Use useEffect to fetch data on component mount
  useEffect(() => {
    fetchData(); // Initial data fetch

    // Optionally add cleanup if needed (not required in this case)
    return () => {
      // Cleanup code if needed
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  // Determine available items based on background color
  const determinePrices = () => {
    if (data?.incomeColor === 'yellow') {
      return {
        Rice: { price: 3, quantity: 7 * (data?.familyMembers || 1) },
        Wheat: { price: 2, quantity: 5 * (data?.familyMembers || 1) },
        Sugar: { price: 20, quantity: 3 * (data?.familyMembers || 1) }
      };
    } else if (data?.incomeColor === 'orange') {
      return {
        Rice: { price: 5, quantity: 3 * (data?.familyMembers || 1) },
        Wheat: { price: 3, quantity: 2 * (data?.familyMembers || 1) },
        Sugar: { price: 20, quantity: 2 * (data?.familyMembers || 1) }
      };
    } else {
      // Default values or handle other cases
      return availableItems.reduce((acc, item) => {
        acc[item.name] = { price: item.price, quantity: item.maxQuantity };
        return acc;
      }, {});
    }
  };

  const availableItems = [
    { name: 'Rice', price: 0, maxQuantity: 0 },
    { name: 'Wheat', price: 0, maxQuantity: 0 },
    { name: 'Sugar', price: 0, maxQuantity: 0 },
  ];

  const prices = determinePrices();

  if (loading) {
    return <div>Loading...</div>; // Show loading state while data is being fetched
  }

  // Use fetched data for user information
  const userInfo = {
    color: data?.incomeColor || '#fff', // Default color if not provided
    name: data?.fullName || 'Unknown',
    familyMembers: data?.familyMembers || 'N/A',
    income: data?.income || 'N/A',
    rationcard: data?.rationCardNumber || 'N/A'
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-heading">Dashboard</h1>
      
      <div className="info-card" style={{ backgroundColor: userInfo.color }}>
        <h2>User Information</h2>
        <p><strong>Name:</strong> {userInfo.name}</p>
        <p><strong>Ration Card Number:</strong> {userInfo.rationcard}</p>
        <p><strong>Number of Family Members:</strong> {userInfo.familyMembers}</p>
        <p><strong>Family Income:</strong> ₹{userInfo.income}</p>
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
          {Object.entries(prices).map(([itemName, { price, quantity }]) => (
            <li key={itemName}>
              {itemName} - Price: ₹{price} per kg
              <br />
              Available Quantity: {quantity} kg
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
