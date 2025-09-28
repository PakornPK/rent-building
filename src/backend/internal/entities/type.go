package entities

import "time"

type Type struct {
	ID          int        `json:"id" gorm:"primaryKey,autoIncrement"`
	Name        string     `json:"name" gorm:"not null;unique"`
	Description string     `json:"description"`
	Categories  []Category `json:"categories,omitempty" gorm:"foreignKey:TypeID"`
	CreatedAt   time.Time  `json:"created_at"`
}
