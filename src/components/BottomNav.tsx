export type Tab = 'feed' | 'atlas' | 'you'

interface Props {
  active: Tab
  onChange: (t: Tab) => void
}

export function BottomNav({ active, onChange }: Props) {
  return (
    <nav className="flex-none border-t border-ink/[0.08] bg-bg/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-2xl items-stretch justify-around">
        <NavTab label="Feed" active={active === 'feed'} onClick={() => onChange('feed')}>
          <FeedIcon />
        </NavTab>
        <NavTab label="Atlas" active={active === 'atlas'} onClick={() => onChange('atlas')}>
          <AtlasIcon />
        </NavTab>
        <NavTab label="You" active={active === 'you'} onClick={() => onChange('you')}>
          <YouIcon />
        </NavTab>
      </div>
    </nav>
  )
}

function NavTab({
  label,
  active,
  onClick,
  children,
}: {
  label: string
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-current={active ? 'page' : undefined}
      onClick={onClick}
      className={`relative flex flex-1 flex-col items-center gap-1 pb-3 pt-3 transition-colors ${
        active ? 'text-accent' : 'text-ink-softer hover:text-ink-soft'
      }`}
    >
      {active && (
        <span className="absolute top-0 left-1/2 h-[2px] w-8 -translate-x-1/2 rounded-full bg-accent" />
      )}
      {children}
      <span className="text-[9px] font-medium uppercase tracking-wide">{label}</span>
    </button>
  )
}

function FeedIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6h16M4 11h16M4 16h10" />
    </svg>
  )
}

function AtlasIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M3.6 9h16.8M3.6 15h16.8M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </svg>
  )
}

function YouIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  )
}
