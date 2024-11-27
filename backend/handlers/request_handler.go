package handlers

import (
	"backend/services"
	"github.com/labstack/echo/v4"
	"net/http"
)

// ExecuteRequest handles API request execution
func ExecuteRequest(c echo.Context) error {
	// Parse the request body
	var reqDetails services.RequestDetails
	if err := c.Bind(&reqDetails); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request payload"})
	}

	// Execute the request
	response, err := services.ExecuteRequest(reqDetails)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	// Return the response
	return c.JSON(http.StatusOK, response)
}
