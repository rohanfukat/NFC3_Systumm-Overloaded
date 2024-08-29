// PriceContext.js
import React, { createContext, useState } from 'react';

// Create a Context for the prices
const PriceContext = createContext();

// Create a Provider component
const PriceProvider = ({ children }) => {
  // State to store prices
  const [prices, setPrices] = useState({ rice: 0, wheat: 0, sugar: 0 });

  return (
    <PriceContext.Provider value={{ prices, setPrices }}>
      {children}
    </PriceContext.Provider>
  );
};

export { PriceContext, PriceProvider };
