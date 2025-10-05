package repositories

import (
	"github.com/PakornPK/rent-building/infra"
	"github.com/PakornPK/rent-building/internal/entities"
	"gorm.io/gorm"
)

type RoomRepository interface {
	Create(room ...entities.Room) error
	GetByID(id int) (*entities.Room, error)
	Update(room *entities.Room) error
	Delete(id int) error
	List(input *entities.PaginationInput) (*entities.PaginationOutput[*entities.Room], error)
}

type roomRepository struct {
	conn *infra.ConnectionDB
}

func NewRoomRepository(conn *infra.ConnectionDB) RoomRepository {
	return &roomRepository{conn: conn}
}

func (r *roomRepository) Create(room ...entities.Room) error {
	return r.conn.DB().Create(&room).Error
}

func (r *roomRepository) GetByID(id int) (*entities.Room, error) {
	var room entities.Room
	if err := r.conn.DB().
		Model(&entities.Room{}).
		Preload("Building").
		Preload("RoomRentals").
		Preload("Invoices").
		First(&room, id).
		Error; err != nil {
		return nil, err
	}
	return &room, nil
}

func (r *roomRepository) Update(room *entities.Room) error {
	result := r.conn.DB().
		Model(&entities.Room{}).
		Where("id = ?", room.ID).
		Updates(room)
	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}

	return nil
}
func (r *roomRepository) Delete(id int) error {
	result := r.conn.DB().
		Model(&entities.Room{}).
		Where("id = ?", id).
		Delete(&entities.Room{})
	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}

	return nil
}

func (r *roomRepository) List(input *entities.PaginationInput) (*entities.PaginationOutput[*entities.Room], error) {
	var rooms []*entities.Room
	var total int64

	query := r.conn.DB().Model(&entities.Room{}).Preload("Building")

	for key, value := range input.Filter {
		query = query.Where(key+" = ?", value)
	}

	if err := query.Count(&total).Error; err != nil {
		return nil, err
	}

	if input.Page < 1 {
		input.Page = 1
	}
	if input.PageSize <= 0 {
		input.PageSize = 10
	}

	offset := (input.Page - 1) * input.PageSize

	if err := query.Limit(input.PageSize).Offset(offset).Find(&rooms).Error; err != nil {
		return nil, err
	}

	return &entities.PaginationOutput[*entities.Room]{
		Data:       rooms,
		TotalRows:  total,
		Page:       input.Page,
		PageSize:   input.PageSize,
		TotalPages: int((total + int64(input.PageSize) - 1) / int64(input.PageSize)),
	}, nil
}
