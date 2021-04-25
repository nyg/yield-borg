module.exports = {
  purge: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  darkMode: false,
  theme: {
    extend: {
      minHeight: {
        fill: '-webkit-fill-available'
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
