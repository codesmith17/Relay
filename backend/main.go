package main

import (
	"backend/handlers"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	// Create a new Echo instance
	e := echo.New()

	// Middleware for logging and recovery
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	// Routes
	e.POST("/api/execute", handlers.ExecuteRequest)

	// Start the server
	e.Logger.Fatal(e.Start(":8080"))
}
