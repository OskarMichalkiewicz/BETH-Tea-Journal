import { defineConfig, presetIcons, presetWebFonts, presetWind, presetUno } from "unocss";

export default defineConfig({
  cli: {
    entry: {
      patterns: ["src/**/*.{ts,tsx}"],
      outFile: "public/dist/unocss.css",
    },
  },
  presets: [presetUno(), presetWind(), presetIcons(), presetWebFonts()],
});
