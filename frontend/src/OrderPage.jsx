import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './OrderPage.css'; // Import CSS for styling

// Import images
import sugarImg from './sugar.jpg';
import wheatImg from './wheat.jpg';
import riceImg from './rice.jpg';

// Import PriceContext
import { PriceContext } from './PriceContext'; // Adjust the import path if necessary

const OrderPage = () => {
  const { prices } = useContext(PriceContext); // Access the prices from context
  const [order, setOrder] = useState({
    sugar: 0,
    rice: 0,
    wheat: 0,
  });

  const navigate = useNavigate();

  // Handle quantity change for items
  const handleQuantityChange = (item, increment) => {
    setOrder((prevState) => ({
      ...prevState,
      [item]: Math.max(prevState[item] + increment, 0), // Prevent negative values
    }));
  };

  // Calculate total price for an item
  const getTotalPrice = (item) => {
    return order[item] * (prices[item] || 0); // Use price from context
  };

  // Handle order confirmation and navigate to payment gateway
  const handleConfirmOrder = () => {
    console.log('Order confirmed:', order);
    navigate('/payment-gateway', { state: { order } }); // Navigate to payment gateway with order details
  };

  return (
    <div className="order-page">
      <h1>Place Your Order</h1>
      <div className="cards-container">
        {/* Sugar Card */}
        <div className="order-card">
          <img src={sugarImg} alt="Sugar" className="product-image" />
          <h2>Sugar</h2>
          <p>Select Quantity (kg):</p>
          <div className="counter">
            <button onClick={() => handleQuantityChange('sugar', -1)}>-</button>
            <span>{order.sugar}</span>
            <button onClick={() => handleQuantityChange('sugar', 1)}>+</button>
          </div>
          <p className="item-total">Total: ₹{getTotalPrice('sugar')}</p>
        </div>

        {/* Rice Card */}
        <div className="order-card">
          <img src={riceImg} alt="Rice" className="product-image" />
          <h2>Rice</h2>
          <p>Select Quantity (kg):</p>
          <div className="counter">
            <button onClick={() => handleQuantityChange('rice', -1)}>-</button>
            <span>{order.rice}</span>
            <button onClick={() => handleQuantityChange('rice', 1)}>+</button>
          </div>
          <p className="item-total">Total: ₹{getTotalPrice('rice')}</p>
        </div>

        {/* Wheat Card */}
        <div className="order-card">
          <img src={wheatImg} alt="Wheat" className="product-image" />
          <h2>Wheat</h2>
          <p>Select Quantity (kg):</p>
          <div className="counter">
            <button onClick={() => handleQuantityChange('wheat', -1)}>-</button>
            <span>{order.wheat}</span>
            <button onClick={() => handleQuantityChange('wheat', 1)}>+</button>
          </div>
          <p className="item-total">Total: ₹{getTotalPrice('wheat')}</p>
        </div>
      </div>

      {/* Confirm Button */}
      <div className="confirm-button-container">
        <button className="confirm-button" onClick={handleConfirmOrder}>
          Confirm Order
        </button>
      </div>
    </div>
  );
};

export default OrderPage;
