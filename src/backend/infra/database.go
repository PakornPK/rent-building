package infra

import (
	"database/sql"
	"fmt"

	"github.com/PakornPK/rent-building/configs"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

type Database interface {
	Connect() error
	DB() (*sql.DB, error)
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

type Connection struct {
	Db *gorm.DB
}

func (d *database) DB() (*sql.DB, error) {
	return d.db.DB()
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
