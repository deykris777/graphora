import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        display: ["Plus Jakarta Sans", "Outfit", "sans-serif"],
        body: ["Inter", "sans-serif"]
      },
      colors: {
        brand: {
          primary: "#FF6B35",     // Luxury Orange
          secondary: "#E0F7FA",   // Cyan Glow Accent
          void: "#050505",        // Deep Black
          surface: "#0D0D0D",     // Sleek Surface
          text: "#FFFFFF",
          muted: "rgba(255, 255, 255, 0.7)",
        },
        graphora: {
          ink: "#050505",
          slate: "#0D0D0D",
          mist: "#E0F7FA",
          cyan: "#E0F7FA",         // Re-map cyan to secondary accent
          emerald: "#E0F7FA",      // Re-map emerald to secondary accent
          ember: "#FF6B35",        // Re-map ember to primary accent
          lime: "#FF6B35",         // Re-map lime to primary accent
          mint: "rgba(255, 255, 255, 0.7)", // Re-map mint to secondary/body text
          void: "#050505",
          abyss: "#0D0D0D"
        }
      },
      boxShadow: {
        glass: "0 18px 50px rgba(0, 0, 0, 0.5)",
        outline: "0 0 0 2px rgba(224, 247, 250, 0.2)"
      }
    }
  },
  plugins: []
} satisfies Config;
