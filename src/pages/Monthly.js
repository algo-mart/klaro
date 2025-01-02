/* global Chart */
import React, { useEffect, useRef, useState } from 'react';
import { Box, Card, CardContent, Typography, Grid, ToggleButton, ToggleButtonGroup } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

const Monthly = () => {
  const lineChartRef = useRef(null);
  const pieChartRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState("Senior Staff");
  
  // This would ideally come from a shared state management solution
  const [participants] = useState([
    {
      id: 1,
      name: "John Doe",
      category: "Senior Staff",
      present: true,
      amountPaid: "5000",
    },
    {
      id: 2,
      name: "Jane Smith",
      category: "Senior Staff",
      present: false,
      amountPaid: "3000",
    },
    {
      id: 3,
      name: "Alex Johnson",
      category: "Senior Staff",
      present: true,
      amountPaid: "4000",
    },
    {
      id: 4,
      name: "Sarah Wilson",
      category: "Member",
      present: true,
      amountPaid: "2500",
    },
    {
      id: 5,
      name: "Mike Brown",
      category: "Member",
      present: false,
      amountPaid: "2000",
    },
    {
      id: 6,
      name: "Emily Davis",
      category: "Intern",
      present: true,
      amountPaid: "1000",
    },
    {
      id: 7,
      name: "Tom Harris",
      category: "Intern",
      present: false,
      amountPaid: "800",
    },
  ]);

  const handleCategoryChange = (event, newCategory) => {
    if (newCategory !== null) {
      setSelectedCategory(newCategory);
    }
  };

  // Calculate statistics for selected category
  const calculateCategoryStats = () => {
    const categoryParticipants = participants.filter(p => p.category === selectedCategory);
    const present = categoryParticipants.filter(p => p.present).length;
    const absent = categoryParticipants.length - present;
    const totalAmount = categoryParticipants.reduce((sum, p) => sum + (parseFloat(p.amountPaid) || 0), 0);
    return { present, absent, totalAmount };
  };

  const stats = calculateCategoryStats();

  useEffect(() => {
    // Line Chart
    const lineCtx = lineChartRef.current.getContext('2d');
    const lineChart = new Chart(lineCtx, {
      type: 'line',
      data: {
        labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
        datasets: [{
          label: `${selectedCategory} Attendance`,
          data: [100, 300, 400, 200, 500, 400, 300],
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              drawBorder: false
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    });

    // Pie Chart for payment distribution
    const pieCtx = pieChartRef.current.getContext('2d');
    const pieChart = new Chart(pieCtx, {
      type: 'doughnut',
      data: {
        labels: ['Paid', 'Pending'],
        datasets: [{
          data: [
            stats.totalAmount,
            stats.absent * (selectedCategory === 'Senior Staff' ? 5000 : selectedCategory === 'Member' ? 2500 : 1000) // Different expected amounts per category
          ],
          backgroundColor: ['#6366f1', '#ef4444'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          }
        },
        cutout: '60%'
      }
    });

    return () => {
      lineChart.destroy();
      pieChart.destroy();
    };
  }, [stats.totalAmount, stats.absent, selectedCategory]);

  const summaryCards = [
    {
      title: `Total Present (${selectedCategory})`,
      value: stats.present.toString(),
      icon: <PeopleIcon sx={{ fontSize: 40, color: '#6366f1' }} />,
    },
    {
      title: `Total Absentee (${selectedCategory})`,
      value: stats.absent.toString(),
      icon: <PersonOffIcon sx={{ fontSize: 40, color: '#6366f1' }} />,
    },
    {
      title: `Account Balance (${selectedCategory})`,
      value: `₦${stats.totalAmount.toLocaleString()}`,
      icon: <AccountBalanceWalletIcon sx={{ fontSize: 40, color: '#6366f1' }} />,
    },
  ];

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* Category Toggle Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <ToggleButtonGroup
          value={selectedCategory}
          exclusive
          onChange={handleCategoryChange}
          aria-label="category selection"
          sx={{
            '& .MuiToggleButton-root.Mui-selected': {
              backgroundColor: '#6366f1',
              color: 'white',
              '&:hover': {
                backgroundColor: '#5558d9',
              },
            },
          }}
        >
          <ToggleButton value="Senior Staff" aria-label="senior staff">
            Senior Staff
          </ToggleButton>
          <ToggleButton value="Member" aria-label="member">
            Member
          </ToggleButton>
          <ToggleButton value="Intern" aria-label="intern">
            Intern
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {summaryCards.map((card, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Card sx={{ height: '100%', borderRadius: 3, boxShadow: 'none', bgcolor: '#f8fafc' }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ bgcolor: 'white', p: 1, borderRadius: 2 }}>
                  {card.icon}
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    {card.title}
                  </Typography>
                  <Typography variant="h5" component="div" fontWeight="bold">
                    {card.value}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%', borderRadius: 3, boxShadow: 'none', bgcolor: '#f8fafc' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>{selectedCategory} Attendance Trend</Typography>
              <Typography variant="h4" sx={{ mb: 3 }}>Weekly Overview</Typography>
              <Box sx={{ height: 300 }}>
                <canvas ref={lineChartRef} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', borderRadius: 3, boxShadow: 'none', bgcolor: '#f8fafc' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>Payment Distribution</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Box sx={{ width: 300, height: 300 }}>
                  <canvas ref={pieChartRef} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Monthly;
