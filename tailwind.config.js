/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    extend: {
      animation: {
        "color-change": "colorChange 4s infinite",
        "spin-slow": "spin 3s linear infinite",
      },

      keyframes: {
        colorChange: {
          "0%, 100%": { color: "white" },
          "25%": { color: "black" },
          "50%": { color: "white" },
          "75%": { color: "yellow" },
        },
        spin: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
    },
  },
  plugins: [],
};
