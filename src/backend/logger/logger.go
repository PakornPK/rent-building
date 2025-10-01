package logger

import (
	"github.com/PakornPK/rent-building/configs"
	"go.uber.org/zap"
)

type Logger interface {
	Info(msg string, fields ...zap.Field)
	Warn(msg string, fields ...zap.Field)
	Error(msg string, fields ...zap.Field)
	Debug(msg string, fields ...zap.Field)
	Fatal(msg string, fields ...zap.Field)
	Sync() error
	WithRequestID(requestID string) Logger
	WithUserID(userID int) Logger
}

type logger struct {
	l *zap.Logger
}

func NewLogger(cfg configs.Config) (Logger, error) {
	if cfg.App.IsProduction() {
		l, err := zap.NewProduction()
		if err != nil {
			return nil, err
		}
		return &logger{l: l.WithOptions(zap.AddCallerSkip(1))}, nil
	} else {
		l, err := zap.NewDevelopment()
		if err != nil {
			return nil, err
		}
		return &logger{l: l.WithOptions(zap.AddCallerSkip(1))}, nil
	}
}

func (l *logger) Info(msg string, fields ...zap.Field) {
	l.l.Info(msg, fields...)
}
func (l *logger) Warn(msg string, fields ...zap.Field) {
	l.l.Warn(msg, fields...)
}
func (l *logger) Error(msg string, fields ...zap.Field) {
	l.l.Error(msg, fields...)
}
func (l *logger) Debug(msg string, fields ...zap.Field) {
	l.l.Debug(msg, fields...)
}
func (l *logger) Fatal(msg string, fields ...zap.Field) {
	l.l.Fatal(msg, fields...)
}
func (l *logger) Sync() error {
	return l.l.Sync()
}
func (l *logger) WithRequestID(requestID string) Logger {
	return &logger{l: l.l.With(zap.String("request_id", requestID))}
}
func (l *logger) WithUserID(userID int) Logger {
	return &logger{l: l.l.With(zap.Int("user_id", userID))}
}
