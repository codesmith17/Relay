package main

import (
	"backend/handlers"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"log"
)

func main() {
	// Create a new Echo instance
	e := echo.New()

	// Middleware for logging and recovery
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	// CORS Middleware
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"http://localhost:5173"}, // Replace with your frontend URL
		AllowMethods: []string{echo.GET, echo.POST, echo.PUT, echo.DELETE},
		AllowHeaders: []string{echo.HeaderContentType, echo.HeaderAuthorization},
	}))

	// API Routes
	setupRoutes(e)

	// Start the server
	log.Println("Starting server on port :8080...")
	e.Logger.Fatal(e.Start(":8080"))
}

// setupRoutes initializes all API routes
func setupRoutes(e *echo.Echo) {
	// Request execution route
	e.GET("/api/execute", handlers.ExecuteRequest)
	e.POST("/api/execute", handlers.ExecuteRequest)
	e.PATCH("/api/execute", handlers.ExecuteRequest)
}
