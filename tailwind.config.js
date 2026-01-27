/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#8B5CF6', // Vibrant purple
        secondary: '#EC4899', // Pink accent
        accent: '#A78BFA', // Light purple
        background: '#FAFBFF',
        text: '#1F2937',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
      },
    },
  },
  plugins: [],
}
