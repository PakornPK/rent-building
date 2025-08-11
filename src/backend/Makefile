.PHONY: dev, db,db-down, migrate

db:
	docker compose -f scripts/docker/docker-compose.yml up -d db
db-down:
	docker compose -f scripts/docker/docker-compose.yml down -v
dev: 
	go run cmd/app/main.go
migrate:
	@echo "Running migrations..."
	@read -p "What are you want to run migrate in mode up or down? (up/down): " MODE; \
	echo "Running migrations in mode: $$MODE"; \
	./scripts/migrations/migration.sh $$MODE

migrate-create:
	@echo "Creating migration file..."
	@read -p "Enter migration name: " MIGRATION_NAME; \
	echo "Creating migration file: $$MIGRATION_NAME"; \
	migrate create -ext sql -dir scripts/db/migrations -seq $$MIGRATION_NAME