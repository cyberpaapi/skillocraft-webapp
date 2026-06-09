// components/admin/CustomerAnalysisChart.tsx
'use client';

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { useRouter } from 'next/navigation';
import { ChartEvent, ActiveElement } from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface CustomerAnalysisChartProps {
  data: {
    totalCustomers: number;
    customersWithCartOnly: number;
    customersWithPurchases: number;
    inactiveCustomers: number;
  };
  onBarClick?: (label: string, value: number) => void;
}

export function CustomerAnalysisChart({ data, onBarClick }: CustomerAnalysisChartProps) {
  const router = useRouter();
  
  const chartData = {
    labels: ['Total Customers', 'Cart Only', 'With Purchases', 'Inactive'],
    datasets: [
      {
        label: 'Customer Analysis',
        data: [
          data.totalCustomers,
          data.customersWithCartOnly,
          data.customersWithPurchases,
          data.inactiveCustomers,
        ],
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 99, 132, 0.6)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const handleClick = (event: ChartEvent, elements: ActiveElement[]) => {
    if (elements.length > 0) {
      const element = elements[0];
      const label = chartData.labels[element.index];
      const value = chartData.datasets[0].data[element.index];
      
      if (onBarClick) {
        onBarClick(label, typeof value === 'number' ? value : 0);
      } else {
        // Default behavior if no onBarClick provided
        const type = label.toLowerCase().replace(/\s+/g, '-');
        router.push(`/admin/analytics?type=${type}&count=${value}`);
      }
    }
  };

  const options = {
    responsive: true,
    onClick: handleClick,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Customer Analysis',
        font: {
          size: 16,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Customers',
        },
        ticks: {
          // Ensure only whole numbers are shown on y-axis
          stepSize: 1,
          precision: 0,
          callback: function(value: number | string) {
            if (typeof value === 'number' && value % 1 === 0) {
              return value;
            }
            return undefined;
          }
        }
      },
    },
  };

  return <Bar data={chartData} options={options} />;
}