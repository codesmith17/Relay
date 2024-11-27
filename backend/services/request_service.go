package services

import (
	"bytes"
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"time"
)

// RequestDetails represents the input for an API request
type RequestDetails struct {
	Method  string            `json:"method"`
	URL     string            `json:"url"`
	Headers map[string]string `json:"headers"`
	Body    string            `json:"body,omitempty"`
}

// ResponseDetails represents the output of an API request
type ResponseDetails struct {
	StatusCode int               `json:"statusCode"`
	Headers    map[string]string `json:"headers"`
	Body       string            `json:"body"`
}

// ExecuteRequest performs the API request and returns the response
func ExecuteRequest(reqDetails RequestDetails) (ResponseDetails, error) {
	if (reqDetails.URL == "") {
		return ResponseDetails{}, errors.New("URL is required")
	}
	var client http.Client
	client.Timeout = 10 * time.Second

	// Prepare the request
	jsonData, _ := json.Marshal(reqDetails.Body)
	
	req, err := http.NewRequest(reqDetails.Method, reqDetails.URL, bytes.NewBuffer(jsonData))
	if err != nil {
		return ResponseDetails{}, err
	}
	// Add headers
	for key, value := range reqDetails.Headers {
		req.Header.Set(key, value)
	}
	

	// Send the request
	resp, err := client.Do(req)
	if err != nil {
		return ResponseDetails{}, err
	}
	defer resp.Body.Close()

	// Read the response body
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return ResponseDetails{}, err
	}

	// Collect headers
	responseHeaders := make(map[string]string)
	for key, values := range resp.Header {
		responseHeaders[key] = values[0]
	}

	return ResponseDetails{
		StatusCode: resp.StatusCode,
		Headers:    responseHeaders,
		Body:       string(body),
	}, nil
}
