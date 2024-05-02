import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  container: {
    width: 500,
    textAlign: "center",
    padding: theme.spacing(4),
  },
  dayBox: {
    cursor: "pointer",
    padding: theme.spacing(2),
    margin: theme.spacing(1),
    borderRadius: theme.spacing(1),
    backgroundColor: "#ffb13e",
    color: "black",
    transition: "background-color 0.3s ease",
    "&:hover": {
      backgroundColor: "#eee",
    },
  },
  selectedDayBox: {
    backgroundColor: "#007bff",
    color: "black",
  },
}));

function Monthly() {
  const classes = useStyles();

  // Sample data for total attendance and payment
  const monthlyData = [
    { day: "2024-04-01", attendance: 100, payment: 5000 },
    { day: "2024-04-05", attendance: 120, payment: 6000 },
    { day: "2024-04-10", attendance: 150, payment: 7500 },
    // Add more data for other days in the month
  ];

  // State to keep track of selected day
  const [selectedDay, setSelectedDay] = useState("");

  // Function to handle day selection
  const handleDaySelect = (day) => {
    setSelectedDay(day);
  };

  return (
    <div
      sx={{ display: "flex", flexDirection: "row" }}
      className={classes.container}
    >
      <div>
        {monthlyData.map((data, index) => (
          <Box
            key={index}
            className={`${classes.dayBox} ${
              selectedDay === data.day ? classes.selectedDayBox : ""
            }`}
            onClick={() => handleDaySelect(data.day)}
          >
            <Typography variant="h5">{data.day}</Typography>
            <Typography variant="body1">
              Total Attendance: {data.attendance}
            </Typography>
            <Typography variant="body1">
              Total Payment: ${data.payment}
            </Typography>
          </Box>
        ))}
      </div>
    </div>
  );
}

export default Monthly;
