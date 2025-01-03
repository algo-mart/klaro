import React from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Avatar,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  EventAvailable as EventIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  backgroundColor: "var(--surface)",
  borderRadius: "var(--radius-lg)",
  boxShadow: "var(--shadow-sm)",
  transition: "transform 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "var(--shadow-md)",
  },
}));

const StatCard = ({ title, value, icon, color }) => (
  <StyledCard>
    <CardContent>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Avatar sx={{ bgcolor: color, width: 48, height: 48 }}>{icon}</Avatar>
        <Box sx={{ ml: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {value}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
        </Box>
      </Box>
    </CardContent>
  </StyledCard>
);

const Dashboard = () => {
  // Sample data for the line chart
  const activityData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Participants",
        data: [65, 59, 80, 81, 56, 55],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.4,
      },
      {
        label: "Revenue",
        data: [28, 48, 40, 19, 86, 27],
        fill: false,
        borderColor: "rgb(255, 99, 132)",
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Activity Overview",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Sample recent activities
  const recentActivities = [
    {
      id: 1,
      name: "John Doe",
      action: "Made a payment",
      amount: "₦50,000",
      time: "2 hours ago",
    },
    {
      id: 2,
      name: "Sarah Smith",
      action: "Registered for event",
      time: "4 hours ago",
    },
    {
      id: 3,
      name: "Mike Johnson",
      action: "Updated profile",
      time: "6 hours ago",
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Participants"
            value="1,234"
            icon={<PeopleIcon />}
            color="var(--primary)"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Revenue"
            value="₦2.4M"
            icon={<MoneyIcon />}
            color="var(--success)"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Events"
            value="12"
            icon={<EventIcon />}
            color="var(--warning)"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Growth"
            value="+24%"
            icon={<TrendingUpIcon />}
            color="var(--info)"
          />
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: "var(--radius-lg)" }}>
            <Line options={chartOptions} data={activityData} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              borderRadius: "var(--radius-lg)",
              height: "100%",
              maxHeight: 400,
              overflow: "auto",
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, px: 1 }}>
              Recent Activities
            </Typography>
            <List>
              {recentActivities.map((activity, index) => (
                <React.Fragment key={activity.id}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: "var(--primary)" }}>
                        {activity.name.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={activity.name}
                      secondary={
                        <>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            {activity.action}
                          </Typography>
                          {activity.amount && ` - ${activity.amount}`}
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.secondary"
                            sx={{ display: "block" }}
                          >
                            {activity.time}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                  {index < recentActivities.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
