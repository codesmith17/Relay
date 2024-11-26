package main

import (
	"log"
	"net/http"
	"backend/api"
)
import "backend/api"


func main() {
	http.HandleFunc("/sum", api.SumHandler)

	log.Println("Server is running on http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
