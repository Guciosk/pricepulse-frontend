import { useState, useMemo } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useProducts } from '../hooks/useProducts'
import { getSiteMeta, detectSite } from '../lib/sites'
import AddProductForm from '../components/AddProductForm'
import ProductCard from '../components/ProductCard'
import ProductListItem from '../components/ProductListItem'
import NotificationsPanel from '../components/NotificationsPanel'
import PriceHistoryModal from '../components/PriceHistoryModal'

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const { products, loading, addProduct, updateProduct, deleteProduct, scrapeNow } = useProducts()

  const [view, setView] = useState('grid')      // 'grid' | 'list'
  const [tab, setTab] = useState('all')          // 'all' | 'sales' | site key
  const [showAdd, setShowAdd] = useState(false)
  const [showNotifs, setShowNotifs] = useState(false)
  const [historyProduct, setHistoryProduct] = useState(null)
  const [editProduct, setEditProduct] = useState(null)

  // Derive categories from products
  const categories = useMemo(() => {
    const cats = {}
    for (const p of products) {
      const key = p.site || detectSite(p.url)
      if (!cats[key]) cats[key] = { ...getSiteMeta(key), count: 0 }
      cats[key].count++
    }
    return cats
  }, [products])

  const onSaleCount = products.filter(p => p.original_price && p.current_price < p.original_price).length

  const filtered = useMemo(() => {
    if (tab === 'all') return products
    if (tab === 'sales') return products.filter(p => p.original_price && p.current_price < p.original_price)
    return products.filter(p => p.site === tab)
  }, [products, tab])

  const stats = [
    { label: 'Tracked', value: products.length },
    { label: 'On sale', value: onSaleCount, color: 'var(--color-text-success)' },
    { label: 'Categories', value: Object.keys(categories).length },
    { label: 'Alerts active', value: products.filter(p => p.alert_enabled).length, color: 'var(--color-text-warning)' },
  ]

  const iconBtn = (active, onClick, children) => (
    <button onClick={onClick} style={{
      width: 32, height: 32, border: `0.5px solid ${active ? 'var(--color-border-primary)' : 'var(--color-border-tertiary)'}`,
      background: active ? 'var(--color-background-secondary)' : 'var(--color-background-primary)',
      borderRadius: 'var(--border-radius-md)', cursor: 'pointer', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
    }}>{children}</button>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-background-tertiary)', fontFamily: 'var(--font-sans)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '1.5rem 1rem' }}>

        {/* Topbar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, background: 'var(--color-background-info)', borderRadius: 'var(--border-radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🎯</div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 500, color: 'var(--color-text-primary)' }}>PricePulse</div>
              <div style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>Sale alerts across the web</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button onClick={() => setShowNotifs(true)} style={{
              background: 'none', border: '0.5px solid var(--color-border-tertiary)', borderRadius: 'var(--border-radius-md)',
              padding: '6px 12px', cursor: 'pointer', fontSize: 13, color: 'var(--color-text-secondary)', fontFamily: 'var(--font-sans)',
            }}>🔔 Alerts</button>
            <button onClick={() => setShowAdd(true)} style={{
              background: 'var(--color-background-info)', color: 'var(--color-text-info)',
              border: '0.5px solid var(--color-border-info)', borderRadius: 'var(--border-radius-md)',
              padding: '7px 16px', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-sans)',
            }}>+ Add product</button>
            <button onClick={signOut} style={{
              background: 'none', border: '0.5px solid var(--color-border-tertiary)', borderRadius: 'var(--border-radius-md)',
              padding: '6px 12px', cursor: 'pointer', fontSize: 13, color: 'var(--color-text-secondary)', fontFamily: 'var(--font-sans)',
            }}>Sign out</button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: '1.5rem' }}>
          {stats.map(s => (
            <div key={s.label} style={{ background: 'var(--color-background-secondary)', borderRadius: 'var(--border-radius-md)', padding: '0.875rem 1rem' }}>
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 24, fontWeight: 500, color: s.color || 'var(--color-text-primary)' }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Section header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--color-text-primary)' }}>
            {tab === 'all' ? 'All products' : tab === 'sales' ? 'On sale now' : getSiteMeta(tab).label}
            {' '}
            <span style={{ fontWeight: 400, color: 'var(--color-text-secondary)', fontSize: 14 }}>({filtered.length})</span>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {iconBtn(view === 'grid', () => setView('grid'),
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="var(--color-text-secondary)" strokeWidth="1.75"><rect x="1" y="1" width="6" height="6" rx="1"/><rect x="9" y="1" width="6" height="6" rx="1"/><rect x="1" y="9" width="6" height="6" rx="1"/><rect x="9" y="9" width="6" height="6" rx="1"/></svg>
            )}
            {iconBtn(view === 'list', () => setView('list'),
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="var(--color-text-secondary)" strokeWidth="1.75" strokeLinecap="round"><line x1="5" y1="4" x2="15" y2="4"/><line x1="5" y1="8" x2="15" y2="8"/><line x1="5" y1="12" x2="15" y2="12"/><circle cx="2" cy="4" r="1" fill="var(--color-text-secondary)"/><circle cx="2" cy="8" r="1" fill="var(--color-text-secondary)"/><circle cx="2" cy="12" r="1" fill="var(--color-text-secondary)"/></svg>
            )}
          </div>
        </div>

        {/* Category tabs */}
        <div style={{ display: 'flex', gap: 6, marginBottom: '1.25rem', flexWrap: 'wrap' }}>
          {[
            { key: 'all', label: 'All', count: products.length },
            ...(onSaleCount > 0 ? [{ key: 'sales', label: 'On sale', count: onSaleCount, green: true }] : []),
            ...Object.entries(categories).map(([key, cat]) => ({ key, label: cat.label, count: cat.count })),
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              fontSize: 12, padding: '5px 12px', borderRadius: 999, cursor: 'pointer',
              border: `0.5px solid ${tab === t.key ? 'var(--color-border-primary)' : 'var(--color-border-tertiary)'}`,
              background: tab === t.key ? 'var(--color-background-secondary)' : 'var(--color-background-primary)',
              color: tab === t.key ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
              fontFamily: 'var(--font-sans)', transition: 'all 0.15s', whiteSpace: 'nowrap',
            }}>
              {t.label}
              <span style={{
                display: 'inline-block', marginLeft: 5, padding: '0 5px', borderRadius: 999, fontSize: 11,
                background: t.green ? 'var(--color-background-success)' : 'var(--color-background-tertiary)',
                color: t.green ? 'var(--color-text-success)' : 'var(--color-text-secondary)',
              }}>{t.count}</span>
            </button>
          ))}
        </div>

        {/* Product grid / list */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-secondary)', fontSize: 14 }}>Loading products…</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <div style={{ fontSize: 44, marginBottom: 14 }}>🔍</div>
            <div style={{ fontSize: 15, color: 'var(--color-text-secondary)', marginBottom: 12 }}>No products here yet</div>
            <button onClick={() => setShowAdd(true)} style={{
              background: 'var(--color-background-info)', color: 'var(--color-text-info)',
              border: '0.5px solid var(--color-border-info)', borderRadius: 'var(--border-radius-md)',
              padding: '8px 18px', fontSize: 14, cursor: 'pointer', fontFamily: 'var(--font-sans)',
            }}>+ Add your first product</button>
          </div>
        ) : view === 'grid' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 14 }}>
            {filtered.map(p => (
              <div key={p.id} onClick={() => setHistoryProduct(p)} style={{ cursor: 'pointer' }}>
                <ProductCard product={p}
                  onDelete={deleteProduct}
                  onScrape={scrapeNow}
                  onEdit={setEditProduct} />
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filtered.map(p => (
              <div key={p.id} onClick={() => setHistoryProduct(p)} style={{ cursor: 'pointer' }}>
                <ProductListItem product={p}
                  onDelete={deleteProduct}
                  onScrape={scrapeNow}
                  onEdit={setEditProduct} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showAdd && <AddProductForm onAdd={addProduct} onClose={() => setShowAdd(false)} />}
      {showNotifs && <NotificationsPanel onClose={() => setShowNotifs(false)} />}
      {historyProduct && <PriceHistoryModal product={historyProduct} onClose={() => setHistoryProduct(null)} />}
    </div>
  )
}
