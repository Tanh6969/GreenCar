/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        green: {
          primary: "#006C4C",
          mid: "#4FBD91",
          light: "rgba(79,189,145,0.10)",
        },
      },
      fontFamily: {
        sans: ["Outfit", "Plus Jakarta Sans", "Inter", "Segoe UI", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};
