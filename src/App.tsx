import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@asgardeo/auth-react';
import { ConfigProvider } from './contexts/ConfigContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Login from './pages/Login';
import DashboardPage from './pages/DashboardPage';

function App() {
  // Check if required environment variables are set
  const clientID = process.env.REACT_APP_ASGARDEO_CLIENT_ID;
  const baseUrl = process.env.REACT_APP_ASGARDEO_BASE_URL;
  const resourceServer = process.env.REACT_APP_ASGARDEO_RESOURCE_SERVER;
  const callBackUrl = process.env.REACT_APP_ASGARDEO_CALLBACK_URL;
  
  const missingConfig = !clientID || !baseUrl || !resourceServer || !callBackUrl;
  
  // If configuration is missing, show error message
  if (missingConfig) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '20px',
        textAlign: 'center',
        fontFamily: 'Arial, sans-serif'
      }}>
        <h1 style={{ color: '#d32f2f' }}>Configuration Error</h1>
        <p style={{ fontSize: '18px', maxWidth: '600px', lineHeight: '1.6' }}>
          Missing required Asgardeo configuration. Please set the following environment variables:
        </p>
        <ul style={{ textAlign: 'left', fontSize: '16px' }}>
          {!clientID && <li>REACT_APP_ASGARDEO_CLIENT_ID</li>}
          {!baseUrl && <li>REACT_APP_ASGARDEO_BASE_URL</li>}
          {!resourceServer && <li>REACT_APP_ASGARDEO_RESOURCE_SERVER</li>}
          {!callBackUrl && <li>REACT_APP_ASGARDEO_CALLBACK_URL</li>}
        </ul>
        <p style={{ fontSize: '16px', marginTop: '20px' }}>
          Update the <code>.env</code> file with these values and restart the application.
        </p>
      </div>
    );
  }

  // Asgardeo configuration
  const asgardeoConfig = {
    signInRedirectURL: callBackUrl,
    signOutRedirectURL: callBackUrl,
    clientID,
    baseUrl,
    scope: ['openid', 'profile', 'email', 'dashboard:view', 'patients:view', 'appointments:view'],
  };

  return (
    <AuthProvider config={asgardeoConfig}>
      <ConfigProvider>
        <ThemeProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Router>
        </ThemeProvider>
      </ConfigProvider>
    </AuthProvider>
  );
}

export default App;
