import React, { useState, useEffect } from "react";
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
  Grid,
  CircularProgress,
  FormControlLabel,
  Radio,
  RadioGroup,
  IconButton,
  Tabs,
  Tab,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Save as SaveIcon,
  Add as AddIcon,
  History as HistoryIcon,
  CloudUpload as CloudUploadIcon,
} from "@mui/icons-material";
import axios from "axios";
import { JSONTree } from "react-json-tree";

// Interface for saved requests
interface SavedRequest {
  id: string;
  name: string;
  method: string;
  url: string;
  headers: string;
  bodyType: string;
  body?: string;
  formData?: Array<{ key: string; value: string }>;
}

export default function Relay() {
  const [method, setMethod] = useState<string>("GET");
  const [url, setUrl] = useState<string>("");
  const [headers, setHeaders] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [formData, setFormData] = useState<Array<{ key: string; value: string }>>([]);
  const [bodyType, setBodyType] = useState<string>("json");
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [savedRequests, setSavedRequests] = useState<SavedRequest[]>([]);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [requestName, setRequestName] = useState<string>("");
  const [requestHistory, setRequestHistory] = useState<SavedRequest[]>([]);
  const [activeTab, setActiveTab] = useState(0);

  const BACKEND_BASE_URL = "http://localhost:8080";

  useEffect(() => {
    const savedRequestsFromStorage = localStorage.getItem("savedRequests");
    const requestHistoryFromStorage = localStorage.getItem("requestHistory");

    if (savedRequestsFromStorage) {
      setSavedRequests(JSON.parse(savedRequestsFromStorage));
    }

    if (requestHistoryFromStorage) {
      setRequestHistory(JSON.parse(requestHistoryFromStorage));
    }
  }, []);

  const parseJSON = (text: string) => {
    try {
      return text ? JSON.parse(text) : undefined;
    } catch (err) {
      setError("Invalid JSON format");
      throw err;
    }
  };

  const saveRequest = () => {
    const newRequest: SavedRequest = {
      id: Date.now().toString(),
      name: requestName || `Request ${savedRequests.length + 1}`,
      method,
      url,
      headers,
      bodyType,
      body: bodyType === "json" ? body : undefined,
      formData: bodyType === "form" ? formData : undefined,
    };

    const updatedSavedRequests = [...savedRequests, newRequest];
    setSavedRequests(updatedSavedRequests);
    localStorage.setItem("savedRequests", JSON.stringify(updatedSavedRequests));

    setIsSaveDialogOpen(false);
    setRequestName("");
  };

  const loadSavedRequest = (request: SavedRequest) => {
    setMethod(request.method);
    setUrl(request.url);
    setHeaders(request.headers);
    setBodyType(request.bodyType);

    if (request.bodyType === "json") {
      setBody(request.body || "");
      setFormData([]);
    } else {
      setBody("");
      setFormData(request.formData || []);
    }
    setActiveTab(0);
  };

  const deleteSavedRequest = (id: string) => {
    const updatedSavedRequests = savedRequests.filter((req) => req.id !== id);
    setSavedRequests(updatedSavedRequests);
    localStorage.setItem("savedRequests", JSON.stringify(updatedSavedRequests));
  };

  const handleExecute = async () => {
    if (!url) {
      setError("URL is required");
      return;
    }

    setLoading(true);
    try {
      setError("");
      let payload;

      if (bodyType === "json") {
        payload = {
          method,
          url,
          headers: parseJSON(headers),
          body: ["POST", "PATCH"].includes(method) ? parseJSON(body) : undefined,
        };
      } else if (bodyType === "form") {
        const formBody = new URLSearchParams();
        formData.forEach((item) => {
          if (item.key.trim()) {
            formBody.append(item.key, item.value);
          }
        });

        payload = {
          method,
          url,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            ...parseJSON(headers),
          },
          body: formBody.toString(),
        };
      }

      const response = await axios.post(`${BACKEND_BASE_URL}/api/execute`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      const historyRequest: SavedRequest = {
        id: Date.now().toString(),
        name: `History ${requestHistory.length + 1}`,
        method,
        url,
        headers,
        bodyType,
        body: bodyType === "json" ? body : undefined,
        formData: bodyType === "form" ? formData : undefined,
      };

      const updatedHistory = [historyRequest, ...requestHistory].slice(0, 20);
      setRequestHistory(updatedHistory);
      localStorage.setItem("requestHistory", JSON.stringify(updatedHistory));

      setResponse(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error executing the request");
      setResponse(null);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleImportFromFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedRequest = JSON.parse(e.target?.result as string);
          loadSavedRequest(importedRequest);
        } catch {
          setError("Invalid file format");
        }
      };
      reader.readAsText(file);
    }
  };

  const exportRequest = () => {
    const requestToExport: SavedRequest = {
      id: Date.now().toString(),
      name: `Export ${new Date().toISOString()}`,
      method,
      url,
      headers,
      bodyType,
      body: bodyType === "json" ? body : undefined,
      formData: bodyType === "form" ? formData : undefined,
    };

    const blob = new Blob([JSON.stringify(requestToExport, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `relay_request_${new Date().toISOString().replace(/:/g, "-")}.json`;
    link.click();
  };


  return (
    <Container maxWidth="lg">
      <Box sx={{ padding: 4, backgroundColor: "#f0f2f5", minHeight: "100vh" }}>
        <Paper elevation={3} sx={{ padding: 4, borderRadius: 3, backgroundColor: "white" }}>
          <Typography
            variant="h4"
            sx={{
              marginBottom: 3,
              textAlign: "center",
              color: "#1976d2",
              fontWeight: "bold",
            }}
          >
            Relay - Advanced API Client
          </Typography>
  
          {/* Tabs for navigation */}
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            centered
            sx={{ marginBottom: 3 }}
          >
            <Tab label="Request Builder" />
            <Tab label="Saved Requests" />
            <Tab label="Request History" />
          </Tabs>
  
          {/* Request Builder Tab */}
          {activeTab === 0 && (
            <>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>HTTP Method</InputLabel>
                    <Select
                      value={method}
                      onChange={(e) => setMethod(e.target.value)}
                      label="HTTP Method"
                    >
                      <MenuItem value="GET">GET</MenuItem>
                      <MenuItem value="POST">POST</MenuItem>
                      <MenuItem value="PUT">PUT</MenuItem>
                      <MenuItem value="PATCH">PATCH</MenuItem>
                      <MenuItem value="DELETE">DELETE</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Request URL"
                    fullWidth
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Enter request URL"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Headers (JSON)"
                    fullWidth
                    multiline
                    rows={3}
                    value={headers}
                    onChange={(e) => setHeaders(e.target.value)}
                    placeholder='e.g., { "Authorization": "Bearer token" }'
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Body Type</InputLabel>
                    <Select
                      value={bodyType}
                      onChange={(e) => setBodyType(e.target.value)}
                      label="Body Type"
                    >
                      <MenuItem value="json">JSON</MenuItem>
                      <MenuItem value="form">Form Data</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                {bodyType === "json" && (
                  <Grid item xs={12}>
                    <TextField
                      label="JSON Body"
                      fullWidth
                      multiline
                      rows={5}
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      placeholder='e.g., { "key": "value" }'
                    />
                  </Grid>
                )}
                {bodyType === "form" && (
                  <Grid item xs={12}>
                    {formData.map((item, index) => (
                      <Box key={index} display="flex" gap={1} sx={{ marginBottom: 2 }}>
                        <TextField
                          label="Key"
                          value={item.key}
                          onChange={(e) => {
                            const updatedFormData = [...formData];
                            updatedFormData[index].key = e.target.value;
                            setFormData(updatedFormData);
                          }}
                          fullWidth
                        />
                        <TextField
                          label="Value"
                          value={item.value}
                          onChange={(e) => {
                            const updatedFormData = [...formData];
                            updatedFormData[index].value = e.target.value;
                            setFormData(updatedFormData);
                          }}
                          fullWidth
                        />
                        <IconButton
                          color="error"
                          onClick={() => {
                            const updatedFormData = [...formData];
                            updatedFormData.splice(index, 1);
                            setFormData(updatedFormData);
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    ))}
                    <Button
                      variant="outlined"
                      onClick={() =>
                        setFormData([...formData, { key: "", value: "" }])
                      }
                      startIcon={<AddIcon />}
                    >
                      Add Field
                    </Button>
                  </Grid>
                )}
                <Grid item xs={12} container spacing={2}>
                  <Grid item xs={6}>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={handleExecute}
                    >
                      Execute Request
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      variant="contained"
                      color="secondary"
                      fullWidth
                      onClick={() => setIsSaveDialogOpen(true)}
                      startIcon={<SaveIcon />}
                    >
                      Save Request
                    </Button>
                  </Grid>
                </Grid>
                {loading && <CircularProgress sx={{ margin: "20px auto" }} />}
                {error && (
                  <Typography color="error" variant="body1">
                    {error}
                  </Typography>
                )}
                {response && (
                  <Paper elevation={2} sx={{ padding: 2, marginTop: 3 }}>
                    <Typography variant="h6">Response</Typography>
                    <JSONTree data={response} theme="monokai" />
                  </Paper>
                )}
              </Grid>
  
              {/* Save Request Dialog */}
              <Dialog
                open={isSaveDialogOpen}
                onClose={() => setIsSaveDialogOpen(false)}
              >
                <DialogTitle>Save Request</DialogTitle>
                <DialogContent>
                  <TextField
                    autoFocus
                    margin="dense"
                    label="Request Name"
                    fullWidth
                    value={requestName}
                    onChange={(e) => setRequestName(e.target.value)}
                    placeholder="Enter a name for this request"
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setIsSaveDialogOpen(false)}>Cancel</Button>
                  <Button onClick={saveRequest} color="primary">
                    Save
                  </Button>
                </DialogActions>
              </Dialog>
            </>
          )}
  
          {/* Saved Requests Tab */}
          {activeTab === 1 && (
            <Box>
              {savedRequests.length === 0 ? (
                <Typography
                  variant="body1"
                  sx={{ textAlign: "center", color: "text.secondary" }}
                >
                  No saved requests. Save a request to see it here.
                </Typography>
              ) : (
                savedRequests.map((request) => (
                  <Paper
                    key={request.id}
                    elevation={2}
                    sx={{
                      padding: 2,
                      marginBottom: 2,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                        {request.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {request.method} - {request.url}
                      </Typography>
                    </Box>
                    <Box>
                      <Tooltip title="Load Request">
                        <IconButton
                          color="primary"
                          onClick={() => loadSavedRequest(request)}
                        >
                          <AddIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Request">
                        <IconButton
                          color="error"
                          onClick={() => deleteSavedRequest(request.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Paper>
                ))
              )}
            </Box>
          )}
  
          {/* Request History Tab */}
          {activeTab === 2 && (
            <Box>
              {requestHistory.length === 0 ? (
                <Typography
                  variant="body1"
                  sx={{ textAlign: "center", color: "text.secondary" }}
                >
                  No request history. Execute some requests to see them here.
                </Typography>
              ) : (
                requestHistory.map((request) => (
                  <Paper
                    key={request.id}
                    elevation={2}
                    sx={{
                      padding: 2,
                      marginBottom: 2,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle1">
                        {request.method} - {request.url}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(parseInt(request.id)).toLocaleString()}
                      </Typography>
                    </Box>
                    <Tooltip title="Load Request">
                      <IconButton
                        color="primary"
                        onClick={() => loadSavedRequest(request)}
                      >
                        <AddIcon />
                      </IconButton>
                    </Tooltip>
                  </Paper>
                ))
              )}
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
  
}