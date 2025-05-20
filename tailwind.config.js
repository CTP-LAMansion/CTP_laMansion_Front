//\tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBlue: '#13152A',
        darkBlueTransparent: 'rgba(19, 21, 42, 0.5)',
        burntOrange: '#AF6F25',
        burntOrangeTransparent: 'rgba(175, 111, 7, 0.5)',
        offWhite: '#F1F2EB',
        customGray: '#D8DAD3',
        transparentCustomGray: 'rgba(216, 218, 211, 0.5)',
        softGreen: '#A4C2A5',
        transparentSoftGreen: 'rgba(164, 194, 165, 0.5)',
        hoverBlue: '#1D4ED8', // Azul personalizado para estados hover
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '50%': { opacity: 0.5, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        spinSlow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        pulseOpacity: {
          '0%': { opacity: 0.6 },
          '50%': { opacity: 1 },
          '100%': { opacity: 0.6 },
        },
        scrollLeft: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(calc(-33.33%))' },
        },
        scrollRight: {
          '0%': { transform: 'translateX(calc(-33.33%))' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        fadeInUp: 'fadeInUp 0.8s ease-out forwards',
        spinSlow: 'spinSlow 3s linear infinite',
        pulseOpacity: 'pulseOpacity 2s ease-in-out infinite',
        'scroll-left': 'scrollLeft 60s linear infinite',
        'scroll-right': 'scrollRight 60s linear infinite',
        'scroll-left-slow': 'scrollLeft 180s linear infinite',
        'scroll-right-slow': 'scrollRight 180s linear infinite',
      },
      rotate: {
        '3': '3deg',
        '6': '6deg',
        '-3': '-3deg',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.animate-transition': {
          'animation-timing-function': 'ease-in-out',
          'animation-duration': '1s',
        },
      };
      addUtilities(newUtilities);
    },
  ],
};