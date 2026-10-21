/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        kirana: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#16a34a',
          600: '#15803d',
          700: '#166534',
          dark: '#0f172a',
          card: '#ffffff',
          accent: '#059669',
          alert: '#dc2626',
          warning: '#d97706',
        }
      },
      fontFamily: {
        sans: ['"Inter"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'thumb': '0 -4px 16px rgba(0, 0, 0, 0.08)',
        'sheet': '0 -10px 30px rgba(0, 0, 0, 0.25)',
        'card': '0 2px 8px -2px rgba(0, 0, 0, 0.06), 0 1px 4px -1px rgba(0, 0, 0, 0.04)',
        'fat': '0 4px 0 rgba(0, 0, 0, 0.15)',
      },
      minHeight: {
        '14': '3.5rem', // 56px fat target
        '16': '4rem',
      },
      minWidth: {
        '14': '3.5rem',
      }
    },
  },
  plugins: [],
}
