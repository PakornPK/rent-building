package services

import (
	"time"

	"github.com/PakornPK/rent-building/internal/entities"
	"github.com/PakornPK/rent-building/internal/repositories"
)

type TenantsInput struct {
	Name        string
	Email       string
	Phone       string
	IDCard      string
	StartDate   string
	EndDate     string
	Status      string
	ContractURL string
	ImageURL    string
}

type TenantsOutput struct {
	ID          int
	Name        string
	Email       string
	Phone       string
	IDCard      string
	StartDate   string
	EndDate     string
	Status      string
	ContractURL string
	ImageURL    string
}

type TenantsService interface {
	CreateTenant(tenant ...TenantsInput) error
	GetTenantByID(id int) (*TenantsOutput, error)
	UpdateTenant(id int, tenant TenantsInput) error
	DeleteTenant(id int) error
	ListTenants(input *entities.PaginationInput) (*entities.PaginationOutput[*entities.Tenants], error)
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
		tenants = append(tenants, entities.Tenants{
			Name:        t.Name,
			Email:       t.Email,
			Phone:       t.Phone,
			IDCard:      t.IDCard,
			StartDate:   parseDate(t.StartDate),
			EndDate:     parseDate(t.EndDate),
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
		EndDate:     tenant.EndDate.Format("2006-01-02"),
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
		IDCard:      tenant.IDCard,
		StartDate:   parseDate(tenant.StartDate),
		EndDate:     parseDate(tenant.EndDate),
		Status:      tenant.Status,
		ContractURL: tenant.ContractURL,
		ImageURL:    tenant.ImageURL,
	})
}

func (s *tenantsService) DeleteTenant(id int) error {
	return s.tenantsRepo.Delete(id)
}

func (s *tenantsService) ListTenants(input *entities.PaginationInput) (*entities.PaginationOutput[*entities.Tenants], error) {
	return s.tenantsRepo.List(input)
}

func parseDate(dateStr string) time.Time {
	layout := "2006-01-02"
	t, err := time.Parse(layout, dateStr)
	if err != nil {
		return time.Time{}
	}
	return t
}
