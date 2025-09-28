package entities

import "time"

type Product struct {
	ID          int       `json:"id" gorm:"primaryKey,autoIncrement"`
	GroupID     int       `json:"group_id" gorm:"not null"`
	Name        string    `json:"name" gorm:"not null;unique"`
	Price       float64   `json:"price" gorm:"not null;default:0"`
	Unit        string    `json:"unit"`
	Status      string    `json:"status" gorm:"not null;default:'inactive'"`
	Description string    `json:"description"`
	Group       *Group    `json:"group,omitempty" gorm:"foreignKey:GroupID;references:ID"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}
