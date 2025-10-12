package repositories

import (
	"github.com/PakornPK/rent-building/infra"
	"github.com/PakornPK/rent-building/internal/entities"
	"gorm.io/gorm"
)

type BuildingRepository interface {
	Create(building ...entities.Building) error
	GetByID(id int) (*entities.Building, error)
	Update(id int, building *entities.Building) error
	Delete(id int) error
	List(input *entities.PaginationInput) (*entities.PaginationOutput[*entities.Building], error)
	FindAll() ([]entities.Building, error)
}

type buildingRepository struct {
	db *infra.ConnectionDB
}

func NewBuildingRepository(db *infra.ConnectionDB) BuildingRepository {
	return &buildingRepository{db: db}
}

func (r *buildingRepository) Create(building ...entities.Building) error {
	return r.db.DB().Create(&building).Error
}

func (r *buildingRepository) GetByID(id int) (*entities.Building, error) {
	var building entities.Building
	if err := r.db.DB().
		Model(&entities.Building{}).
		Preload("Rooms").
		First(&building, id).
		Error; err != nil {
		return nil, err
	}
	return &building, nil
}

func (r *buildingRepository) Update(id int, building *entities.Building) error {
	result := r.db.DB().
		Model(&entities.Building{}).
		Where("id = ?", id).
		Updates(&building)
	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}

	return nil
}

func (r *buildingRepository) Delete(id int) error {
	result := r.db.DB().
		Model(&entities.Building{}).
		Where("id = ?", id).
		Delete(&entities.Building{})
	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}

	return nil
}

func (r *buildingRepository) List(input *entities.PaginationInput) (*entities.PaginationOutput[*entities.Building], error) {
	var buildings []*entities.Building
	var total int64

	query := r.db.DB().Model(&entities.Building{}).Preload("Rooms")

	if err := query.Count(&total).Error; err != nil {
		return nil, err
	}

	if err := query.
		Limit(input.PageSize).
		Offset((input.Page - 1) * input.PageSize).
		Find(&buildings).Error; err != nil {
		return nil, err
	}

	output := &entities.PaginationOutput[*entities.Building]{
		Data:       buildings,
		TotalRows:  total,
		Page:       input.Page,
		PageSize:   input.PageSize,
		TotalPages: int((total + int64(input.PageSize) - 1) / int64(input.PageSize)),
	}

	return output, nil
}

func (r *buildingRepository) FindAll() ([]entities.Building, error) {
	var building []entities.Building
	err := r.db.DB().Model(&entities.Building{}).Find(&building).Error
	if err != nil {
		return nil, err
	}
	return building, nil
}
