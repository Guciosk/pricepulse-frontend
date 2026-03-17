import { AuthProvider, useAuth } from './hooks/useAuth'
import AuthPage from './pages/AuthPage'
import Dashboard from './pages/Dashboard'

function AppInner() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--color-background-tertiary)', fontFamily: 'var(--font-sans)',
        fontSize: 14, color: 'var(--color-text-secondary)',
      }}>
        Loading…
      </div>
    )
  }

  return user ? <Dashboard /> : <AuthPage />
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  )
}
