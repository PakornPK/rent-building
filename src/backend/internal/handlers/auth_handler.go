package handlers

import (
	"github.com/PakornPK/rent-building/internal/services"
	"github.com/gofiber/fiber/v2"
)

type AuthHandler interface {
	Login(c *fiber.Ctx) error
	Logout(c *fiber.Ctx) error
	RefreshToken(c *fiber.Ctx) error
}

type authHandler struct {
	authService services.AuthService
}

func NewAuthHandler(authService services.AuthService) AuthHandler {
	return &authHandler{authService: authService}
}

func (h *authHandler) Login(c *fiber.Ctx) error {
	var loginInput services.LoginInput
	if err := c.BodyParser(&loginInput); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input: " + err.Error()})
	}
	token, err := h.authService.Login(loginInput)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Login failed: " + err.Error()})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{"token": token})
}

func (h *authHandler) Logout(c *fiber.Ctx) error {
	id := c.Locals("userID").(int)
	if err := h.authService.Logout(id); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Logout failed: " + err.Error()})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Logged out successfully"})
}

func (h *authHandler) RefreshToken(c *fiber.Ctx) error {
	refreshToken := c.Cookies("refresh_token")
	token, err := h.authService.RefreshToken(refreshToken)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Refresh token failed: " + err.Error()})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{"token": token})
}
