import { Box, Container, Typography, Button, Card, CardContent } from '@mui/material';
import { useAuth } from './AuthContext';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';

export default function Dashboard() {
  const { user, token, logout } = useAuth();

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          py: 4,
        }}
      >
        <Card sx={{ width: '100%', maxWidth: 500 }}>
          <CardContent>
            <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold', mb: 3 }}>
              Welcome! 👋
            </Typography>

            <Box sx={{ mb: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Email:</strong> {user?.email}
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', wordBreak: 'break-all' }}>
                <strong>Token:</strong> {token ? token.substring(0, 20) + '...' : 'N/A'}
              </Typography>
            </Box>

            <Typography variant="body2" color="textSecondary" paragraph>
              You are successfully logged in with a valid authentication token. This token is stored in localStorage and can be used to authenticate API requests.
            </Typography>

            <Button
              fullWidth
              variant="contained"
              color="error"
              startIcon={<PowerSettingsNewIcon />}
              onClick={logout}
              sx={{ mt: 2 }}
            >
              Logout
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
