import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

export default function AuthPage() {
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState('')
  const [success, setSuccess] = useState('')

  const handle = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      if (mode === 'login') {
        const { error } = await signIn(email, password)
        if (error) throw error
      } else {
        const { error } = await signUp(email, password)
        if (error) throw error
        setSuccess('Check your email to confirm your account!')
      }
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--color-background-tertiary)', fontFamily: 'var(--font-sans)',
    }}>
      <div style={{
        background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)',
        borderRadius: 'var(--border-radius-lg)', padding: '2.5rem 2rem', width: '100%', maxWidth: 380,
      }}>
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <div style={{
            width: 44, height: 44, background: 'var(--color-background-info)',
            borderRadius: 'var(--border-radius-md)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', margin: '0 auto 12px', fontSize: 22,
          }}>🎯</div>
          <div style={{ fontSize: 20, fontWeight: 500, color: 'var(--color-text-primary)' }}>PricePulse</div>
          <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginTop: 4 }}>
            {mode === 'login' ? 'Sign in to your account' : 'Create a new account'}
          </div>
        </div>

        <form onSubmit={handle}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 6 }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com" required style={{ width: '100%' }} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 12, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 6 }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" required style={{ width: '100%' }} />
          </div>

          {error && (
            <div style={{ background: 'var(--color-background-danger)', color: 'var(--color-text-danger)', fontSize: 13, padding: '8px 12px', borderRadius: 'var(--border-radius-md)', marginBottom: 14 }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{ background: 'var(--color-background-success)', color: 'var(--color-text-success)', fontSize: 13, padding: '8px 12px', borderRadius: 'var(--border-radius-md)', marginBottom: 14 }}>
              {success}
            </div>
          )}

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '10px', background: 'var(--color-background-info)',
            color: 'var(--color-text-info)', border: '0.5px solid var(--color-border-info)',
            borderRadius: 'var(--border-radius-md)', fontSize: 14, fontWeight: 500,
            fontFamily: 'var(--font-sans)', cursor: 'pointer', opacity: loading ? 0.7 : 1,
          }}>
            {loading ? 'Loading…' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <div style={{ marginTop: 18, textAlign: 'center', fontSize: 13, color: 'var(--color-text-secondary)' }}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); setSuccess('') }}
            style={{ background: 'none', border: 'none', color: 'var(--color-text-info)', cursor: 'pointer', fontSize: 13, fontFamily: 'var(--font-sans)' }}>
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </div>
      </div>
    </div>
  )
}
