package server

import (
	"fmt"

	"github.com/PakornPK/rent-building/configs"
	"github.com/PakornPK/rent-building/infra"
	"github.com/PakornPK/rent-building/internal/entities"
	"github.com/PakornPK/rent-building/internal/handlers"
	"github.com/PakornPK/rent-building/internal/middlewares"
	"github.com/PakornPK/rent-building/internal/repositories"
	"github.com/PakornPK/rent-building/internal/services"
	"github.com/PakornPK/rent-building/logger"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/recover"
)

type handler struct {
	auth       handlers.AuthHandler
	user       handlers.UserHandler
	rental     handlers.RentalsHandler
	masterData handlers.MasterDataHandler
	room       handlers.RoomHandler
	building   handlers.BuildingHandler
	tenants    handlers.TenantsHandler
	dashboard  handlers.DashboardHandler
}

type server struct {
	auth       services.AuthService
	user       services.UserService
	rental     services.RentalService
	masterData services.MasterDataService
	roomRental services.RoomRentalService
	building   services.BuildingService
	tenants    services.TenantsService
}

type repository struct {
	user           repositories.UserRepository
	masterType     repositories.MasterDataRepository[entities.Type]
	masterCategory repositories.MasterDataRepository[entities.Category]
	masterGroup    repositories.MasterDataRepository[entities.Group]
	rental         repositories.RentalRepository
	building       repositories.BuildingRepository
	room           repositories.RoomRepository
	rentalRoom     repositories.RoomRentalRepository
	tenants        repositories.TenantsRepository
}

func StartServer(conn *infra.ConnectionDB, cfg configs.Config, logger logger.Logger) error {
	appCfg := fiber.Config{
		DisableStartupMessage: true,
	}
	app := fiber.New(appCfg)

	repo := InitializeRepository(conn)
	service := initializeService(repo, cfg)
	handler := initializeHandlers(service, cfg, logger)
	initializedRouter(app, handler, cfg)
	logger.Info(fmt.Sprintf("Starting server on port: %d", cfg.Server.Port))
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
	rental := api.Group("/rentals").Use(authMiddleware)
	rentalRouter(rental, handler.rental)
	masterData := api.Group("/master-data").Use(authMiddleware)
	masterDataRouter(masterData, handler.masterData)
	building := api.Group("/buildings").Use(authMiddleware)
	buildingRouter(building, handler.building)
	room := api.Group("/rooms").Use(authMiddleware)
	roomRouter(room, handler.room)
	tenants := api.Group("/tenants").Use(authMiddleware)
	tenantsRouter(tenants, handler.tenants)
	dashboard := api.Group("/dashboard").Use(authMiddleware)
	dashboardHandler(dashboard, handler.dashboard)
}

func InitializeRepository(conn *infra.ConnectionDB) *repository {
	userRepo := repositories.NewUserRepository(conn)
	masterTypeRepo := repositories.NewMasterDataRepository[entities.Type](conn)
	masterCategoryRepo := repositories.NewMasterDataRepository[entities.Category](conn)
	masterGroupRepo := repositories.NewMasterDataRepository[entities.Group](conn)
	rentalRepo := repositories.NewRentalRepository(conn)
	buildingRepo := repositories.NewBuildingRepository(conn)
	roomRepo := repositories.NewRoomRepository(conn)
	roomRentalRepo := repositories.NewRoomRentalRepository(conn)
	tenantsRepo := repositories.NewTenantsRepository(conn)
	return &repository{
		user:           userRepo,
		masterType:     masterTypeRepo,
		masterCategory: masterCategoryRepo,
		masterGroup:    masterGroupRepo,
		rental:         rentalRepo,
		building:       buildingRepo,
		room:           roomRepo,
		rentalRoom:     roomRentalRepo,
		tenants:        tenantsRepo,
	}
}

func initializeService(repo *repository, cfg configs.Config) *server {
	userService := services.NewUserService(repo.user)
	authService := services.NewAuthService(userService, &cfg.Auth)
	rentalService := services.NewRentalService(repo.rental)
	masterDataService := services.NewMasterDataService(repo.masterType, repo.masterCategory, repo.masterGroup)
	roomRentalService := services.NewRoomRentalService(repo.room, repo.rental, repo.rentalRoom)
	buildingService := services.NewBuildingService(repo.building)
	tenantsService := services.NewTenantsService(repo.tenants)
	return &server{
		auth:       authService,
		user:       userService,
		rental:     rentalService,
		masterData: masterDataService,
		roomRental: roomRentalService,
		building:   buildingService,
		tenants:    tenantsService,
	}
}

func initializeHandlers(service *server, cfg configs.Config, logger logger.Logger) *handler {
	// Initialize user handler
	userHandler := handlers.NewUserHandler(service.user, logger)
	authHandler := handlers.NewAuthHandler(service.auth).SetSecure(cfg.App.IsProduction())
	rentalHandler := handlers.NewRentalsHandler(service.rental, logger)
	masterDataHandler := handlers.NewMasterDataHandler(service.masterData)
	buildingHandler := handlers.NewBuildingHandler(service.building, logger)
	roomHandler := handlers.NewRoomHandler(service.roomRental, logger)
	tenantsHandler := handlers.NewTenantsHandler(service.tenants, logger)
	dashboardHnadler := handlers.NewDashboardHandler(service.roomRental)
	return &handler{
		auth:       authHandler,
		user:       userHandler,
		rental:     rentalHandler,
		masterData: masterDataHandler,
		room:       roomHandler,
		building:   buildingHandler,
		tenants:    tenantsHandler,
		dashboard:  dashboardHnadler,
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

func rentalRouter(router fiber.Router, rentalHandler handlers.RentalsHandler) {
	router.Get("/", rentalHandler.ListRentals)
	router.Post("/", rentalHandler.CreateRental)
	router.Get("/:id", rentalHandler.GetRental)
	router.Put("/:id", rentalHandler.UpdateRental)
	router.Delete("/:id", rentalHandler.DeleteRental)
}

func masterDataRouter(router fiber.Router, masterDataHandler handlers.MasterDataHandler) {
	router.Get("/dropdown", masterDataHandler.Dropdown)
}

func buildingRouter(router fiber.Router, buildingHandler handlers.BuildingHandler) {
	router.Get("/", buildingHandler.ListBuilding)
	router.Get("/dropdown", buildingHandler.Dropdown)
	router.Post("/", buildingHandler.CreateBuilding)
	router.Put("/:id", buildingHandler.UpdateBuilding)
}

func roomRouter(router fiber.Router, roomHandler handlers.RoomHandler) {
	router.Get("/", roomHandler.ListRoom)
	router.Get("/dropdown", roomHandler.Dropdown)
	router.Post("/", roomHandler.CreateRoom)
	router.Post("/swap", roomHandler.SwapRoom)
	router.Get("/:id", roomHandler.GetRoom)
	router.Get("/:id/rental", roomHandler.ListRental)
	router.Put("/:id", roomHandler.UpdateRoom)
	router.Put("/:id/rental", roomHandler.UpdateRental)
	router.Post("/rental", roomHandler.AppendRoomRental)
	router.Delete("/rental", roomHandler.RemoveRoomRental)
	router.Delete("/:id", roomHandler.DeleteRoom)
}

func tenantsRouter(router fiber.Router, tenantsHandler handlers.TenantsHandler) {
	router.Get("/", tenantsHandler.ListTenants)
	router.Post("/", tenantsHandler.CreateTenant)
	router.Post("/invoice", tenantsHandler.Invoice)
	router.Get("/:id", tenantsHandler.GetTenant)
	router.Put("/:id", tenantsHandler.UpdateTenant)
	router.Delete("/:id", tenantsHandler.DeleteTenant)
}

func dashboardHandler(router fiber.Router, dashboardHandler handlers.DashboardHandler) {
	router.Get("/", dashboardHandler.GetDashboard)
}
