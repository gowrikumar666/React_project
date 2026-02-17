import { useState } from 'react';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
} from '@mui/material';

interface SignInProps {
  onSignInSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export default function SignIn({ onSignInSuccess, onSwitchToLogin }: SignInProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError('All fields are required');
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

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setSuccess('Account created successfully!');
    setFormData({ email: '', password: '', confirmPassword: '' });

    if (onSignInSuccess) {
      setTimeout(onSignInSuccess, 1500);
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
          Sign Up
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

          <TextField
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            margin="normal"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 2, py: 1.5 }}
          >
            Sign Up
          </Button>
        </form>

        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Typography variant="body2">
            Already have an account?{" "}
            <Link
              component="button"
              underline="none"
              sx={{ cursor: "pointer", fontWeight: "bold" }}
              onClick={(e) => {
                e.preventDefault();
                if (onSwitchToLogin) onSwitchToLogin();
              }}
            >
              Login here
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}