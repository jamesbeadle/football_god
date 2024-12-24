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
        BrandNegative: "#FF403C",
        BrandPositive: "#66E094",
        BrandPurple: "#7F56F1",
        BrandDarkGray: "#32353F",
        BrandGray: "#242529",
        BrandLightGray: "#2F3035",
        BrandDisabled: "#919191",
        BrandActive: "#FFFFFF",
        BrandOddsDivider: "#313235",
        BrandPurpleDark: "#6646D1",
        BrandDark: "#101111",
        BrandPanelGray: "#2F3035",
        BrandTextGray: "#919191",
        BrandTextGray2: "#8C8C8C",
        BrandBetSlipGray: "#F9F9F9",
      },
      fontWeight: {
        light: "300",
        med: "400",
        sub: "600",
      },
    },
  },
  plugins: [],
};
