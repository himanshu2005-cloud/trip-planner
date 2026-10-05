/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: '#0c0c0f',
          dark: '#08080a',
          card: '#131317',
          surface: '#18181f',
        },
        cream: {
          DEFAULT: '#f5f2eb',
          soft: '#e7e3da',
          muted: '#9e9a91',
          faint: '#5c5851',
        },
        violet: {
          accent: '#7a5293',
          deep: '#432357',
          subtle: 'rgba(122, 82, 147, 0.15)',
          lavender: '#cebfdf',
        },
        editorial: {
          border: '#23232c',
          'border-light': '#32323e',
          rule: '#1c1c23',
        },
        // Semantic aliases
        background: '#0c0c0f',
        surface: '#131317',
        'text-primary': '#f5f2eb',
        'text-secondary': '#9e9a91',
        'text-muted': '#5c5851',
        success: '#4ade80',
        warning: '#facc15',
        danger: '#f87171',
      },

      fontFamily: {
        serif: ['Newsreader', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },

      letterSpacing: {
        'widest-editorial': '0.25em',
        'wider-editorial': '0.15em',
      },

      borderRadius: {
        sm: '2px',
        DEFAULT: '4px',
        md: '6px',
        lg: '8px',
      },

      boxShadow: {
        editorial: '0 10px 40px -10px rgba(0, 0, 0, 0.6)',
        subtle: '0 4px 20px rgba(0, 0, 0, 0.35)',
      },
    },
  },
  plugins: [],
}
