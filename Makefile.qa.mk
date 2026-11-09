qa: lint arch-selftest icons-check format-check typecheck test-unit ## QA rapide : lint (dont architecture), auto-test des règles, sprite d'icônes, format, types, tests unitaires

qa-full: qa test-e2e test-a11y test-dev metrics ## QA complète : QA rapide + e2e + a11y + Lighthouse

lint: ## ESLint
	$(RUN) yarn lint

arch-selftest: ## Écrit des violations volontaires des règles d'architecture, exige l'échec d'ESLint, puis les retire
	$(RUN) node tools/archSelftest.mts

icons-check: ## Échoue si public/icons.svg ou le type des noms ne correspondent plus à icons.json
	$(RUN) node tools/icons.mts --check

lint-fix: ## ESLint avec correction automatique
	$(RUN) yarn lint:fix

format: ## Prettier (écriture)
	$(RUN) yarn format

format-check: ## Prettier (vérification)
	$(RUN) yarn format:check

typecheck: ## Vérification des types TypeScript
	$(RUN) yarn typecheck

test: test-unit test-e2e test-a11y test-dev ## Tous les tests

test-unit: ## Tests unitaires et fonctionnels (Vitest + Testing Library) ; VITEST_CHANGED=1 : fichiers touchés par les modifications non commitées
	$(RUN) yarn test:unit $(if $(VITEST_CHANGED),--changed)

test-e2e: ## Tests end-to-end desktop et mobile (Playwright)
	$(RUN) yarn test:e2e

e2e-vite: ## e2e desktop des fichiers modifiés depuis origin/main (FICHIERS="…" ou GREP="…"), build réutilisé s'il est à jour
	$(RUN) env FICHIERS='$(FICHIERS)' GREP='$(GREP)' sh tools/e2e-vite.sh

test-a11y: ## Tests d'accessibilité WCAG 2.1 AA (axe-core + Playwright)
	$(RUN) yarn test:a11y

test-dev: ## Pages de développement (charte graphique) servies par next dev
	$(RUN) yarn test:dev

metrics: build ## Métriques Lighthouse CI en clair puis en sombre (perf ≥ 90, a11y et SEO = 100)
	$(RUN) sh -c 'export CHROME_PATH=$$(node -e "console.log(require(\"@playwright/test\").chromium.executablePath())") && yarn lhci && yarn lhci:sombre'

.PHONY: qa qa-full lint arch-selftest icons-check lint-fix format format-check typecheck test test-unit test-e2e e2e-vite test-a11y test-dev metrics
