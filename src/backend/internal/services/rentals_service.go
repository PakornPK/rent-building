package services

import (
	"github.com/PakornPK/rent-building/internal/entities"
	"github.com/PakornPK/rent-building/internal/repositories"
)

type RentalInput struct {
	GroupID     int     `json:"group_id" validate:"required"`
	Name        string  `json:"name" validate:"required"`
	Price       float64 `json:"price" validate:"required"`
	Unit        string  `json:"unit" validate:"required"`
	Status      string  `json:"status" validate:"required"`
	Description string  `json:"description" validate:"required"`
}

type RentalService interface {
	List(input *entities.PaginationInput) (*entities.PaginationOutput[*entities.Product], error)
	Create(product ...RentalInput) error
	GetByID(id int) (*entities.Product, error)
	Update(id int, update *RentalInput) error
	Delete(id int) error
}

type rentalService struct {
	productRepo repositories.ProductRepository
}

func NewRentalService(productRepo repositories.ProductRepository) RentalService {
	return &rentalService{productRepo: productRepo}
}

func (s *rentalService) List(input *entities.PaginationInput) (*entities.PaginationOutput[*entities.Product], error) {
	return s.productRepo.List(input)
}

func (s *rentalService) Create(input ...RentalInput) error {
	var products []entities.Product
	for _, i := range input {
		products = append(products, entities.Product{
			GroupID:     i.GroupID,
			Name:        i.Name,
			Price:       i.Price,
			Unit:        i.Unit,
			Status:      i.Status,
			Description: i.Description,
		})
	}
	return s.productRepo.Create(products...)
}

func (s *rentalService) GetByID(id int) (*entities.Product, error) {
	return s.productRepo.GetByID(id)
}

func (s *rentalService) Update(id int, update *RentalInput) error {
	return s.productRepo.Update(&entities.Product{
		ID:          id,
		GroupID:     update.GroupID,
		Name:        update.Name,
		Price:       update.Price,
		Unit:        update.Unit,
		Status:      update.Status,
		Description: update.Description,
	})
}

func (s *rentalService) Delete(id int) error {
	return s.productRepo.Delete(id)
}
