export type Tab = 'today' | 'pathway' | 'browse' | 'stats' | 'settings'

interface Props {
  active: Tab
  onChange: (t: Tab) => void
}

export function BottomNav({ active, onChange }: Props) {
  return (
    <nav className="flex-none border-t border-white/[0.06] bg-bg/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-2xl items-stretch justify-around">
        <NavTab label="Today" active={active === 'today'} onClick={() => onChange('today')}>
          <TodayIcon />
        </NavTab>
        <NavTab label="Pathway" active={active === 'pathway'} onClick={() => onChange('pathway')}>
          <PathwayIcon />
        </NavTab>
        <NavTab label="Browse" active={active === 'browse'} onClick={() => onChange('browse')}>
          <BrowseIcon />
        </NavTab>
        <NavTab label="Stats" active={active === 'stats'} onClick={() => onChange('stats')}>
          <StatsIcon />
        </NavTab>
        <NavTab label="Settings" active={active === 'settings'} onClick={() => onChange('settings')}>
          <SettingsIcon />
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
      className={`flex flex-1 flex-col items-center gap-0.5 pb-safe pt-3 pb-3 transition-colors ${
        active ? 'text-accent' : 'text-ink-softer hover:text-ink-soft'
      }`}
    >
      {children}
      <span className="text-[9px] uppercase tracking-wide">{label}</span>
      {active && (
        <span className="absolute bottom-0 h-0.5 w-8 rounded-full bg-accent opacity-0" />
      )}
    </button>
  )
}

function TodayIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="17" rx="2.5" />
      <path d="M16 2v3M8 2v3M3 9h18" />
      <circle cx="12" cy="15" r="2" fill="currentColor" stroke="none" />
    </svg>
  )
}

function PathwayIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="12" cy="19" r="2" />
      <path d="M12 7v3M12 14v3" />
    </svg>
  )
}

function BrowseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  )
}

function StatsIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 20V10M12 20V4M6 20v-6" />
    </svg>
  )
}

function SettingsIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9" />
    </svg>
  )
}
