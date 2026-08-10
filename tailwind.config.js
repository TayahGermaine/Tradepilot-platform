/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        base: {
          950: '#05060a',
          900: '#0a0b10',
          850: '#0d0e15',
          800: '#111219',
          700: '#181a24',
          600: '#22242f',
          border: '#1e2130',
        },
        accent: {
          DEFAULT: '#3b6cf6',
          hover: '#5680f9',
          soft: '#3b6cf61a',
        },
        violet: {
          DEFAULT: '#8b5cf6',
          soft: '#8b5cf61f',
        },
        up: '#2fd480',
        down: '#f96262',
        warn: '#f5a623',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(59,108,246,0.15), 0 8px 30px rgba(59,108,246,0.12)',
      },
      backgroundImage: {
        'radial-fade': 'radial-gradient(circle at 15% 10%, rgba(59,108,246,0.16), transparent 40%), radial-gradient(circle at 90% 30%, rgba(139,92,246,0.14), transparent 45%)',
      },
    },
  },
  plugins: [],
}
