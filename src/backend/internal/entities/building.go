package entities

import "time"

type Building struct {
	ID        int       `json:"id" gorm:"primaryKey,autoIncrement"`
	Name      string    `json:"name" gorm:"not null;unique"`
	Address   string    `json:"address"`
	Status    string    `json:"status" gorm:"not null;default:'ACTIVE'"`
	CreatedAt time.Time `json:"created_at"`
	// Add a one-to-many relationship with Room
	Rooms []Room `json:"rooms,omitempty" gorm:"foreignKey:BuildingID;references:ID"`
}
