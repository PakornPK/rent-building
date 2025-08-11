//go:generate moq -out ../mocks/user_repository_mock.go -pkg mocks . UserRepository
package repositories

import (
	"github.com/PakornPK/rent-building/infra"
	"github.com/PakornPK/rent-building/internal/entities"
)

type UserRepository interface {
	Create(user ...entities.User) error
	GetByID(id int) (*entities.User, error)
	GetByEmail(email string) (*entities.User, error)
	GetByORganization(organization string) ([]entities.User, error)
	Update(user entities.User) error
	Delete(id int) error
	List(input *entities.PaginationInput) (*entities.PaginationOutput[*entities.User], error)
}

type userRepository struct {
	conn *infra.ConnectionDB
}

func NewUserRepository(conn *infra.ConnectionDB) UserRepository {
	return &userRepository{conn: conn}
}

func (r *userRepository) Create(user ...entities.User) error {
	return r.conn.DB().Create(&user).Error
}

func (r *userRepository) GetByID(id int) (*entities.User, error) {
	var user entities.User
	if err := r.conn.DB().Model(&entities.User{}).First(&user, id).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *userRepository) GetByEmail(email string) (*entities.User, error) {
	var user entities.User
	if err := r.conn.DB().Model(&entities.User{}).Where("email = ?", email).First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *userRepository) GetByORganization(organization string) ([]entities.User, error) {
	var users []entities.User
	if err := r.conn.DB().Model(&entities.User{}).Where("organization = ?", organization).Find(&users).Error; err != nil {
		return nil, err
	}
	return users, nil
}

func (r *userRepository) Update(user entities.User) error {
	return r.conn.DB().Model(&entities.User{}).Where("id = ?", user.ID).Updates(&user).Error
}

func (r *userRepository) Delete(id int) error {
	return r.conn.DB().Model(&entities.User{}).Where("id = ?", id).Delete(&entities.User{}).Error
}

func (r *userRepository) List(input *entities.PaginationInput) (*entities.PaginationOutput[*entities.User], error) {
	var totalRows int64
	query := r.conn.DB().Model(&entities.User{})
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
	var data []*entities.User
	if err := query.
		Limit(input.PageSize).
		Offset(offset).
		Order("created_at " + input.Sort).
		Find(&data).Error; err != nil {
		return nil, err
	}
	totalPages := int((totalRows + int64(input.PageSize) - 1) / int64(input.PageSize))
	return &entities.PaginationOutput[*entities.User]{
		Data:       data,
		Page:       input.Page,
		PageSize:   input.PageSize,
		TotalRows:  totalRows,
		TotalPages: totalPages,
	}, nil
}
