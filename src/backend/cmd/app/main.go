package main

import (
	"fmt"
	"os"
	"os/signal"
	"syscall"

	"github.com/PakornPK/rent-building/configs"
	"github.com/PakornPK/rent-building/infra"
	"github.com/PakornPK/rent-building/logger"
	"github.com/PakornPK/rent-building/server"
)

func main() {
	cfg, err := configs.NewConfig()
	if err != nil {
		panic(err)
	}
	logger, err := logger.NewLogger(*cfg)
	if err != nil {
		panic(err)
	}
	defer logger.Sync()

	db := infra.NewDatabase(&cfg.Database, !cfg.App.IsProduction())
	err = db.Connect()
	if err != nil {
		logger.Fatal(fmt.Sprintf("Failed to connect to database: %v", err))
	}
	defer func() {
		if err := db.Close(); err != nil {
			logger.Fatal(fmt.Sprintf("Failed to close database connection: %v", err))
		}
		logger.Info("Database connection closed")
	}()

	serverErr := make(chan error, 1)
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)

	go func() {
		if err := server.StartServer(db.GetConnectionDB(), *cfg, logger); err != nil {
			serverErr <- err
		}
	}()

	select {
	case err := <-serverErr:
		logger.Fatal(fmt.Sprintf("Server error: %v", err))
	case <-quit:
		logger.Info("Shutting down server...")
	}
}
