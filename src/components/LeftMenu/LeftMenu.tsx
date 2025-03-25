import React from 'react';
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton,
  ListItemIcon, 
  ListItemText, 
  Divider, 
  Box,
  Toolbar
} from '@mui/material';
import { 
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Event as EventIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useConfig } from '../../contexts/ConfigContext';
import { useAuthContext } from '@asgardeo/auth-react';

// Map of icon names to their components
const iconMap: Record<string, React.ReactElement> = {
  Dashboard: <DashboardIcon />,
  People: <PeopleIcon />,
  Event: <EventIcon />,
  Assessment: <AssessmentIcon />,
  Settings: <SettingsIcon />
};

// Drawer width
const drawerWidth = 240;

const LeftMenu: React.FC = () => {
  const { config } = useConfig();
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useAuthContext();

  const hasScope = (scope: string): boolean => {
    return state?.allowedScopes.includes(scope);
  };

  // Filter menu items based on user scopes
  const filteredMenuItems = config.menuItems.filter(item => 
    hasScope(item.requiredScope)
  );

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { 
          width: drawerWidth, 
          boxSizing: 'border-box',
          backgroundColor: (theme) => theme.palette.background.default
        },
      }}
    >
      <Toolbar /> {/* This creates space for the AppBar */}
      <Box sx={{ overflow: 'auto', mt: 2 }}>
        <List>
          {filteredMenuItems.map((item) => (
            <ListItem key={item.id} disablePadding>
              <ListItemButton
                onClick={() => navigate(item.path)}
                selected={location.pathname === item.path}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: (theme) => `${theme.palette.primary.main}20`,
                    borderRight: (theme) => `4px solid ${theme.palette.primary.main}`,
                    '&:hover': {
                      backgroundColor: (theme) => `${theme.palette.primary.main}30`,
                    }
                  },
                  '&:hover': {
                    backgroundColor: (theme) => `${theme.palette.primary.main}10`,
                  }
                }}
              >
                <ListItemIcon>
                  {iconMap[item.icon] || <DashboardIcon />}
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider sx={{ my: 2 }} />
      </Box>
    </Drawer>
  );
};

export default LeftMenu;
