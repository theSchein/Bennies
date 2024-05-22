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
        'body': ['Lato', 'sans-serif'],
        'subheading': ['Comfortaa', 'sans-serif'],
      },
      colors: {
        light: {
          'primary': '#E1F0DA',
          'secondary': '#D4E7C5',
          'tertiary': '#BFD8AF',
          'quaternary': '#99BC85',
          'background': '#99BC85',
          'font': '#294B29',
	        'ennies': '#ECF2E8'
        },
        dark: {
          'primary': '#DBE7C9',
          'secondary': '#789461',
          'tertiary': '#50623A',
          'quaternary': '#294B29',
          'background': '#294B29',
          'font': '#F0E5CF',
        },
    },
    backgroundImage: {
      'rainbow-gradient': 'linear-gradient(to right, #FF0000, #FF9A00, #D0DE21, #4FDC4A, #3FDAD8, #2FC9E2, #1C7FEE, #5F15F2, #BA0CF8, #FB07D9, #FF0000)',
      'gradient-dark': 'linear-gradient(to bottom, #294B29, #789461)',
      'gradient-dark-comment': 'linear-gradient(to right, #789461, #294B29)',
      'gradient-light': 'linear-gradient(to bottom, #99BC85, #E1F0DA)',
      'gradient-light-comment': 'linear-gradient(to right, #D4E7C5, #99BC85)',
    }
  },
},
  plugins: [],
}
