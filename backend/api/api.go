package api

import (
	"encoding/json"
	"net/http"
	"strconv"
)

// Response structure for the API
type Response struct {
	Result int `json:"result"`
}

// SumHandler handles requests to the /sum endpoint
func SumHandler(w http.ResponseWriter, r *http.Request) {
	// Parse query parameters
	a := r.URL.Query().Get("a")
	b := r.URL.Query().Get("b")

	// Convert parameters to integers
	var num1, num2 int
	var err error
	if num1, err = strconv.Atoi(a); err != nil {
		http.Error(w, "Invalid 'a' parameter", http.StatusBadRequest)
		return
	}
	if num2, err = strconv.Atoi(b); err != nil {
		http.Error(w, "Invalid 'b' parameter", http.StatusBadRequest)
		return
	}

	// Calculate sum
	result := num1 + num2

	// Respond with JSON
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(Response{Result: result})
}
