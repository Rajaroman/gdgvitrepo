export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gemma: {
          blue: '#4285F4',
          purple: '#A142F4',
          amber: '#F4B400',
          emerald: '#0F9D58',
          dark: '#0B0F19',
          card: '#131926',
          border: '#1E293B',
          accent: '#6366F1'
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 15px rgba(66, 133, 244, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(161, 66, 244, 0.6)' },
        }
      }
    },
  },
  plugins: [],
}
