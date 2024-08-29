import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const Inventory = () => {
  // Initial inventory data
  const initialInventory = {
    rice: 1000,
    wheat: 500,
    sugar: 700,
  };

  // State to store inventory and ordered quantities
  const [inventory, setInventory] = useState(initialInventory);
  const [ordered, setOrdered] = useState({ rice: 0, wheat: 0, sugar: 0 });

  // Function to handle ordering of items
  const handleOrderChange = (item, amount) => {
    // Ensure the order amount does not exceed inventory
    const newOrdered = Math.max(0, ordered[item] + amount);
    const newInventory = inventory[item] - newOrdered;

    if (newInventory >= 0) {
      setOrdered((prevState) => ({ ...prevState, [item]: newOrdered }));
    }
  };

  // Prepare data for pie charts
  const prepareChartData = (item) => [
    { name: 'In Stock', value: inventory[item] - ordered[item] },
    { name: 'Ordered Out', value: ordered[item] },
  ];

  // Colors for the pie chart slices
  const COLORS = ['#0088FE', '#FFBB28'];

  return (
    <div>
      <h2>Inventory Management</h2>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        {/* Rice Pie Chart */}
        <div>
          <h3>Rice Inventory</h3>
          <PieChart width={300} height={300}>
            <Pie
              data={prepareChartData('rice')}
              dataKey="value"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {prepareChartData('rice').map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
          <div>
            <button onClick={() => handleOrderChange('rice', -10)}>-</button>
            <span>{ordered.rice} kg</span>
            <button onClick={() => handleOrderChange('rice', 10)}>+</button>
          </div>
        </div>

        {/* Wheat Pie Chart */}
        <div>
          <h3>Wheat Inventory</h3>
          <PieChart width={300} height={300}>
            <Pie
              data={prepareChartData('wheat')}
              dataKey="value"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#82ca9d"
              label
            >
              {prepareChartData('wheat').map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
          <div>
            <button onClick={() => handleOrderChange('wheat', -10)}>-</button>
            <span>{ordered.wheat} kg</span>
            <button onClick={() => handleOrderChange('wheat', 10)}>+</button>
          </div>
        </div>

        {/* Sugar Pie Chart */}
        <div>
          <h3>Sugar Inventory</h3>
          <PieChart width={300} height={300}>
            <Pie
              data={prepareChartData('sugar')}
              dataKey="value"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#ffc658"
              label
            >
              {prepareChartData('sugar').map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
          <div>
            <button onClick={() => handleOrderChange('sugar', -10)}>-</button>
            <span>{ordered.sugar} kg</span>
            <button onClick={() => handleOrderChange('sugar', 10)}>+</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
