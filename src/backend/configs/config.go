package configs

import (
	"log"
	"os"
	"strings"

	"github.com/joho/godotenv"
	"github.com/spf13/viper"
)

type Config struct {
	Database DatabaseConfig `mapstructure:",squash"`
	Server   ServerConfig   `mapstructure:",squash"`
	Auth     AuthConfig     `mapstructure:",squash"`
}

type ServerConfig struct {
	Port int `mapstructure:"SERVER_PORT"`
}

type DatabaseConfig struct {
	Host     string `mapstructure:"DATABASE_HOST"`
	Port     int    `mapstructure:"DATABASE_PORT"`
	Username string `mapstructure:"DATABASE_USERNAME"`
	Password string `mapstructure:"DATABASE_PASSWORD"`
	Database string `mapstructure:"DATABASE_NAME"`
	SSL      bool   `mapstructure:"DATABASE_SSL"`
	Debug    bool   `mapstructure:"DATABASE_DEBUG"`
}

type AuthConfig struct {
	PublicKey  string `mapstructure:"AUTH_PUBLIC_KEY"`
	PrivateKey string `mapstructure:"AUTH_PRIVATE_KEY"`
	Issuer     string `mapstructure:"AUTH_ISSUER"`
	ExpiresIn  int    `mapstructure:"AUTH_EXPIRES_IN"`
	RefreshIn  int    `mapstructure:"AUTH_REFRESH_IN"`
}

func NewConfig() (*Config, error) {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found or cannot read:", err)
	}
	v := viper.New()
	envs := os.Environ()
	for _, env := range envs {
		env := strings.SplitN(env, "=", 2)
		v.BindEnv(env[0])
	}

	var config Config
	if err := v.Unmarshal(&config); err != nil {
		return nil, err
	}

	return &config, nil
}
