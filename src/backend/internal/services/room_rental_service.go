package services

import (
	"github.com/PakornPK/rent-building/internal/entities"
	"github.com/PakornPK/rent-building/internal/repositories"
)

type RoomInput struct {
	BuildingID int    `json:"building_id" validate:"required"`
	TenantID   int    `json:"tenant_id,omitempty"`
	RoomNo     string `json:"room_no" validate:"required"`
	Status     string `json:"status" validate:"required"`
}

type RoomRentalInput struct {
	RoomID   int     `json:"room_id"`
	RetalID  int     `json:"rental_id"`
	Quantity int     `json:"quantity"`
	Price    float64 `json:"price"`
}

type RoomRentalService interface {
	CreateRoom(rooms ...RoomInput) error
	Update(id int, room RoomInput) error
	AppendRental(input ...RoomRentalInput) error
	RemoveRental(roomRental int) error
	GetByID(id int) (*entities.Room, error)
	List(input *entities.PaginationInput) (*entities.PaginationOutput[*entities.Room], error)
	DeleteByID(id int) error
}

type roomRentalService struct {
	roomRepo       repositories.RoomRepository
	roomRentalRepo repositories.RoomRentalRepository
}

func NewRoomRentalService(roomRepo repositories.RoomRepository, roomRentalRepo repositories.RoomRentalRepository) RoomRentalService {
	return &roomRentalService{
		roomRepo:       roomRepo,
		roomRentalRepo: roomRentalRepo,
	}
}

func (s *roomRentalService) CreateRoom(input ...RoomInput) error {
	var rooms []entities.Room
	for _, room := range input {
		rooms = append(rooms, entities.Room{
			BuildingID: room.BuildingID,
			TenantID:   room.TenantID,
			RoomNo:     room.RoomNo,
			Status:     room.Status,
		})
	}
	return s.roomRepo.Create(rooms...)
}
func (s *roomRentalService) Update(id int, room RoomInput) error {
	return s.roomRepo.Update(id, &entities.Room{
		BuildingID: room.BuildingID,
		TenantID:   room.TenantID,
		RoomNo:     room.RoomNo,
		Status:     room.Status,
	})
}
func (s *roomRentalService) AppendRental(input ...RoomRentalInput) error {
	var roomRentals []entities.RoomRentals
	for _, rr := range input {
		roomRentals = append(roomRentals, entities.RoomRentals{
			RoomID:   rr.RoomID,
			RentalID: rr.RetalID,
			Price:    rr.Price,
			Quantity: rr.Quantity,
		})
	}
	return s.roomRentalRepo.Create(roomRentals...)
}
func (s *roomRentalService) RemoveRental(id int) error {
	return s.roomRentalRepo.DeleteByID(id)
}
func (s *roomRentalService) GetByID(id int) (*entities.Room, error) {
	return s.roomRepo.GetByID(id)
}
func (s *roomRentalService) List(input *entities.PaginationInput) (*entities.PaginationOutput[*entities.Room], error) {
	return s.roomRepo.List(input)
}
func (s *roomRentalService) DeleteByID(id int) error {
	return s.roomRepo.Delete(id)
}
