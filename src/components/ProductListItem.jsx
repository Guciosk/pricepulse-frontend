import { useState } from 'react'
import { getSiteMeta, pctOff, fmt } from '../lib/sites'

export default function ProductListItem({ product, onDelete, onScrape, onEdit }) {
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
      border: `0.5px solid ${belowTarget || isOnSale ? 'var(--color-border-success)' : 'var(--color-border-tertiary)'}`,
      borderRadius: 'var(--border-radius-lg)', padding: '12px 16px',
      display: 'flex', alignItems: 'center', gap: 14,
      fontFamily: 'var(--font-sans)', transition: 'border-color 0.15s',
    }}>
      {/* Icon */}
      <div style={{
        width: 42, height: 42, borderRadius: 'var(--border-radius-md)',
        background: 'var(--color-background-secondary)', display: 'flex',
        alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0, overflow: 'hidden',
      }}>
        {product.image_url
          ? <img src={product.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : product.emoji}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <a href={product.url} target="_blank" rel="noreferrer"
          style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text-primary)', textDecoration: 'none', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {product.name}
        </a>
        <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: site.color, display: 'inline-block' }} />
            {site.label}
          </span>
          <span>·</span>
          <span style={{ color: product.alert_enabled ? 'var(--color-text-success)' : 'var(--color-text-secondary)' }}>
            {product.alert_enabled
              ? product.target_price ? `Alert < ${fmt(product.target_price)}` : 'Alert on'
              : 'No alert'}
          </span>
          {product.last_checked_at && (
            <>
              <span>·</span>
              <span>Checked {new Date(product.last_checked_at).toLocaleDateString()}</span>
            </>
          )}
        </div>
      </div>

      {/* Price */}
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontSize: 16, fontWeight: 500, color: isOnSale ? 'var(--color-text-success)' : 'var(--color-text-primary)' }}>
          {fmt(product.current_price)}
        </div>
        {isOnSale ? (
          <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
            <span style={{ textDecoration: 'line-through' }}>{fmt(product.original_price)}</span>
            {' '}
            <span style={{ color: 'var(--color-text-success)' }}>−{discount}%</span>
          </div>
        ) : (
          <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>regular price</div>
        )}
      </div>

      {/* Menu */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <button onClick={() => setMenuOpen(o => !o)} style={{
          background: 'none', border: 'none', cursor: 'pointer', fontSize: 16,
          color: 'var(--color-text-secondary)', padding: '4px 6px', lineHeight: 1,
          fontFamily: 'var(--font-sans)',
        }}>···</button>
        {menuOpen && (
          <div style={{
            position: 'absolute', right: 0, top: '100%', marginTop: 4,
            background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)',
            borderRadius: 'var(--border-radius-md)', minWidth: 150, zIndex: 10,
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
  )
}
