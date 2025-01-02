import React from "react";
import { Box, Typography, Avatar, Grid, Paper, Divider } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: "#fff",
  borderRadius: "12px",
  border: "none",
  boxShadow: "none",
}));

const InfoRow = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginBottom: theme.spacing(2),
  "& .label": {
    minWidth: "120px",
    color: theme.palette.text.secondary,
    fontSize: "0.875rem",
  },
  "& .value": {
    color: theme.palette.text.primary,
    fontWeight: 500,
  },
}));

const Dashboard = () => {
  // Admin information - replace with actual data
  const admin = {
    name: "Clara Igwe",
    role: "HR Manager",
    department: "Human Resources",
    email: "clara.igwe@company.com",
    phone: "+234 123 456 7890",
    location: "Lagos, Nigeria",
    joinDate: "January 2023",
    status: "Active",
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: "0 auto", marginTop: 5 }}>
      <Grid container spacing={4}>
        {/* Admin Profile Section */}
        <Grid item xs={12} md={4}>
          <StyledPaper>
            <Box sx={{ textAlign: "center", mb: 3 }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  margin: "0 auto",
                  mb: 2,
                  bgcolor: "#1976d2",
                  fontSize: "2.5rem",
                }}
              >
                CI
              </Avatar>
              <Typography variant="h5" sx={{ mb: 1 }}>
                {admin.name}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                {admin.role}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mt: 3 }}>
              <InfoRow>
                <Typography className="label">Department:</Typography>
                <Typography className="value">{admin.department}</Typography>
              </InfoRow>
              <InfoRow>
                <Typography className="label">Email:</Typography>
                <Typography className="value">{admin.email}</Typography>
              </InfoRow>
              <InfoRow>
                <Typography className="label">Phone:</Typography>
                <Typography className="value">{admin.phone}</Typography>
              </InfoRow>
              <InfoRow>
                <Typography className="label">Location:</Typography>
                <Typography className="value">{admin.location}</Typography>
              </InfoRow>
              <InfoRow>
                <Typography className="label">Join Date:</Typography>
                <Typography className="value">{admin.joinDate}</Typography>
              </InfoRow>
              <InfoRow>
                <Typography className="label">Status:</Typography>
                <Typography
                  className="value"
                  sx={{
                    color: "#4caf50",
                    backgroundColor: "#e8f5e9",
                    padding: "4px 12px",
                    borderRadius: "16px",
                    display: "inline-block",
                  }}
                >
                  {admin.status}
                </Typography>
              </InfoRow>
            </Box>
          </StyledPaper>
        </Grid>

        {/* Quick Stats Section */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <StyledPaper>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  Quick Overview
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  Welcome back, {admin.name}! Here's your workspace at a glance.
                </Typography>
              </StyledPaper>
            </Grid>

            {/* Additional quick stats or information can be added here */}
            <Grid item xs={12} md={6}>
              <StyledPaper>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Recent Activities
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  • Added new participant: John Doe
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  • Updated attendance records
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  • Processed monthly payments
                </Typography>
              </StyledPaper>
            </Grid>

            <Grid item xs={12} md={6}>
              <StyledPaper>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  System Info
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  • Last Login: Today, 8:30 AM
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  • Browser: Chrome
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  • Version: KLARO v1.0.0
                </Typography>
              </StyledPaper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
