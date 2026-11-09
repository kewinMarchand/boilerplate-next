import type { ComplianceStatus } from '@/shared/config/accessibility'

const plural = (count: number, singular: string, pluralForm = `${singular}s`) =>
  count > 1 ? pluralForm : singular

export const fr = {
  language: { ogLocale: 'fr_FR', tag: 'fr-FR' },
  nav: {
    home: 'Accueil',
    catalog: 'Catalogue',
    blog: 'Blog',
    tasks: 'Tâches',
    contact: 'Contact',
    legalNotice: 'Mentions légales',
    privacy: 'Données personnelles',
    accessibility: 'Déclaration d’accessibilité',
    sitemap: 'Plan du site',
  },
  layout: {
    skipLink: 'Aller au contenu principal',
    mainNavigation: 'Navigation principale',
    legalLinks: 'Liens légaux',
    accessibilityStatus: (status: string) => `Accessibilité : ${status}`,
    styleguide: 'Charte graphique (développement)',
    breadcrumb: "Fil d'Ariane",
    menu: 'Menu',
    closeMenu: 'Fermer le menu',
    back: (parent: string) => `Retour : ${parent}`,
    wholeCategory: 'Voir toute la catégorie',
    wholeCatalog: 'Tout le catalogue',
    languages: 'Langue',
  },
  compliance: {
    'non conforme': 'non conforme',
    'partiellement conforme': 'partiellement conforme',
    'totalement conforme': 'totalement conforme',
  } satisfies Record<ComplianceStatus, string>,
  a11yMode: { label: 'Accessibilité renforcée' },
  colorScheme: {
    choices: { auto: 'système', light: 'clair', dark: 'sombre' },
    label: (choice: string) => `Thème : ${choice}`,
    suspended: ", suspendu par l'accessibilité renforcée",
  },
  carousel: {
    roleDescription: 'carrousel',
    slideRoleDescription: 'diapositive',
    previous: 'Précédent',
    next: 'Suivant',
    slides: 'Diapositives',
    position: (position: number, total: number) => `${position} sur ${total}`,
    goTo: (position: number) => `Aller à la diapositive ${position}`,
  },
  errors: {
    notFoundTitle: 'Page introuvable',
    notFoundIntro:
      "La page demandée n'existe pas ou a été déplacée. Ces liens peuvent vous aider à retrouver votre chemin.",
    serverTitle: 'Une erreur est survenue',
    serverIntro:
      "La page n'a pas pu s'afficher. Réessayez dans quelques instants, le problème est peut-être passager.",
    globalIntro: "Le site n'a pas pu s'afficher. Réessayez dans quelques instants.",
    retry: 'Réessayer',
    home: "Retour à l'accueil",
  },
  home: {
    overline: 'Jardinerie tropicale de démonstration',
    tasksLink: 'Voir la démo TanStack Query',
    contactLink: 'Voir le formulaire',
  },
  catalog: {
    featured: 'À la une',
    featuredError: 'Impossible de charger le carrousel pour le moment.',
    loadError: 'Impossible de charger le catalogue pour le moment.',
    title: 'Catalogue',
    subcategories: 'Sous-catégories',
    productCount: (count: number) => `${count} ${plural(count, 'produit')}`,
    filters: 'Filtres',
    filterButton: (activeCount: number) =>
      `Filtrer${activeCount > 0 ? ` (${activeCount} ${plural(activeCount, 'actif')})` : ''}`,
    closeFilters: 'Fermer les filtres',
    showProducts: (total: number) => `Voir les ${total} produits`,
    category: 'Catégorie',
    exposure: 'Exposition',
    size: 'Taille',
    price: 'Prix (en euros)',
    priceMin: 'Minimum',
    priceMax: 'Maximum',
    availability: 'Disponibilité',
    inStockOnly: 'En stock uniquement',
    applyFilters: 'Appliquer les filtres',
    filtersHint: "Les filtres s'appliquent dès qu'ils changent.",
    removeFilter: 'Retirer le filtre : ',
    clearFilters: 'Tout effacer',
    fromPrice: (euros: number) => `Dès ${euros} €`,
    upToPrice: (euros: number) => `Jusqu'à ${euros} €`,
    inStock: 'En stock',
    outOfStock: 'Rupture de stock',
    loadingProducts: 'Chargement des produits',
    retry: 'Réessayer',
    empty: 'Aucun produit ne correspond à ces filtres.',
    pagination: 'Pagination',
    previous: 'Précédent',
    next: 'Suivant',
    page: 'Page ',
    pageLink: (page: number) => `Page ${page}`,
    sortBy: 'Trier par',
    sort: 'Trier',
    sorts: {
      pertinence: 'Pertinence',
      'prix-asc': 'Prix croissant',
      'prix-desc': 'Prix décroissant',
      nom: 'Nom',
    },
    display: 'Affichage',
    views: { grille: 'Grille', liste: 'Liste' },
    exposures: { soleil: 'Soleil', 'mi-ombre': 'Mi-ombre', ombre: 'Ombre' },
    sizeLabel: (size: string) => `Taille ${size}`,
    cardMeta: (exposure: string, size: string) => `Exposition : ${exposure} · Taille ${size}`,
    metaTitle: (category: string) => `${category} · Catalogue`,
    rootMetaTitle: 'Catalogue de plantes tropicales',
    rootMetaDescription: (salesEnabled: boolean) =>
      `Catalogue de démonstration d’une jardinerie tropicale : plantes d’intérieur, d’extérieur et aquatiques, filtrables par exposition, ${salesEnabled ? 'taille, prix et stock' : 'taille et stock'}.`,
    categoryMetaDescription: (category: string, salesEnabled: boolean) =>
      `${category} : sélection de plantes tropicales de démonstration, à filtrer par exposition, ${salesEnabled ? 'taille, prix et disponibilité' : 'taille et disponibilité'}, avec tri et pagination.`,
  },
  product: {
    fallbackTitle: 'Produit',
    loadError: 'Impossible de charger ce produit pour le moment.',
    exposure: 'Exposition',
    size: 'Taille',
    availability: 'Disponibilité',
    inStock: 'En stock',
    outOfStock: 'Rupture de stock',
    otherProducts: (category: string) => `Voir les autres produits : ${category}`,
    similar: 'Produits similaires',
    galleryImage: (position: number, total: number) => `Voir l’image ${position} sur ${total}`,
    metaDescription: (product: {
      name: string
      exposure: string
      size: string
      price: string | null
      inStock: boolean
      category: string | undefined
    }) =>
      `${product.name} : exposition ${product.exposure.toLowerCase()}, taille ${product.size}${product.price ? `, ${product.price}` : ''}. ${product.inStock ? 'En stock' : 'En rupture de stock'}, rayon ${product.category ?? 'catalogue'}.`,
  },
  cart: {
    title: 'Panier',
    link: 'Panier',
    itemCount: (count: number) => ` ${plural(count, 'article')}`,
    noScript: 'Le panier demande JavaScript.',
    add: 'Ajouter au panier',
    added: (name: string) => `${name} ajouté au panier.`,
    view: 'Voir le panier',
    empty: 'Votre panier est vide.',
    browseCatalog: 'Parcourir le catalogue',
    unitPrice: (price: string) => `${price} l’unité`,
    quantityOf: (name: string) => `Quantité de ${name}`,
    remove: 'Retirer',
    removeItem: (name: string) => `Retirer ${name}`,
    total: 'Total : ',
    soon: 'La commande en ligne arrive bientôt.',
  },
  contact: {
    title: 'Contact',
    intro: 'Formulaire validé par un schéma zod et envoyé via une mutation TanStack Query.',
    product: 'Votre demande concerne : ',
    name: 'Nom',
    email: 'E-mail',
    message: 'Message',
    send: 'Envoyer',
    sent: 'Merci, votre message a bien été envoyé.',
    inquirySent: 'Votre demande de renseignement a bien été envoyée.',
    sendError: "L'envoi a échoué. Réessayez dans quelques instants.",
    inquiry: 'Demande de renseignement',
    inquiryAbout: (name: string) => ` sur ${name}`,
    validation: {
      name: 'Indiquez votre nom (2 caractères minimum).',
      email: 'Indiquez une adresse e-mail valide, par exemple nom@domaine.fr.',
      message: 'Votre message doit contenir au moins 10 caractères.',
    },
  },
  blog: {
    title: 'Blog',
    latest: 'Derniers articles',
    all: 'Tous les articles',
    loading: 'Chargement des articles',
    empty: "Aucun article publié pour l'instant. Revenez bientôt !",
    latestError: 'Impossible de charger les derniers articles pour le moment.',
    articleError: 'Impossible de charger cet article pour le moment.',
    retry: 'Réessayer',
    sections: 'Rubriques',
    allSections: 'Toutes',
    articleFallbackTitle: 'Article',
    publishedOn: 'Publié le ',
    audio: 'Version audio, ',
  },
  tasks: {
    title: 'Tâches',
    intro:
      'Données chargées côté client avec TanStack Query : chargement, erreur et liste vide sont gérés.',
    loading: 'Chargement des tâches',
    loadError: 'Impossible de charger les tâches pour le moment.',
    retry: 'Réessayer',
    empty: "Aucune tâche pour l'instant. Tout est à jour.",
    done: 'Terminée',
    todo: 'À faire',
  },
  legal: {
    loadError: 'Impossible de charger cette page pour le moment. Réessayez dans quelques minutes.',
    accessibilityTitle: "Déclaration d'accessibilité",
    audienceTitle: "Mesure d'audience",
    audienceText:
      "La fréquentation du site est mesurée avec Matomo, hébergé par l'éditeur, configuré sans cookie et sans identifiant : aucun suivi d'un site à l'autre, aucune donnée transmise à un tiers. Les statistiques produites sont anonymes et servent uniquement à améliorer le site. Les données brutes sont conservées 25 mois au plus.",
    oppositionText:
      'Vous pouvez vous opposer à cette mesure : votre choix est gardé dans ce navigateur, sans cookie.',
    oppositionLabel: 'Ne pas mesurer mes visites sur ce site',
    refused: 'Vos visites ne sont plus mesurées depuis ce navigateur.',
    measured: 'Vos visites sont mesurées, de façon anonyme.',
  },
  meta: {
    accessibility: {
      title: 'Déclaration d’accessibilité',
      description:
        'Déclaration d’accessibilité RGAA 4.1.2 : état de conformité, tests menés, mode accessibilité renforcée, contact et voies de recours.',
    },
    blog: {
      title: 'Blog',
      description:
        'Tous les articles du blog : accessibilité renforcée, carrousel sans dépendance, rendu serveur et autres choix techniques expliqués.',
    },
    contact: {
      title: 'Contact',
      description:
        'Démo de formulaire : validation par schéma zod avec react-hook-form, erreurs liées aux champs et envoi par mutation.',
    },
    privacy: {
      title: 'Données personnelles',
      description:
        'Traitement des données du formulaire de contact : responsable, finalité, base légale, durée de conservation, droits et réclamation CNIL.',
    },
    legalNotice: {
      title: 'Mentions légales',
      description:
        'Éditeur, directeur de la publication, hébergeur et propriété intellectuelle du site, avec les informations issues de la configuration.',
    },
    cart: {
      title: 'Panier',
      description:
        'Votre panier : les produits choisis, leurs quantités et le total, gardés dans ce navigateur.',
    },
    sitemap: {
      title: 'Plan du site',
      description:
        'Plan du site : liste de toutes les pages, générée depuis la configuration de navigation qui alimente aussi le sitemap XML.',
    },
    tasks: {
      title: 'Tâches',
      description:
        'Démo TanStack Query : liste de tâches chargée côté client avec gestion du chargement, des erreurs et de la liste vide.',
    },
  },
}
