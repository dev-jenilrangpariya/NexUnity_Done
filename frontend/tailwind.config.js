/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    fontFamily: {
      poppins:["Poppins"],
      merienda: ["Merienda"],
      playfair: ["Playfair Display"]
    },

    extend: {
      screens: {
        xxsm: "320px",
        xsm: "420px",
        sm: "576px",
        md: "768px",
        lg: "992px",
        xl: "1200px",
        xxl: "1400px",
        "3xl": "1640px",
      },

      colors: {
        backgroundv1: "var(--background-v1)",
        backgroundv2: "var(--background-v2)",
        backgroundv3: "var(--background-v3)",
        textPrimary: "var(--color-text-primary)",
        textGray:"#77828b",
        // blueMain:'#2a86fe',
        blueMain:'#2ce28b',//green
        blueMainLight:'#e5f8ef'//green light
      },
      container: {
        center: true,
        padding: {
          DEFAULT: 12,
          sm: 16,
        },
      },
      fontSize: {
        10: "10px",
        12: "12px",
        14: "14px",
        16: "16px",
        18: "18px",
        20: "20px",
        22: "22px",
        24: "24px",
        26: "26px",
        28: "28px",
        30: "30px",
        32: "32px",
        34: "34px",
        36: "36px",
        42: "42px",
        44: "44px",
        46: "46px",
        52: "52px",
        64: "64px",
        74: "74px",
      },
      fontWeight:{
        100:"100",
        200:"200",
        300:"300",
        400:"400",
        500:"500",
        600:"600",
        700:"700",
        800:"800",
        900:"900"
      }
    },
  },
  veriants: {
    extends: {},
  },
  plugins: [],
};
