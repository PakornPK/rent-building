package handlers

import (
	"github.com/PakornPK/rent-building/internal/services"
	"github.com/PakornPK/rent-building/logger"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

type RoomHandler interface {
	CreateRoom(c *fiber.Ctx) error
	ListRoom(c *fiber.Ctx) error
	GetRoom(c *fiber.Ctx) error
	UpdateRoom(c *fiber.Ctx) error
	DeleteRoom(c *fiber.Ctx) error
	AppendRoomRental(c *fiber.Ctx) error
	RemoveRoomRental(c *fiber.Ctx) error
	ListRental(c *fiber.Ctx) error
}

type roomHandler struct {
	service services.RoomRentalService
	logger  logger.Logger
}

func NewRoomHandler(service services.RoomRentalService, logger logger.Logger) RoomHandler {
	return &roomHandler{
		service: service,
		logger:  logger,
	}
}

func (h *roomHandler) CreateRoom(c *fiber.Ctx) error {
	requestID := c.Get("Request-Id", uuid.New().String())
	logger := h.logger.WithRequestID(requestID).WithUserID(c.Locals("userID").(int))
	req := make([]services.RoomInput, 0)
	if err := c.BodyParser(&req); err != nil {
		return c.SendStatus(fiber.StatusBadRequest)
	}
	err := h.service.CreateRoom(req...)
	if err != nil {
		return c.SendStatus(fiber.StatusInternalServerError)
	}
	logger.Info("room created successfully")
	return c.SendStatus(fiber.StatusOK)
}

func (h *roomHandler) ListRoom(c *fiber.Ctx) error {
	requestID := c.Get("Request-Id", uuid.New().String())
	logger := h.logger.WithRequestID(requestID).WithUserID(c.Locals("userID").(int))
	input, err := paginationInputBuilder(c.Queries())
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	users, err := h.service.List(input)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to list users"})
	}
	logger.Info("room listed successfully")
	return c.Status(fiber.StatusOK).JSON(users)
}

func (h *roomHandler) GetRoom(c *fiber.Ctx) error {
	requestID := c.Get("Request-Id", uuid.New().String())
	logger := h.logger.WithRequestID(requestID).WithUserID(c.Locals("userID").(int))
	id, err := c.ParamsInt("id")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid room ID"})
	}
	room, err := h.service.GetByID(id)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update room"})
	}
	logger.Info("room updated successfully")
	return c.JSON(room)
}

func (h *roomHandler) UpdateRoom(c *fiber.Ctx) error {
	requestID := c.Get("Request-Id", uuid.New().String())
	logger := h.logger.WithRequestID(requestID).WithUserID(c.Locals("userID").(int))
	id, err := c.ParamsInt("id")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid room ID"})
	}
	var input services.RoomInput
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input: " + err.Error()})
	}
	if input.Status != "OCCUPIED" && input.Status != "VACANT" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid status value"})
	}
	if err := h.service.Update(id, input); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update room"})
	}
	logger.Info("room updated successfully")
	return c.SendStatus(fiber.StatusOK)
}

func (h *roomHandler) DeleteRoom(c *fiber.Ctx) error {
	requestID := c.Get("Request-Id", uuid.New().String())
	logger := h.logger.WithRequestID(requestID).WithUserID(c.Locals("userID").(int))
	id, err := c.ParamsInt("id")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid room ID"})
	}

	if err := h.service.DeleteByID(id); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update room"})
	}
	logger.Info("room deleted successfully")
	return c.SendStatus(fiber.StatusOK)
}

func (h *roomHandler) AppendRoomRental(c *fiber.Ctx) error {
	requestID := c.Get("Request-Id", uuid.New().String())
	logger := h.logger.WithRequestID(requestID).WithUserID(c.Locals("userID").(int))
	req := make([]services.RoomRentalInput, 0)
	if err := c.BodyParser(&req); err != nil {
		return c.SendStatus(fiber.StatusBadRequest)
	}
	err := h.service.AppendRental(req...)
	if err != nil {
		return c.SendStatus(fiber.StatusInternalServerError)
	}
	logger.Info("room rental added successfully")
	return c.SendStatus(fiber.StatusOK)
}

func (h *roomHandler) RemoveRoomRental(c *fiber.Ctx) error {
	requestID := c.Get("Request-Id", uuid.New().String())
	logger := h.logger.WithRequestID(requestID).WithUserID(c.Locals("userID").(int))
	req := make([]services.DeleteRentalInput, 0)
	if err := c.BodyParser(&req); err != nil {
		return c.SendStatus(fiber.StatusBadRequest)
	}

	if err := h.service.RemoveRental(req...); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update user"})
	}
	logger.Info("room rental deletd successfully")
	return c.SendStatus(fiber.StatusOK)
}

func (h *roomHandler) ListRental(c *fiber.Ctx) error {
	requestID := c.Get("Request-Id", uuid.New().String())
	logger := h.logger.WithRequestID(requestID).WithUserID(c.Locals("userID").(int))
	id, err := c.ParamsInt("id")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid room ID"})
	}
	rentals, err := h.service.ListRental(id)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to list rentals"})
	}
	logger.Info("rental listed successfully")
	return c.Status(fiber.StatusOK).JSON(rentals)
}
