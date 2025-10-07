package repositories

import (
	"github.com/PakornPK/rent-building/infra"
	"github.com/PakornPK/rent-building/internal/entities"
	"gorm.io/gorm"
)

type RentalRepository interface {
	Create(product ...entities.Rental) error
	GetByID(id int) (*entities.Rental, error)
	Update(product *entities.Rental) error
	Delete(id int) error
	List(input *entities.PaginationInput) (*entities.PaginationOutput[*entities.Rental], error)
	FindByGroupID(id int) ([]entities.Rental, error)
	FindAll() ([]entities.Rental, error)
}

type rentalRepository struct {
	conn *infra.ConnectionDB
}

func NewRentalRepository(conn *infra.ConnectionDB) RentalRepository {
	return &rentalRepository{conn: conn}
}

func (r *rentalRepository) Create(product ...entities.Rental) error {
	return r.conn.DB().Create(&product).Error
}

func (r *rentalRepository) GetByID(id int) (*entities.Rental, error) {
	var product entities.Rental
	if err := r.conn.DB().
		Model(&entities.Rental{}).
		Preload("Group").
		Preload("Group.Category").
		Preload("Group.Category.Type").
		First(&product, id).
		Error; err != nil {
		return nil, err
	}
	return &product, nil
}

func (r *rentalRepository) Update(product *entities.Rental) error {
	result := r.conn.DB().
		Model(&entities.Rental{}).
		Where("id = ?", product.ID).
		Updates(product)
	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}

	return nil
}

func (r *rentalRepository) Delete(id int) error {
	result := r.conn.DB().
		Model(&entities.Rental{}).
		Where("id = ?", id).
		Delete(&entities.Rental{})
	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}

	return nil
}

func (r *rentalRepository) List(input *entities.PaginationInput) (*entities.PaginationOutput[*entities.Rental], error) {
	var totalRows int64
	query := r.conn.DB().Model(&entities.Rental{})
	offset := (input.Page - 1) * input.PageSize
	if input.Sort == "" {
		input.Sort = "DESC"
	}
	for key, value := range input.Filter {
		query = query.Where(key+" = ?", value)
	}
	err := query.Count(&totalRows).Error
	if err != nil {
		return nil, err
	}
	var data []*entities.Rental
	if err := query.
		Preload("Group").
		Preload("Group.Category").
		Preload("Group.Category.Type").
		Limit(input.PageSize).
		Offset(offset).
		Order("created_at " + input.Sort).
		Find(&data).Error; err != nil {
		return nil, err
	}
	totalPages := int((totalRows + int64(input.PageSize) - 1) / int64(input.PageSize))
	return &entities.PaginationOutput[*entities.Rental]{
		Data:       data,
		Page:       input.Page,
		PageSize:   input.PageSize,
		TotalRows:  totalRows,
		TotalPages: totalPages,
	}, nil
}

func (r *rentalRepository) FindByGroupID(id int) ([]entities.Rental, error) {
	var rentals []entities.Rental
	err := r.conn.DB().Model(&entities.Rental{}).Where("group_id = ?", id).Find(&rentals).Error
	if err != nil {
		return nil, err
	}
	return rentals, nil
}

func (r *rentalRepository) FindAll() ([]entities.Rental, error) {
	var rentals []entities.Rental
	err := r.conn.DB().Model(&entities.Rental{}).Find(&rentals).Error
	if err != nil {
		return nil, err
	}
	return rentals, nil
}
