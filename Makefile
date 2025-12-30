# =========================
# Global
# =========================
COMPOSE = docker compose
BACKEND = backend
FRONTEND = frontend

.DEFAULT_GOAL := help

# =========================
# Help
# =========================
help:
	@echo ""
	@echo "Usage:"
	@echo "  make up            Start all containers"
	@echo "  make down          Stop all containers"
	@echo "  make restart       Restart all containers"
	@echo "  make logs          Show logs"
	@echo ""
	@echo "Development:"
	@echo "  make dev           Build & start (dev)"
	@echo "  make rebuild       Rebuild all images"
	@echo ""
	@echo "Backend:"
	@echo "  make be            Exec backend shell"
	@echo "  make prisma        Run prisma studio"
	@echo "  make migrate       Prisma migrate dev"
	@echo "  make generate      Prisma generate"
	@echo ""
	@echo "Database:"
	@echo "  make db            Exec postgres shell"
	@echo "  make reset-db      Reset database (DANGEROUS)"
	@echo ""

# =========================
# Docker lifecycle
# =========================
up:
	$(COMPOSE) up -d

down:
	$(COMPOSE) down

restart:
	$(COMPOSE) down
	$(COMPOSE) up -d

logs:
	$(COMPOSE) logs -f

dev:
	$(COMPOSE) up -d --build

rebuild:
	$(COMPOSE) build --no-cache

# =========================
# Backend
# =========================
be:
	$(COMPOSE) exec backend sh

# =========================
# Prisma
# =========================
migrate:
	$(COMPOSE) exec backend npx prisma migrate dev
	$(COMPOSE) exec backend npx prisma generate

generate:
	$(COMPOSE) exec backend npx prisma generate

prisma:
	$(COMPOSE) exec backend npx prisma studio

seed:
	$(COMPOSE) exec backend npx prisma db seed

# =========================
# Database
# =========================
db:
	$(COMPOSE) exec db psql -U $$POSTGRES_USER -d $$POSTGRES_DB

reset-db:
	@echo "⚠️  This will remove db-data completely."
	@read -p "Are you sure? [y/N]: " ans; \
	if [ "$$ans" = "y" ]; then \
		rm -rf db-data && $(COMPOSE) up -d db; \
	else \
		echo "Canceled."; \
	fi
