package services

import (
	"github.com/PakornPK/rent-building/internal/entities"
	"github.com/PakornPK/rent-building/internal/repositories"
)

type RoomInput struct {
	BuildingID int    `json:"building_id" validate:"required"`
	TenantID   int    `json:"tenant_id,omitempty"`
	Floor      int    `json:"floor" validate:"required"`
	RoomNo     string `json:"room_no" validate:"required"`
	Status     string `json:"status" validate:"required"`
}

type RoomRentalInput struct {
	RoomID   int     `json:"room_id"`
	RetalID  int     `json:"rental_id"`
	Quantity int     `json:"quantity"`
	Price    float64 `json:"price"`
}

type RoomRentalDiff struct {
	Implemented   []entities.Rental `json:"implemented"`
	Unimplemented []entities.Rental `json:"unimplemented"`
}

type RoomRentalService interface {
	CreateRoom(rooms ...RoomInput) error
	Update(id int, room RoomInput) error
	AppendRental(input ...RoomRentalInput) error
	RemoveRental(roomRental int) error
	GetByID(id int) (*entities.Room, error)
	List(input *entities.PaginationInput) (*entities.PaginationOutput[*entities.Room], error)
	DeleteByID(id int) error
	ListRental(roomID int) (*RoomRentalDiff, error)
}

type roomRentalService struct {
	roomRepo       repositories.RoomRepository
	rentalRepo     repositories.RentalRepository
	roomRentalRepo repositories.RoomRentalRepository
}

func NewRoomRentalService(roomRepo repositories.RoomRepository, rentalRepo repositories.RentalRepository, roomRentalRepo repositories.RoomRentalRepository) RoomRentalService {
	return &roomRentalService{
		roomRepo:       roomRepo,
		rentalRepo:     rentalRepo,
		roomRentalRepo: roomRentalRepo,
	}
}

func (s *roomRentalService) CreateRoom(input ...RoomInput) error {
	var rooms []entities.Room
	for _, room := range input {
		rooms = append(rooms, entities.Room{
			BuildingID: room.BuildingID,
			TenantID:   room.TenantID,
			Floor:      room.Floor,
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
		Floor:      room.Floor,
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

func (s *roomRentalService) ListRental(roomID int) (*RoomRentalDiff, error) {
	roomRentals, err := s.roomRentalRepo.GetByRoomID(roomID)
	if err != nil {
		return nil, err
	}
	rentals, err := s.rentalRepo.FindAll()
	if err != nil {
		return nil, err
	}
	implemented := make([]entities.Rental, 0)
	unimplemented := make([]entities.Rental, 0)
	for _, rental := range rentals {
		for _, rt := range roomRentals {
			if rt.RentalID == rental.ID {
				implemented = append(implemented, rental)
			}
		}
		unimplemented = append(unimplemented, rental)
	}
	return &RoomRentalDiff{
		Implemented:   implemented,
		Unimplemented: unimplemented,
	}, nil
}
