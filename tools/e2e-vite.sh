#!/bin/sh
# make e2e-vite : Playwright, projet desktop seul, sur les fichiers e2e ciblés, contre le build `.next`
# réutilisé s'il est à jour. Lancé dans le conteneur `node`, à la racine du dépôt.
#   FICHIERS="tests/e2e/a.e2e.ts …" : ces fichiers ; GREP="motif" : les tests dont le titre correspond ;
#   sans l'un ni l'autre : fichiers modifiés par rapport à origin/main (--only-changed).
set -eu

EMPREINTE=.next/empreinte-e2e

# Empreinte de ce qui entre dans le build : fichiers suivis ou non ignorés hors tests et docs, fichiers
# d'environnement (ignorés par git, lus par Next), variables d'environnement lues au build.
empreinte() {
  {
    printf 'API_URL=%s\n' "${API_URL:-}"
    env | grep '^NEXT_PUBLIC_' | sort || true
    git ls-files -z -co --exclude-standard -- . ':!:tests' ':!:*.md' ':!:*.test.ts' ':!:*.test.tsx' \
      ':!:playwright*.config.ts' ':!:.github' | xargs -0 sha256sum 2>/dev/null || true
    for fichier in .env .env.local .env.production .env.production.local; do
      if [ -f "$fichier" ]; then sha256sum "$fichier"; fi
    done
  } | sha256sum | cut -d ' ' -f 1
}

SOURCES=$(empreinte)
# L'identifiant du build lie l'empreinte à ce build-ci : un `make build` lancé ensuite (sans les routes
# de test) en change et force la reconstruction.
if [ -f "$EMPREINTE" ] && [ "$(cat "$EMPREINTE")" = "$SOURCES $(cat .next/BUILD_ID 2>/dev/null)" ]; then
  echo "e2e-vite : build .next à jour, réutilisé"
else
  echo "e2e-vite : sources modifiées depuis le dernier build, reconstruction"
  rm -f "$EMPREINTE"
  ENABLE_TEST_ROUTES=1 yarn build
  echo "$SOURCES $(cat .next/BUILD_ID)" > "$EMPREINTE"
fi

set -- --project=desktop --pass-with-no-tests
if [ -n "${FICHIERS:-}" ]; then
  # shellcheck disable=SC2086 # une liste de fichiers séparés par des espaces
  set -- "$@" $FICHIERS
elif [ -n "${GREP:-}" ]; then
  set -- "$@" tests/e2e
else
  set -- "$@" tests/e2e --only-changed=origin/main
fi
if [ -n "${GREP:-}" ]; then set -- "$@" --grep "$GREP"; fi

E2E_SANS_BUILD=1 exec yarn playwright test "$@"
