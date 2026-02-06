import { useEffect, useState } from 'react'
import { supabase, getImagePublicUrl, type DailyImage } from './lib/supabase'
import './App.css'

function formatDateKey(d: Date): string {
  return d.toISOString().slice(0, 10)
}

function App() {
  const [todayImage, setTodayImage] = useState<DailyImage | null>(null)
  const [isFallback, setIsFallback] = useState(false) // true = on affiche la dernière image (pas celle du jour)
  const [revealed, setRevealed] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const today = formatDateKey(new Date())
    let cancelled = false

    const timeoutId = setTimeout(() => {
      if (cancelled) return
      setError(
        'La connexion a pris trop de temps. Vérifie les secrets Supabase (repo → Settings → Secrets) et que la table daily_images existe.'
      )
      setLoading(false)
    }, 12_000)

    async function fetchImage() {
      setLoading(true)
      setError(null)
      setIsFallback(false)

      // 1) Essayer l'image du jour
      const { data: todayData, error: todayErr } = await supabase
        .from('daily_images')
        .select('*')
        .eq('image_date', today)
        .maybeSingle()

      if (cancelled) return
      if (todayErr) {
        clearTimeout(timeoutId)
        setError(todayErr.message)
        setLoading(false)
        return
      }

      if (todayData) {
        setTodayImage(todayData as DailyImage)
        setLoading(false)
        return
      }

      // 2) Sinon récupérer la dernière image en base (pour test / fallback)
      const { data: lastData, error: lastErr } = await supabase
        .from('daily_images')
        .select('*')
        .order('image_date', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (cancelled) return
      clearTimeout(timeoutId)
      if (lastErr) {
        setError(lastErr.message)
        setLoading(false)
        return
      }
      if (lastData) {
        setIsFallback(true)
        setTodayImage(lastData as DailyImage)
      } else {
        setTodayImage(null)
      }
      setLoading(false)
    }

    fetchImage()
    return () => {
      cancelled = true
      clearTimeout(timeoutId)
    }
  }, [])

  if (loading) {
    return (
      <div className="app">
        <header className="header">
          <h1>Image du jour</h1>
        </header>
        <div className="loading">
          <p>Chargement de l’image du jour…</p>
          <p className="loading-hint">Vérification de la base de données (Supabase).</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="app">
        <header className="header">
          <h1>Image du jour</h1>
        </header>
        <div className="error">
          <p>Erreur : {error}</p>
          <p className="hint">
            Vérifie que Supabase est configuré (.env) et que la table daily_images existe (voir supabase/schema.sql).
          </p>
        </div>
      </div>
    )
  }

  if (!todayImage) {
    return (
      <div className="app">
        <header className="header">
          <h1>Image du jour</h1>
        </header>
        <div className="empty">
          <p>Aucune image pour aujourd’hui.</p>
          <p className="date">{formatDateKey(new Date())}</p>
        </div>
      </div>
    )
  }

  const imageUrl = getImagePublicUrl(todayImage.image_path)

  return (
    <div className="app">
      <header className="header">
        <h1>Image du jour</h1>
        <p className="date">{todayImage.image_date}</p>
        {isFallback && (
          <p className="fallback-badge">Dernière image en base (pas d’image pour aujourd’hui)</p>
        )}
      </header>

      <main className="main">
        <button
          type="button"
          className={`reveal-area ${revealed ? 'revealed' : ''}`}
          onClick={() => setRevealed(true)}
          aria-label={revealed ? 'Image dévoilée' : 'Cliquer pour dévoiler l’image'}
        >
          <span className="cover" aria-hidden={revealed}>
            {!revealed && 'Clique pour dévoiler'}
          </span>
          <img
            src={imageUrl}
            alt="Image du jour"
            className={`daily-image ${revealed ? 'visible' : ''}`}
          />
        </button>
      </main>
    </div>
  )
}

export default App
