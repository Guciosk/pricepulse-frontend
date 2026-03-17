import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { api } from '../lib/api'
import { fmt } from '../lib/sites'
import { format } from 'date-fns'

export default function PriceHistoryModal({ product, onClose }) {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getPriceHistory(product.id).then(data => {
      setHistory(data.map(h => ({
        date: format(new Date(h.checked_at), 'MMM d'),
        price: h.price,
        is_sale: h.is_sale,
      })))
    }).finally(() => setLoading(false))
  }, [product.id])

  const minPrice = history.length ? Math.min(...history.map(h => h.price)) : 0
  const maxPrice = history.length ? Math.max(...history.map(h => h.price)) : 0

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    return (
      <div style={{
        background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)',
        borderRadius: 'var(--border-radius-md)', padding: '8px 12px', fontSize: 13,
        fontFamily: 'var(--font-sans)',
      }}>
        <div style={{ color: 'var(--color-text-secondary)', marginBottom: 2 }}>{label}</div>
        <div style={{ fontWeight: 500, color: payload[0].payload.is_sale ? 'var(--color-text-success)' : 'var(--color-text-primary)' }}>
          {fmt(payload[0].value)}
          {payload[0].payload.is_sale && ' 🏷️ Sale'}
        </div>
      </div>
    )
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem',
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: 'var(--color-background-primary)', borderRadius: 'var(--border-radius-lg)',
        border: '0.5px solid var(--color-border-tertiary)', padding: '1.75rem',
        width: '100%', maxWidth: 560, fontFamily: 'var(--font-sans)',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--color-text-primary)' }}>Price history</div>
            <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginTop: 2 }}>{product.name}</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: 'var(--color-text-secondary)', lineHeight: 1 }}>×</button>
        </div>

        {history.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: '1.5rem' }}>
            {[
              { label: 'Current', value: fmt(product.current_price) },
              { label: 'Lowest', value: fmt(minPrice), green: true },
              { label: 'Highest', value: fmt(maxPrice) },
            ].map(s => (
              <div key={s.label} style={{ background: 'var(--color-background-secondary)', borderRadius: 'var(--border-radius-md)', padding: '10px 14px' }}>
                <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 3 }}>{s.label}</div>
                <div style={{ fontSize: 18, fontWeight: 500, color: s.green ? 'var(--color-text-success)' : 'var(--color-text-primary)' }}>{s.value}</div>
              </div>
            ))}
          </div>
        )}

        {loading ? (
          <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-secondary)', fontSize: 14 }}>
            Loading…
          </div>
        ) : history.length < 2 ? (
          <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-secondary)', fontSize: 14, textAlign: 'center' }}>
            Not enough history yet.<br />
            <span style={{ fontSize: 12, marginTop: 4, display: 'block' }}>Price data accumulates with each scrape check.</span>
          </div>
        ) : (
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--color-text-secondary)', fontFamily: 'var(--font-sans)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--color-text-secondary)', fontFamily: 'var(--font-sans)' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} width={55} />
                <Tooltip content={<CustomTooltip />} />
                {product.target_price && (
                  <ReferenceLine y={product.target_price} stroke="var(--color-border-info)" strokeDasharray="4 3" label={{ value: 'Target', fill: 'var(--color-text-info)', fontSize: 11 }} />
                )}
                <Line type="monotone" dataKey="price" stroke="var(--color-text-info)" strokeWidth={2} dot={{ r: 3, fill: 'var(--color-text-info)' }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  )
}
