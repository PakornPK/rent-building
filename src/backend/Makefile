.PHONY: dev, db,db-down, migrate, init, generate, migrate-create, test, certs-gen

init: 
	go install go.uber.org/mock/mockgen@latest
	go install github.com/matryer/moq@latest
db:
	docker compose -f scripts/docker/compose.yml up -d db
db-down:
	docker compose -f scripts/docker/compose.yml down -v
dev: 
	go run cmd/app/main.go
m migrate:
	@echo "Running migrations..."
	@read -p "What are you want to run migrate in mode up or down? (up/down): " MODE; \
	echo "Running migrations in mode: $$MODE"; \
	./scripts/migrations/migration.sh $$MODE

mc migrate-create:
	@echo "Creating migration file..."
	@read -p "Enter migration name: " MIGRATION_NAME; \
	echo "Creating migration file: $$MIGRATION_NAME"; \
	migrate create -ext sql -dir scripts/db/migrations -seq $$MIGRATION_NAME

generate:
	@echo "Generating code..."
	go generate ./...

test:
	@echo "Running tests..."
	go test -v ./... -cover

certs-gen:
	@echo "Generating certificates..."
	./scripts/certs/generate_certs.sh
	@echo "Certificates generated successfully."