/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily : {
      'body': [
        'Inter',
        'Roboto',
        'ui-sans-serif',
        'system-ui'
      ],
      'sans': [
        'Inter',
        'Roboto',
        'ui-sans-serif',
        'system-ui'
      ],
    },
    extend: {
      height: {
        '80vh' : '80vh',
      }
    },
  },
  plugins: [
    require('daisyui'),
  ],
  darkMode: 'class'
}
