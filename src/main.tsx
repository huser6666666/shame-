import { StrictMode, Component, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error?: Error }> {
  state = { hasError: false, error: undefined as Error | undefined }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center', background: '#1a1a2e', color: '#e8e8e8', minHeight: '100vh' }}>
          <h1>Erreur</h1>
          <p>{this.state.error?.message ?? 'Une erreur s\'est produite.'}</p>
          <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>
            Ouvre la console (F12) pour plus de détails. Vérifie que tu ouvres le site à l’URL :<br />
            <strong>https://huser6666666.github.io/shame-/</strong>
          </p>
        </div>
      )
    }
    return this.props.children
  }
}

const root = document.getElementById('root')
if (root) {
  createRoot(root).render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>,
  )
}
