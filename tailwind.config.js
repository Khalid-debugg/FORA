/** @type {import('tailwindcss').Config} */

export const darkMode = ["class"];
export const content = [
  "./pages/**/*.{ts,tsx}",
  "./components/**/*.{ts,tsx}",
  "./app/**/*.{ts,tsx}",
  "./src/**/*.{ts,tsx}",
];
export const theme = {
  container: {
    center: true,
    padding: "2rem",
    screens: {
      "2xl": "1400px",
    },
  },
  extend: {
    colors: {
      "primary-500": "#30cc42",
      "primary-600": "#5D5FEF",
      "secondary-500": "#FFB620",
      "off-white": "#D0DFFF",
      "dark-1": "#000000",
      "dark-2": "#09090A",
      "dark-3": "#101012",
      "dark-4": "#1F1F22",
      "light-1": "#FFFFFF",
      "light-2": "#EFEFEF",
      "light-3": "#7878A3",
      "light-4": "#5C5C7B",
    },
    screens: {
      xs: "480px",
    },
    width: {
      420: "420px",
      465: "465px",
    },
    fontFamily: {
      sora: ["Sora", "sans-serif"],
    },
    keyframes: {
      "accordion-down": {
        from: { height: 0 },
        to: { height: "var(--radix-accordion-content-height)" },
      },
      "accordion-up": {
        from: { height: "var(--radix-accordion-content-height)" },
        to: { height: 0 },
      },
      "fade-in": {
        from: {
          opacity: 0,
          transform: "translate(-50%, -50%) translateX(-20px)",
        },
        to: { opacity: 1, transform: "translate(-50%, -50%) translateX(0)" },
      },
      "fade-out": {
        from: { opacity: 1, transform: "translate(-50%, -50%) translateX(0)" },
        to: { opacity: 0, transform: "translate(-50%, -50%) translateX(20px)" },
      },
    },
    animation: {
      "accordion-down": "accordion-down 0.2s ease-out",
      "accordion-up": "accordion-up 0.2s ease-out",
      "fade-in": "fade-in 0.3s ease-out",
      "fade-out": "fade-out 0.3s ease-out",
    },
  },
};
export const plugins = [import("tailwindcss-animate")];
