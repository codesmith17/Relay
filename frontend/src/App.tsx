import React, { useState } from 'react';
import { 
  Container, 
  Box, 
  TextField, 
  Button, 
  MenuItem, 
  Select, 
  FormControl, 
  InputLabel, 
  Typography, 
  Paper, 
  Grid 
} from '@mui/material';
import axios from 'axios';

export default function Relay() {
  const [method, setMethod] = useState<string>('GET');
  const [url, setUrl] = useState<string>('');
  const [headers, setHeaders] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [error, setError] = useState<string>('');

  const BACKEND_BASE_URL = 'http://localhost:8080';

  // Handle method change
  const handleMethodChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setMethod(event.target.value as string);
  };

  // Handle Execute button click to send the request
  const handleExecute = async () => {
    try {
      setError('');
      const payload = {
        method, // GET or POST
        url,
        headers: headers ? JSON.parse(headers) : {}, // Parse headers if provided
        body: method === 'POST' ? body : undefined,  // Include body only for POST requests
      };
  
      const response = await axios.post("http://localhost:8080/api/execute", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      setResponse(JSON.stringify(response?.data ?? {}, null, 2));
    } catch (err) {
      setError('Error executing the request');
      setResponse('');
      console.error(err); // Log the error for debugging
    }
  };
  

  return (
    <Container maxWidth="lg">
      <Box sx={{ padding: 4 }}>
        <Typography variant="h4" gutterBottom>
          Relay - API Client
        </Typography>

        <Paper sx={{ padding: 3 }}>
          <Grid container spacing={3}>
            {/* Request Method */}
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel>Method</InputLabel>
                <Select value={method} onChange={handleMethodChange}>
                  <MenuItem value="GET">GET</MenuItem>
                  <MenuItem value="POST">POST</MenuItem>
                  {/* Add more HTTP methods as needed */}
                </Select>
              </FormControl>
            </Grid>

            {/* URL Input */}
            <Grid item xs={12} sm={9}>
              <TextField
                label="Request URL"
                variant="outlined"
                fullWidth
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://api.example.com"
              />
            </Grid>

            {/* Headers Input */}
            <Grid item xs={12}>
              <TextField
                label="Headers (JSON format)"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                value={headers}
                onChange={(e) => setHeaders(e.target.value)}
                placeholder='{"Content-Type": "application/json"}'
              />
            </Grid>

            {/* Body Input (for POST requests) */}
            {method === 'POST' && (
              <Grid item xs={12}>
                <TextField
                  label="Request Body (JSON format)"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={6}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder='{"key": "value"}'
                />
              </Grid>
            )}

            {/* Execute Button */}
            <Grid item xs={12}>
              <Button variant="contained" fullWidth onClick={handleExecute}>
                Execute Request
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Response Area */}
        {response && (
          <Box sx={{ marginTop: 3 }}>
            <Typography variant="h6">Response:</Typography>
            <Paper sx={{ padding: 2, marginTop: 2 }}>
              <Typography variant="body1" component="pre">
                {response}
              </Typography>
            </Paper>
          </Box>
        )}

        {/* Error Handling */}
        {error && (
          <Box sx={{ marginTop: 3 }}>
            <Typography variant="h6" color="error">
              {error}
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
}
