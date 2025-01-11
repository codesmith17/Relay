import JsonView from 'react18-json-view'
import 'react18-json-view/src/style.css'
import InfoIcon from '@mui/icons-material/Info';
import {
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Divider,
  IconButton,
  TextField,
  Grid,
  Button,
  Tabs,
  Box,
  Tab,
  Typography,
  SelectChangeEvent,
  Tooltip, Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material";
import { RootState, AppDispatch } from "./store/store";
import { setHttpMethod } from "./store/slices/httpMethodSlice";
import { useState } from "react";
import TabPanel from "./components/TabPanel";
import { httpMethodColors } from "./color";
import { setUrl } from "./store/slices/URLSlice";
import { ChangeEvent } from "react";
import axios from "axios";
import { getStatusCodeDetails } from './color.ts';

const App = () => {
  const dispatch: AppDispatch = useDispatch();
  const httpMethod = useSelector((state: RootState) => state.httpMethod.value);
  const URL = useSelector((state: RootState) => state.url.value);

  const [tabName, setTabName] = useState("Params");
  const [bodyType, setBodyType] = useState("JSON");
  const [jsonBody, setJsonBody] = useState("{}");
  const [formFields, setFormFields] = useState([{ key: "", value: "" }]);
  const [response, setResponse] = useState<string | object>("");
  const [responseTabName, setResponseTabName] = useState("Body");
  const [responseHeaders, setResponseHeaders] = useState({});
  const [responseStatusCode, setResponseStatusCode] = useState(0);
  const [headerFormat, setHeaderFormat] = useState("JSON");
  const [headerFormFields, setHeaderFormFields] = useState<Array<{ key: string; value: string }>>([]);
  const handleHeaderFormatChange = (event: SelectChangeEvent) => {
    setHeaderFormat(event.target.value);
  };
  const changeTabName = (_: React.SyntheticEvent, newValue: string) => {
    setTabName(newValue);
  };

  const onHttpMethodChange = (event: SelectChangeEvent) => {
    dispatch(setHttpMethod(event.target.value));
  };

  const onChangeURL = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(setUrl(event.target.value));
  };

  const handleBodyTypeChange = (event: SelectChangeEvent) => {
    setBodyType(event.target.value);
  };

  const handleJsonChange = (event: ChangeEvent<HTMLInputElement>) => {
    setJsonBody(event.target.value);
  };

  const handleFormFieldChange = (
    index: number,
    field: "key" | "value",
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const updatedFields = [...formFields];
    updatedFields[index][field] = event.target.value;
    setFormFields(updatedFields);
  };

  const addFormField = () => {
    if (formFields[formFields.length - 1].key.length > 0 || formFields[formFields.length - 1].value.length > 0)
      setFormFields([...formFields, { key: "", value: "" }]);
  };

  const removeFormField = (index: number) => {
    const updatedFields = formFields.filter((_, i) => i !== index);
    setFormFields(updatedFields);
  };

  const changeResponseTabName = (_: React.SyntheticEvent, newValue: string) => {
    setResponseTabName(newValue);
  };

  const handleSend = async () => {
    if (!URL.trim()) {
      alert("Please enter a URL.");
      return;
    }

    let dataBody = null;

    if (bodyType === "JSON" && httpMethod !== "GET") {
      dataBody = JSON.parse(jsonBody);
    } else if (bodyType === "Form" && httpMethod !== "GET") {
      dataBody = formFields.reduce((acc, field) => {
        if (field.key.trim()) {
          acc[field.key.trim()] = field.value.trim();
        }
        return acc;
      }, {} as Record<string, string>);
    }

    const payload = {
      method: httpMethod,
      url: URL,
      headers: {
        "Content-Type": "application/json"
      },
      body: httpMethod === "GET" ? null : dataBody,
    };

    try {
      const response = await axios({
        method: "post",
        url: "http://localhost:8080/api/execute",
        headers: {
          "Content-Type": payload.headers["Content-Type"],
        },
        data: payload
      });

      let { statusCode, headers, body } = response.data;
      const headerFields = Object.entries(headers).map(([key, value]) => ({
        key,
        value: String(value)
      }));
      setHeaderFormFields(headerFields);
      let parsedBody: string | object = {};

      // Check if body is not empty and handle accordingly
      if (body && body.length > 0) {
        try {
          parsedBody = JSON.parse(body);
        } catch (e) {
          console.warn("Response isn't valid JSON. Rendering as raw text.");
          parsedBody = body
        }
      } else {
        // If the body is empty, use a fallback value or an empty object
        parsedBody = { message: "No content in the response." };
      }

      // Ensure the parsedBody is set as a string
      setResponse(parsedBody);

      setResponseHeaders(headers);
      setResponseStatusCode(statusCode);
    } catch (error) {
      console.error("Error sending request:", error);
      alert("Failed to send request. See console for details.");
    }
  };



  return (
    <Container sx={{ mt: "50px" }}>
      <Stack direction="row" spacing={2}>
        <FormControl sx={{ width: "150px" }}>
          <InputLabel>Method</InputLabel>
          <Select
            value={httpMethod}
            label="Method"
            onChange={onHttpMethodChange}
            sx={{ color: httpMethodColors[httpMethod.toLowerCase()] || "text.primary" }}
          >
            <MenuItem value={"GET"} sx={{ color: httpMethodColors.get }}>GET</MenuItem>
            <MenuItem value={"POST"} sx={{ color: httpMethodColors.post }}>POST</MenuItem>
            <MenuItem value={"PUT"} sx={{ color: httpMethodColors.put }}>PUT</MenuItem>
            <MenuItem value={"PATCH"} sx={{ color: httpMethodColors.patch }}>PATCH</MenuItem>
            <MenuItem value={"DELETE"} sx={{ color: httpMethodColors.delete }}>DELETE</MenuItem>
          </Select>
        </FormControl>
        <Divider orientation="vertical" variant="middle" flexItem />
        <TextField
          id="url-text-box"
          label="URL"
          variant="outlined"
          fullWidth
          value={URL}
          onChange={onChangeURL}
        />
        <Button variant="contained" onClick={handleSend}>Send</Button>
      </Stack>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tabName} onChange={changeTabName}>
            <Tab label="Params" value="Params" />
            <Tab label="Authorization" value="Authorization" />
            <Tab label="Body" value="Body" />
          </Tabs>
        </Box>
        <TabPanel value={tabName} index="Authorization">
          <Typography>Authorization Tab Content</Typography>
        </TabPanel>
        <TabPanel value={tabName} index="Params">
          <Typography>Params Tab Content</Typography>
        </TabPanel>
        <TabPanel value={tabName} index="Body">
          <FormControl sx={{ width: "150px", mb: 2 }}>
            <InputLabel>Body Type</InputLabel>
            <Select value={bodyType} label="Body Type" onChange={handleBodyTypeChange}>
              <MenuItem value="JSON">JSON</MenuItem>
              <MenuItem value="Form">Form</MenuItem>
            </Select>
          </FormControl>
          {bodyType === "JSON" && (
            <TextField
              id="json-body"
              label="JSON Body"
              multiline
              rows={10}
              fullWidth
              value={jsonBody}
              onChange={handleJsonChange}
            />
          )}
          {bodyType === "Form" && (
            <Stack spacing={2}>
              {formFields.map((field, index) => (
                <Grid container spacing={2} key={index}>
                  <Grid item xs={5}>
                    <TextField
                      label="Key"
                      value={field.key}
                      onChange={(event) => handleFormFieldChange(index, "key", event)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={5}>
                    <TextField
                      label="Value"
                      value={field.value}
                      onChange={(event) => handleFormFieldChange(index, "value", event)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <IconButton onClick={() => removeFormField(index)} color="error">
                      <RemoveCircleOutline />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}
              <Button
                variant="outlined"
                startIcon={<AddCircleOutline />}
                onClick={addFormField}
              >
                Add Field
              </Button>
            </Stack>
          )}
        </TabPanel>
      </Box>
      <Box
        sx={{
          mt: 4,
          p: 2,
          borderRadius: 2,
          color: "black",
          background: "linear-gradient(145deg, #e0e0e0, #f5f5f5)",
          boxShadow: 2,
          backdropFilter: "blur(5px)",
          border: "1px solid rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", color: "#333" }}>
          Response:
        </Typography>
        {responseStatusCode && (
          <Box
            sx={{
              p: 1,
              backgroundColor: getStatusCodeDetails(responseStatusCode).color,
              borderRadius: 1,
              color: "#fff",
              mb: 2,
              width: "fit-content"
            }}
          >
            {responseStatusCode !== 0 && (
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography>
                  Status Code: {responseStatusCode} - {getStatusCodeDetails(responseStatusCode).text}
                </Typography>
                <Tooltip
                  title={getStatusCodeDetails(responseStatusCode).description}
                  arrow
                >
                  <IconButton color="inherit">
                    <InfoIcon />
                  </IconButton>
                </Tooltip>
              </Stack>
            )}

          </Box>
        )}
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={responseTabName} onChange={changeResponseTabName}>
            <Tab label="Headers" value="Headers" />
            <Tab label="Body" value="Body" />
          </Tabs>
        </Box>
        <TabPanel value={responseTabName} index="Headers">
          <FormControl sx={{ width: "150px", mb: 2 }}>
            <InputLabel>Format</InputLabel>
            <Select value={headerFormat} label="Format" onChange={handleHeaderFormatChange}>
              <MenuItem value="JSON">JSON</MenuItem>
              <MenuItem value="Form">Form</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ maxHeight: "300px", overflowY: "auto" }}>
            {headerFormat === "JSON" ? (
              <JsonView
                dark={true}
                src={responseHeaders ? responseHeaders : "// No response headers"}
                collapsed={3}
                collapseStringsAfterLength={200}
                theme="github"
                enableClipboard={true}
              />
            ) : (
              <Stack spacing={2}>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell><Typography fontWeight="bold">Header</Typography></TableCell>
                        <TableCell><Typography fontWeight="bold">Value</Typography></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.entries(headerFormFields).map(([key, value], index) => (
                        <TableRow key={index}>
                          <TableCell>{key}</TableCell>
                          <TableCell>{value}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Stack>
            )}
          </Box>
        </TabPanel>
        <TabPanel value={responseTabName} index="Body">
          <Box sx={{ maxHeight: "300px", overflowY: "auto" }}>
            <JsonView
              dark={true}
              src={response ? response : "// No response body"}
              collapsed={3}
              collapseStringsAfterLength={200}
              theme="github"
              enableClipboard={true}
            />
          </Box>
        </TabPanel>
      </Box>




    </Container>
  );
};

export default App;
