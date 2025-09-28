package handlers

import (
	"github.com/PakornPK/rent-building/internal/services"
	"github.com/gofiber/fiber/v2"
)

type RentalsHandler interface {
	ListRentals(c *fiber.Ctx) error
	CreateRental(c *fiber.Ctx) error
	GetRental(c *fiber.Ctx) error
	UpdateRental(c *fiber.Ctx) error
	DeleteRental(c *fiber.Ctx) error
}

type rentalsHandler struct {
	service services.RentalService
}

func NewRentalsHandler(service services.RentalService) RentalsHandler {
	return &rentalsHandler{service: service}
}

func (h *rentalsHandler) ListRentals(c *fiber.Ctx) error {
	input, err := paginationInputBuilder(c.Queries())
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	rentals, err := h.service.List(input)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	return c.Status(fiber.StatusOK).JSON(rentals)
}

func (h *rentalsHandler) CreateRental(c *fiber.Ctx) error {
	var input []services.RentalInput
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	if err := h.service.Create(input...); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "rental created successfully",
	})
}

func (h *rentalsHandler) GetRental(c *fiber.Ctx) error {
	id, err := c.ParamsInt("id")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	rental, err := h.service.GetByID(id)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	return c.Status(fiber.StatusOK).JSON(rental)
}

func (h *rentalsHandler) UpdateRental(c *fiber.Ctx) error {
	id, err := c.ParamsInt("id")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	var input services.RentalInput
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	if err := h.service.Update(id, &input); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "rental updated successfully",
	})
}

func (h *rentalsHandler) DeleteRental(c *fiber.Ctx) error {
	id, err := c.ParamsInt("id")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	if err := h.service.Delete(id); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "rental deleted successfully",
	})
}
