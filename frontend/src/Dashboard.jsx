import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { PriceContext } from './PriceContext'; 
import './Dashboard.css';

const endpoint = "http://localhost:8000/data"; // Endpoint for fetching data

const Dashboard = () => {
  const { prices: contextPrices, setPrices } = useContext(PriceContext); // Use context to get and set prices
  const [orderedItems, setOrderedItems] = useState([
    { name: 'Rice', quantity: 5 } // Example of rice ordered
  ]);
  const [data, setData] = useState(null); // State to store fetched data
  const [loading, setLoading] = useState(true); // Loading state
  const [userInfo, setUserInfo] = useState({
    color: '#fff', // Default color
    name: 'Unknown',
    rationcard: 'N/A',
    income: 'N/A',
  }); // State for user info

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

      // Log the result to check the data being fetched
      console.log('Fetched data:', result);

      // Update user info state based on fetched data
      setUserInfo({
        color: result.color || '#fff',
        name: result.name || 'Unknown',
        rationcard: result.rationcard || 'N/A',
        familyMembers: result.familyMembers || 'N/A',
        income: `₹${result.income}` || 'N/A',
      });

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
  }, []); // Empty dependency array ensures this runs only once on mount

  // Determine available items based on background color
  const determinePrices = () => {
    if (data?.color === 'yellow') {
      return {
        Rice: { price: 3, quantity: 7 * (data?.familyMembers || 1) },
        Wheat: { price: 2, quantity: 5 * (data?.familyMembers || 1) },
        Sugar: { price: 20, quantity: 3 * (data?.familyMembers || 1) }
      };
    } else if (data?.color === 'orange') {
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

  // Function to update the prices in the PriceContext
  const updatePricesInContext = (newPrices) => {
    setPrices((prevPrices) => ({
      ...prevPrices,
      rice: newPrices.Rice.price,
      wheat: newPrices.Wheat.price,
      sugar: newPrices.Sugar.price
    }));
  };

  const availableItems = [
    { name: 'Rice', price: 0, maxQuantity: 0 },
    { name: 'Wheat', price: 0, maxQuantity: 0 },
    { name: 'Sugar', price: 0, maxQuantity: 0 },
  ];

  const prices = determinePrices();

  // Update the context prices when the component mounts or data changes
  useEffect(() => {
    if (data) {
      updatePricesInContext(prices);
    }
  }, [data, prices]);

  if (loading) {
    return <div>Loading...</div>; // Show loading state while data is being fetched
  }

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-heading">Dashboard</h1>
      
      <div className="info-card" style={{ backgroundColor: userInfo.color }}>
        <h2>User Information</h2>
        <p><strong>Name:</strong> {userInfo.name}</p>
        <p><strong>Ration Card Number:</strong> {userInfo.rationcard}</p>
        <p><strong>Family Members:</strong> {userInfo.familyMembers}</p>
        <p><strong>Family Income:</strong> {userInfo.income}</p>
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
