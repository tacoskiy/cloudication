# =========================
# Global
# =========================
COMPOSE = docker compose
API = api
WEB = web

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
	@echo "Services:"
	@echo "  make api-sh        Exec api shell"
	@echo "  make web-sh        Exec web shell"
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

exp:
	ngrok http 3000

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
# Shell Access
# =========================
api-sh:
	$(COMPOSE) exec $(API) sh

web-sh:
	$(COMPOSE) exec $(WEB) sh

# =========================
# Prisma
# =========================
migrate:
	$(COMPOSE) exec $(API) npx prisma migrate dev
	$(COMPOSE) exec $(API) npx prisma generate

generate:
	$(COMPOSE) exec $(API) npx prisma generate

prisma:
	$(COMPOSE) exec $(API) npx prisma studio

seed:
	$(COMPOSE) exec $(API) npx prisma db seed

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
