import { useState } from 'react';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  Checkbox,
  FormControlLabel,
  CircularProgress,
} from '@mui/material';
import { useAuth } from './AuthContext';

interface LoginTokenProps {
  onLoginSuccess?: () => void;
  onSwitchToSignUp?: () => void;
}

export default function LoginToken({ onLoginSuccess, onSwitchToSignUp }: LoginTokenProps) {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email');
      return;
    }

    setLoading(true);

    try {
      // Replace with your actual API endpoint
      const response = await fetch('http://your-api.com/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();

      // Store token and user info
      login(data.token, formData.email);

      if (formData.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }

      setSuccess('Login successful!');
      setFormData({ email: '', password: '', rememberMe: false });

      if (onLoginSuccess) {
        setTimeout(onLoginSuccess, 1500);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

   return (
    <Container
      maxWidth={false}
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f4f6f8",
      }}
    >
      <Box
        sx={{
          width: 360,
          p: 3,
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: "#fff",
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          align="center"
          sx={{ mb: 3, fontWeight: "bold" }}
        >
          Login
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            disabled={loading}
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            disabled={loading}
          />

          <FormControlLabel
            control={
              <Checkbox
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                disabled={loading}
              />
            }
            label="Remember me"
            sx={{ mt: 1 }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2, py: 1.5 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Login'}
          </Button>
        </form>

        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <Link href="#" sx={{ textDecoration: "none" }}>
              Forgot password?
            </Link>
          </Typography>
          <Typography variant="body2">
            Don't have an account?{" "}
            <Link
              component="button"
              variant="body2"
              onClick={(e) => {
                e.preventDefault();
                if (onSwitchToSignUp) onSwitchToSignUp();
              }}
              sx={{ cursor: "pointer", fontWeight: "bold" }}
            >
              Sign up here
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}

