package entities

import "time"

type Payment struct {
	ID           int       `json:"id" gorm:"primaryKey,autoIncrement"`
	InvoicesID   int       `json:"invoices_id" gorm:"not null"`
	Amount       int       `json:"amount" gorm:"not null;default:0"`
	Note         string    `json:"note"`
	PaySlipUrl   string    `json:"pay_slip_url"`
	SalesSlipUrl string    `json:"sales_slip_url"`
	PaymentAt    time.Time `json:"payment_at" gorm:"not null;default:CURRENT_TIMESTAMP"`
	CreatedAt    time.Time `json:"created_at"`
	Invoices     *Invoices `json:"invoices,omitempty" gorm:"foreignKey:InvoicesID;references:ID"`
}
