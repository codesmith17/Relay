package handlers

import (
	"backend/services"
	"github.com/labstack/echo/v4"
	"net/http"
)

// ExecuteRequest handles API request execution for all HTTP methods
func ExecuteRequest(c echo.Context) error {
	var reqDetails services.RequestDetails

	// Bind and validate the incoming JSON payload
	if err := c.Bind(&reqDetails); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Invalid request payload: " + err.Error(),
		})
	}

	// Validate required fields
	if reqDetails.URL == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "The 'url' field is required",
		})
	}

	// Default the method to GET if not provided
	if reqDetails.Method == "" {
		reqDetails.Method = "GET"
	}

	// Ensure the method is valid
	if reqDetails.Method != "GET" && reqDetails.Method != "POST" && reqDetails.Method != "PATCH" {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Unsupported HTTP method: " + reqDetails.Method,
		})
	}

	// Process the request using the service layer
	response, err := services.ExecuteRequest(reqDetails)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Failed to execute request: " + err.Error(),
		})
	}

	return c.JSON(http.StatusOK, response)
}
