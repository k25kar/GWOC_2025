"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const data = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: 'Referrals',
      data: [12, 15, 18, 22, 25, 30],
      backgroundColor: '#0ea5e9',
    },
    {
      label: 'Earnings',
      data: [240, 300, 360, 440, 500, 600],
      backgroundColor: '#14b8a6',
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
      text: 'Referral Program Performance',
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

export function ReferralStats() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Referral Program Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ width: '100%', height: '300px' }}>
          <Bar data={data} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}