package entities

import "time"

type Tenants struct {
	ID          int        `json:"id" gorm:"primaryKey,autoIncrement"`
	Name        string     `json:"name" gorm:"not null;unique"`
	Email       string     `json:"email" gorm:"not null;unique"`
	Phone       string     `json:"phone" gorm:"not null;unique"`
	IDCard      string     `json:"id_card" gorm:"not null;unique"`
	StartDate   time.Time  `json:"start_date" gorm:"not null"`
	EndDate     time.Time  `json:"end_date"`
	Status      string     `json:"status" gorm:"not null;default:'ACTIVE'"`
	ContractURL string     `json:"contract_url"`
	ImageURL    string     `json:"image_url"`
	CreatedAt   time.Time  `json:"created_at"`
	UpdatedAt   time.Time  `json:"updated_at"`
	DeletedAt   *time.Time `json:"deleted_at,omitempty" gorm:"index"`
	Room        []Room     `json:"room,omitempty" gorm:"foreignKey:TenantsID;references:ID"`
	Invoices    []Invoices `json:"invoices,omitempty" gorm:"foreignKey:TenantsID;references:ID"`
}
