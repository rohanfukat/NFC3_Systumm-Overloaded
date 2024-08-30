import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { PriceContext } from './PriceContext';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import './Dashboard.css';

const endpoint = "http://localhost:8000/data"; // Endpoint for fetching data

const Dashboard = () => {
  const { prices: contextPrices, setPrices } = useContext(PriceContext); // Use context to get and set prices
  const [orderedItems, setOrderedItems] = useState([]);

  const [data, setData] = useState(null); // State to store fetched data
  const [loading, setLoading] = useState(true); // Loading state
  const [userInfo, setUserInfo] = useState({
    color: '#fff', // Default color
    name: 'Unknown',
    rationcard: 'N/A',
    income: 'N/A',
  }); // State for user info

  // State for URL parameters
  const [urlParams, setUrlParams] = useState({
    rice: 0,
    wheat: 0,
    sugar: 0
  });

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

  // Use useEffect to extract URL parameters
  useEffect(() => {
    const extractDataFromUrl = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const rice = urlParams.get('rice') || 0;
      const wheat = urlParams.get('wheat') || 0;
      const sugar = urlParams.get('sugar') || 0;

      // Update ordered items based on URL parameters
      setOrderedItems([
        { name: 'Rice', quantity: parseInt(rice, 10) },
        { name: 'Wheat', quantity: parseInt(wheat, 10) },
        { name: 'Sugar', quantity: parseInt(sugar, 10) }
      ]);

      setUrlParams({
        rice: parseInt(rice, 10),
        wheat: parseInt(wheat, 10),
        sugar: parseInt(sugar, 10)
      });
    };

    extractDataFromUrl();
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

  // Prepare data for the pie chart
  const chartData = Object.entries(prices).map(([itemName, { quantity }]) => ({
    name: itemName,
    total: quantity,
    ordered: urlParams[itemName.toLowerCase()] || 0,
    remaining: quantity - (urlParams[itemName.toLowerCase()] || 0)
  }));

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
        <h3>Order Summary..-</h3>
        {chartData.map((data, index) => (
          <div key={index} className="chart-container">
            <h4>{data.name}</h4>
            <PieChart width={300} height={300}>
              <Pie
                data={[
                  { name: 'Ordered', value: data.ordered },
                  { name: 'Remaining', value: data.remaining }
                ]}
                dataKey="value"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                <Cell key="1" fill="#FF8042" />
                <Cell key="2" fill="#00C49F" />
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
        ))}
        <div className="available-items">
          <h3>Quantity Alloted By Government</h3>
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
    </div>
  );
};

export default Dashboard;
