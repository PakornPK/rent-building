package entities

type RoomRentals struct {
	ID       int     `json:"id" gorm:"primaryKey,autoIncrement"`
	RoomID   int     `json:"room_id" gorm:"not null"`
	RentalID int     `json:"rental_id" gorm:"not null"`
	Price    float64 `json:"price" gorm:"not null"`
	Quantity int     `json:"quantity" gorm:"not null;default:1"`
	Room     *Room   `json:"room,omitempty" gorm:"foreignKey:RoomID;references:ID"`
	Rental   *Rental `json:"rental,omitempty" gorm:"foreignKey:RentalID;references:ID"`
}
