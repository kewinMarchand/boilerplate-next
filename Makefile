.DEFAULT_GOAL := help

UID := $(shell id -u)
GID := $(shell id -g)
PLAYWRIGHT_VERSION := $(shell sed -n 's/.*"@playwright\/test": "\([0-9.]*\)".*/\1/p' package.json)
DEV_PORT ?= 3000
# Dossier git commun, monté au même chemin dans le conteneur : dans un worktree, `.git` n'est qu'un renvoi vers lui
GIT_COMMUN := $(shell git rev-parse --path-format=absolute --git-common-dir 2>/dev/null)
export UID GID PLAYWRIGHT_VERSION DEV_PORT GIT_COMMUN
RUN := docker compose run --rm node

include Makefile.qa.mk

help: ## Affiche cette aide
	@grep -hE '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-16s\033[0m %s\n", $$1, $$2}'

install: ## Construit l'image de dev (Node, Chromium) et installe les dépendances dans son volume
	docker compose build node
	$(RUN) yarn install --frozen-lockfile

up: ## Lance le serveur de développement en conteneur (http://localhost:$(DEV_PORT), DEV_PORT=3000 par défaut)
	$(RUN) yarn dev --port $(DEV_PORT)

build: ## Build de production
	$(RUN) yarn build

start: ## Sert le build de production (http://localhost:$(DEV_PORT))
	$(RUN) yarn start --port $(DEV_PORT)

icons: ## Génère public/icons.svg et le type des noms depuis icons.json (noms Lucide)
	$(RUN) node tools/icons.mts

api-types: ## Génère les types TypeScript depuis le schéma OpenAPI (API_SCHEMA_URL)
	$(RUN) yarn api:types

lint-staged: ## Vérifie les fichiers indexés (appelé par le hook pre-commit)
	$(RUN) yarn lint-staged

docker-build: ## Construit l'image Docker de production
	docker compose build

docker-up: ## Lance l'image de production (port PORT, 4018 par défaut)
	docker compose up

docker-down: ## Arrête les conteneurs
	docker compose --profile dev down --remove-orphans

.PHONY: help install up build start icons api-types lint-staged docker-build docker-up docker-down
