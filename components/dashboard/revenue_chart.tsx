"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const data = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: 'Revenue',
      data: [4000, 3000, 5000, 4500, 6000, 5500],
      borderColor: '#0ea5e9',
      borderWidth: 2,
      fill: false,
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Revenue Overview',
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

export function RevenueChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ width: '100%', height: '300px' }}>
          <Line data={data} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}