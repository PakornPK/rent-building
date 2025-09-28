package entities

import "time"

type Group struct {
	ID          int       `json:"id" gorm:"primaryKey,autoIncrement"`
	CategoryID  int       `json:"category_id" gorm:"not null"`
	Name        string    `json:"name" gorm:"not null;unique"`
	Description string    `json:"description"`
	Category    *Category `json:"category,omitempty" gorm:"foreignKey:CategoryID"`
	Products    []Product `json:"products,omitempty" gorm:"foreignKey:GroupID"`
	CreatedAt   time.Time `json:"created_at"`
}
