/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: '#001F3F',
        'navy-dark': '#000D1A',
        'navy-light': '#0A3D62',
        emerald: '#10B981',
        'emerald-dark': '#059669',
        'emerald-light': '#ECFDF5',
        'red-alert': '#EF4444',
        'red-light': '#FEE2E2',
        'gray-light': '#E5E7EB',
        'gray-medium': '#9CA3AF',
        'gray-dark': '#374151',
      },
      fontFamily: {
        sans: ['system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-subtle': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      screens: {
        xs: '320px',
        sm: '375px',
        base: '414px',
      },
    },
  },
  plugins: [],
};
