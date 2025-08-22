package server

import (
	"fmt"

	"github.com/PakornPK/rent-building/configs"
	"github.com/PakornPK/rent-building/infra"
	"github.com/PakornPK/rent-building/internal/handlers"
	"github.com/PakornPK/rent-building/internal/middlewares"
	"github.com/PakornPK/rent-building/internal/repositories"
	"github.com/PakornPK/rent-building/internal/services"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/log"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/recover"
)

type handler struct {
	auth handlers.AuthHandler
	user handlers.UserHandler
}

type server struct {
	auth services.AuthService
	user services.UserService
}

type repository struct {
	user repositories.UserRepository
}

func StartServer(conn *infra.ConnectionDB, cfg configs.Config) error {
	appCfg := fiber.Config{
		DisableStartupMessage: true,
	}
	app := fiber.New(appCfg)

	repo := InitializeRepository(conn)
	service := initializeService(repo, cfg)
	handler := initializeHandlers(service, cfg)
	initializedRouter(app, handler, cfg)

	log.Info("Starting server on port:", cfg.Server.Port)
	return app.Listen(fmt.Sprintf(":%d", cfg.Server.Port))
}

func initializedRouter(app *fiber.App, handler *handler, cfg configs.Config) {
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.SendStatus(fiber.StatusOK)
	})

	app.Use(recover.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins:     "http://localhost:5173",
		AllowMethods:     "GET,POST,PUT,DELETE,OPTIONS",
		AllowHeaders:     "Origin, Content-Type, Accept, Authorization",
		AllowCredentials: true,
	}))

	authMiddleware := middlewares.AuthMiddleware(&cfg.Auth)
	api := app.Group("api")
	user := api.Group("/users").Use(authMiddleware)
	userRouter(user, handler.user)
	auth := api.Group("/auth")
	authRouter(auth, handler.auth, cfg.Auth)
}

func InitializeRepository(conn *infra.ConnectionDB) *repository {
	userRepo := repositories.NewUserRepository(conn)

	return &repository{
		user: userRepo,
	}
}

func initializeService(repo *repository, cfg configs.Config) *server {
	userService := services.NewUserService(repo.user)
	authService := services.NewAuthService(userService, &cfg.Auth)

	return &server{
		auth: authService,
		user: userService,
	}
}

func initializeHandlers(service *server, cfg configs.Config) *handler {
	// Initialize user handler
	userHandler := handlers.NewUserHandler(service.user)
	authHandler := handlers.NewAuthHandler(service.auth).SetSecure(cfg.App.IsProduction())

	return &handler{
		auth: authHandler,
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

func authRouter(router fiber.Router, authHandler handlers.AuthHandler, cfg configs.AuthConfig) {
	router.Post("/login", authHandler.Login)
	router.Post("/logout", middlewares.AuthMiddleware(&cfg), authHandler.Logout)
	router.Post("/refresh", authHandler.RefreshToken)
}
