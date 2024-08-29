import React, { useState } from 'react';
import './OrderPage.css'; // Import CSS for styling

const OrderPage = () => {
  // State to track the quantity of each item
  const [order, setOrder] = useState({
    sugar: 0,
    rice: 0,
    wheat: 0,
  });

  // Function to handle quantity change
  const handleQuantityChange = (item, increment) => {
    setOrder((prevState) => ({
      ...prevState,
      [item]: Math.max(prevState[item] + increment, 0), // Prevents negative values
    }));
  };

  // Function to handle order confirmation
  const handleConfirmOrder = () => {
    console.log('Order confirmed:', order);
    alert('Order confirmed:\nSugar: ${order.sugar} kg\nRice: ${order.rice} kg\nWheat: ${order.wheat} kg');
    // Here you can send the order to the backend or perform further actions
  };

  return (
    <div className="order-page">
      <h1>Place Your Order</h1>
      <div className="cards-container">
        {/* Sugar Card */}
        <div className="order-card">
          <h2>Sugar</h2>
          <p>Select Quantity (kg):</p>
          <div className="counter">
            <button onClick={() => handleQuantityChange('sugar', -1)}>-</button>
            <span>{order.sugar}</span>
            <button onClick={() => handleQuantityChange('sugar', 1)}>+</button>
          </div>
        </div>

        {/* Rice Card */}
        <div className="order-card">
          <h2>Rice</h2>
          <p>Select Quantity (kg):</p>
          <div className="counter">
            <button onClick={() => handleQuantityChange('rice', -1)}>-</button>
            <span>{order.rice}</span>
            <button onClick={() => handleQuantityChange('rice', 1)}>+</button>
          </div>
        </div>

        {/* Wheat Card */}
        <div className="order-card">
          <h2>Wheat</h2>
          <p>Select Quantity (kg):</p>
          <div className="counter">
            <button onClick={() => handleQuantityChange('wheat', -1)}>-</button>
            <span>{order.wheat}</span>
            <button onClick={() => handleQuantityChange('wheat', 1)}>+</button>
          </div>
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