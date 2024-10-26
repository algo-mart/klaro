import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell"; // Add this line
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme) => ({
  container: {
    width: '90%',
    // maxWidth: 1200,
    margin: '0 auto',
    padding: theme.spacing(5),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
   
   
  },
  // other styles...


  title: {
    marginBottom: theme.spacing(4),
    color: 'black', 
    fontWeight: 600,
  
  },
  tableContainer: {
    maxHeight: 300, // Set a fixed height (you can adjust this)
    overflowY: 'auto', // Enable vertical scrolling
  },
  table: {
    minWidth: 650,
  },
  headerCell: {
    backgroundColor: '#f2f2f2', 
    // color: '#ffffff',
    color: 'black',
    // fontWeight: 'bold',
  },
  headerCell2: {
    backgroundColor: '#f2f2f2', 
    // color: '#ffffff',
    color: 'black',
    // fontWeight: 'bold',
  },
  cell: {
    backgroundColor: '#ffffff',
    color: '#1D1842',
  },
  selectedRow: {
    backgroundColor: '#FFCC80',
  },
  gridItem: {
    padding: theme.spacing(2),
  },
}));
function Reports() {
  const classes = useStyles();
  
  const [selectedDay, setSelectedDay] = useState("");

  const weeklyData = [
    { day: "Monday", staffRoles: { intern: { attendance: 20, payment: 1000 }, member: { attendance: 15, payment: 750 }, senior: { attendance: 15, payment: 750 } } },
    { day: "Tuesday", staffRoles: { intern: { attendance: 25, payment: 1250 }, member: { attendance: 20, payment: 1000 }, senior: { attendance: 10, payment: 500 } } },
    // Add more days as needed
  ];

  const monthlyData = [
    { day: "2024-04-01", staffRoles: { intern: { attendance: 10, payment: 500 }, member: { attendance: 8, payment: 400 }, senior: { attendance: 5, payment: 250 } } },
    { day: "2024-04-02", staffRoles: { intern: { attendance: 12, payment: 600 }, member: { attendance: 10, payment: 500 }, senior: { attendance: 6, payment: 300 } } },
    // Add more days as needed
  ];

  return (
    <div className={classes.container}>
      <Typography variant="h4" className={classes.title}>
        Weekly & Monthly Reports
      </Typography>
      
      {/* Weekly Report Table */}
      <Grid container direction="row" spacing={3}>
        <Grid item xs={12} className={classes.gridItem}>
          <Typography variant="h5" className={classes.title}>
            Weekly Report
          </Typography>
          <TableContainer component={Paper} className={classes.tableContainer}>
            <Table className={classes.table} aria-label="weekly report table">
              <TableHead>
                <TableRow>
                  <TableCell className={classes.headerCell}>Day</TableCell>
                  <TableCell className={classes.headerCell}>Intern Attendance</TableCell>
                  <TableCell className={classes.headerCell}>Intern Payment</TableCell>
                  <TableCell className={classes.headerCell}>Member Attendance</TableCell>
                  <TableCell className={classes.headerCell}>Member Payment</TableCell>
                  <TableCell className={classes.headerCell}>Senior Attendance</TableCell>
                  <TableCell className={classes.headerCell}>Senior Payment</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {weeklyData.map((data, index) => (
                  <TableRow
                    key={index}
                    onClick={() => setSelectedDay(data.day)}
                    className={selectedDay === data.day ? classes.selectedRow : ""}
                  >
                    <TableCell className={classes.cell}>{data.day}</TableCell>
                    <TableCell className={classes.cell}>{data.staffRoles.intern.attendance}</TableCell>
                    <TableCell className={classes.cell}>₦{data.staffRoles.intern.payment}</TableCell>
                    <TableCell className={classes.cell}>{data.staffRoles.member.attendance}</TableCell>
                    <TableCell className={classes.cell}>₦{data.staffRoles.member.payment}</TableCell>
                    <TableCell className={classes.cell}>{data.staffRoles.senior.attendance}</TableCell>
                    <TableCell className={classes.cell}>₦{data.staffRoles.senior.payment}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        {/* Monthly Report Table */}
        <Grid item xs={12} className={classes.gridItem}>
          <Typography variant="h5" className={classes.title}>
            Monthly Report
          </Typography>
          <TableContainer component={Paper} className={classes.tableContainer}>
            <Table className={classes.table} aria-label="monthly report table">
              <TableHead>
                <TableRow>
                  <TableCell className={classes.headerCell2}>Date</TableCell>
                  <TableCell className={classes.headerCell2}>Intern Attendance</TableCell>
                  <TableCell className={classes.headerCell2}>Intern Payment</TableCell>
                  <TableCell className={classes.headerCell2}>Member Attendance</TableCell>
                  <TableCell className={classes.headerCell2}>Member Payment</TableCell>
                  <TableCell className={classes.headerCell2}>Senior Attendance</TableCell>
                  <TableCell className={classes.headerCell2}>Senior Payment</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {monthlyData.map((data, index) => (
                  <TableRow
                    key={index}
                    onClick={() => setSelectedDay(data.day)}
                    className={selectedDay === data.day ? classes.selectedRow : ""}
                  >
                    <TableCell className={classes.cell}>{data.day}</TableCell>
                    <TableCell className={classes.cell}>{data.staffRoles.intern.attendance}</TableCell>
                    <TableCell className={classes.cell}>₦{data.staffRoles.intern.payment}</TableCell>
                    <TableCell className={classes.cell}>{data.staffRoles.member.attendance}</TableCell>
                    <TableCell className={classes.cell}>₦{data.staffRoles.member.payment}</TableCell>
                    <TableCell className={classes.cell}>{data.staffRoles.senior.attendance}</TableCell>
                    <TableCell className={classes.cell}>₦{data.staffRoles.senior.payment}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </div>
  );
}

export default Reports;
