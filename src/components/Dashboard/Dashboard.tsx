import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, Card, CardContent, CardHeader, List, ListItem, ListItemText, Divider } from '@mui/material';
import { useConfig } from '../../contexts/ConfigContext';
import { useAuthContext } from '@asgardeo/auth-react';
import { brandingService } from '../../services/brandingService';

// Widget components
const CounterWidget: React.FC<{ title: string; data?: { total: number; new: number; active: number } }> = ({ title, data }) => {
  return (
    <Card elevation={2}>
      <CardHeader title={title} />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Typography variant="h4" align="center">{data?.total || 0}</Typography>
            <Typography variant="body2" align="center" color="textSecondary">Total</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h4" align="center" color="primary">{data?.new || 0}</Typography>
            <Typography variant="body2" align="center" color="textSecondary">New</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h4" align="center" color="secondary">{data?.active || 0}</Typography>
            <Typography variant="body2" align="center" color="textSecondary">Active</Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

const ListWidget: React.FC<{ title: string; data?: Array<{ time: string; patient: string; type: string }> }> = ({ title, data }) => {
  return (
    <Card elevation={2}>
      <CardHeader title={title} />
      <CardContent>
        <List>
          {data ? (
            data.map((item, index) => (
              <React.Fragment key={index}>
                {index > 0 && <Divider />}
                <ListItem>
                  <ListItemText 
                    primary={item.patient} 
                    secondary={`${item.time} - ${item.type}`} 
                  />
                </ListItem>
              </React.Fragment>
            ))
          ) : (
            <ListItem>
              <ListItemText primary="No data available" />
            </ListItem>
          )}
        </List>
      </CardContent>
    </Card>
  );
};

const TimelineWidget: React.FC<{ title: string; data?: Array<{ time: string; action: string; details: string }> }> = ({ title, data }) => {
  return (
    <Card elevation={2}>
      <CardHeader title={title} />
      <CardContent>
        <List>
          {data ? (
            data.map((item, index) => (
              <React.Fragment key={index}>
                {index > 0 && <Divider />}
                <ListItem>
                  <ListItemText 
                    primary={item.action} 
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="textPrimary">
                          {item.time}
                        </Typography>
                        {" - " + item.details}
                      </>
                    } 
                  />
                </ListItem>
              </React.Fragment>
            ))
          ) : (
            <ListItem>
              <ListItemText primary="No data available" />
            </ListItem>
          )}
        </List>
      </CardContent>
    </Card>
  );
};

// Main Dashboard component
const Dashboard: React.FC = () => {
  const { config, updateTheme } = useConfig();
  const { state, getDecodedIDToken } = useAuthContext();
  const [brandingFetched, setBrandingFetched] = useState<boolean>(false);
  const [brandingError, setBrandingError] = useState<boolean>(false);

  const hasScope = (scope: string): boolean => {
    return state?.allowedScopes.includes(scope);
  };

  // Fetch organization branding when user is authenticated
  useEffect(() => {
    // Only run this effect when authentication state changes
    // This prevents the loop on initial load
    if (!state.isLoading) {
      const fetchBranding = async () => {
        // Only fetch branding if:
        // 1. User is authenticated
        // 3. We haven't already fetched branding
        // 4. We haven't encountered an error previously
        if (state.isAuthenticated && !brandingFetched && !brandingError) {
          try {
            // Get the ID token to extract organization info
            const idToken = await getDecodedIDToken();
        
            // Check if organization info exists in the token
            const orgId = idToken.org_id || '';
            
            if (!orgId) {
              console.log('No organization found in ID token, using default theme');
              setBrandingFetched(true); // Mark as fetched to prevent further attempts
              return; // Use default theme from config
            }
          
            // We're using a proxy to avoid CORS issues, so we don't need to set the base URL
            // The proxy is configured in setupProxy.js
            
            // Call the branding API
            const branding = await brandingService.getSubOrganizationBranding(orgId);
            
            // Update the theme with the organization's primary color
            if (branding.primaryColor) {
              updateTheme(branding.primaryColor);
            }
            
          } catch (error) {
            console.error('Error fetching organization branding:', error);
          } finally {
            // Mark as fetched to prevent further API calls regardless of success/failure
            setBrandingFetched(true);
          }
        }
      };

      fetchBranding();
    }
  }, [state.isLoading]);

  // Filter widgets based on user scopes
  const filteredWidgets = config.dashboardWidgets.filter(widget => 
    !widget.requiredScope || hasScope(widget.requiredScope)
  );

  // Render widget based on type
  const renderWidget = (widget: any) => {
    switch (widget.type) {
      case 'counter':
        return <CounterWidget title={widget.title} data={widget.data} />;
      case 'list':
        return <ListWidget title={widget.title} data={widget.data} />;
      case 'timeline':
        return <TimelineWidget title={widget.title} data={widget.data} />;
      default:
        return (
          <Card elevation={2}>
            <CardHeader title={widget.title} />
            <CardContent>
              <Typography>Unknown widget type: {widget.type}</Typography>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {config.texts.dashboardTitle}
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" paragraph>
        {config.texts.welcomeMessage}
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {filteredWidgets.map((widget) => (
          <Grid item xs={12} md={widget.type === 'counter' ? 12 : 6} lg={4} key={widget.id}>
            {renderWidget(widget)}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;
