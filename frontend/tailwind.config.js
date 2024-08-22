import daisyui from "daisyui";
import daisyUIThemes from "daisyui/src/theming/themes";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [daisyui],

  daisyui: {
    themes: [
      {
        light: {
          ...daisyUIThemes["light"],
        }
      },
      {
        black: {
          ...daisyUIThemes["black"],
          
        },
      },
    ],
    base: true, // Include base styles (optional)
    utils: true, // Include utility styles (optional)
    logs: true, // Show logs (optional)
    rtl: false, // Enable rtl (optional)
  },
};
