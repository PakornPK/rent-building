package infra

import (
	"fmt"

	"github.com/PakornPK/rent-building/configs"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

type Database interface {
	Connect() error
	GetConnectionDB() *ConnectionDB
	Close() error
}

type database struct {
	db   *gorm.DB
	conf *configs.DatabaseConfig
}

func NewDatabase(conf *configs.DatabaseConfig) Database {
	return &database{
		conf: conf,
	}
}

type ConnectionDB struct {
	db *gorm.DB
}

func (d *ConnectionDB) DB() *gorm.DB {
	if d.db == nil {
		panic("Database connection is not initialized")
	}
	return d.db
}

func (d *database) GetConnectionDB() *ConnectionDB {
	return &ConnectionDB{
		db: d.db,
	}
}

func (d *database) Connect() error {
	// Initialize database
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%d)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		d.conf.Username,
		d.conf.Password,
		d.conf.Host,
		d.conf.Port,
		d.conf.Database,
	)
	if d.conf.SSL {
		dsn += "&tls=true"
	} else {
		dsn += "&tls=false"
	}
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		return err
	}

	d.db = db
	return nil
}

func (d *database) Close() error {
	sqlDB, err := d.db.DB()
	if err != nil {
		return err
	}
	return sqlDB.Close()
}
