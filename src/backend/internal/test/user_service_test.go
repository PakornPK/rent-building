package test

import (
	"testing"

	"github.com/PakornPK/rent-building/internal/entities"
	"github.com/PakornPK/rent-building/internal/mocks"
	"github.com/PakornPK/rent-building/internal/services"
)

func TestCreaetUser(t *testing.T) {
	cases := []struct {
		name       string
		input      services.UserInput
		mockReturn error
		expected   error
	}{
		{
			name: "Valid User",
			input: services.UserInput{
				FirstName:    "John",
				LastName:     "Doe",
				Email:        "test@test.com",
				Phone:        "1234567890",
				Password:     "password123",
				Organization: "TestOrg",
			},
			expected: nil,
		},
	}

	for _, c := range cases {
		t.Run(c.name, func(t *testing.T) {
			userRepository := mocks.UserRepositoryMock{}
			userRepository.CreateFunc = func(user ...entities.User) error {
				return c.mockReturn
			}
			userService := services.NewUserService(&userRepository)
			err := userService.CreateUser(c.input)
			if err != c.expected {
				t.Errorf("expected %v, got %v", c.expected, err)
			}
		})
	}
}
