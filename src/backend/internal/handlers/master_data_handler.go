package handlers

import (
	"github.com/PakornPK/rent-building/internal/services"
	"github.com/gofiber/fiber/v2"
)

type MasterDataHandler interface {
	Dropdown(c *fiber.Ctx) error
}

type masterDataHandler struct {
	masterDataService services.MasterDataService
}

func NewMasterDataHandler(masterDataService services.MasterDataService) MasterDataHandler {
	return &masterDataHandler{masterDataService: masterDataService}
}

func (h *masterDataHandler) Dropdown(c *fiber.Ctx) error {
	key := c.Query("key")
	if key == "" {
		return c.SendStatus(fiber.StatusBadRequest)
	}
	value := c.QueryInt("value", 0)
	result, err := h.masterDataService.Dropdown(services.MasterDataInput{
		Key:   key,
		Value: value,
	})
	if err != nil {
		return c.SendStatus(fiber.StatusInternalServerError)
	}
	return c.Status(fiber.StatusOK).JSON(result)
}
