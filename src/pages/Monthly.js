import React from "react";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  LinearScale,
  ArcElement,
  DoughnutController,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  LinearScale,
  ArcElement,
  DoughnutController,
  Title,
  Tooltip,
  Legend,
);

function Monthly() {
  // Data for Monthly Line Chart
  const lineChartData = {
    labels: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`), // Days of the month
    datasets: [
      {
        label: "Active eSIM Usage",
        data: [
          120, 150, 180, 170, 160, 200, 210, 250, 270, 280, 300, 310, 320, 330,
          340, 350, 370, 380, 400, 410, 420, 430, 440, 450, 460, 470, 480, 490,
          500, 510,
        ],
        borderColor: "#007bff",
        backgroundColor: "rgba(0, 123, 255, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  // Data for Doughnut Chart
  const doughnutChartData = {
    labels: ["Package A", "Package B", "Package C", "Package D"],
    datasets: [
      {
        data: [30, 25, 20, 25], // Example package data
        backgroundColor: ["#007bff", "#6f42c1", "#ffc107", "#dc3545"],
      },
    ],
  };

  const Card = ({ icon, title, value }) => {
    return (
      <div
        className="flex flex-col items-center justify-center border shadow-md rounded-lg p-4 bg-white text-center"
        style={{ width: "200px", height: "120px" }}
      >
        <div className="text-3xl mb-2">{icon}</div>
        <div className="text-lg font-medium">{title}</div>
        <div className="text-2xl font-bold">{value}</div>
      </div>
    );
  };

  const doughnutChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "right",
        labels: {
          boxWidth: 20,
          padding: 15,
        },
      },
    },
  };

  return (
    <div>
      <div className="flex space-x-4 p-4 bg-gray-100">
        <Card
          icon={
            <span role="img" aria-label="users">
              👥
            </span>
          }
          title="Active Users"
          value={1998}
        />
        <Card
          icon={
            <span role="img" aria-label="eSIM">
              📱
            </span>
          }
          title="Active eSIM"
          value={2024}
        />
        <Card
          icon={
            <span role="img" aria-label="balance">
              💰
            </span>
          }
          title="Account Balance"
          value="$2,215"
        />
      </div>

      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          padding: "20px",
        }}
      >
        {/* Monthly Line Chart in a Card */}
        <div style={cardStyle}>
          <h4 style={titleStyle}>Active eSIM Usage (Monthly)</h4>
          <div style={{ height: "300px" }}>
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
        </div>

        {/* Monthly Doughnut Chart in a Card */}
        <div style={cardStyle}>
          <h4 style={titleStyle}>Top Packages (Monthly)</h4>
          <div style={{ height: "300px" }}>
            <Doughnut data={doughnutChartData} options={doughnutChartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Inline styles for the cards
const cardStyle = {
  backgroundColor: "#fff",
  borderRadius: "10px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  padding: "20px",
  flex: "1 1 calc(50% - 20px)",
  minWidth: "300px",
};

const titleStyle = {
  margin: "0 0 20px",
  color: "#333",
  fontSize: "18px",
  fontWeight: "bold",
};

export default Monthly;
