/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#0f172a',
          soft: '#1e293b',
          softer: '#334155',
        },
        ink: {
          DEFAULT: '#f8fafc',
          soft: '#cbd5e1',
          softer: '#94a3b8',
        },
        accent: {
          DEFAULT: '#fbbf24',
          soft: '#fcd34d',
        },
      },
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['ui-serif', 'Georgia', 'Cambria', 'serif'],
      },
    },
  },
  plugins: [],
}
