package handlers

import (
	"github.com/PakornPK/rent-building/internal/services"
	"github.com/PakornPK/rent-building/logger"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

type TenantsHandler interface {
	CreateTenant(c *fiber.Ctx) error
	GetTenant(c *fiber.Ctx) error
	UpdateTenant(c *fiber.Ctx) error
	DeleteTenant(c *fiber.Ctx) error
	ListTenants(c *fiber.Ctx) error
}

type tenantsHandler struct {
	service services.TenantsService
	logger  logger.Logger
}

func NewTenantsHandler(service services.TenantsService, logger logger.Logger) TenantsHandler {
	return &tenantsHandler{
		service: service,
		logger:  logger,
	}
}

func (h *tenantsHandler) CreateTenant(c *fiber.Ctx) error {
	requestID := c.Get("Request-Id", uuid.New().String())
	logger := h.logger.WithRequestID(requestID).WithUserID(c.Locals("userID").(int))
	var tenantInput []services.TenantsInput
	if err := c.BodyParser(&tenantInput); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input: " + err.Error()})
	}
	if err := h.service.CreateTenant(tenantInput...); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create tenant"})
	}
	logger.Info("Tenant created successfully")
	return c.SendStatus(fiber.StatusCreated)
}

func (h *tenantsHandler) GetTenant(c *fiber.Ctx) error {
	requestID := c.Get("Request-Id", uuid.New().String())
	logger := h.logger.WithRequestID(requestID).WithUserID(c.Locals("userID").(int))
	id, err := c.ParamsInt("id")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid tenant ID"})
	}
	tenant, err := h.service.GetTenantByID(id)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Tenant not found"})
	}
	logger.Info("Tenant retrieved successfully")
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"data": tenant,
	})
}

func (h *tenantsHandler) UpdateTenant(c *fiber.Ctx) error {
	requestID := c.Get("Request-Id", uuid.New().String())
	logger := h.logger.WithRequestID(requestID).WithUserID(c.Locals("userID").(int))
	id, err := c.ParamsInt("id")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid user ID"})
	}
	var userInput services.TenantsInput
	if err := c.BodyParser(&userInput); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input: " + err.Error()})
	}
	if err := h.service.UpdateTenant(id, userInput); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update Tenant"})
	}
	logger.Info("Tenant updated successfully")
	return c.SendStatus(fiber.StatusNoContent)
}

func (h *tenantsHandler) DeleteTenant(c *fiber.Ctx) error {
	requestID := c.Get("Request-Id", uuid.New().String())
	userID := c.Locals("userID").(int)
	logger := h.logger.WithRequestID(requestID).WithUserID(userID)
	id, err := c.ParamsInt("id")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid Tenant ID"})
	}
	if userID == id {
		return c.SendStatus(fiber.StatusBadRequest)
	}
	if err := h.service.DeleteTenant(id); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to delete user"})
	}
	logger.Info("Tenant deleted successfully")
	return c.SendStatus(fiber.StatusNoContent)
}

func (h *tenantsHandler) ListTenants(c *fiber.Ctx) error {
	requestID := c.Get("Request-Id", uuid.New().String())
	logger := h.logger.WithRequestID(requestID).WithUserID(c.Locals("userID").(int))
	input, err := paginationInputBuilder(c.Queries())
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	users, err := h.service.ListTenants(input)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to list users"})
	}
	logger.Info("Tenents listed successfully")
	return c.Status(fiber.StatusOK).JSON(users)
}
