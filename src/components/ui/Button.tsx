import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'soft'
  children: ReactNode
}

export function Button({ variant = 'primary', className = '', children, ...rest }: Props) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-transform active:scale-[0.97] disabled:opacity-40 disabled:active:scale-100'
  const styles = {
    primary: 'bg-accent-grad text-bg shadow-glow',
    ghost: 'text-ink-soft hover:text-ink',
    soft: 'border border-white/10 bg-bg-raised text-ink hover:border-accent/50',
  }[variant]
  return (
    <button className={`${base} ${styles} ${className}`} {...rest}>
      {children}
    </button>
  )
}
