package entities

import "time"

type User struct {
	ID                 int        `json:"id" gorm:"primaryKey,autoIncrement"`
	FirstName          string     `json:"first_name" gorm:"not null"`
	LastName           string     `json:"last_name" gorm:"not null"`
	Email              string     `json:"email" gorm:"not null;unique"`
	Phone              string     `json:"phone"`
	Password           string     `json:"password" gorm:"not null"`
	Organization       string     `json:"organization" gorm:"not null"`
	LastLogin          *time.Time `json:"last_login" gorm:"default:null"`
	IsActive           bool       `json:"is_active" gorm:"default:true"`
	IsAdmin            bool       `json:"is_admin" gorm:"default:false"`
	AccessToken        string     `json:"access_token" gorm:"default:null"`
	AccessTokenExpiry  *time.Time `json:"access_token_expiry" gorm:"default:null"`
	RefreshToken       string     `json:"refresh_token" gorm:"default:null"`
	RefreshTokenExpiry *time.Time `json:"refresh_token_expiry" gorm:"default:null"`
	CreatedAt          *time.Time `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt          *time.Time `json:"updated_at" gorm:"autoUpdateTime"`
	DeletedAt          *time.Time `json:"deleted_at" gorm:"index"`
}
