package handlers

import (
	"strconv"

	"github.com/PakornPK/rent-building/internal/entities"
)

func paginationInputBuilder(queries map[string]string) (*entities.PaginationInput, error) {
	filter := make(map[string]string, 0)
	var page, pageSize int
	var sort string
	for k, v := range queries {
		if k == "page" {
			p, err := strconv.Atoi(v)
			if err != nil {
				return nil, err
			}
			page = p
			continue
		}
		if k == "page_size" {
			ps, err := strconv.Atoi(v)
			if err != nil {
				return nil, err
			}
			pageSize = ps
			continue
		}
		if k == "sort" {
			sort = v
			continue
		}
		filter[k] = v
	}
	return &entities.PaginationInput{
		Page:     page,
		PageSize: pageSize,
		Sort:     sort,
		Filter:   filter,
	}, nil
}
