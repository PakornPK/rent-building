package entities

import "time"

type User struct {
	ID           int        `json:"id" gorm:"primaryKey,autoIncrement"`
	FirstName    string     `json:"first_name" gorm:"not null"`
	LastName     string     `json:"last_name" gorm:"not null"`
	Email        string     `json:"email" gorm:"not null;unique"`
	Phone        string     `json:"phone"`
	Password     string     `json:"password" gorm:"not null"`
	Organization string     `json:"organization" gorm:"not null"`
	CreatedAt    *time.Time `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt    *time.Time `json:"updated_at" gorm:"autoUpdateTime"`
	DeletedAt    *time.Time `json:"deleted_at" gorm:"index"`
}
