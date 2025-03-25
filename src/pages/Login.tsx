import React, { useEffect } from 'react';
import { Container, Box, Typography, Button, Paper, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useConfig } from '../contexts/ConfigContext';
import { useAuthContext } from '@asgardeo/auth-react';

const Login: React.FC = () => {
  const { config } = useConfig();
  const navigate = useNavigate();
  const { state, signIn, } = useAuthContext();
  
  // Redirect to dashboard if already authenticated
  useEffect(() => {
    
    if (state.isAuthenticated) {
      navigate('/dashboard');
    }
  }, [state.isAuthenticated, navigate]);

  // Handle login button click
  const handleLogin = () => {
    signIn();
  };

  if (state.isLoading) {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
          }}
        >
          <CircularProgress />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Loading...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Box sx={{ mb: 3 }}>
            <img
              src={config.logo.main}
              alt={config.appName}
              style={{ height: '80px' }}
              onError={(e) => {
                // Fallback to a default logo if the configured one fails to load
                (e.target as HTMLImageElement).src = '/logo192.png';
              }}
            />
          </Box>
          <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
            {config.texts.loginTitle}
          </Typography>
          <Typography variant="body1" color="textSecondary" align="center" sx={{ mb: 3 }}>
            Sign in with your Asgardeo account to access the application.
          </Typography>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            onClick={handleLogin}
            sx={{ mt: 2 }}
          >
            Sign In
          </Button>
        </Paper>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 3 }}>
          Powered by Asgardeo
        </Typography>
      </Box>
    </Container>
  );
};

export default Login;
