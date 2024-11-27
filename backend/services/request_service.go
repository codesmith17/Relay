package services

import (
	"bytes"
	"errors"
	"fmt"
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
	// Validate the URL
	if reqDetails.URL == "" {
		return ResponseDetails{}, errors.New("URL is required")
	}

	// Create HTTP client
	client := http.Client{
		Timeout: 10 * time.Second,
	}

	// Prepare the request body
	var reqBody io.Reader
	if reqDetails.Body != "" {
		reqBody = bytes.NewBuffer([]byte(reqDetails.Body)) // Use raw JSON string
	} else {
		reqBody = nil
	}

	// Create a new HTTP request
	req, err := http.NewRequest(reqDetails.Method, reqDetails.URL, reqBody)
	if err != nil {
		return ResponseDetails{}, fmt.Errorf("failed to create request: %w", err)
	}

	// Add headers
	for key, value := range reqDetails.Headers {
		req.Header.Set(key, value)
	}

	// Execute the request
	resp, err := client.Do(req)
	if err != nil {
		return ResponseDetails{}, fmt.Errorf("request execution failed: %w", err)
	}
	defer resp.Body.Close()

	// Read response body
	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return ResponseDetails{}, fmt.Errorf("failed to read response: %w", err)
	}

	// Extract headers
	responseHeaders := make(map[string]string)
	for key, values := range resp.Header {
		responseHeaders[key] = values[0] // Take the first value for simplicity
	}

	// Return response details
	return ResponseDetails{
		StatusCode: resp.StatusCode,
		Headers:    responseHeaders,
		Body:       string(respBody),
	}, nil
}

