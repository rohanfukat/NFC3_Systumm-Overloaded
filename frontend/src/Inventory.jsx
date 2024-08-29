import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const Inventory = () => {
  // Initial static inventory data
  const initialInventory = {
    rice: 1000,
    wheat: 500,
    sugar: 700,
  };

  // State to store ordered quantities fetched from the backend
  const [ordered, setOrdered] = useState({ rice: 0, wheat: 0, sugar: 0 });
  const [loading, setLoading] = useState(true); // Loading state to handle data fetching

  // Fetch ordered data from backend when component mounts
  useEffect(() => {
    fetchOrderedData();
  }, []);

  const fetchOrderedData = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/ordered'); // Adjust the endpoint as necessary
      if (response.ok) {
        const data = await response.json();
        setOrdered(data.ordered);
        console.log(data)
      } else {
        console.error('Failed to fetch ordered data');
      }
    } catch (error) {
      console.error('Error fetching ordered data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Prepare data for pie charts
  const prepareChartData = (item) => [
    { name: 'In Stock', value: initialInventory[item] - ordered[item] },
    { name: 'Ordered Out', value: ordered[item] },
  ];

  // Colors for the pie chart slices
  const COLORS = ['#0088FE', '#FFBB28'];

  if (loading) {
    return <div>Loading...</div>;
  }

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
        </div>
      </div>
    </div>
  );
};

export default Inventory;
