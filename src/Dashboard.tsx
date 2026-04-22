import { Box, Container, Typography, Card, CardContent, Button, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SideNav from './SideNav';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Pie, Doughnut, Bar, Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [screenWidth, setScreenWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const [forceUpdate, setForceUpdate] = useState(0);
  const resizeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleResize = () => {
      // Clear previous timeout
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }

      // Debounce resize events
      resizeTimeoutRef.current = setTimeout(() => {
        setScreenWidth(window.innerWidth);
        // Force re-render of charts
        setForceUpdate(prev => prev + 1);
      }, 250);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, []);

  // Doughnut Chart Data
  const doughnutData = {
    labels: ['Product A', 'Product B', 'Product C', 'Product D'],
    datasets: [
      {
        label: 'Revenue Distribution',
        data: [250, 180, 1500, 220],
        backgroundColor: [
          'rgba(255, 159, 64, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 99, 132, 0.6)',
        ],
        borderColor: [
          'rgba(255, 159, 64, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  // Pie Chart Data
  const pieData = {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple'],
    datasets: [
      {
        label: 'Sales by Category',
        data: [12, 19, 3, 5, 2],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Bar Chart Data
  const barData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'Sales',
        data: [65, 59, 80, 81, 56, 55],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'Revenue',
        data: [45, 79, 60, 71, 86, 65],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Line Chart Data
  const lineData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
    datasets: [
      {
        label: 'User Growth',
        data: [120, 190, 150, 240, 220],
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Engagement',
        data: [80, 120, 160, 200, 250],
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          boxWidth: 12,
          padding: 15,
          font: {
            size: screenWidth < 600 ? 10 : 12,
          },
        },
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: screenWidth < 600 ? 10 : 12,
          },
        },
      },
      y: {
        ticks: {
          font: {
            size: screenWidth < 600 ? 10 : 12,
          },
        },
      },
    },
  };

  return (
    <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
      <SideNav open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          py: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 2, sm: 3, md: 4 } }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' } }}>
            Dashboard
          </Typography>
        </Box>

        <Box sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: '1fr 1fr',
            md: '1fr 1fr',
            lg: '1fr 1fr 1fr 1fr',
          },
          gap: { xs: 2, sm: 2, md: 3 },
          gridAutoFlow: 'dense',
        }}>
          {/* Doughnut Chart */}
          <Box key={`doughnut-${forceUpdate}`} sx={{ gridColumn: { xs: '1 / -1', sm: 'span 1', md: 'span 1', lg: 'span 2' } }}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: { xs: 1.5, sm: 2, md: 2.5 } }}>
                <Typography variant="h6" sx={{ mb: 2, fontSize: { xs: '0.95rem', sm: '1.1rem', md: '1.25rem' } }}>
                  Revenue Distribution (Doughnut Chart)
                </Typography>
                <Box sx={{ flexGrow: 1, height: { xs: 200, sm: 250, md: 300, lg: 350 }, position: 'relative', width: '100%' }}>
                  <Doughnut data={doughnutData} options={chartOptions} />
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Pie Chart */}
          <Box key={`pie-${forceUpdate}`} sx={{ gridColumn: { xs: '1 / -1', sm: 'span 1', md: 'span 1', lg: 'span 2' } }}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: { xs: 1.5, sm: 2, md: 2.5 } }}>
                <Typography variant="h6" sx={{ mb: 2, fontSize: { xs: '0.95rem', sm: '1.1rem', md: '1.25rem' } }}>
                  Sales by Category (Pie Chart)
                </Typography>
                <Box sx={{ flexGrow: 1, height: { xs: 200, sm: 250, md: 300, lg: 350 }, position: 'relative', width: '100%' }}>
                  <Pie data={pieData} options={chartOptions} />
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Bar Chart */}
          <Box key={`bar-${forceUpdate}`} sx={{ gridColumn: { xs: '1 / -1', sm: '1 / -1', md: '1 / -1', lg: '1 / -1' } }}>
            <Card>
              <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 2.5 } }}>
                <Typography variant="h6" sx={{ mb: 2, fontSize: { xs: '0.95rem', sm: '1.1rem', md: '1.25rem' } }}>
                  Monthly Sales & Revenue (Bar Chart)
                </Typography>
                <Box sx={{ height: { xs: 220, sm: 280, md: 350, lg: 400 }, position: 'relative', width: '100%' }}>
                  <Bar data={barData} options={chartOptions} />
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Line Chart */}
          <Box key={`line-${forceUpdate}`} sx={{ gridColumn: { xs: '1 / -1', sm: '1 / -1', md: '1 / -1', lg: '1 / -1' } }}>
            <Card>
              <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 2.5 } }}>
                <Typography variant="h6" sx={{ mb: 2, fontSize: { xs: '0.95rem', sm: '1.1rem', md: '1.25rem' } }}>
                  User Growth & Engagement (Line Chart)
                </Typography>
                <Box sx={{ height: { xs: 220, sm: 280, md: 350, lg: 400 }, position: 'relative', width: '100%' }}>
                  <Line data={lineData} options={chartOptions} />
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

