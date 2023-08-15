/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
    extend: {

      colors: {
        black: "#121212",
orange: {
          50: "#FFE9E5",
          100: "#FFD4CC",
          200: "#FFA899",
          300: "#FF7D66",
          400: "#FF5233",
          500: "#FF2700",
          600: "#CC1F00",
          700: "#991700",
          800: "#660F00",
          900: "#330800",
        },

      },
      fontFamily: {

        sans: ["Poppins", ...defaultTheme.fontFamily.sans],
        mono: ["JetBrains Mono", ...defaultTheme.fontFamily.mono],
      },
    },
  },
	plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
		require('@tailwindcss/aspect-ratio'),
    require("nightwind")
	],
}
