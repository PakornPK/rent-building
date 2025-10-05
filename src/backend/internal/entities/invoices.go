package entities

import "time"

type Invoices struct {
	ID         int       `json:"id" gorm:"primaryKey,autoIncrement"`
	RoomID     int       `json:"room_id" gorm:"not null"`
	InvoicesNo string    `json:"invoices_no" gorm:"not null;unique"`
	Amount     int       `json:"amount" gorm:"not null;default:0"`
	IssueDate  time.Time `json:"issue_date" gorm:"not null;default:CURRENT_TIMESTAMP"`
	DueDate    time.Time `json:"due_date" gorm:"not null"`
	Status     string    `json:"status" gorm:"not null;default:'UNPAID'"`
	Note       string    `json:"note"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
	Room       *Room     `json:"room,omitempty" gorm:"foreignKey:RoomID;references:ID"`
	Payments   []Payment `json:"payments,omitempty" gorm:"foreignKey:InvoicesID;references:ID"`
}
