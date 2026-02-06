# Image du jour (Supabase)

Site où une image est affichée par jour. L’image est cachée ; un clic la dévoile.

## Connexion à Supabase

1. **Crée un projet** sur [supabase.com](https://supabase.com) si ce n’est pas déjà fait.

2. **Récupère l’URL et la clé anon**  
   Dashboard → ton projet → **Settings** → **API** :
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** (Project API keys) → `VITE_SUPABASE_ANON_KEY`

3. **Crée le fichier `.env`** à la racine du projet (copie `.env.example`) :
   ```env
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
   ```

4. **Base de données**  
   Dans Supabase : **SQL Editor** → New query → colle le contenu de `supabase/schema.sql` → Run.

5. **Storage (images)**  
   Suis les étapes dans `supabase/storage-setup.md` pour créer le bucket `daily-images` et une politique de lecture publique. Ensuite, uploade une image (ex. `2025-02-06.jpg`) et insère une ligne dans `daily_images` avec `image_date` = date du jour et `image_path` = nom du fichier.

## Lancer le projet

```bash
npm install
npm run dev
```

Ouvre l’URL affichée (souvent `http://localhost:5173`). Tu devrais voir l’image du jour (cachée) ; un clic la dévoile.

## GitHub Pages

1. **Crée un dépôt** sur GitHub (ex. `shame-`). Ne coche pas « Initialize with README » si tu pousses ce projet.

2. **Lien avec ton dépôt et push** (remplace `TON_USER` et `shame-` par ton compte et le nom du repo) :
   ```bash
   git remote add origin https://github.com/TON_USER/shame-.git
   git add .
   git commit -m "Initial commit - Image du jour + GitHub Pages"
   git push -u origin main
   ```

3. **Activer GitHub Pages**  
   Repo → **Settings** → **Pages** → **Build and deployment** :
   - Source : **Deploy from a branch**
   - Branch : **gh-pages** → dossier **/ (root)** → Save.

   La branche `gh-pages` est créée par le workflow au premier push sur `main`. Si elle n’existe pas encore, pousse d’abord le code puis reviens ici.

4. **Secrets pour le build** (obligatoire pour que Supabase marche en prod)  
   Repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret** :
   - `VITE_SUPABASE_URL` = ton URL Supabase
   - `VITE_SUPABASE_ANON_KEY` = ta clé anon

5. **URL du site**  
   Après le premier push réussi : `https://TON_USER.github.io/shame-/`  
   Si ton repo a un autre nom, change `base` dans `vite.config.ts` (ex. `base: '/mon-repo/'`).
