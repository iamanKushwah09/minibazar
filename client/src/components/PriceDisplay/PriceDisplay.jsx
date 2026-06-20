import React from 'react'

function calcDiscount(mrp, sale) {
  const m = Number(mrp)
  const s = Number(sale)
  if (!isFinite(m) || !isFinite(s) || m <= 0) return 0
  return Math.round(((m - s) / m) * 100)
}

export default function PriceDisplay({ mrp, sale, currency = '₹', className = '' }) {
  const m = Number(mrp) || 0
  const s = Number(sale) || 0
  const discount = calcDiscount(m, s)

  return (
    <div className={className} style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
      <div style={{ fontSize: 18, fontWeight: 700, color: '#1f2937' }}>
        {currency}{s.toFixed(2)}
      </div>

      <div style={{ color: '#6b7280', textDecoration: 'line-through', fontSize: 14 }}>
        {currency}{m.toFixed(2)}
      </div>

      {discount > 0 && (
        <div style={{ background: '#ffedd5', color: '#b45309', padding: '4px 8px', borderRadius: 6, fontWeight: 700, fontSize: 12 }}>
          {discount}% off
        </div>
      )}
    </div>
  )
}

export { calcDiscount }
