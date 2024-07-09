/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    extend: {
      animation: {
        "color-change": "colorChange 4s infinite",
      },
      keyframes: {
        colorChange: {
          "0%, 100%": { color: "white" },
          "25%": { color: "black" },
          "50%": { color: "white" },
          "75%": { color: "yellow" },
        },
      },
    },
  },
  plugins: [],
};
