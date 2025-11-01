package services

import (
	"errors"
	"time"

	"github.com/PakornPK/rent-building/internal/entities"
	"github.com/PakornPK/rent-building/internal/repositories"
)

type TenantsInput struct {
	Name        string `json:"name"`
	Email       string `json:"email"`
	Phone       string `json:"phone"`
	IDCard      string `json:"id_card"`
	StartDate   string `json:"start_date"`
	EndDate     string `json:"end_date"`
	Status      string `json:"status"`
	ContractURL string `json:"contract_url"`
	ImageURL    string `json:"image_url"`
}

type TenantsOutput struct {
	ID          int    `json:"id"`
	Name        string `json:"name"`
	Email       string `json:"email"`
	Phone       string `json:"phone"`
	IDCard      string `json:"id_card"`
	StartDate   string `json:"start_date"`
	EndDate     string `json:"end_date"`
	Status      string `json:"status"`
	ContractURL string `json:"contract_url"`
	ImageURL    string `json:"image_url"`
}

type TenantsService interface {
	CreateTenant(tenant ...TenantsInput) error
	GetTenantByID(id int) (*TenantsOutput, error)
	UpdateTenant(id int, tenant TenantsInput) error
	DeleteTenant(id int) error
	ListTenants(input *entities.PaginationInput) (*entities.PaginationOutput[*TenantsOutput], error)
}

type tenantsService struct {
	tenantsRepo repositories.TenantsRepository
}

func NewTenantsService(tenantsRepo repositories.TenantsRepository) TenantsService {
	return &tenantsService{tenantsRepo: tenantsRepo}
}

func (s *tenantsService) CreateTenant(tenant ...TenantsInput) error {
	var tenants []entities.Tenants
	for _, t := range tenant {
		if t.StartDate == "" {
			t.StartDate = time.Now().Format("2006-01-02")
		}
		if t.IDCard == "" {
			return errors.New("ID Card is required")
		}
		tenants = append(tenants, entities.Tenants{
			Name:        t.Name,
			Email:       t.Email,
			Phone:       t.Phone,
			IDCard:      t.IDCard,
			StartDate:   parseDate(t.StartDate),
			EndDate:     parseDatePtr(t.EndDate),
			Status:      t.Status,
			ContractURL: t.ContractURL,
			ImageURL:    t.ImageURL,
		})
	}
	return s.tenantsRepo.Create(tenants...)
}

func (s *tenantsService) GetTenantByID(id int) (*TenantsOutput, error) {
	tenant, err := s.tenantsRepo.GetByID(id)
	if err != nil {
		return nil, err
	}
	return &TenantsOutput{
		ID:          tenant.ID,
		Name:        tenant.Name,
		Email:       tenant.Email,
		Phone:       tenant.Phone,
		IDCard:      tenant.IDCard,
		StartDate:   tenant.StartDate.Format("2006-01-02"),
		EndDate:     formatDatePtr(tenant.EndDate),
		Status:      tenant.Status,
		ContractURL: tenant.ContractURL,
		ImageURL:    tenant.ImageURL,
	}, nil
}

func (s *tenantsService) UpdateTenant(id int, tenant TenantsInput) error {
	return s.tenantsRepo.Update(id, entities.Tenants{
		Name:        tenant.Name,
		Email:       tenant.Email,
		Phone:       tenant.Phone,
		StartDate:   parseDate(tenant.StartDate),
		EndDate:     parseDatePtr(tenant.EndDate),
		Status:      tenant.Status,
		ContractURL: tenant.ContractURL,
		ImageURL:    tenant.ImageURL,
	})
}

func (s *tenantsService) DeleteTenant(id int) error {
	return s.tenantsRepo.Delete(id)
}

func (s *tenantsService) ListTenants(input *entities.PaginationInput) (*entities.PaginationOutput[*TenantsOutput], error) {
	list, err := s.tenantsRepo.List(input)
	if err != nil {
		return nil, err
	}
	var tenants []*TenantsOutput
	for _, tenant := range list.Data {
		tenants = append(tenants, &TenantsOutput{
			ID:          tenant.ID,
			Name:        tenant.Name,
			Email:       tenant.Email,
			Phone:       tenant.Phone,
			IDCard:      tenant.IDCard,
			StartDate:   tenant.StartDate.Format("2006-01-02"),
			EndDate:     formatDatePtr(tenant.EndDate),
			Status:      tenant.Status,
			ContractURL: tenant.ContractURL,
			ImageURL:    tenant.ImageURL,
		})
	}
	return &entities.PaginationOutput[*TenantsOutput]{
		Data:       tenants,
		TotalPages: list.TotalPages,
		Page:       list.Page,
		PageSize:   list.PageSize,
		TotalRows:  list.TotalRows,
	}, nil
}

func parseDate(dateStr string) time.Time {
	layout := "2006-01-02"
	t, err := time.Parse(layout, dateStr)
	if err != nil {
		return time.Time{}
	}
	return t
}

func parseDatePtr(dateStr string) *time.Time {
	layout := "2006-01-02"
	t, err := time.Parse(layout, dateStr)
	if err != nil {
		return nil
	}
	return &t
}

func formatDatePtr(t *time.Time) string {
	if t == nil {
		return ""
	}
	return t.Format("2006-01-02")
}
