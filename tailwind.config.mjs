/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc5fb',
          400: '#38a5f6',
          500: '#0e86d4',
          600: '#0369a1', // Deep trustworthy primary blue
          700: '#035382',
          800: '#07476e',
          900: '#082f49', // Navy base
          950: '#031b2e',
        },
        navy: {
          800: '#0f1f38',
          850: '#0a1628',
          900: '#070f1e',
          950: '#040913',
        },
        slate: {
          850: '#151e2e',
          950: '#0a0f18',
        },
        emerald: {
          550: '#059669',
          650: '#047857',
        },
        amber: {
          550: '#d97706',
          650: '#b45309',
        }
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
        mono: [
          'JetBrains Mono',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'monospace',
        ],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.03)',
        'card-hover': '0 10px 25px -5px rgba(3, 83, 130, 0.08), 0 8px 10px -6px rgba(3, 83, 130, 0.04)',
        'result': '0 10px 30px -5px rgba(3, 83, 130, 0.25), 0 4px 12px -2px rgba(0, 0, 0, 0.1)',
        'modal': '0 20px 40px -10px rgba(0, 0, 0, 0.2), 0 1px 3px 0 rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
};
