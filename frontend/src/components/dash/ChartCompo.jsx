import React, { useEffect, useRef, useState } from "react";
import Chart from "react-apexcharts";

const ChartCompo = ({ color }) => {
  const [options, setoptions] = useState({
    chart: {
      toolbar: {
        show: false, // Hide chart toolbar
      },
      animations: {
        enabled: true,
        dynamicAnimation: {
          speed: 500, // Set the speed of the animation
        },
      },
    },
    offsetY: 0,
    offsetX: 0,
    padding: 0,
    margin: 0,
    grid: {
      show: false, // Hide grid lines
    },
    xaxis: {
      labels: {
        show: false, // Hide x-axis labels
      },
    },
    yaxis: {
      labels: {
        show: false, // Hide y-axis labels
      },
    },
    dataLabels: {
      enabled: false, // Disable data labels on points
    },
    tooltip: {
      enabled: false, // Disable tooltip on hover
    },
    fill: {
      // colors: ["#FF69B4"], // Set pink color for the area
      colors: [color || "#FF69B4"], // Set pink color for the area
    },
    markers: {
      size: 0, // Set marker size to 0 to hide points
    },
    stroke: {
      curve: "smooth",
    },
    // colors: ["#FF69B4"],
    colors: [color || "#FF69B4"],
  });
  const [series, setseries] = useState([
    {
      name: "Sample Series",
      // data: [20, 21, 22, 24 , 25],
      data: [31, 40, 38, 51],
    },
  ]);


  const handleHover = () => {
    // Update options for hover animation
   
  };

  const handleMouseLeave = () => {
    // Reset options to default after hover
  
  };


  return (
    <div className="chart m-0 p-0 h-full w-full hover:scale-125 transition-all duration-300 ease-linear" onMouseEnter={handleHover}
    onMouseLeave={handleMouseLeave}>
      <Chart
        options={options}
        series={series}
        type="area"
        width="100%"
        height="100%"
      />
    </div>
  );
};

export default ChartCompo;
