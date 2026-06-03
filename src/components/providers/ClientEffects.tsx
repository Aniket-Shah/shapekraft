'use client'
import dynamic from 'next/dynamic'

const CursorTrailDot = dynamic(
  () => import('@/components/motion/CursorTrailDot').then((m) => m.CursorTrailDot),
  { ssr: false }
)

export function ClientEffects() {
  return <CursorTrailDot />
}
