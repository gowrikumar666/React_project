import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SideNav from './SideNav';
import { IconButton, Box, Typography, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from './AuthContext';
import Chatbot from './Chatbot';

function Layout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST', credentials: 'include' });
    logout();
    navigate('/');
  };

  return (
    <Box sx={{ display: 'flex' }}>

      {/* Sidebar */}
      <SideNav open={open} onClose={() => setOpen(false)} />

      {/* Main Content */}
      <Box sx={{  flexGrow: 1,
      ml: open ? '250px' : 0,   
      transition: 'margin 0.3s' }}>

        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={() => setOpen(true)}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6">My App</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography>Welcome, {user?.email}</Typography>
            <Button variant="outlined" onClick={handleLogout}>Logout</Button>
          </Box>
        </Box>

        {/* Dynamic Render Area */}
        {children}

      </Box>

      {/* Chatbot - always visible */}
      <Chatbot />

    </Box>
  );
}

export default Layout;