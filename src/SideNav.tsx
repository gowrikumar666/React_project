import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

import DashboardIcon from '@mui/icons-material/Dashboard';
import ListIcon from '@mui/icons-material/List';
import UploadFileIcon from '@mui/icons-material/UploadFile';

import { useNavigate } from 'react-router-dom';

const drawerWidth = 250;

const routes = [
  { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
  { label: 'People List', path: '/list', icon: <ListIcon /> },
  { label: 'Data Table Selector', path: '/dropdown', icon: <UploadFileIcon /> },
  { label: 'India Form', path: '/indiacomponent', icon: <UploadFileIcon /> },
];

export default function SideNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'persistent'}
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: drawerWidth,
        },
      }}
    >
      {/* Close button for both mobile and desktop */}
      <List>
        <ListItem disablePadding sx={{ justifyContent: 'flex-end', px: 1 }}>
          <ListItemButton onClick={onClose} sx={{ maxWidth: 40, minWidth: 40 }}>
            <ListItemIcon sx={{ minWidth: 0 }}>
              {/* Use a left arrow or X icon for close */}
              <span style={{ fontSize: 20, fontWeight: 'bold' }}>&#10005;</span>
            </ListItemIcon>
          </ListItemButton>
        </ListItem>
        {routes.map((route) => (
          <ListItem key={route.path} disablePadding>
            <ListItemButton
              onClick={() => {
                navigate(route.path);
                if (isMobile) onClose();
              }}
            >
              <ListItemIcon>{route.icon}</ListItemIcon>
              <ListItemText primary={route.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
    </Drawer>
  );
}