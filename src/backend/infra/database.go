package infra

import (
	"fmt"
	"log"
	"os"
	"time"

	"github.com/PakornPK/rent-building/configs"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

type Database interface {
	Connect() error
	GetConnectionDB() *ConnectionDB
	Close() error
}

type database struct {
	db   *gorm.DB
	conf *configs.DatabaseConfig
	prod bool
}

func NewDatabase(conf *configs.DatabaseConfig, prod bool) Database {
	return &database{
		conf: conf,
		prod: prod,
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
	var opt gorm.Config
	if d.prod {
		newLogger := logger.New(
			log.New(os.Stdout, "\r\n", log.LstdFlags), // io writer
			logger.Config{
				SlowThreshold:             time.Second, // Slow SQL threshold
				LogLevel:                  logger.Info, // Log level
				IgnoreRecordNotFoundError: true,        // Ignore ErrRecordNotFound error for logger
				Colorful:                  true,        // Disable color
			},
		)
		opt.Logger = newLogger
	}
	db, err := gorm.Open(mysql.Open(dsn), &opt)
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
