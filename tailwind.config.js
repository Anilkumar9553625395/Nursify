/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50:  '#eef2f7',
          100: '#d5dde8',
          200: '#b3c1d4',
          300: '#8aa1bc',
          400: '#6683a3',
          500: '#4a6a8a',
          600: '#39536e',
          700: '#2a3f55',
          800: '#1a2b3d',
          900: '#0c1b2a',
          950: '#060e17',
        },
        emerald: {
          50:  '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        sapphire: {
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        medical: {
          bg:      '#f0f4f8',
          card:    '#ffffff',
          surface: '#f8fafc',
        },
      },
      fontFamily: {
        sans:  ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Georgia', 'serif'],
      },
      boxShadow: {
        'glass':    '0 8px 32px rgba(12, 27, 42, 0.08)',
        'glass-lg': '0 16px 48px rgba(12, 27, 42, 0.12)',
        'medical':  '0 4px 20px rgba(16, 185, 129, 0.15)',
        'card':     '0 1px 3px rgba(12, 27, 42, 0.06), 0 4px 16px rgba(12, 27, 42, 0.04)',
        'card-hover': '0 8px 30px rgba(12, 27, 42, 0.1)',
        'nav':      '0 2px 20px rgba(12, 27, 42, 0.06)',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      animation: {
        'float':      'float 6s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
        'fade-in':    'fade-in 0.6s ease-out forwards',
        'slide-up':   'slide-up 0.5s ease-out forwards',
        'heartbeat':  'heartbeat 1.5s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.7' },
        },
        'fade-in': {
          '0%':   { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        heartbeat: {
          '0%':   { transform: 'scale(1)' },
          '14%':  { transform: 'scale(1.15)' },
          '28%':  { transform: 'scale(1)' },
          '42%':  { transform: 'scale(1.1)' },
          '70%':  { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
