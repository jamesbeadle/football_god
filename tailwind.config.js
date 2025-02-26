/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    screens: {
      xxs: "420px",
      xs: "480px",
      sm: "640px",
      // => @media (min-width: 640px) { ... }

      md: "768px",
      // => @media (min-width: 768px) { ... }

      lg: "1024px",
      // => @media (min-width: 1024px) { ... }

      xl: "1280px",
      // => @media (min-width: 1280px) { ... }

      "2xl": "1536px",
      // => @media (min-width: 1536px) { ... }

      "3xl": "1920px",
      // => @media (min-width: 1920px) { ... }
    },
    fontSize: {
      xxs: ".625rem",
      xs: "0.7rem",
      sm: "0.8rem",
      base: "1rem",
      lg: "1.1rem",
      xl: "1.25rem",
      "2xl": "1.563rem",
      "3xl": "1.953rem",
      "4xl": "2.441rem",
      "5xl": "3.052rem",
    },
    extend: {
      colors: {
        BrandError: "#FF403C",
        BrandSuccess: "#66E094",
        BrandInfo: "#3CA1FF",
        BrandPurple: "#7F56F1",
        BrandPurpleDark: "#462F84",
        BrandDarkGray: "#32353F",
        BrandGray: "#242529",
        BrandDark: "#101111",
        BrandLightGray: "#2F3035",
        BrandDisabled: "#919191",
        BrandActive: "#FFFFFF",
        BrandInactive: "#5A5A5A",
        BrandGreen: "#2CE3A6",
        BrandRed: "#CF5D43",
        BrandBlack: "#161819",
        BrandGrayBg: "#2F2F2F",
        BrandGrayShade1: "#484848",
        BrandGrayShade2: "#757575",
        BrandGrayShade3: "#8C8C8C",
        BrandGrayShade4: "#D1D1D1",
        BrandGrayShade5: "#E8E8E8",
        BrandGrayShade6: "#F9F9F9",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
