package handlers

import (
	"github.com/PakornPK/rent-building/internal/services"
	"github.com/gofiber/fiber/v2"
)

type AuthHandler interface {
	SetSecure(secure bool) AuthHandler
	Login(c *fiber.Ctx) error
	Logout(c *fiber.Ctx) error
	RefreshToken(c *fiber.Ctx) error
}

type authHandler struct {
	authService services.AuthService
	Secure      bool
}

func NewAuthHandler(authService services.AuthService) AuthHandler {
	return &authHandler{
		authService: authService,
		Secure:      true,
	}
}

func (h *authHandler) SetSecure(secure bool) AuthHandler {
	h.Secure = secure
	return h
}

// TODO: ADD REDIS CACHE
func (h *authHandler) Login(c *fiber.Ctx) error {
	var loginInput services.LoginInput
	if err := c.BodyParser(&loginInput); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input: " + err.Error()})
	}
	token, refToken, err := h.authService.Login(loginInput)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Login failed: " + err.Error()})
	}
	sameSite := "lax"
	if h.Secure {
		sameSite = "none"
	}
	c.Cookie(&fiber.Cookie{
		Name:     "refresh_token",
		Value:    refToken,
		Secure:   h.Secure,
		HTTPOnly: true,
		SameSite: sameSite,
		Path:     "/",
	})
	return c.Status(fiber.StatusOK).JSON(token)
}

func (h *authHandler) Logout(c *fiber.Ctx) error {
	id := c.Locals("userID").(int)
	if err := h.authService.Logout(id); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Logout failed: " + err.Error()})
	}
	c.ClearCookie("refresh_token")
	return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Logged out successfully"})
}

func (h *authHandler) RefreshToken(c *fiber.Ctx) error {
	refreshToken := c.Cookies("refresh_token")
	token, refToken, err := h.authService.RefreshToken(refreshToken)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Refresh token failed: " + err.Error()})
	}
	c.Cookie(&fiber.Cookie{
		Name:     "refresh_token",
		Value:    refToken,
		Secure:   true,
		HTTPOnly: true,
		SameSite: "Lax",
		Path:     "/",
	})
	return c.Status(fiber.StatusOK).JSON(token)
}
