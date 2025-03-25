import React, { useEffect } from 'react';
import { Box, CssBaseline } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header/Header';
import LeftMenu from '../components/LeftMenu/LeftMenu';
import Dashboard from '../components/Dashboard/Dashboard';
import { useAuthContext } from '@asgardeo/auth-react';

const DashboardPage: React.FC = () => {
  const { state } = useAuthContext();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!state.isLoading && !state.isAuthenticated) {
      navigate('/login');
    }
  }, [state.isAuthenticated, state.isLoading, navigate]);

  // Show nothing while loading or if not authenticated
  if (state.isLoading || !state.isAuthenticated) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Header />
      <LeftMenu />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
          pt: '64px', // AppBar height
        }}
      >
        <Dashboard />
      </Box>
    </Box>
  );
};

export default DashboardPage;
