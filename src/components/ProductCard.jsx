import { useState } from 'react'
import { getSiteMeta, pctOff, fmt } from '../lib/sites'

export default function ProductCard({ product, onDelete, onScrape, onEdit }) {
  const [scraping, setScraping] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const site = getSiteMeta(product.site)
  const isOnSale = product.original_price && product.current_price < product.original_price
  const discount = isOnSale ? pctOff(product.original_price, product.current_price) : null
  const belowTarget = product.target_price && product.current_price <= product.target_price

  const handleScrape = async () => {
    setScraping(true)
    setMenuOpen(false)
    try { await onScrape(product.id) } finally { setScraping(false) }
  }

  return (
    <div style={{
      background: 'var(--color-background-primary)',
      border: `0.5px solid ${belowTarget ? 'var(--color-border-success)' : isOnSale ? 'var(--color-border-success)' : 'var(--color-border-tertiary)'}`,
      borderRadius: 'var(--border-radius-lg)', overflow: 'hidden',
      fontFamily: 'var(--font-sans)', position: 'relative',
      transition: 'border-color 0.15s',
    }}>
      {/* Image / emoji area */}
      <div style={{
        height: 120, background: 'var(--color-background-secondary)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 44, position: 'relative',
      }}>
        {product.image_url
          ? <img src={product.image_url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : product.emoji}

        {discount && (
          <div style={{
            position: 'absolute', top: 8, right: 8,
            background: 'var(--color-background-success)', color: 'var(--color-text-success)',
            fontSize: 11, fontWeight: 500, padding: '3px 8px', borderRadius: 999,
          }}>−{discount}%</div>
        )}

        {belowTarget && (
          <div style={{
            position: 'absolute', top: 8, left: 8,
            background: 'var(--color-background-info)', color: 'var(--color-text-info)',
            fontSize: 11, fontWeight: 500, padding: '3px 8px', borderRadius: 999,
          }}>🎯 Target hit!</div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: '12px 12px 10px' }}>
        <a href={product.url} target="_blank" rel="noreferrer"
          style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-primary)', textDecoration: 'none', display: 'block', marginBottom: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
          title={product.name}>
          {product.name}
        </a>

        <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: site.color, display: 'inline-block', flexShrink: 0 }} />
          {site.label}
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 10 }}>
          <span style={{ fontSize: 17, fontWeight: 500, color: isOnSale ? 'var(--color-text-success)' : 'var(--color-text-primary)' }}>
            {fmt(product.current_price)}
          </span>
          {isOnSale && (
            <span style={{ fontSize: 12, color: 'var(--color-text-secondary)', textDecoration: 'line-through' }}>
              {fmt(product.original_price)}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%', display: 'inline-block',
              background: product.alert_enabled ? 'var(--color-background-success)' : 'var(--color-border-tertiary)',
            }} />
            {product.alert_enabled
              ? product.target_price ? `Alert < ${fmt(product.target_price)}` : 'Alerting'
              : 'No alert'}
          </div>

          {/* Menu */}
          <div style={{ position: 'relative' }}>
            <button onClick={() => setMenuOpen(o => !o)} style={{
              background: 'none', border: 'none', cursor: 'pointer', fontSize: 16,
              color: 'var(--color-text-secondary)', padding: '0 4px', lineHeight: 1,
              fontFamily: 'var(--font-sans)',
            }}>···</button>
            {menuOpen && (
              <div style={{
                position: 'absolute', bottom: '100%', right: 0, marginBottom: 4,
                background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)',
                borderRadius: 'var(--border-radius-md)', minWidth: 140, zIndex: 10,
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              }}>
                {[
                  { label: scraping ? 'Checking…' : 'Check price now', action: handleScrape },
                  { label: 'Edit alert', action: () => { onEdit(product); setMenuOpen(false) } },
                  { label: 'Delete', action: () => { onDelete(product.id); setMenuOpen(false) }, danger: true },
                ].map(item => (
                  <button key={item.label} onClick={item.action} style={{
                    display: 'block', width: '100%', textAlign: 'left', padding: '8px 14px',
                    background: 'none', border: 'none', cursor: 'pointer', fontSize: 13,
                    color: item.danger ? 'var(--color-text-danger)' : 'var(--color-text-primary)',
                    fontFamily: 'var(--font-sans)',
                  }}>{item.label}</button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
