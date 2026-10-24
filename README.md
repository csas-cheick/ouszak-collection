# OUSZAK COLLECTION

Vitrine e-commerce responsive dédiée à la présentation des collections OUSZAK.
L'application React et TypeScript permet de parcourir le catalogue, consulter les
fiches produit et contacter la boutique.

## Fonctionnalités

- Accueil et présentation de la marque
- Catalogue local de chaussures, parfums et modèles de couture
- Filtres par catégorie et affichage en grille ou en liste
- Fiches produit avec contact direct
- Page À propos
- Connexion administrateur et tableau de bord de gestion (Supabase)

Les visuels et les données de démonstration du catalogue sont dans
`src/data/catalog.ts`. Les prix et la disponibilité sont communiqués sur demande.

## Espace administrateur

La connexion et les données de caisse utilisent Supabase. Renseignez
`VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` dans votre fichier `.env`, puis
exécutez `supabase/schema.sql` dans le SQL Editor du projet Supabase.

Dans Supabase Auth, désactivez les inscriptions publiques et créez les comptes
administrateurs depuis le tableau de bord Supabase. Après avoir créé un compte,
attribuez-lui l’accès en exécutant dans le SQL Editor, en remplaçant l’UUID par
celui de l’utilisateur :

```sql
insert into public.admin_users (user_id)
values ('UUID-DE-L-UTILISATEUR');
```

Les ventes, dépenses et sessions de caisse sont protégées par Row Level Security.
Ne placez jamais la clé `service_role` dans une variable `VITE_*` ni dans le code
du navigateur.

## Développement

```sh
npm install
npm run dev
```

Pour vérifier la compilation :

```sh
npm run build
```
