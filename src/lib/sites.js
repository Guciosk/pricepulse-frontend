export const SITE_META = {
  'amazon.com':    { label: 'Amazon',    emoji: '📦', color: '#E47911' },
  'ebay.com':      { label: 'eBay',      emoji: '🛍️', color: '#86B817' },
  'bestbuy.com':   { label: 'Best Buy',  emoji: '🖥️', color: '#0046BE' },
  'walmart.com':   { label: 'Walmart',   emoji: '🏪', color: '#0071CE' },
  'target.com':    { label: 'Target',    emoji: '🎯', color: '#CC0000' },
  'newegg.com':    { label: 'Newegg',    emoji: '💻', color: '#F08700' },
  'etsy.com':      { label: 'Etsy',      emoji: '🎨', color: '#F56400' },
  'costco.com':    { label: 'Costco',    emoji: '🛒', color: '#005DAA' },
  'homedepot.com': { label: 'Home Depot',emoji: '🔨', color: '#F96302' },
  'nike.com':      { label: 'Nike',      emoji: '👟', color: '#111111' },
  'other':         { label: 'Other',     emoji: '🔗', color: '#888780' },
}

export function detectSite(url) {
  try {
    const hostname = new URL(url).hostname.replace('www.', '')
    for (const key of Object.keys(SITE_META)) {
      if (key !== 'other' && hostname.includes(key)) return key
    }
  } catch {}
  return 'other'
}

export function getSiteMeta(siteKey) {
  return SITE_META[siteKey] || SITE_META.other
}

export function pctOff(original, current) {
  if (!original || !current || original <= current) return null
  return Math.round(((original - current) / original) * 100)
}

export function fmt(price) {
  if (price == null) return '—'
  return `$${Number(price).toFixed(2)}`
}
