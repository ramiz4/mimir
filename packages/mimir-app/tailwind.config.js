/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        mimir: {
          primary: '#6366f1',
          'primary-hover': '#4f46e5',
          dark: '#0f172a',
          card: '#1e293b',
          muted: '#94a3b8',
          sony: '#0072ce',
          samsung: '#1428a0',
          lg: '#a50034',
        },
      },
      animation: {
        progress: 'progress 2s ease-in-out infinite',
        slideIn: 'slideIn 0.3s ease-out',
      },
      keyframes: {
        progress: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(200%)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
