package services

import (
	"github.com/PakornPK/rent-building/internal/entities"
	"github.com/PakornPK/rent-building/internal/repositories"
)

type BuildingInput struct {
	Name    string `json:"name" validate:"required"`
	Address string `json:"address" validate:"required"`
	Status  string `json:"status" validate:"required"`
}

type BuildingService interface {
	Create(building ...BuildingInput) error
	Update(id int, building BuildingInput) error
	List(input *entities.PaginationInput) (*entities.PaginationOutput[*entities.Building], error)
}

type buildingService struct {
	repo repositories.BuildingRepository
}

func NewBuildingRepository(repo repositories.BuildingRepository) BuildingService {
	return &buildingService{repo: repo}
}

func (s *buildingService) Create(building ...BuildingInput) error {
	var be []entities.Building
	for _, b := range building {
		be = append(be, entities.Building{
			Name:    b.Address,
			Address: b.Address,
			Status:  b.Status,
		})
	}
	return s.repo.Create(be...)
}
func (s *buildingService) Update(id int, building BuildingInput) error {
	return s.repo.Update(id, &entities.Building{
		Name:    building.Name,
		Address: building.Address,
		Status:  building.Status,
	})
}

func (s *buildingService) List(input *entities.PaginationInput) (*entities.PaginationOutput[*entities.Building], error) {
	return s.repo.List(input)
}
