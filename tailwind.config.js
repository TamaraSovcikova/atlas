/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Warm Observatory dark -- deep ink, not blue-black
        bg: {
          DEFAULT: '#1a1410',
          soft: '#221c15',
          softer: '#2c251b',
          raised: '#372e22',
        },
        ink: {
          DEFAULT: '#f4eedf',
          soft: '#c5b89c',
          softer: '#857568',
        },
        // Amber: the one saturated accent. Domain hues live only in Constellation.
        accent: {
          DEFAULT: '#fbbf24',
          soft: '#fcd34d',
          deep: '#d99413',
          glow: 'rgba(251, 191, 36, 0.3)',
        },
        good: '#4ade80',
        bad: '#f87171',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Fraunces', 'ui-serif', 'Georgia', 'serif'],
      },
      borderRadius: {
        xl: '0.9rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      boxShadow: {
        card: '0 1px 0 0 rgba(255,255,255,0.04) inset, 0 8px 30px -12px rgba(0,0,0,0.7)',
        raised: '0 1px 0 0 rgba(255,255,255,0.06) inset, 0 12px 40px -10px rgba(0,0,0,0.8)',
        glow: '0 0 0 1px rgba(251,191,36,0.4), 0 0 28px -4px rgba(251,191,36,0.45)',
      },
      backgroundImage: {
        'accent-grad': 'linear-gradient(135deg, #fcd34d 0%, #fbbf24 45%, #d99413 100%)',
        'surface-grad': 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 60%)',
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
