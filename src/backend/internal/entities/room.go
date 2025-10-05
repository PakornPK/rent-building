package entities

import "time"

type Room struct {
	ID          int           `json:"id" gorm:"primaryKey,autoIncrement"`
	BuildingID  int           `json:"building_id" gorm:"not null"`
	TenantsID   int           `json:"tenants_id"`
	RoomNo      string        `json:"room_no" gorm:"not null;unique"`
	Status      string        `json:"status" gorm:"not null;default:'OCCUPIED'"`
	CreatedAt   time.Time     `json:"created_at"`
	UpdatedAt   time.Time     `json:"updated_at"`
	Building    *Building     `json:"building,omitempty" gorm:"foreignKey:BuildingID;references:ID"`
	Tenants     *Tenants      `json:"tenants,omitempty" gorm:"foreignKey:TenantsID;references:ID"`
	RoomRentals []RoomRentals `json:"room_rentals,omitempty" gorm:"foreignKey:RoomID;references:ID"`
}
