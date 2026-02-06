# Configuration du bucket Storage Supabase

1. Dans le **Dashboard Supabase** → **Storage** → **New bucket**
2. Nom du bucket : `daily-images`
3. Cocher **Public bucket** (pour que les images soient accessibles via URL publique)
4. Créer le bucket

5. Dans **Policies** du bucket, ajouter une politique de lecture :
   - Policy name: `Public read`
   - Allowed operation: `SELECT` (read)
   - Target roles: `anon` (ou `public`)
   - USING expression: `true`

Pour uploader une image pour une date donnée :
- Upload dans le bucket `daily-images` avec un nom du type `2025-02-06.jpg` (ou la date du jour)
- Puis insérer une ligne dans la table `daily_images` via SQL Editor ou Table Editor :

```sql
insert into public.daily_images (image_date, image_path)
values ('2025-02-06', '2025-02-06.jpg');
```

L’URL publique de l’image sera :  
`https://<PROJECT_REF>.supabase.co/storage/v1/object/public/daily-images/2025-02-06.jpg`
