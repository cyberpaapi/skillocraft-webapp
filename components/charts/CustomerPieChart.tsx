'use client';

import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend as ChartLegend, ChartOptions } from 'chart.js';

// Register ChartJS components
ChartJS.register(ArcElement, ChartTooltip, ChartLegend);

export interface CustomerDistributionData {
  customer_purchased: number;
  customer_not_purchased: number;
}

interface CustomerPieChartProps {
  data: CustomerDistributionData;
}

export function CustomerPieChart({ data }: CustomerPieChartProps) {
  // Prepare chart data
  const chartData = {
    labels: ['Purchased', 'Not Purchased'],
    datasets: [
      {
        data: [data.customer_purchased, data.customer_not_purchased],
        backgroundColor: ['#0088FE', '#00C49F'],
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw as number;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="w-full h-[400px] p-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Distribution</h3>
      <div className="w-full h-full">
        <Pie data={chartData} options={options} />
      </div>
    </div>
  );
}
