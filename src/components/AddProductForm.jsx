import { useState } from 'react'
import { detectSite, getSiteMeta } from '../lib/sites'

export default function AddProductForm({ onAdd, onClose }) {
  const [url, setUrl] = useState('')
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [target, setTarget] = useState('')
  const [alert, setAlert] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const detectedSite = url ? getSiteMeta(detectSite(url)) : null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!url || !name || !price) { setError('URL, name and price are required.'); return }
    setLoading(true)
    try {
      await onAdd({
        url,
        name,
        current_price: parseFloat(price),
        target_price: target ? parseFloat(target) : null,
        alert_enabled: alert,
        emoji: detectedSite?.emoji || '🔗',
      })
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const labelStyle = { fontSize: 12, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 6 }
  const groupStyle = { marginBottom: 16 }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem',
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: 'var(--color-background-primary)', borderRadius: 'var(--border-radius-lg)',
        border: '0.5px solid var(--color-border-tertiary)', padding: '1.75rem',
        width: '100%', maxWidth: 480, fontFamily: 'var(--font-sans)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: 16, fontWeight: 500, color: 'var(--color-text-primary)' }}>Track a product</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: 'var(--color-text-secondary)', lineHeight: 1 }}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={groupStyle}>
            <label style={labelStyle}>Product URL</label>
            <input type="url" value={url} onChange={e => setUrl(e.target.value)}
              placeholder="https://www.amazon.com/dp/..." required style={{ width: '100%' }} />
            {detectedSite && (
              <div style={{ marginTop: 6, fontSize: 12, color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: detectedSite.color, display: 'inline-block' }} />
                Detected: {detectedSite.label} {detectedSite.emoji}
              </div>
            )}
          </div>

          <div style={groupStyle}>
            <label style={labelStyle}>Product name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)}
              placeholder="e.g. Sony WH-1000XM5" required style={{ width: '100%' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            <div>
              <label style={labelStyle}>Current price ($)</label>
              <input type="number" step="0.01" min="0" value={price} onChange={e => setPrice(e.target.value)}
                placeholder="199.99" required style={{ width: '100%' }} />
            </div>
            <div>
              <label style={labelStyle}>Alert below ($) <span style={{ opacity: 0.6 }}>optional</span></label>
              <input type="number" step="0.01" min="0" value={target} onChange={e => setTarget(e.target.value)}
                placeholder="149.99" style={{ width: '100%' }} />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <input type="checkbox" id="alert-check" checked={alert} onChange={e => setAlert(e.target.checked)}
              style={{ width: 16, height: 16, cursor: 'pointer' }} />
            <label htmlFor="alert-check" style={{ fontSize: 13, color: 'var(--color-text-secondary)', cursor: 'pointer' }}>
              Send email alert when price drops
            </label>
          </div>

          {error && (
            <div style={{ background: 'var(--color-background-danger)', color: 'var(--color-text-danger)', fontSize: 13, padding: '8px 12px', borderRadius: 'var(--border-radius-md)', marginBottom: 14 }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} style={{ fontFamily: 'var(--font-sans)' }}>Cancel</button>
            <button type="submit" disabled={loading} style={{
              background: 'var(--color-background-info)', color: 'var(--color-text-info)',
              border: '0.5px solid var(--color-border-info)', borderRadius: 'var(--border-radius-md)',
              padding: '8px 18px', fontSize: 14, fontFamily: 'var(--font-sans)', cursor: 'pointer',
              opacity: loading ? 0.7 : 1,
            }}>
              {loading ? 'Adding…' : 'Track product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
