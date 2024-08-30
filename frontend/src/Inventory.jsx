import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
// import { useHistory } from 'react-router-dom'; // Assuming you're using react-router

const Inventory = () => {
  // Initial static inventory data
  const initialInventory = {
    rice: 100,
    wheat: 300,
    sugar: 200,
  };

  // State to store ordered quantities fetched from the URL parameters
  const [ordered, setOrdered] = useState({ rice: 0, wheat: 0, sugar: 0 });
  const [loading, setLoading] = useState(true); // Loading state to handle data fetching

  // const history = useHistory()
  // Fetch ordered data from URL parameters when the component mounts
  useEffect(() => {
    const fetchOrderedData = () => {
      const urlParams = new URLSearchParams(window.location.search);

      // Retrieve specific parameters and update the state
      const rice = parseInt(urlParams.get('rice'), 10) || 0;
      const wheat = parseInt(urlParams.get('wheat'), 10) || 0;
      const sugar = parseInt(urlParams.get('sugar'), 10) || 0;

      setOrdered({ rice, wheat, sugar });
      setLoading(false); // Set loading to false after fetching the data
    };

    fetchOrderedData();
  }, []);

  // const handleNavigateToDashboard = () => {
  //   const params = new URLSearchParams(ordered).toString();
  //   history.push(`/dashboard?${params}`);
  // };
  



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
