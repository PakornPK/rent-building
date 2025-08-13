package services

import (
	"errors"
	"time"

	"github.com/PakornPK/rent-building/configs"
	"github.com/PakornPK/rent-building/internal/utils"
	"github.com/golang-jwt/jwt/v5"
)

type AuthService interface {
	Login(input LoginInput) (*LoginOutput, error)
}

type LoginInput struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=8,max=20"`
}

type LoginOutput struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
	TokenType    string `json:"token_type"`
}
type authService struct {
	userService UserService
	cfg         *configs.AuthConfig
}

func NewAuthService(userService UserService, cfg *configs.AuthConfig) AuthService {
	return &authService{
		userService: userService,
		cfg:         cfg,
	}
}

func (s *authService) Login(input LoginInput) (*LoginOutput, error) {
	user, err := s.userService.GetByEmail(input.Email)
	if err != nil {
		return nil, err
	}

	if !utils.CheckPasswordHash(input.Password, user.Password) {
		return nil, errors.New("invalid credentials")
	}

	privateKey := s.cfg.PrivateKey
	accExpiresIn := time.Minute * time.Duration(s.cfg.ExpiresIn)
	refExpiresIn := time.Minute * time.Duration(s.cfg.RefreshIn)
	accClaims := jwt.MapClaims{
		"sub":    user.ID,
		"email":  user.Email,
		"org":    user.Organization,
		"admin":  user.IsAdmin,
		"active": user.IsActive,
		"iss":    s.cfg.Issuer,
		"iat":    time.Now().Unix(),
		"exp":    time.Now().Add(accExpiresIn).Unix(),
	}
	refClaims := jwt.MapClaims{
		"sub":    user.ID,
		"org":    user.Organization,
		"active": user.IsActive,
		"iat":    time.Now().Unix(),
		"exp":    time.Now().Add(refExpiresIn).Unix(),
	}

	tokenAccObj := jwt.NewWithClaims(jwt.SigningMethodRS256, accClaims)
	tokenRefObj := jwt.NewWithClaims(jwt.SigningMethodRS256, refClaims)

	var parsedPrivateKey interface{}
	parsedPrivateKey, err = jwt.ParseRSAPrivateKeyFromPEM([]byte(privateKey))
	if err != nil {
		return nil, err
	}

	accToken, err := tokenAccObj.SignedString(parsedPrivateKey)
	if err != nil {
		return nil, err
	}
	refToken, err := tokenRefObj.SignedString(parsedPrivateKey)
	if err != nil {
		return nil, err
	}
	if user.LastLogin == nil || user.LastLogin.Before(time.Now().Add(-24*time.Hour)) {
		now := time.Now()
		accExp := now.Add(accExpiresIn)
		refExp := now.Add(refExpiresIn)
		user.LastLogin = &now
		if err := s.userService.Update(user.ID, UserInput{
			LastLogin:          user.LastLogin,
			AccessToken:        accToken,
			AccessTokenExpiry:  &accExp,
			RefreshToken:       refToken,
			RefreshTokenExpiry: &refExp,
		}); err != nil {
			return nil, err
		}
	}

	return &LoginOutput{
		AccessToken:  accToken,
		RefreshToken: refToken,
		TokenType:    "Bearer",
	}, nil
}
