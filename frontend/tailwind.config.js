/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FBF3E1',
        creamLight: '#FFFBF3',
        navy: '#1E2A45',
        navySoft: '#3A4A6B',
        gold: '#F4B740',
        goldSoft: '#FCE8B8',
        teal: '#8FD6E1',
        line: '#E7DFCB',
      },
      fontFamily: {
        sora: ['Sora', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        sticker: '6px 6px 0 #1E2A45',
        stickerSm: '4px 4px 0 #1E2A45',
      },
      borderRadius: {
        xl2: '24px',
      },
    },
  },
  plugins: [],
};
