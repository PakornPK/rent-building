package repositories

import (
	"github.com/PakornPK/rent-building/infra"
	"github.com/PakornPK/rent-building/internal/entities"
	"gorm.io/gorm"
)

type ProductRepository interface {
	Create(product ...entities.Product) error
	GetByID(id int) (*entities.Product, error)
	Update(product *entities.Product) error
	Delete(id int) error
	List(input *entities.PaginationInput) (*entities.PaginationOutput[*entities.Product], error)
}

type productRepository struct {
	conn *infra.ConnectionDB
}

func NewProductRepository(conn *infra.ConnectionDB) ProductRepository {
	return &productRepository{conn: conn}
}

func (r *productRepository) Create(product ...entities.Product) error {
	return r.conn.DB().Create(&product).Error
}

func (r *productRepository) GetByID(id int) (*entities.Product, error) {
	var product entities.Product
	if err := r.conn.DB().
		Model(&entities.Product{}).
		Preload("Group").
		Preload("Group.Category").
		Preload("Group.Category.Type").
		First(&product, id).
		Error; err != nil {
		return nil, err
	}
	return &product, nil
}

func (r *productRepository) Update(product *entities.Product) error {
	result := r.conn.DB().
		Model(&entities.Product{}).
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

func (r *productRepository) Delete(id int) error {
	result := r.conn.DB().
		Model(&entities.Product{}).
		Where("id = ?", id).
		Delete(&entities.Product{})
	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}

	return nil
}

func (r *productRepository) List(input *entities.PaginationInput) (*entities.PaginationOutput[*entities.Product], error) {
	var totalRows int64
	query := r.conn.DB().Model(&entities.Product{})
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
	var data []*entities.Product
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
	return &entities.PaginationOutput[*entities.Product]{
		Data:       data,
		Page:       input.Page,
		PageSize:   input.PageSize,
		TotalRows:  totalRows,
		TotalPages: totalPages,
	}, nil
}
