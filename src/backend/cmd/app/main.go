package main

import (
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/PakornPK/rent-building/configs"
	"github.com/PakornPK/rent-building/infra"
	"github.com/PakornPK/rent-building/internal/api"
)

func main() {
	cfg, err := configs.NewConfig()
	if err != nil {
		panic(err)
	}

	db := infra.NewDatabase(&cfg.Database)
	err = db.Connect()
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer func() {
		if err := db.Close(); err != nil {
			log.Fatalf("Failed to close database connection: %v", err)
		}
		log.Println("Database connection closed")
	}()

	serverErr := make(chan error, 1)
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)

	go func() {
		if err := api.StartServer(db.GetConnectionDB(), &cfg.Server); err != nil {
			serverErr <- err
		}
	}()

	select {
	case err := <-serverErr:
		log.Fatalf("Server error: %v", err)
	case <-quit:
		log.Println("Shutting down server...")
	}
}
