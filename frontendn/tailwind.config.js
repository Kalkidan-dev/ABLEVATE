/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  safelist: [
    'bg-braille', // Braille-friendly background
    'bg-light', // Light theme background
    'bg-dark', // Dark theme background
    'text-primary', // Primary color for text
    'text-secondary', // Secondary color for text
    'text-accent', // Accent color for highlights
    'text-error', // Error color for alerts
    'text-success', // Success color for confirmations
  ],
  important: true, // Ensures Tailwind styles take precedence
  corePlugins: {
    preflight: true, // Enable Tailwind's base styles
  },
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

