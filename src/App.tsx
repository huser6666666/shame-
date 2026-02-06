import { useEffect, useState } from 'react'
import { supabase, getImagePublicUrl, type DailyImage } from './lib/supabase'
import './App.css'

function formatDateKey(d: Date): string {
  return d.toISOString().slice(0, 10)
}

function App() {
  const [todayImage, setTodayImage] = useState<DailyImage | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const today = formatDateKey(new Date())
    let cancelled = false

    async function fetchToday() {
      setLoading(true)
      setError(null)
      const { data, error: err } = await supabase
        .from('daily_images')
        .select('*')
        .eq('image_date', today)
        .maybeSingle()

      if (cancelled) return
      if (err) {
        setError(err.message)
        setLoading(false)
        return
      }
      setTodayImage(data as DailyImage | null)
      setLoading(false)
    }

    fetchToday()
    return () => { cancelled = true }
  }, [])

  if (loading) {
    return (
      <div className="app">
        <header className="header">
          <h1>Image du jour</h1>
        </header>
        <div className="loading">Chargement…</div>
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
