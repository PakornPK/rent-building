package repositories

import "github.com/PakornPK/rent-building/infra"

type MasterDataRepository[T any] interface {
	FindAll() ([]T, error)
	FindByID(id int) (*T, error)
	FindAllWithPreload(preload ...string) ([]T, error)
	FindByIDWithPreload(id int, preload ...string) (*T, error)
}

type masterDataRepository[T any] struct {
	conn *infra.ConnectionDB
}

func NewMasterDataRepository[T any](conn *infra.ConnectionDB) MasterDataRepository[T] {
	return &masterDataRepository[T]{conn: conn}
}

func (r *masterDataRepository[T]) FindAll() ([]T, error) {
	var result []T
	if err := r.conn.DB().Find(&result).Error; err != nil {
		return nil, err
	}
	return result, nil
}

func (r *masterDataRepository[T]) FindByID(id int) (*T, error) {
	var result T
	if err := r.conn.DB().First(&result, id).Error; err != nil {
		return nil, err
	}
	return &result, nil
}

func (r *masterDataRepository[T]) FindAllWithPreload(preload ...string) ([]T, error) {
	var result []T
	db := r.conn.DB()
	for _, p := range preload {
		db = db.Preload(p)
	}
	if err := db.Find(&result).Error; err != nil {
		return nil, err
	}
	return result, nil
}

func (r *masterDataRepository[T]) FindByIDWithPreload(id int, preload ...string) (*T, error) {
	var result T
	db := r.conn.DB()
	for _, p := range preload {
		db = db.Preload(p)
	}
	if err := db.First(&result, id).Error; err != nil {
		return nil, err
	}
	return &result, nil
}
