package repositories

import (
	"github.com/PakornPK/rent-building/infra"
	"github.com/PakornPK/rent-building/internal/entities"
	"gorm.io/gorm"
)

type RoomRentalRepository interface {
	Create(roomRental ...entities.RoomRentals) error
	Update(id int, roomRental *entities.RoomRentals) error
	GetByRoomID(roomID int) ([]entities.RoomRentals, error)
	DeleteByRoomID(roomID int) error
	DeleteByIDs(ids ...int) error
}

type roomRentalRepository struct {
	conn *infra.ConnectionDB
}

func NewRoomRentalRepository(conn *infra.ConnectionDB) RoomRentalRepository {
	return &roomRentalRepository{conn: conn}
}

func (r *roomRentalRepository) Create(roomRental ...entities.RoomRentals) error {
	return r.conn.DB().Create(&roomRental).Error
}

func (r *roomRentalRepository) GetByRoomID(id int) ([]entities.RoomRentals, error) {
	var roomRental []entities.RoomRentals
	if err := r.conn.DB().
		Model(&entities.RoomRentals{}).
		Preload("Room").
		Preload("Rental").
		Find(&roomRental, "room_id = ?", id).
		Error; err != nil {
		return nil, err
	}
	return roomRental, nil
}

func (r *roomRentalRepository) Update(id int, roomRental *entities.RoomRentals) error {
	result := r.conn.DB().
		Model(&entities.RoomRentals{}).
		Where("id = ?", id).
		Updates(roomRental)
	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}

	return nil
}

func (r *roomRentalRepository) DeleteByRoomID(roomID int) error {
	result := r.conn.DB().
		Where("room_id = ?", roomID).
		Delete(&entities.RoomRentals{})
	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}

	return nil
}

func (r *roomRentalRepository) DeleteByIDs(ids ...int) error {
	result := r.conn.DB().
		Where("id in ?", ids).
		Delete(&entities.RoomRentals{})
	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}

	return nil
}
