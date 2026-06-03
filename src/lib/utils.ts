import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

export const debounce = <T extends (...args: unknown[]) => void>(fn: T, ms: number) => {
  let timeout: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn(...args), ms)
  }
}

export const throttle = <T extends (...args: unknown[]) => void>(fn: T, ms: number) => {
  let last = 0
  return (...args: Parameters<T>) => {
    const now = Date.now()
    if (now - last >= ms) { last = now; fn(...args) }
  }
}
