/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      // ── Color palette from DESIGN.md ──────────────────────────────────────
      colors: {
        purple: {
          950: '#170B2E',
          900: '#241044',
          800: '#32165F',
          700: '#4C1D95',
          600: '#6D28D9',
          500: '#8B5CF6',
          400: '#A78BFA',
          300: '#C4B5FD',
        },
        accent: {
          pink:  '#E879F9',
          blue:  '#818CF8',
          cyan:  '#67E8F9',
        },
        // Semantic aliases mapped to CSS variables (applied in index.css)
        background: 'var(--background)',
        surface:    'var(--surface)',
        'text-primary':   'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted':     'var(--text-muted)',
        success: '#34D399',
        warning: '#FBBF24',
        danger:  '#FB7185',
      },

      // ── Typography ────────────────────────────────────────────────────────
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'sans-serif',
        ],
      },

      // ── Border radius ─────────────────────────────────────────────────────
      borderRadius: {
        '2xl': '20px',   // standard card radius per DESIGN.md
        '3xl': '24px',
      },

      // ── Box shadows ───────────────────────────────────────────────────────
      boxShadow: {
        'glass': '0 20px 60px rgba(0, 0, 0, 0.25)',
        'glow-sm': '0 0 12px rgba(139, 92, 246, 0.3)',
        'glow':    '0 0 24px rgba(139, 92, 246, 0.4)',
        'glow-lg': '0 0 40px rgba(139, 92, 246, 0.5)',
      },

      // ── Animation durations (DESIGN.md: 150–300 ms) ──────────────────────
      transitionDuration: {
        '200': '200ms',
        '250': '250ms',
      },

      // ── Background gradients ──────────────────────────────────────────────
      backgroundImage: {
        'purple-gradient': 'linear-gradient(135deg, #7C3AED, #A855F7)',
        'page-bg': `
          radial-gradient(circle at 15% 10%, rgba(139,92,246,0.18), transparent 30%),
          radial-gradient(circle at 85% 20%, rgba(232,121,249,0.10), transparent 28%)
        `,
      },
    },
  },
  plugins: [],
}
