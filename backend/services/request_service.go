package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

// RequestDetails represents the API request details
type RequestDetails struct {
	Method  string            `json:"method"`
	URL     string            `json:"url"`
	Headers map[string]string `json:"headers"`
	Body    interface{}       `json:"body"`
}

// ExecuteRequest executes the API request based on the details
func ExecuteRequest(details RequestDetails) (map[string]interface{}, error) {
	// Serialize body if provided
	var requestBody []byte
	if details.Body != nil {
		var err error
		requestBody, err = json.Marshal(details.Body)
		if err != nil {
			return nil, fmt.Errorf("error marshaling request body: %w", err)
		}
	}

	// Create the HTTP request
	req, err := http.NewRequest(details.Method, details.URL, bytes.NewBuffer(requestBody))
	if err != nil {
		return nil, fmt.Errorf("error creating request: %w", err)
	}

	// Set headers
	for key, value := range details.Headers {
		req.Header.Set(key, value)
	}

	// Perform the request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("error performing request: %w", err)
	}
	defer resp.Body.Close()

	fmt.Println("Response Status:", resp.Status)

	// Read the entire response body into a byte slice
	bodyBytes, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("error reading response body: %w", err)
	}

	// Log the raw response body
	fmt.Println("Raw Response Body:", string(bodyBytes))

	// Parse the response body using the byte slice
	var parsedResponse map[string]interface{}
	if err := json.Unmarshal(bodyBytes, &parsedResponse); err != nil {
		return nil, fmt.Errorf("error unmarshaling response body: %w", err)
	}

	// Log the parsed response
	fmt.Println("Parsed Response:", parsedResponse)

	// Return the full response
	return parsedResponse, nil
}
