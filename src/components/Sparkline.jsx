export default function Sparkline({ data, width = 120, height = 36, tone = 'up' }) {
  if (!data || data.length < 2) {
    return <div style={{ width, height }} className="rounded bg-base-800" />
  }

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const stepX = width / (data.length - 1)

  const points = data
    .map((v, i) => `${i * stepX},${height - ((v - min) / range) * height}`)
    .join(' ')

  const color = tone === 'up' ? '#2fd480' : tone === 'down' ? '#f96262' : '#3b6cf6'
  const areaPoints = `0,${height} ${points} ${width},${height}`

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} className="overflow-visible">
      <polygon points={areaPoints} fill={color} opacity="0.12" />
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}
