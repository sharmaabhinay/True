/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        cream:  '#F5F0E8',
        warm:   '#E8DDD0',
        bark:   '#8B6B4A',
        wood:   '#6B4C2A',
        deep:   '#2C1F12',
        gold:   '#C8A86B',
        sage:   '#7A8C6E',
        ivory:  '#FAF7F2',
        muted:  '#7A6A5A',
        'admin-bg':      '#0F0F13',
        'admin-surface': '#16161D',
        'admin-card':    '#1E1E28',
        'admin-border':  '#2A2A38',
        'admin-text':    '#E8E8F0',
        'admin-muted':   '#888899',
        'admin-green':   '#4CAF82',
        'admin-red':     '#E05050',
        'admin-blue':    '#5090E0',
      },
      fontFamily: {
        cormorant: ['"Cormorant Garamond"', 'serif'],
        dm:        ['"DM Sans"', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(circle, var(--tw-gradient-stops))',
      },
      boxShadow: {
        'warm-sm': '0 4px 16px rgba(44,31,18,0.08)',
        'warm-md': '0 8px 32px rgba(44,31,18,0.12)',
        'warm-lg': '0 20px 60px rgba(44,31,18,0.16)',
      },
      animation: {
        'fade-up':   'fadeUp 0.7s ease both',
        'slide-up':  'slideUp 0.7s cubic-bezier(.4,0,.2,1) both',
        'load-bar':  'loadBar 2s ease forwards',
        'pulse-dot': 'pulseDot 2s infinite',
      },
      keyframes: {
        fadeUp:   { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideUp:  { from: { opacity: '0', transform: 'translateY(60px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        loadBar:  { from: { left: '-100%' }, to: { left: '0' } },
        pulseDot: { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.3' } },
      },
      screens: { xs: '380px' },
      transitionDuration: { '350': '350ms', '400': '400ms' },
    },
  },
  plugins: [],
};
