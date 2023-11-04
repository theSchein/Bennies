/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'heading': ['Metropolis', 'sans-serif'],
        'body': ['Josefin Sans', 'sans-serif'],
      },
      colors: {
        'primary': '#F0F5F9',
        'secondary': '#C9D6DF',
        'tertiary': '#52616B',
        'quaternary': '#1E2022',
        'background': '#F0F5F9'
    },
    backgroundImage: {
      'rainbow-gradient': 'linear-gradient(to right, #FF0000, #FF9A00, #D0DE21, #4FDC4A, #3FDAD8, #2FC9E2, #1C7FEE, #5F15F2, #BA0CF8, #FB07D9, #FF0000)',
    }
  },
},
  plugins: [],
}
