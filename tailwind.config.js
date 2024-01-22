/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'heading': ['Gasoek One', 'sans-serif'],
        'body': ['Josefin Sans', 'sans-serif'],
        'subheading': ['lilita one', 'sans-serif'],
      },
      colors: {
        light: {
          'primary': '#F5F5F5',
          'secondary': '#F2EAD3',
          'tertiary': '#DFD7BF',
          'quaternary': '#3F2305',
          'background': '#3F2305'
        },
        dark: {
          'primary': '#E6E6E6',
          'secondary': '#C5A880',
          'tertiary': '#532E1C',
          'quaternary': '#0F0F0F',
          'background': '#0F0F0F'
        },
    },
    backgroundImage: {
      'rainbow-gradient': 'linear-gradient(to right, #FF0000, #FF9A00, #D0DE21, #4FDC4A, #3FDAD8, #2FC9E2, #1C7FEE, #5F15F2, #BA0CF8, #FB07D9, #FF0000)',
    }
  },
},
  plugins: [],
}
