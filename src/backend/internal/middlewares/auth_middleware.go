package middlewares

import (
	"errors"

	"github.com/PakornPK/rent-building/configs"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

func AuthMiddleware(cfg *configs.AuthConfig) fiber.Handler {
	return func(c *fiber.Ctx) error {
		tokenString := c.Get("Authorization")
		if tokenString == "" {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Authorization header is missing"})
		}

		if len(tokenString) < 7 || tokenString[:7] != "Bearer " {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid authorization format"})
		}
		tokenString = tokenString[7:] // Remove "Bearer " prefix
		if tokenString == "" {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Token is missing"})
		}
		claims, err := parseTokenClaims(tokenString, []byte(cfg.PrivateKey))
		if err != nil {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid token: " + err.Error()})
		}
		if userID, ok := claims["sub"].(float64); ok {
			c.Locals("userID", int(userID))
		}
		if email, ok := claims["email"].(string); ok {
			c.Locals("userEmail", email)
		}
		if org, ok := claims["org"].(string); ok {
			c.Locals("userOrganization", org)
		}
		if admin, ok := claims["admin"].(bool); ok {
			c.Locals("userIsAdmin", admin)
		}
		if active, ok := claims["active"].(bool); ok && !active {
			return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "User is not active"})
		}

		return c.Next()
	}
}

func parseTokenClaims(tokenString string, secretKey []byte) (map[string]interface{}, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("unexpected signing method")
		}
		return secretKey, nil
	})
	if err != nil || !token.Valid {
		return nil, err
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok {
		return claims, nil
	}
	return nil, errors.New("invalid token claims")
}

func getUserIDFromToken(tokenString string, secretKey []byte) (int, error) {
	claims, err := parseTokenClaims(tokenString, secretKey)
	if err != nil {
		return 0, err
	}

	if userID, ok := claims["sub"].(float64); ok {
		return int(userID), nil
	}
	return 0, errors.New("user ID not found in token claims")
}

func getUserEmailFromToken(tokenString string, secretKey []byte) (string, error) {
	claims, err := parseTokenClaims(tokenString, secretKey)
	if err != nil {
		return "", err
	}

	if email, ok := claims["email"].(string); ok {
		return email, nil
	}
	return "", errors.New("email not found in token claims")
}
