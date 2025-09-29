package services

import (
	"errors"

	"github.com/PakornPK/rent-building/internal/entities"
	"github.com/PakornPK/rent-building/internal/repositories"
)

type MasterDataInput struct {
	Key   string `json:"key"`
	Value int    `json:"value,omitempty"`
}

type MasterDataOutput struct {
	ID   int `json:"id"`
	Name string `json:"name"`
}

type MasterDataService interface {
	Dropdown(input MasterDataInput) ([]MasterDataOutput, error)
}

type masterDataService struct {
	typeRepo     repositories.MasterDataRepository[entities.Type]
	categoryRepo repositories.MasterDataRepository[entities.Category]
	groupRepo    repositories.MasterDataRepository[entities.Group]
}

func NewMasterDataService(typeRepo repositories.MasterDataRepository[entities.Type], categoryRepo repositories.MasterDataRepository[entities.Category], groupRepo repositories.MasterDataRepository[entities.Group]) MasterDataService {
	return &masterDataService{typeRepo: typeRepo, categoryRepo: categoryRepo, groupRepo: groupRepo}
}

// TODO: IF MASTER DATA IS LARGE SCALE THEN OPTIMIZE THIS CODE
func (s *masterDataService) Dropdown(input MasterDataInput) ([]MasterDataOutput, error) {
	var result []MasterDataOutput
	switch input.Key {
	case "type":
		t, err := s.typeRepo.FindAll()
		if err != nil {
			return nil, err
		}
		for _, v := range t {
			result = append(result, MasterDataOutput{
				ID:   v.ID,
				Name: v.Name,
			})
		}
		return result, nil
	case "category":
		c, err := s.categoryRepo.FindAll()
		if err != nil {
			return nil, err
		}
		for _, v := range c {
			if v.TypeID != input.Value {
				continue
			}
			result = append(result, MasterDataOutput{
				ID:   v.ID,
				Name: v.Name,
			})
		}
		return result, nil
	case "group":
		g, err := s.groupRepo.FindAll()
		if err != nil {
			return nil, err
		}
		for _, v := range g {
			if v.CategoryID != input.Value {
				continue
			}
			result = append(result, MasterDataOutput{
				ID:   v.ID,
				Name: v.Name,
			})
		}
		return result, nil
	default:
		return nil, errors.New("invalid key")
	}
}
