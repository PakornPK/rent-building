package handlers

import (
	"github.com/PakornPK/rent-building/internal/services"
	"github.com/PakornPK/rent-building/logger"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

type UserHandler interface {
	CreateUser(c *fiber.Ctx) error
	GetUser(c *fiber.Ctx) error
	UpdateUser(c *fiber.Ctx) error
	UpdateUserPassword(c *fiber.Ctx) error
	DeleteUser(c *fiber.Ctx) error
	ListUsers(c *fiber.Ctx) error
}

type userHandler struct {
	userServ services.UserService
	logger   logger.Logger
}

func NewUserHandler(userServ services.UserService, logger logger.Logger) UserHandler {
	return &userHandler{userServ: userServ, logger: logger}
}

func (h *userHandler) CreateUser(c *fiber.Ctx) error {
	requestID := c.Get("Request-Id", uuid.New().String())
	logger := h.logger.WithRequestID(requestID).WithUserID(c.Locals("userID").(int))
	var userInput []services.UserInput
	if err := c.BodyParser(&userInput); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input: " + err.Error()})
	}
	if err := h.userServ.CreateUser(userInput...); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create user"})
	}
	logger.Info("User created successfully")
	return c.SendStatus(fiber.StatusCreated)
}

func (h *userHandler) GetUser(c *fiber.Ctx) error {
	requestID := c.Get("Request-Id", uuid.New().String())
	logger := h.logger.WithRequestID(requestID).WithUserID(c.Locals("userID").(int))
	id, err := c.ParamsInt("id")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid user ID"})
	}
	user, err := h.userServ.GetByID(id)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "User not found"})
	}
	logger.Info("User retrieved successfully")
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"data": user,
	})
}

func (h *userHandler) UpdateUser(c *fiber.Ctx) error {
	requestID := c.Get("Request-Id", uuid.New().String())
	logger := h.logger.WithRequestID(requestID).WithUserID(c.Locals("userID").(int))
	id, err := c.ParamsInt("id")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid user ID"})
	}
	var userInput services.UserInput
	if err := c.BodyParser(&userInput); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input: " + err.Error()})
	}
	if err := h.userServ.Update(id, userInput); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update user"})
	}
	logger.Info("User updated successfully")
	return c.SendStatus(fiber.StatusNoContent)
}

func (h *userHandler) DeleteUser(c *fiber.Ctx) error {
	requestID := c.Get("Request-Id", uuid.New().String())
	userID := c.Locals("userID").(int)
	logger := h.logger.WithRequestID(requestID).WithUserID(userID)
	id, err := c.ParamsInt("id")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid user ID"})
	}
	if userID == id {
		return c.SendStatus(fiber.StatusBadRequest)
	}
	if err := h.userServ.Delete(id); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to delete user"})
	}
	logger.Info("User deleted successfully")
	return c.SendStatus(fiber.StatusNoContent)
}

func (h *userHandler) ListUsers(c *fiber.Ctx) error {
	requestID := c.Get("Request-Id", uuid.New().String())
	logger := h.logger.WithRequestID(requestID).WithUserID(c.Locals("userID").(int))
	input, err := paginationInputBuilder(c.Queries())
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	users, err := h.userServ.List(input)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to list users"})
	}
	logger.Info("Users listed successfully")
	return c.Status(fiber.StatusOK).JSON(users)
}

func (h *userHandler) UpdateUserPassword(c *fiber.Ctx) error {
	requestID := c.Get("Request-Id", uuid.New().String())
	logger := h.logger.WithRequestID(requestID).WithUserID(c.Locals("userID").(int))
	id, err := c.ParamsInt("id")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid user ID"})
	}
	var input struct {
		NewPassword string `json:"new_password"`
	}
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input: " + err.Error()})
	}
	if err := h.userServ.UpdatePassword(id, input.NewPassword); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update password"})
	}
	logger.Info("Password updated successfully")
	return c.SendStatus(fiber.StatusNoContent)
}
