import { useEffect, useState } from 'react';
import { Box, FormControl, InputLabel, MenuItem, Select, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Alert } from '@mui/material';

interface TableOption {
  id: string;
  label: string;
}

interface PersonRow {
  id: number;
  name: string;
  address: string;
  gender: string;
  occupation: string;
}

interface SummaryRow {
  label: string;
  value: number;
}

const DropdownComponent: React.FC = () => {
  const [options, setOptions] = useState<TableOption[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [peopleData, setPeopleData] = useState<PersonRow[]>([]);
  const [summaryData, setSummaryData] = useState<SummaryRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOptions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/tables');
      if (!response.ok) throw new Error('Unable to load table options');
      const data = await response.json();
      setOptions(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error loading tables');
    } finally {
      setLoading(false);
    }
  };

  const fetchTableData = async (tableId: string) => {
    if (!tableId) return;
    setLoading(true);
    setError(null);
    setPeopleData([]);
    setSummaryData([]);
    try {
      const response = await fetch(`/api/table-data?table=${encodeURIComponent(tableId)}`);
      if (!response.ok) throw new Error('Unable to load table data');
      const data = await response.json();
      if (tableId === 'people') {
        setPeopleData(data);
      } else {
        setSummaryData(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error loading data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOptions();
  }, []);

  const handleSelectChange = (event: any) => {
    const value = event.target.value as string;
    setSelectedTable(value);
    fetchTableData(value);
  };

  const renderTable = () => {
    if (loading) {
      return (
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;
    }

    if (!selectedTable) {
      return <Typography sx={{ mt: 2 }}>Select a table from the dropdown to display data.</Typography>;
    }

    if (selectedTable === 'people') {
      return (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Occupation</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {peopleData.map(row => (
                <TableRow key={row.id}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.address}</TableCell>
                  <TableCell>{row.gender}</TableCell>
                  <TableCell>{row.occupation}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      );
    }

    return (
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Category</TableCell>
              <TableCell>Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {summaryData.map((row, idx) => (
              <TableRow key={idx}>
                <TableCell>{row.label}</TableCell>
                <TableCell>{row.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <Box sx={{ p: 3, maxWidth: 960, mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 2 }}>Data Table Selector</Typography>
      <Typography sx={{ mb: 2 }}>Choose a table from the dropdown and the component will fetch the associated data from the API.</Typography>

      <FormControl fullWidth sx={{ maxWidth: 420 }}>
        <InputLabel id="dropdown-table-label">Select Table</InputLabel>
        <Select
          labelId="dropdown-table-label"
          id="dropdown-table"
          value={selectedTable}
          label="Select Table"
          onChange={handleSelectChange}
          disabled={loading || options.length === 0}
        >
          {options.map(option => (
            <MenuItem key={option.id} value={option.id}>{option.label}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {renderTable()}
    </Box>
  );
};

export default DropdownComponent;
