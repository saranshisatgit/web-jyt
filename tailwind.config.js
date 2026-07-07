/** @type {import('tailwindcss').Config} */
// Loaded into Tailwind v4 via `@config` in styles/globals.css.
// Brings in @medusajs/ui-preset so real Medusa components render, and scans
// the @medusajs/ui dist so their utility classes are generated. Sky palette
// is mapped onto Medusa's CSS variables in styles/medusa-ui-tokens.css.
module.exports = {
  presets: [require('@medusajs/ui-preset')],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@medusajs/ui/dist/**/*.{js,mjs}',
  ],
  theme: {
    extend: {
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-in-out',
      },
    },
  },
  plugins: [],
};
