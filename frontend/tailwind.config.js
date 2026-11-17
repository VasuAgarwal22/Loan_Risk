/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Fintech Brand Blue (#315EF5) & Deep Navy (#101B35)
        navy: {
          50: '#F0F3F9',
          100: '#E2E8F0',
          200: '#C5D1E4',
          700: '#253557',
          800: '#172442',
          900: '#101B35', // Deep Navy Brand
          950: '#0A1124',
        },
        primary: {
          50: '#EEF4FF',
          100: '#E0EBFE',
          200: '#C7D9FD',
          300: '#9EBEFB',
          400: '#6495F8',
          500: '#315EF5', // Primary Blue Brand
          600: '#1F47E3',
          700: '#1736BA',
          800: '#172D93',
          900: '#192B74',
        },
        // Backward-compatible alias for existing brand-* classes
        brand: {
          50: '#EEF4FF',
          100: '#E0EBFE',
          200: '#C7D9FD',
          300: '#9EBEFB',
          400: '#6495F8',
          500: '#315EF5',
          600: '#1F47E3',
          700: '#1736BA',
          800: '#172D93',
          900: '#101B35',
        },
        surface: {
          DEFAULT: '#F5F7FC',
          card: '#FFFFFF',
          subtle: '#F8FAFC',
          border: '#E2E8F0',
        },
        // Fintech semantic colors
        fintech: {
          emerald: '#10B981',
          amber: '#F59E0B',
          rose: '#F43F5E',
          sky: '#0EA5E9',
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(16, 27, 53, 0.05), 0 1px 2px -1px rgba(16, 27, 53, 0.05)',
        'card-hover': '0 10px 25px -5px rgba(16, 27, 53, 0.08), 0 8px 10px -6px rgba(16, 27, 53, 0.04)',
        soft: '0 4px 20px -2px rgba(49, 94, 245, 0.12)',
        'soft-lg': '0 12px 35px -4px rgba(49, 94, 245, 0.20)',
        dropdown: '0 10px 30px -4px rgba(16, 27, 53, 0.12), 0 4px 6px -2px rgba(16, 27, 53, 0.04)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out both',
        'fade-in-up': 'fade-in-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) both',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
