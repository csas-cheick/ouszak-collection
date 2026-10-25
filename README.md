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

### Configuration de Supabase

1. Créez un projet sur [supabase.com/dashboard](https://supabase.com/dashboard).
2. Dans **Project Settings → API**, copiez le **Project URL** et la clé
   **anon / publishable**.
3. Ajoutez ces valeurs à votre fichier `.env` à la racine du projet :

   ```dotenv
   VITE_SUPABASE_URL=https://votre-projet.supabase.co
   VITE_SUPABASE_ANON_KEY=votre-cle-anon-ou-publishable
   ```

4. Dans **SQL Editor**, exécutez le contenu de `supabase/schema.sql`.
5. Dans **Authentication → Users**, créez votre utilisateur administrateur.
   Désactivez les inscriptions publiques dans les paramètres d’authentification
   si elles ne sont pas nécessaires.
6. Copiez l’UUID de cet utilisateur puis, dans le SQL Editor, accordez-lui le rôle
   administrateur :

   ```sql
   insert into public.admin_users (user_id)
   values ('UUID-DE-L-UTILISATEUR');
   ```

7. Redémarrez Vite après avoir modifié `.env`, puis ouvrez `/admin/login` et
   connectez-vous avec l’adresse et le mot de passe de l’utilisateur créé.

Les ventes, dépenses et sessions de caisse sont protégées par Row Level Security.
La clé **anon / publishable** est prévue pour le client navigateur avec ces règles
RLS. Ne placez jamais la clé `service_role` dans une variable `VITE_*` ni dans le
code du navigateur.

## Développement

```sh
npm install
npm run dev
```

Pour vérifier la compilation :

```sh
npm run build
```
