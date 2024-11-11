import daisyui from "daisyui";
import daisyUIThemes from "daisyui/src/theming/themes";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		fontFamily: {
  			rfSemibold: ["RFDewiExtended-Semibold"],
  			rfBlack: ["RFDewiExtended-Ultrabold"],
  			rfRegular: ["RFDewiExtended-Regular"],
  			rfBold: ["RFDewiExtended-Bold"],
  			rfUltralightItalic: ["RFDewiExtended-UltralightItalic"],
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [daisyui, require("tailwindcss-animate")],

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
