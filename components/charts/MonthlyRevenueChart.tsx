'use client';

import { Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip as ChartTooltip, 
  Legend,
  Filler,
  TooltipItem
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend,
  Filler
);

export interface RevenueData {
  january: number;
  february: number;
  march: number;
  april: number;
  may: number;
  june: number;
  july: number;
  august: number;
  september: number;
  october: number;
  november: number;
  december: number;
}

interface MonthlyRevenueChartProps {
  data: RevenueData | null;
}

export function MonthlyRevenueChart({ data }: MonthlyRevenueChartProps) {

  if (!data) {
    return (
      <div className="w-full h-[400px] p-4 flex items-center justify-center">
        <p className="text-gray-500">Loading revenue data...</p>
      </div>
    );
  }

  // Convert the data to chart format
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const monthAbbreviations = months.map(month => month.slice(0, 3));
  const revenueValues = [
    data.january, data.february, data.march, data.april, data.may, data.june,
    data.july, data.august, data.september, data.october, data.november, data.december
  ];

  // Prepare chart data
  const chartJsData = {
    labels: monthAbbreviations,
    datasets: [
      {
        label: 'Monthly Revenue',
        data: revenueValues,
        borderColor: '#4f46e5',
        backgroundColor: 'rgba(129, 140, 248, 0.3)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#4f46e5',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#4f46e5',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'white',
        titleColor: '#1f2937',
        bodyColor: '#4b5563',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        callbacks: {
          label: (context: TooltipItem<'line'>) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return value !== null ? `${label}: ₹${value.toLocaleString()}` : `${label}: N/A`;
          },
          title: (context: { label: string }[]) => {
            return `Month: ${context[0].label}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6b7280',
        },
      },
      y: {
        grid: {
          color: '#e5e7eb',
        },
        ticks: {
          color: '#6b7280',
          callback: (value: number | string) => `₹${Number(value).toLocaleString()}`,
        },
      },
    },
  };


  return (
    <div className="w-full h-[400px] p-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Revenue</h3>
      <div className="w-full h-full">
        <Line data={chartJsData} options={options} />
      </div>
    </div>
  );
}

