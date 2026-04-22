import React, { useState, Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import SideNav from './SideNav';
import { IconButton, Box, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

// Lazy loaded pages
const Dashboard = lazy(() => import('./Dashboard'));
const ListComponent = lazy(() => import('./ListComponent'));
const IndiaComponent = lazy(() => import('./IndiaComponent'));

function Layout() {
  const [open, setOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex' }}>

      {/* Sidebar */}
      <SideNav open={open} onClose={() => setOpen(false)} />

      {/* Main Content */}
      <Box sx={{  flexGrow: 1,
      ml: open ? '250px' : 0,   
      transition: 'margin 0.3s' }}>

        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
          <IconButton onClick={() => setOpen(true)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">My App</Typography>
        </Box>

        {/* Dynamic Render Area */}
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/list" element={<ListComponent />} />
            <Route path="/indiacomponent" element={<IndiaComponent />} />
            
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </Suspense>

      </Box>
    </Box>
  );
}

export default Layout;