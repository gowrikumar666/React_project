import React, { useState, useEffect } from 'react';
import { Box, Button, MenuItem, TextField, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';

interface LocationData {
  [country: string]: {
    [state: string]: string[];
  };
}

const locationData: LocationData = {
  India: {
    Maharashtra: ['Mumbai', 'Pune', 'Nagpur'],
    Karnataka: ['Bangalore', 'Mysore', 'Hubli'],
    TamilNadu: ['Chennai', 'Coimbatore', 'Madurai'],
  },
  USA: {
    California: ['Los Angeles', 'San Francisco', 'San Diego'],
    Texas: ['Houston', 'Dallas', 'Austin'],
  },
};

const initialForm = {
  country: '',
  state: '',
  district: '',
};

const IndiaComponent: React.FC = () => {
  const [form, setForm] = useState(initialForm);
  const [states, setStates] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (form.country) {
      setStates(Object.keys(locationData[form.country] || {}));
      setForm(f => ({ ...f, state: '', district: '' }));
      setDistricts([]);
    } else {
      setStates([]);
      setDistricts([]);
    }
  }, [form.country]);

  useEffect(() => {
    if (form.country && form.state) {
      setDistricts(locationData[form.country][form.state] || []);
      setForm(f => ({ ...f, district: '' }));
    } else {
      setDistricts([]);
    }
  }, [form.state, form.country]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);
    try {
      await axios.post('http://localhost:4000/api/location', form);
      setSuccess('Submitted successfully!');
      setForm(initialForm);
    } catch (err: any) {
      setError('Submission failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxWidth={400} mx="auto" mt={4} p={3} boxShadow={3} borderRadius={2} bgcolor="#fff">
      <Typography variant="h5" mb={2} align="center">Location Form</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          select
          label="Country"
          name="country"
          value={form.country}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        >
          {Object.keys(locationData).map(country => (
            <MenuItem key={country} value={country}>{country}</MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="State"
          name="state"
          value={form.state}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          disabled={!states.length}
        >
          {states.map(state => (
            <MenuItem key={state} value={state}>{state}</MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="District"
          name="district"
          value={form.district}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          disabled={!districts.length}
        >
          {districts.map(district => (
            <MenuItem key={district} value={district}>{district}</MenuItem>
          ))}
        </TextField>
        <Box mt={2} display="flex" justifyContent="center">
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Submit'}
          </Button>
        </Box>
        {success && <Typography color="success.main" mt={2} align="center">{success}</Typography>}
        {error && <Typography color="error.main" mt={2} align="center">{error}</Typography>}
      </form>
    </Box>
  );
};

export default IndiaComponent;
