import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !anonKey) {
  console.warn(
    'Supabase non configuré : crée un fichier .env avec VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY (voir .env.example)'
  )
}

export const supabase = createClient(url ?? '', anonKey ?? '')

const BUCKET = 'daily-images'

/** URL publique d'une image du bucket Storage */
export function getImagePublicUrl(imagePath: string): string {
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(imagePath)
  return data.publicUrl
}

export type DailyImage = {
  id: string
  image_date: string // YYYY-MM-DD
  image_path: string // chemin dans le bucket Storage
  created_at: string
}
