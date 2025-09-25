"use client"
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Tooltip } from 'chart.js'
import { Bar, Line } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend)

export function SalesChart() {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Sales',
        data: [0, 0, 0, 0, 0, 0],
        borderColor: 'hsl(var(--primary))',
        backgroundColor: 'hsl(var(--primary) / 0.3)'
      }
    ]
  }
  return <Line data={data} options={{ responsive: true, plugins: { legend: { display: false } } }} />
}

export function RevenueChart() {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue',
        data: [0, 0, 0, 0, 0, 0],
        backgroundColor: 'hsl(var(--chart-2))'
      }
    ]
  }
  return <Bar data={data} options={{ responsive: true, plugins: { legend: { display: false } } }} />
}
