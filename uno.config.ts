import {
  defineConfig,
  presetIcons,
  presetUno,
  presetWebFonts,
  presetWind,
} from "unocss";

export default defineConfig({
  cli: {
    entry: {
      patterns: ["src/**/*.{ts,tsx}"],
      outFile: "public/dist/unocss.css",
    },
  },
  presets: [presetUno(), presetWind(), presetIcons(), presetWebFonts()],
});
