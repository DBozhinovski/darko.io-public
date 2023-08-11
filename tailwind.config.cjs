/** @type {import('tailwindcss').Config} */

function withOpacity(variableName) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgba(var(${variableName}), ${opacityValue})`;
    }
    return `rgb(var(${variableName}))`;
  };
}

module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    fontFamily: {
      'handlee': ['handlee', 'cursive'],
      'open-sans': ['Open Sans', 'sans-serif']
    },
    extend: {
      colors: {
        'background': '#FAF3E0',
        'primary': '#2E2E2E',
        'secondary': '#755C42',
        'accent-one': '#967340',
        'accent-two': '#4C6A50',
        'highlight-select': '#3B4F77',
        'error-attention': '#9A534D',
        'root': '#32312d'
      }
    }
  },
  plugins: [require("@tailwindcss/typography")],
};
