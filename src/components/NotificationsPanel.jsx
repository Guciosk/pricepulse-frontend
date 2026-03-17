import { useState, useEffect } from 'react'
import { api } from '../lib/api'
import { fmt } from '../lib/sites'
import { format } from 'date-fns'

export default function NotificationsPanel({ onClose }) {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getNotifications().then(data => {
      setNotifications(data)
    }).finally(() => setLoading(false))
  }, [])

  const markAllRead = async () => {
    await api.markAllRead()
    setNotifications(prev => prev.map(n => ({ ...n, read_at: new Date().toISOString() })))
  }

  const unreadCount = notifications.filter(n => !n.read_at).length

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.25)', zIndex: 100,
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        position: 'absolute', top: 0, right: 0, height: '100%', width: '100%', maxWidth: 400,
        background: 'var(--color-background-primary)', borderLeft: '0.5px solid var(--color-border-tertiary)',
        display: 'flex', flexDirection: 'column', fontFamily: 'var(--font-sans)',
      }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '0.5px solid var(--color-border-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--color-text-primary)' }}>Notifications</div>
            {unreadCount > 0 && (
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 2 }}>{unreadCount} unread</div>
            )}
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            {unreadCount > 0 && (
              <button onClick={markAllRead} style={{ fontSize: 12, color: 'var(--color-text-info)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
                Mark all read
              </button>
            )}
            <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: 'var(--color-text-secondary)', lineHeight: 1 }}>×</button>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: 14 }}>Loading…</div>
          ) : notifications.length === 0 ? (
            <div style={{ padding: '3rem 2rem', textAlign: 'center' }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>🔔</div>
              <div style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>No notifications yet.<br />You'll hear from us when prices drop!</div>
            </div>
          ) : (
            notifications.map(n => {
              const product = n.products
              const isUnread = !n.read_at
              return (
                <div key={n.id} style={{
                  padding: '14px 20px', borderBottom: '0.5px solid var(--color-border-tertiary)',
                  background: isUnread ? 'var(--color-background-info)' : 'transparent',
                  transition: 'background 0.15s',
                }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 20 }}>{product?.emoji || '🔔'}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, color: 'var(--color-text-primary)', marginBottom: 4 }}>{n.message}</div>
                      {n.old_price && n.new_price && (
                        <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>
                          <span style={{ textDecoration: 'line-through' }}>{fmt(n.old_price)}</span>
                          {' → '}
                          <span style={{ color: 'var(--color-text-success)', fontWeight: 500 }}>{fmt(n.new_price)}</span>
                        </div>
                      )}
                      <div style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>
                        {format(new Date(n.sent_at), 'MMM d, h:mm a')}
                      </div>
                    </div>
                    {isUnread && (
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--color-text-info)', display: 'inline-block', marginTop: 4, flexShrink: 0 }} />
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
