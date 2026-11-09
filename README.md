# boilerplate-next

Point de départ pour une application **Next.js App Router** avec les composants de **boilerplates-ui**, **TanStack Query**, **react-hook-form + zod**, et toute la chaîne qualité : lint, format, types, tests unitaires, end-to-end, accessibilité et Lighthouse.

Les pages de démonstration montrent chaque brique en situation :

| Page                                                                            | Ce qu'elle montre                                                                                           |
| ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `/`                                                                             | Hero pleine largeur (image LCP), carrousel Embla, grille de blog rendue côté serveur                        |
| `/catalogue/[...]`                                                              | Catalogue à facettes rendu côté serveur, état dans l'URL, formulaire GET qui marche sans JavaScript         |
| `/taches`                                                                       | Chargement côté client avec TanStack Query et ses trois états : chargement, erreur avec relance, liste vide |
| `/contact`                                                                      | Formulaire validé par un schéma zod, erreurs liées aux champs, envoi par mutation TanStack Query            |
| `/mentions-legales`, `/donnees-personnelles`, `/accessibilite`, `/plan-du-site` | Pages légales lues dans l'API (texte administré dans son `/admin`), plan du site tiré de la navigation      |
| `/charte-graphique`                                                             | Charte graphique, **en développement uniquement** (404 sur le build de production)                          |

Le header porte le logo, la navigation, le menu de catégories (cascade sur ordinateur, panneau par niveaux sur mobile) et le bouton du **mode accessibilité renforcée**.

Le site est **multilingue quand l'API l'active** (`locales` de `GET /api/site-identity`) : la langue par défaut garde ses adresses sans préfixe, les autres sont préfixées (`/en/produit/swiss-cheese-plant`), un sélecteur de langue apparaît dans le header, avec `hreflang` et un sitemap par langue. Un site monolingue ne change en rien. Les libellés de l'interface sont dans `src/shared/i18n/dictionaries/` (français et anglais).

## Stack

| Brique                                 | Rôle                                                                      |
| -------------------------------------- | ------------------------------------------------------------------------- |
| Next.js 16 (App Router, Turbopack)     | Routage, rendu serveur, metadata, sitemap                                 |
| React 19, TypeScript 6 (strict)        | UI et typage                                                              |
| boilerplates-ui                        | Jetons, CSS et composants React communs ; styles du site en CSS Modules   |
| TanStack Query 5                       | Cache et synchronisation des données serveur côté client                  |
| react-hook-form + zod 4                | Formulaires, validation et types dérivés du même schéma                   |
| Embla Carousel 8 + wheel-gestures      | Carrousel (glisser, swipe, molette), dans `shared/ui/carousel` uniquement |
| Lucide (sprite SVG)                    | Icônes : `icons.json`, `make icons`, composant `Icon`                     |
| ESLint 9, Prettier, Husky, lint-staged | Qualité du code et règles d’architecture, vérifiées à chaque commit       |
| Vitest 5 + Testing Library             | Tests unitaires et fonctionnels                                           |
| Playwright + axe-core                  | Tests end-to-end et accessibilité, desktop et mobile                      |
| Lighthouse CI                          | Performance, accessibilité, SEO, bonnes pratiques                         |

## Prérequis

- Docker avec Compose
- `make`
- git

Rien d'autre : ni Node, ni Yarn, ni navigateur sur la machine. Chaque commande `make` lance `docker compose run` sur le service `node` (image officielle Playwright, à la version exacte de `@playwright/test`). Les dépendances vivent dans le volume nommé `node_modules`, et le conteneur tourne avec l'UID et le GID de la machine : les fichiers générés ne sont pas à root.

## Démarrage

```sh
git clone https://github.com/kewinMarchand/boilerplate-next.git
cd boilerplate-next
cp .env.example .env.local
make install   # image de dev (Node, Chromium) et dépendances
make up        # http://localhost:3000, rechargement à chaud
```

Le site lit ses données dans une API de test lancée à côté : [boilerplate-api-platform](https://github.com/kewinMarchand/boilerplate-api-platform) sur le port 8090 (défaut) ou [boilerplate-hono](https://github.com/kewinMarchand/boilerplate-hono) sur le port 8091, au même contrat. `API_URL` choisit l'une ou l'autre. Les tests e2e ont besoin de l'API lancée.

Le port vient de `DEV_PORT` (3000 par défaut), pour `make up` comme pour `make start`. Le conteneur partage le réseau de la machine. Le navigateur appelle l'API directement : un autre port doit être autorisé par la configuration CORS de l'API, par exemple `DEV_PORT=3150 make up` si le 3000 est déjà pris.

Variables d'environnement :

| Variable                                               | Rôle                                                                                                                                                                                     |
| ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`                                 | URL publique, utilisée pour les URL canoniques, Open Graph, JSON-LD et le sitemap                                                                                                        |
| `API_URL`                                              | Origine de l'API : `http://localhost:8090` (API Platform, défaut) ou `http://localhost:8091` (Hono), même contrat. Relue à l'exécution par le serveur, figée au build pour le navigateur |
| `API_SCHEMA_URL`                                       | Schéma OpenAPI de l'API consommée, lu par `make api-types`                                                                                                                               |
| `MAINTENANCE`                                          | `1` : toutes les pages répondent 503 avec `Retry-After` (page autonome, `src/proxy.ts`)                                                                                                  |
| `GLITCHTIP_DSN`, `NEXT_PUBLIC_GLITCHTIP_DSN`           | Suivi des erreurs GlitchTip, serveur et navigateur. Vides : aucun SDK chargé, aucune requête                                                                                             |
| `NEXT_PUBLIC_GLITCHTIP_ENVIRONMENT`                    | Environnement des erreurs remontées (défaut : `development` ou `production`)                                                                                                             |
| `NEXT_PUBLIC_MATOMO_URL`, `NEXT_PUBLIC_MATOMO_SITE_ID` | Mesure d'audience Matomo sans cookie. Vides : aucun script, aucune requête, pas de paragraphe « Mesure d'audience »                                                                      |
| `ENABLE_TEST_ROUTES`                                   | `1` : active `/_erreur-test` sur un build de production. Posée par Playwright seulement                                                                                                  |

## Commandes

`make help` liste toutes les commandes. Les principales :

| Commande                               | Effet                                                                                                        |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `make install`                         | Construit l'image de développement et installe les dépendances                                               |
| `make up`                              | Serveur de développement (port `DEV_PORT`, 3000 par défaut)                                                  |
| `make build` / `make start`            | Build de production, puis le servir                                                                          |
| `make qa`                              | QA rapide : lint (dont architecture), auto-test des règles, format, types, tests unitaires                   |
| `make arch-selftest`                   | Écrit une violation de chaque règle d'architecture, exige l'échec d'ESLint, puis la retire                   |
| `make qa-full`                         | QA complète : QA rapide, e2e, accessibilité, pages de dev, Lighthouse                                        |
| `make test-unit`                       | Vitest                                                                                                       |
| `make test-e2e`                        | Playwright, desktop et mobile, sur le build de production (port 3150)                                        |
| `make test-a11y`                       | axe-core, WCAG 2.1 AA, sur chaque page, dans les deux modes d'affichage                                      |
| `make test-dev`                        | Charte graphique, servie par `next dev` (port 3151)                                                          |
| `make metrics`                         | Lighthouse CI en clair puis en sombre : échoue sous 90 en performance ou sous 100 en accessibilité et SEO    |
| `make icons` / `make icons-check`      | Génère le sprite `public/icons.svg` et le type `IconName` depuis `icons.json`, ou vérifie qu'ils sont à jour |
| `make api-types`                       | Génère `src/shared/api/schema.d.ts` depuis `API_SCHEMA_URL`                                                  |
| `make docker-build` / `make docker-up` | Image de production, sur le port `PORT` (3000 par défaut)                                                    |
| `make docker-down`                     | Arrête les conteneurs, dont ceux du profil de développement                                                  |

## Architecture

Le front est un seul contexte borné, découpé en **modules** par sous-domaine métier, et en **couches** à l'intérieur de chaque module (vocabulaire d'Evans et de Khononov, détaillé dans le document d'architecture commun aux boilerplates).

```
src/
  app/                    routage uniquement : chaque route délègue à une vue ou à l'index d'un module
    [lang]/               pages et layout racine, sous la langue de la page (réécrite par proxy.ts)
      @languages/         sélecteur de langue de chaque page (route parallèle)
    global-not-found.tsx  404 d'une adresse sans route ; sitemap, robots, manifeste, theme.css à la racine
  proxy.ts                mode maintenance (503) et langue de l'adresse, couche de routage lui aussi
  views/                  pages sans métier ou qui composent des modules : home, legal, errors, styleguide,
                          document (le document complet : <html>, en-tête, pied de page)
  modules/
    catalog/              forme complète
      domain/             types (namespace Catalog), value objects, règles pures, sans framework
      application/        cas d'utilisation : chargement de page, menu, chemins du sitemap, sans framework
      infrastructure/     accès aux données : catalogRepository.ts appelle l'API
        http/             traduction entre le contrat de l'API et le domaine (seule à importer les types générés)
      ui/                 vue serveur, filtres et tri client, cartes, pagination, métadonnées SEO
      index.ts            seul export public
    blog/, contact/, task/   forme réduite : domain/, infrastructure/, ui/, sans application/
  shared/                 socle sans métier : config, seo, theme, providers, i18n (langues, dictionnaires),
                          ui/ (kit, layout, carousel, a11y-mode, hooks), api/ (client typé, types générés)
tests/
  e2e/                    un fichier par page ou par brique transverse
  a11y/                   audit axe de chaque page, dans les deux modes
  dev/                    pages réservées au développement
tools/
  archSelftest.mts        auto-test des règles d'architecture
```

Règles de dépendance, vérifiées par ESLint (`@boundaries/eslint-plugin`) :

- le routage importe les vues, l'index public des modules et le socle ;
- une vue importe l'index public des modules et le socle ;
- un module n'importe jamais un autre module, la composition se fait dans `views/` (l'accueil assemble le blog) ;
- le socle n'importe ni module, ni vue, ni routage : il reçoit les données métier en propriétés (le menu de catégories est fourni par `src/views/document/SiteDocument.tsx`) ;
- dans un module, `domain/` n'importe que lui-même (et des types du socle), `application/` le domaine et l'infrastructure, `infrastructure/` le domaine et les types générés de l'API, `ui/` le domaine, l'application, l'interface du module et le socle (l'infrastructure seulement si le module n'a pas d'`application/`) ;
- les types générés de l'API (`shared/api/`) ne sont importés que par `infrastructure/`.

`make arch-selftest`, lancé par `make qa`, écrit une violation volontaire de chaque règle à son emplacement réel, exige l'échec d'ESLint, puis la retire.

**Sources uniques** :

- `src/shared/config/site.ts` : nom, description, URL, éditeur (valeurs fictives, pour le SEO), état d'audit d'accessibilité (lien du footer).
- `GET /api/slides` et `GET /api/legal_pages/{slug}` : carrousel de l'accueil et texte des pages légales, administrés dans l'admin de l'API Platform.
- `src/shared/config/navigation.ts` : navigation principale et liens légaux, libellés par clé de dictionnaire. Le header, le footer, le plan du site, le sitemap XML et le fil d'Ariane en dérivent.
- `src/shared/i18n/dictionaries/fr.ts` et `en.ts` : libellés de l'interface, mêmes clés dans les deux langues (vérifié par le type et par un test). `GET /api/site-identity` (`locales`) : langues du site, la première par défaut.
- `GET /api/categories` : arbre des catégories, lu par le module catalogue. Le layout racine en tire le menu (`getCategoryMenu`), le plan du site et le sitemap leurs liens (`listCatalogPaths`).
- `src/shared/seo/` : `buildMetadata` construit title, description, canonique, robots, Open Graph et Twitter de chaque route. Les JSON-LD (`Organization`, `WebSite`, `BreadcrumbList`, `ItemList`) en partagent les URL absolues.

Les conventions de code viennent du `CLAUDE.md` global de l'auteur. Le `CLAUDE.md` de ce dépôt note les choix propres au projet, les versions épinglées et les pièges rencontrés.

## Recettes

### Ajouter une page

1. Page sans métier : créer `src/views/<nom>/` avec sa vue `<Nom>View.tsx` et son `index.ts`. Page d'un module : la vue va dans `ui/` du module et sort par son `index.ts`. La vue s'enveloppe dans `<PageContainer breadcrumb={buildBreadcrumb(t.nav, '/<route>')}>`, `t` venant de `getDictionary()` ; ses libellés vont dans les deux dictionnaires.
2. Créer `src/app/[lang]/<route>/page.tsx`, dont `generateMetadata` renvoie `buildMetadata({ ...dictionaryFor(locale).meta.<page>, path, settings: await getSeoSettings(locale) })` (`locale` par `getLocale()`) et qui rend la vue. Le sélecteur de langue la couvre déjà (`@languages/[...rest]`) ; une page détaillée dont le slug change selon la langue a sa page dans `@languages/`.
3. Ajouter la route à `src/shared/config/navigation.ts` (menu, plan du site, sitemap, fil d'Ariane) et à `tests/e2e/routes.ts` (réponse, SEO, débordement, axe), puis à `.lighthouserc.json`.
4. Écrire `tests/e2e/<route>.e2e.ts`.

### Ajouter une catégorie ou une facette au catalogue

- Catégorie : l'ajouter dans l'API. Le menu, le plan du site, le sitemap et le fil d'Ariane suivent. Un slug absent de l'arbre répond 404.
- Facette : ajouter le champ au produit et à `Catalog.Query`, le lire et l'écrire dans `catalogQuery.ts` (zod ignore les valeurs invalides), le traduire en paramètre de l'API dans `infrastructure/http/catalogTranslation.ts`, l'afficher dans `FiltersForm.tsx`. Chaque étape a son test unitaire à côté.
- Tout changement de filtre passe par `withFilter`, qui remet la page à 1 et conserve le reste (vue comprise).

### Charger des données avec TanStack Query

Le pattern est dans `src/modules/task/` :

- `infrastructure/taskRepository.ts` appelle `GET /api/tasks` depuis le navigateur avec le client typé, `infrastructure/http/taskTranslation.ts` traduit la réponse en `Task.Entity`.
- `ui/hooks/useTasks.ts` encapsule `useQuery`, avec une clé de cache exportée et une erreur de chargement (`TasksLoadError`).
- `ui/TaskList.tsx` affiche les trois états à partir de props, ce qui le rend testable sans réseau.
- `ui/TasksPanel.tsx` est le seul composant client : il relie le hook au composant d'affichage.

Les données utiles au référencement (blog de l'accueil, catalogue) sont au contraire lues côté serveur dans la vue.

### Ajouter un champ de formulaire

1. Ajouter le champ et son message d'erreur dans `src/modules/contact/domain/contactSchema.ts`. Le type du formulaire en découle.
2. Ajouter le `TextField` de la bibliothèque dans `ContactForm.tsx` avec un `id`, `{...form.register('champ')}` et `error`. Le composant relie le message au champ par `aria-describedby`.

### CSP et rapports de violation

Chaque réponse porte un en-tête `Content-Security-Policy-Report-Only` construit par [`@kewinmarchand/csp`](https://github.com/kewinMarchand/csp), dans `src/shared/security/` : rien n'est bloqué, le navigateur signale chaque ressource qu'une CSP stricte refuserait à `POST /api/csp-report`, qui écrit une ligne lisible sur la sortie standard du serveur :

```
[csp-report] https://cdn.exemple.com a besoin d'une autorisation de type script (script-src) — bloqué sur /contact
```

- **Lire les logs** : `docker compose logs -f web` pour l'image de production, la sortie de `make up` en développement, la console de l'hébergeur en production. Au démarrage, `[boilerplate-next] serveur démarré (production)` permet de retrouver le bon fichier.
- **Autoriser une origine** : l'ajouter à sa directive (le nom est entre parenthèses dans la ligne) dans `siteCsp()` de `src/shared/security/csp.ts`. L'API (`API_URL`), Matomo et GlitchTip y sont déjà, quand leur variable est renseignée. L'en-tête est figé au build, comme les `NEXT_PUBLIC_*`.
- **Pourquoi Report-Only et `'unsafe-inline'`** : on collecte d'abord ce que le site charge vraiment avant de bloquer quoi que ce soit ; l'hydratation de Next et les attributs `style` écrivent du code en ligne, et un nonce par réponse rendrait toutes les pages dynamiques.

### Ajouter une icône

Ajouter son nom Lucide dans `icons.json`, puis lancer `make icons` : le sprite `public/icons.svg` et le type `IconName` sont régénérés, à versionner tous les deux. `make qa` échoue s'ils sont périmés. Les outils d'icônes (`@iconify-json/lucide`, `svgstore`) ne s'importent que dans `tools/icons.mts`, ESLint le refuse ailleurs. La charte graphique liste automatiquement les icônes du wrapper.

### Ajuster le mode accessibilité renforcée

Le script inline est dans `src/shared/ui/a11y-mode/a11yMode.ts` : il pose `data-a11y-mode="enhanced"` sur `<html>` avant le premier rendu, et ses surcharges CSS sont dans `src/shared/theme/global.css`. Les espacements de texte ne visent que le contenu de `<main>`, jamais le header, la navigation ni le footer. Un composant qui a besoin d'un style propre à ce mode le cible dans son CSS Module avec `:global(html[data-a11y-mode='enhanced']) .classe`.

### Déclarer un audit d'accessibilité

Renseigner `accessibility` dans `src/shared/config/site.ts` (date, taux de conformité, auditeur). L'état « non conforme », « partiellement conforme » ou « totalement conforme » est recalculé pour le lien du footer. Le texte de la déclaration se modifie dans l'admin de l'API Platform (`/admin`, Pages légales).

### Passer le site en maintenance

Démarrer le serveur avec `MAINTENANCE=1`. Toutes les routes répondent 503 avec `Retry-After: 3600` et une page HTML autonome, dans la langue de l'adresse (préfixe, sinon langue par défaut du site).

## Tests

- **Unitaires et fonctionnels** : fichiers `*.test.ts(x)` à côté du code testé.
- **End-to-end** : Playwright sert le build de production sur le port 3150, avec `ENABLE_TEST_ROUTES=1` pour la route de test de la 500. Les éléments sont ciblés par `data-testid`, préfixé par le module ou la zone (`tasks-list`, `catalog-product`, `layout-breadcrumb`). Chaque rendu conditionnel est testé présent et absent. Un test vérifie qu'aucune page ne déborde horizontalement à 375, 768 et 1280 px dans les deux modes et enregistre des captures de l'accueil et du catalogue dans `test-results/`.
- **Accessibilité** : `tests/a11y/` passe axe-core sur chaque route de `tests/e2e/routes.ts`, sur le catalogue filtré, la 404, la 500 et les menus ouverts, dans les deux modes. Axe ne couvre qu'une partie du RGAA, un audit manuel reste nécessaire.
- **Pages de développement** : `tests/dev/` vérifie la charte graphique sur `next dev` (port 3151). Le build de production, lui, vérifie qu'elle répond 404.
- **Site bilingue** : `tests/e2e/bilingue.e2e.ts` construit une version dans `.next-bilingue` avec `API_SCENARIO=bilingual` (l'API active `en` et sert quelques traductions) et la sert sur le port 3106 : routes préfixées, contenu et libellés en anglais, sélecteur, `hreflang`, `<html lang>`, sitemap, 404 d'un préfixe non activé, axe sur les pages anglaises dans les trois affichages. Il vérifie qu'aucun libellé français ne reste sur les pages anglaises (libellés des dictionnaires absents de l'anglais et défauts de boilerplates-ui) : alertes, champs obligatoires, chargement (réponses de l'API retenues par une interception limitée à `/api/**`), filtres, pagination, fil d'Ariane, page introuvable, panier et maintenance (même build servi avec `MAINTENANCE=1` sur le port 3107), et qu'une ligne du panier suit la langue de la page. Il vérifie aussi l'absence de sélecteur sur le site monolingue.

## Intégration continue

`.github/workflows/ci.yml` lance `make install`, `make qa`, puis, contre l'API Hono clonée et lancée dans le job (`API_URL=http://localhost:8091`), les tests e2e, accessibilité, pages de développement et Lighthouse, à chaque push sur `main` et sur chaque pull request. En cas d'échec, le rapport Playwright est joint au run.

## Licence

MIT
