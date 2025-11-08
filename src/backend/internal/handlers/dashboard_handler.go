package handlers

import (
	"github.com/PakornPK/rent-building/internal/services"
	"github.com/gofiber/fiber/v2"
)

type DashboardHandler interface {
	GetDashboard(c *fiber.Ctx) error
}

type dashboardHandler struct {
	roomSvc services.RoomRentalService
}

func NewDashboardHandler(roomSvc services.RoomRentalService) DashboardHandler {
	return &dashboardHandler{
		roomSvc: roomSvc,
	}
}

func (h *dashboardHandler) GetDashboard(c *fiber.Ctx) error {
	rooms, err := h.roomSvc.GetAll(nil)
	if err != nil {
		return c.SendStatus(fiber.StatusInternalServerError)
	}
	totalRoom := len(rooms)
	vacant := 0
	for _, v := range rooms {
		if v.Status == "VACANT" {
			vacant += 1
		}
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"total":    totalRoom,
		"vacant":   vacant,
		"occupied": totalRoom - vacant,
	})
}
