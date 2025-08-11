package services

import (
	"github.com/PakornPK/rent-building/internal/entities"
	"github.com/PakornPK/rent-building/internal/repositories"
	"github.com/PakornPK/rent-building/internal/utils"
)

type UserInput struct {
	FirstName    string `json:"first_name" validate:"required"`
	LastName     string `json:"last_name" validate:"required"`
	Email        string `json:"email" validate:"required,email"`
	Phone        string `json:"phone" validate:"required"`
	Password     string `json:"password" validate:"required,min=8"`
	Organization string `json:"organization" validate:"required"`
}

type UserService interface {
	CreateUser(input ...UserInput) error
	GetByID(id int) (*entities.User, error)
	GetByEmail(email string) (*entities.User, error)
	GetByOrganization(organization string) ([]entities.User, error)
	Update(id int, user UserInput) error
	UpdatePassword(id int, newPassword string) error
	Delete(id int) error
	List(input *entities.PaginationInput) (*entities.PaginationOutput[*entities.User], error)
}

type userService struct {
	userRepo repositories.UserRepository
}

func NewUserService(userRepo repositories.UserRepository) UserService {
	return &userService{userRepo: userRepo}
}

func (s *userService) CreateUser(input ...UserInput) error {
	var users []entities.User
	for _, u := range input {
		password, err := utils.HashPassword(u.Password)
		if err != nil {
			return err
		}
		users = append(users, entities.User{
			FirstName:    u.FirstName,
			LastName:     u.LastName,
			Email:        u.Email,
			Phone:        u.Phone,
			Password:     password,
			Organization: u.Organization,
		})
	}
	return s.userRepo.Create(users...)
}

func (s *userService) GetByID(id int) (*entities.User, error) {
	return s.userRepo.GetByID(id)
}

func (s *userService) GetByEmail(email string) (*entities.User, error) {
	return s.userRepo.GetByEmail(email)
}

func (s *userService) GetByOrganization(organization string) ([]entities.User, error) {
	return s.userRepo.GetByORganization(organization)
}

func (s *userService) Update(id int, user UserInput) error {
	return s.userRepo.Update(entities.User{
		ID:           id,
		FirstName:    user.FirstName,
		LastName:     user.LastName,
		Email:        user.Email,
		Organization: user.Organization,
		Phone:        user.Phone,
	})
}

func (s *userService) UpdatePassword(id int, newPassword string) error {
	hashedPassword, err := utils.HashPassword(newPassword)
	if err != nil {
		return err
	}
	return s.userRepo.Update(entities.User{
		ID:       id,
		Password: hashedPassword,
	})
}

func (s *userService) Delete(id int) error {
	return s.userRepo.Delete(id)
}

func (s *userService) List(input *entities.PaginationInput) (*entities.PaginationOutput[*entities.User], error) {
	return s.userRepo.List(input)
}
