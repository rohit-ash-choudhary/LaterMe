/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1A73E8', // Chrome Blue
        secondary: '#34A853', // Chrome Green
        accent: '#FBBC04', // Chrome Yellow
        background: '#F8F9FA', // Chrome Background
        text: '#202124', // Chrome Text
        success: '#34A853',
        warning: '#FBBC04',
        error: '#EA4335',
        // Chrome Material Colors
        'chrome-blue': '#1A73E8',
        'chrome-green': '#34A853',
        'chrome-yellow': '#FBBC04',
        'chrome-red': '#EA4335',
        'chrome-gray': '#5F6368',
        'chrome-dark': '#202124',
      },
      fontFamily: {
        sans: ['Google Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
