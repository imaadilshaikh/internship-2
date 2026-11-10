/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#1A120B',
          900: '#3C2A21',
          700: '#604A3D',
          500: '#806B5B',
          300: '#B9AA92',
          100: '#D5CEA3',
          50: '#E5E5CB',
        },
        brand: {
          700: '#1A120B',
          600: '#3C2A21',
          500: '#3C2A21',
          100: '#D5CEA3',
          50: '#E5E5CB',
        },
        accent: {
          600: '#3C2A21',
          500: '#806B5B',
          100: '#D5CEA3',
          50: '#E5E5CB',
        },
        surface: {
          DEFAULT: '#F5F4E8',
          muted: '#E5E5CB',
          raised: '#D5CEA3',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'ui-sans-serif', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      },
      fontWeight: {
        regular: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      lineHeight: { snug: '1.375', relaxed: '1.625' },
      spacing: { 18: '4.5rem', 22: '5.5rem', 26: '6.5rem' },
      borderRadius: { sm: '0.5rem', md: '0.75rem', lg: '1rem', xl: '1.25rem' },
      boxShadow: {
        soft: '0 12px 32px -16px rgb(26 18 11 / 0.22)',
        focus: '0 0 0 4px rgb(60 42 33 / 0.18)',
      },
    },
  },
  plugins: [],
}
