import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const GradeChart = ({ data = [] }) => {
    // Handle empty data
    if (!data || data.length === 0) {
        return (
            <Box 
                display="flex" 
                flexDirection="column" 
                alignItems="center" 
                justifyContent="center" 
                height={300}
            >
                <Typography variant="h6" color="textSecondary">
                    Belum ada data nilai
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    Data akan muncul setelah nilai siswa diinput
                </Typography>
            </Box>
        );
    }

    // Prepare chart data - group by class
    const classData = {};
    data.forEach(grade => {
        const className = grade.className || 'Tidak Diketahui';
        if (!classData[className]) {
            classData[className] = [];
        }
        classData[className].push(grade.score || 0);
    });

    // Calculate average for each class
    const chartLabels = Object.keys(classData);
    const chartData = chartLabels.map(className => {
        const scores = classData[className];
        return scores.reduce((sum, score) => sum + score, 0) / scores.length;
    });

    const chartConfig = {
        labels: chartLabels,
        datasets: [
            {
                label: 'Rata-rata Nilai',
                data: chartData,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 205, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(153, 102, 255, 0.8)',
                    'rgba(255, 159, 64, 0.8)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 205, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 2,
                borderRadius: 5,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Rata-rata Nilai per Kelas',
                font: {
                    size: 16,
                    weight: 'bold',
                }
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                ticks: {
                    stepSize: 20,
                }
            },
        },
    };

    return (
        <Box height={300}>
            <Bar data={chartConfig} options={options} />
        </Box>
    );
};

export default GradeChart;
};

export default GradeChart;