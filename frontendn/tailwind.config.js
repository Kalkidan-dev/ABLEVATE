/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  theme: {
    extend: {
     colors: {
        braille: '#f5f5dc', // Optional: Braille-friendly background color
        light: '#ffffff', // Light theme background
        dark: '#000000', // Dark theme background
        primary: '#4a90e2', // Primary color for buttons and links
        secondary: '#50e3c2', // Secondary color for accents
        accent: '#f8e71c', // Accent color for highlights
        error: '#d0021b', // Error color for alerts
        success: '#7ed321', // Success color for confirmations
      },
    },
  },
  plugins: [],
}

