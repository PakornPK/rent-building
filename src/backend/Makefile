.PHONY: dev, db

db:
	docker compose -f scripts/docker/docker-compose.yml up -d db
db-down:
	docker compose -f scripts/docker/docker-compose.yml down -v
dev: 
	go run cmd/app/main.go