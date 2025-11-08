import React, { useState, useEffect, useCallback, useRef } from 'react'
import dashboardProxy from '../proxy/dashboard'
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);

const Dashboard = () => {
  const [dashboard, setDashboard] = useState({})
  const fetched = useRef(false);

  const fetchDashboard = useCallback(async () => {
    try {
      const res = await dashboardProxy.getDashboard()
      if (!res?.ok) {
        throw new Error("Failed to fetch dashboard")
      }
      const data = await res.json()
      console.log(data);

      setDashboard(data)
    } catch (error) {
      console.error("fetchDashboard: ", error)
    }
  }, [setDashboard])

  useEffect(() => {
    if (!fetched.current) {
      fetched.current = true
      fetchDashboard()
    }
  }, [])
  return (
    <div className='flex justify-center p-4 gap-3'>
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
        <Typography variant="h5" component="div">
          จำนวนห้องทั้งหมด
        </Typography>
        <Typography variant="h5" component="div">
          {dashboard.total}
        </Typography>
        </CardContent>
      </Card>
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
        <Typography variant="h5" component="div">
          จำนวนว่าง
        </Typography>
        <Typography variant="h5" component="div">
          {dashboard.vacant}
        </Typography>
        </CardContent>
      </Card>
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
        <Typography variant="h5" component="div">
          จำนวนห้อที่มีผู้เช่า
        </Typography>
        <Typography variant="h5" component="div">
          {dashboard.occupied}
        </Typography>
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard