package handlers

import (
	"github.com/PakornPK/rent-building/internal/services"
	"github.com/PakornPK/rent-building/logger"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

type BuildingHandler interface {
	CreateBuilding(ctx *fiber.Ctx) error
	ListBuilding(ctx *fiber.Ctx) error
	UpdateBuilding(ctx *fiber.Ctx) error
	Dropdown(ctx *fiber.Ctx) error
}

type buildingHandler struct {
	service services.BuildingService
	logger  logger.Logger
}

func NewBuildingHandler(service services.BuildingService, logger logger.Logger) BuildingHandler {
	return &buildingHandler{
		service: service,
		logger:  logger,
	}
}

func (h *buildingHandler) CreateBuilding(ctx *fiber.Ctx) error {
	requestID := ctx.Get("Request-Id", uuid.New().String())
	logger := h.logger.WithRequestID(requestID).WithUserID(ctx.Locals("userID").(int))
	req := make([]services.BuildingInput, 0)
	if err := ctx.BodyParser(&req); err != nil {
		return ctx.SendStatus(fiber.StatusBadRequest)
	}
	err := h.service.Create(req...)
	if err != nil {
		return ctx.SendStatus(fiber.StatusInternalServerError)
	}
	logger.Info("building created successfully")
	return ctx.SendStatus(fiber.StatusOK)
}

func (h *buildingHandler) ListBuilding(ctx *fiber.Ctx) error {
	requestID := ctx.Get("Request-Id", uuid.New().String())
	logger := h.logger.WithRequestID(requestID).WithUserID(ctx.Locals("userID").(int))
	input, err := paginationInputBuilder(ctx.Queries())
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	users, err := h.service.List(input)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to list users"})
	}
	logger.Info("building listed successfully")
	return ctx.Status(fiber.StatusOK).JSON(users)
}

func (h *buildingHandler) UpdateBuilding(c *fiber.Ctx) error {
	requestID := c.Get("Request-Id", uuid.New().String())
	logger := h.logger.WithRequestID(requestID).WithUserID(c.Locals("userID").(int))
	id, err := c.ParamsInt("id")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid building ID"})
	}
	var input services.BuildingInput
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input: " + err.Error()})
	}
	if err := h.service.Update(id, input); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "unexpected error: update building: " + err.Error()})
	}
	logger.Info("building updated successfully")
	return c.SendStatus(fiber.StatusOK)
}

func (h *buildingHandler) Dropdown(c *fiber.Ctx) error {
	result, err := h.service.Dropdown()
	if err != nil {
		return c.SendStatus(fiber.StatusInternalServerError)
	}
	return c.Status(fiber.StatusOK).JSON(result)
}
