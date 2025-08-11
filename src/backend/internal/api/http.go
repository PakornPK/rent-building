package api

import (
	"fmt"

	"github.com/PakornPK/rent-building/configs"
	"github.com/PakornPK/rent-building/infra"
	"github.com/PakornPK/rent-building/internal/handlers"
	"github.com/PakornPK/rent-building/internal/repositories"
	"github.com/PakornPK/rent-building/internal/services"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/log"
)

type handler struct {
	user handlers.UserHandler
}

type server struct {
	user services.UserService
}

type repository struct {
	user repositories.UserRepository
}

func StartServer(conn *infra.ConnectionDB, cfg *configs.ServerConfig) error {
	appCfg := fiber.Config{
		DisableStartupMessage: true,
	}
	app := fiber.New(appCfg)

	repo := InitializeRepository(conn)
	service := initializeService(repo)
	handler := initializeHandlers(service)
	initializedRouter(app, handler)

	log.Info("Starting server on port:", cfg.Port)
	return app.Listen(fmt.Sprintf(":%d", cfg.Port))
}

func initializedRouter(app *fiber.App, handler *handler) {
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.SendStatus(fiber.StatusOK)
	})
	user := app.Group("/users")
	userRouter(user, handler.user)
}

func InitializeRepository(conn *infra.ConnectionDB) *repository {
	userRepo := repositories.NewUserRepository(conn)

	return &repository{
		user: userRepo,
	}
}

func initializeService(repo *repository) *server {
	userService := services.NewUserService(repo.user)

	return &server{
		user: userService,
	}
}

func initializeHandlers(service *server) *handler {
	// Initialize user handler
	userHandler := handlers.NewUserHandler(service.user)

	return &handler{
		user: userHandler,
	}
}

func userRouter(router fiber.Router, userHandler handlers.UserHandler) {
	router.Get("/", userHandler.ListUsers)
	router.Post("/", userHandler.CreateUser)
	router.Get("/:id", userHandler.GetUser)
	router.Put("/:id", userHandler.UpdateUser)
	router.Patch("/:id", userHandler.UpdateUserPassword)
	router.Delete("/:id", userHandler.DeleteUser)
}
