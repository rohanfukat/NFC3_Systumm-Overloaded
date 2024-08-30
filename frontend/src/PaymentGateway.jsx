import React, { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PriceContext } from './PriceContext'; // Import the PriceContext
import './PaymentGateway.css';

const PaymentGateway = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  // Get the prices object from PriceContext
  const { prices } = useContext(PriceContext);

  const [paymentMethod, setPaymentMethod] = useState('');
  const [showProcessingCard, setShowProcessingCard] = useState(false);
  const [netBankingDetails, setNetBankingDetails] = useState({ bankName: '', accountNumber: '' });
  const [upiDetails, setUpiDetails] = useState({ upiId: '' });
  const [selectedCity, setSelectedCity] = useState('');
  const [randomAddress, setRandomAddress] = useState('');
  const [mode, setMode] = useState(''); // State for mode of buying

  if (!order) {
    return <div>No order data available. Please go back and place your order.</div>;
  }

  // Debugging output to check the values
  console.log('Order data:', order);
  console.log('Prices from context:', prices);

  // Ensure all values are numeric before calculating the total price
  const riceTotal = Number(order.rice) * (Number(prices.rice) || 0);
  const wheatTotal = Number(order.wheat) * (Number(prices.wheat) || 0);
  const sugarTotal = Number(order.sugar) * (Number(prices.sugar) || 0);
  const totalPrice = riceTotal + wheatTotal + sugarTotal;

  // Check if totalPrice is NaN
  if (isNaN(totalPrice)) {
    console.error('Total price is NaN. Check order data and prices from context.');
  }

  const addresses = {
    mumbai: [
      '123 Marine Drive, Mumbai',
      '456 Colaba Causeway, Mumbai',
      '789 Bandra West, Mumbai',
    ],
    'navi-mumbai': [
      '101 Vashi, Navi Mumbai',
      '202 CBD Belapur, Navi Mumbai',
      '303 Kharghar, Navi Mumbai',
    ],
    nasik: [
      '111 Mhasrul, Nasik',
      '222 Gangapur Road, Nasik',
      '333 Nashik Road, Nasik',
    ],
    pune: [
      '123 FC Road, Pune',
      '456 Viman Nagar, Pune',
      '789 Kothrud, Pune',
    ],
    nagpur: [
      '101 Sitabuldi, Nagpur',
      '202 Civil Lines, Nagpur',
      '303 Jaripatka, Nagpur',
    ],
  };

  const handlePaymentMethodChange = (e) => {
    const selectedMethod = e.target.value;
    setPaymentMethod(selectedMethod);

    // Show processing card for Net Banking or UPI
    if (selectedMethod === 'net-banking' || selectedMethod === 'upi') {
      setShowProcessingCard(true);
    } else {
      setShowProcessingCard(false);
    }
  };

  const handleNetBankingChange = (e) => {
    setNetBankingDetails({ ...netBankingDetails, [e.target.name]: e.target.value });
  };

  const handleUpiChange = (e) => {
    setUpiDetails({ ...upiDetails, [e.target.name]: e.target.value });
  };

  const handleCityChange = (e) => {
    const city = e.target.value;
    setSelectedCity(city);

    if (mode === 'pickup' && city) {
      // Get the addresses for the selected city
      const cityAddresses = addresses[city];
      if (cityAddresses) {
        // Select a random address
        const randomAddr = cityAddresses[Math.floor(Math.random() * cityAddresses.length)];
        setRandomAddress(randomAddr);
      }
    } else {
      setRandomAddress('');
    }
  };

  const handleModeChange = (e) => {
    const selectedMode = e.target.value;
    setMode(selectedMode);

    // Clear address if mode is not pickup
    if (selectedMode !== 'pickup') {
      setRandomAddress('');
    }
  };

  const handleSubmitPayment = () => {
    setShowProcessingCard(false);
  };

  const handleConfirmPayment = async () => {
    try {
      const data = new FormData();
      data.append('rice', order.rice);
      data.append('wheat', order.wheat);
      data.append('sugar', order.sugar);
      console.log(document.cookie);

      // Send data to the backend
      const response = await fetch('http://localhost:8000/process-payment', {
        method: 'POST',
        credentials: 'include',
        body: data,
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result);
        alert('Payment successful!');
        const params = new URLSearchParams(result).toString();
        window.location.href = `http://localhost:3000/inventory?${params}`;
        // navigate('/dashboard');
      } else {
        alert('Payment failed. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred during payment processing.');
    }
  };

  return (
    <div className={`payment-gateway ${showProcessingCard ? 'blur-background' : ''}`}>
      <div className="payment-card">
        <h2>Payment Gateway</h2>
        <p><strong>Order Summary:</strong></p>
        <ul>
          <li>Rice: {order.rice} kg</li>
          <li>Wheat: {order.wheat} kg</li>
          <li>Sugar: {order.sugar} kg</li>
        </ul>
        <p><strong>Total Price:</strong> ₹{totalPrice}</p>

        <div className="payment-methods">
          <h3>Select Payment Method:</h3>
          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="cash"
              checked={paymentMethod === 'cash'}
              onChange={handlePaymentMethodChange}
            />
            Cash
          </label>
          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="net-banking"
              checked={paymentMethod === 'net-banking'}
              onChange={handlePaymentMethodChange}
            />
            Net Banking
          </label>
          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="upi"
              checked={paymentMethod === 'upi'}
              onChange={handlePaymentMethodChange}
            />
            UPI
          </label>
        </div>

        {paymentMethod === 'cash' && <p>Please carry exact change.</p>}
        {paymentMethod === 'net-banking' && (
          <div className="net-banking-summary">
            <p><strong>Bank Name:</strong> {netBankingDetails.bankName}</p>
            <p><strong>Account Number:</strong> {netBankingDetails.accountNumber}</p>
          </div>
        )}
        {paymentMethod === 'upi' && (
          <div className="upi-summary">
            <p><strong>UPI ID:</strong> {upiDetails.upiId}</p>
          </div>
        )}

        <div className="payment-options">
          <h3>Select Mode of Buying:</h3>
          <label>
            <input
              type="radio"
              name="mode"
              value="pickup"
              checked={mode === 'pickup'}
              onChange={handleModeChange}
            />
            Pick-up
          </label>
          <label>
            <input
              type="radio"
              name="mode"
              value="delivery"
              checked={mode === 'delivery'}
              onChange={handleModeChange}
            />
            Delivery
          </label>
        </div>

        <div className="city-selection">
          <label htmlFor="city">Which city do you live in:</label>
          <select id="city" value={selectedCity} onChange={handleCityChange}>
            <option value="">Select a city</option>
            <option value="mumbai">Mumbai</option>
            <option value="navi-mumbai">Navi Mumbai</option>
            <option value="nasik">Nashik</option>
            <option value="pune">Pune</option>
            <option value="nagpur">Nagpur</option>
          </select>
          {mode === 'pickup' && randomAddress && (
            <p className="random-address">Ration Shop Address: {randomAddress}</p>
          )}
        </div>

        <button className="confirm-payment" onClick={handleConfirmPayment}>
          Confirm Payment
        </button>
      </div>

      {showProcessingCard && paymentMethod !== 'cash' && (
        <div className="processing-card">
          <h3>Processing Payment Information</h3>
          {paymentMethod === 'net-banking' && (
            <div className="net-banking-form">
              <label>
                Bank Name:
                <input
                  type="text"
                  name="bankName"
                  value={netBankingDetails.bankName}
                  onChange={handleNetBankingChange}
                />
              </label>
              <label>
                Account Number:
                <input
                  type="text"
                  name="accountNumber"
                  value={netBankingDetails.accountNumber}
                  onChange={handleNetBankingChange}
                />
              </label>
            </div>
          )}
          {paymentMethod === 'upi' && (
            <div className="upi-form">
              <label>
                UPI ID:
                <input
                  type="text"
                  name="upiId"
                  value={upiDetails.upiId}
                  onChange={handleUpiChange}
                />
              </label>
            </div>
          )}
          <button className="submit-payment" onClick={handleSubmitPayment}>
            Submit
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentGateway;
