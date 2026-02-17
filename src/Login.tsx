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
} from '@mui/material';

interface LoginProps {
  onLoginSuccess?: () => void;
  onSwitchToSignIn?: () => void;
}

export default function Login({ onLoginSuccess, onSwitchToSignIn }: LoginProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
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

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setSuccess('Login successful! Welcome back!');
    setFormData({ email: '', password: '', rememberMe: false });

    if (onLoginSuccess) {
      setTimeout(onLoginSuccess, 1500);
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

        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
          />

          <FormControlLabel
            control={
              <Checkbox
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
            }
            label="Remember me"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 2, py: 1.5 }}
          >
            Login
          </Button>
        </form>

        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Typography variant="body2">
            <Link href="#" underline="none">
              Forgot password?
            </Link>
          </Typography>

          <Typography variant="body2" sx={{ mt: 1 }}>
            Don't have an account?{" "}
            <Link component="button" underline="none" sx={{ fontWeight: "bold" }}>
              Sign up here
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
