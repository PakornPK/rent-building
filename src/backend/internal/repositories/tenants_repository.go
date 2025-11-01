package repositories

import (
	"github.com/PakornPK/rent-building/infra"
	"github.com/PakornPK/rent-building/internal/entities"
)

type TenantsRepository interface {
	Create(tenant ...entities.Tenants) error
	GetByID(id int) (*entities.Tenants, error)
	Update(id int, tenant entities.Tenants) error
	Delete(id int) error
	List(input *entities.PaginationInput) (*entities.PaginationOutput[*entities.Tenants], error)
}

type tenantsRepository struct {
	conn *infra.ConnectionDB
}

func NewTenantsRepository(conn *infra.ConnectionDB) TenantsRepository {
	return &tenantsRepository{conn: conn}
}

func (r *tenantsRepository) Create(tenant ...entities.Tenants) error {
	return r.conn.DB().Create(&tenant).Error
}

func (r *tenantsRepository) GetByID(id int) (*entities.Tenants, error) {
	var tenant entities.Tenants
	if err := r.conn.DB().Model(&entities.Tenants{}).First(&tenant, id).Error; err != nil {
		return nil, err
	}
	return &tenant, nil
}

func (r *tenantsRepository) Update(id int,tenant entities.Tenants) error {
	return r.conn.DB().Model(&entities.Tenants{}).Where("id = ?", id).Updates(&tenant).Error
}

func (r *tenantsRepository) Delete(id int) error {
	return r.conn.DB().Model(&entities.Tenants{}).Where("id = ?", id).Delete(&entities.Tenants{}).Error
}

func (r *tenantsRepository) List(input *entities.PaginationInput) (*entities.PaginationOutput[*entities.Tenants], error) {
	var totalRows int64
	query := r.conn.DB().Model(&entities.Tenants{})
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
	var data []*entities.Tenants
	if err := query.
		Limit(input.PageSize).
		Offset(offset).
		Order("created_at " + input.Sort).
		Find(&data).Error; err != nil {
		return nil, err
	}
	totalPages := int((totalRows + int64(input.PageSize) - 1) / int64(input.PageSize))
	return &entities.PaginationOutput[*entities.Tenants]{
		Data:       data,
		Page:       input.Page,
		PageSize:   input.PageSize,
		TotalRows:  totalRows,
		TotalPages: totalPages,
	}, nil
}
