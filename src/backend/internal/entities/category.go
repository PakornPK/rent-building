package entities

import "time"

type Category struct {
	ID          int       `json:"id" gorm:"primaryKey,autoIncrement"`
	TypeID      int       `json:"type_id" gorm:"not null"`
	Name        string    `json:"name" gorm:"not null;unique"`
	Description string    `json:"description"`
	Type        *Type     `json:"type,omitempty" gorm:"foreignKey:TypeID"`
	Group       []Group   `json:"group,omitempty" gorm:"foreignKey:CategoryID"`
	CreatedAt   time.Time `json:"created_at"`
}
