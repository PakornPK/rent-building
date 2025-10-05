package services

import "github.com/PakornPK/rent-building/internal/entities"

type RoomInput struct {
	BuildingID int    `json:"building_id" validate:"required"`
	RoomNo     string `json:"name" validate:"required"`
	Status     string `json:"status" validate:"required"`
}

type RoomRentalService interface {
	CreateRoom(rooms ...RoomInput) error
	Update(id int, room RoomInput) error
	AppendRental(roomID, retalIDs int) error
	RemoveRental(roomRental int) error
	GetByID(id int) (*entities.Room, error)
	List(input *entities.PaginationInput) (*entities.PaginationOutput[*entities.Room], error)
}
