'use client'
import { useState, useEffect } from 'react'

export function useBrandEmail(): string {
  const [email, setEmail] = useState('hello@shapekraft.co')

  useEffect(() => {
    setEmail(
      window.location.hostname.endsWith('.in')
        ? 'hello@shapekraft.in'
        : 'hello@shapekraft.co'
    )
  }, [])

  return email
}
