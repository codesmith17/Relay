package services

import (
    "bytes"
    "encoding/json"
    "fmt"
    "io/ioutil"
    "net/http"
)

type RequestDetails struct {
    Method  string            `json:"method"`
    URL     string            `json:"url"`
    Headers map[string]string `json:"headers"`
    Body    interface{}       `json:"body"`
}

func ExecuteRequest(details RequestDetails) (map[string]interface{}, error) {
	var requestBody []byte
	if details.Body != nil {
			bodyStr, ok := details.Body.(string)
			if ok {
					requestBody = []byte(bodyStr)
			} else {
					var err error
					requestBody, err = json.Marshal(details.Body)
					if err != nil {
							return nil, fmt.Errorf("error marshaling request body: %w", err)
					}
			}
	}

	req, err := http.NewRequest(details.Method, details.URL, bytes.NewBuffer(requestBody))
	if err != nil {
			return nil, fmt.Errorf("error creating request: %w", err)
	}

	for key, value := range details.Headers {
			req.Header.Set(key, value)
	}

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
			return nil, fmt.Errorf("error performing request: %w", err)
	}
	defer resp.Body.Close()

	bodyBytes, err := ioutil.ReadAll(resp.Body)
	if err != nil {
			return nil, fmt.Errorf("error reading response body: %w", err)
	}

	responseDetails := map[string]interface{}{
			"statusCode": resp.StatusCode,
			"headers":    resp.Header,
			"body":       string(bodyBytes), // Send as a string; frontend can parse JSON if needed
	}

	return responseDetails, nil
}
