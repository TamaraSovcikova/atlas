/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Deep layered surfaces (darkest -> lightest) for real depth.
        bg: {
          DEFAULT: '#0b1020',
          soft: '#141b2e',
          softer: '#1f2940',
          raised: '#26324d',
        },
        ink: {
          DEFAULT: '#f6f8fc',
          soft: '#c2cce0',
          softer: '#8794ad',
        },
        // Warm amber primary kept, but with a glow companion.
        accent: {
          DEFAULT: '#fbbf24',
          soft: '#fcd34d',
          deep: '#d99413',
          glow: 'rgba(251, 191, 36, 0.35)',
        },
        // A cool secondary so the palette is not single-hue.
        cool: {
          DEFAULT: '#6ea8fe',
          soft: '#9cc4ff',
          deep: '#3f7fe0',
        },
        good: '#4ade80',
        bad: '#f87171',
      },
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['ui-serif', 'Georgia', 'Cambria', 'serif'],
      },
      borderRadius: {
        xl: '0.9rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      boxShadow: {
        card: '0 1px 0 0 rgba(255,255,255,0.04) inset, 0 8px 30px -12px rgba(0,0,0,0.6)',
        raised: '0 1px 0 0 rgba(255,255,255,0.06) inset, 0 12px 40px -10px rgba(0,0,0,0.7)',
        glow: '0 0 0 1px rgba(251,191,36,0.4), 0 0 28px -4px rgba(251,191,36,0.45)',
      },
      backgroundImage: {
        'accent-grad': 'linear-gradient(135deg, #fcd34d 0%, #fbbf24 45%, #d99413 100%)',
        'surface-grad': 'linear-gradient(180deg, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0) 60%)',
        'app-grad':
          'radial-gradient(1200px 600px at 50% -10%, rgba(110,168,254,0.10), transparent 60%), radial-gradient(900px 500px at 80% 10%, rgba(251,191,36,0.07), transparent 55%)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pop: {
          '0%': { transform: 'scale(0.96)' },
          '60%': { transform: 'scale(1.03)' },
          '100%': { transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
        pop: 'pop 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
        shimmer: 'shimmer 1.4s linear infinite',
      },
    },
  },
  plugins: [],
}
