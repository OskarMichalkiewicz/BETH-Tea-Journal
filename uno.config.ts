import {
  defineConfig,
  presetIcons,
  presetUno,
  presetWebFonts,
  presetWind,
} from "unocss";
import presetAutoprefixer from "unocss-preset-autoprefixer";

export default defineConfig({
  cli: {
    entry: {
      patterns: ["**/*.{ts,tsx,html}"],
      outFile: "public/dist/unocss.css",
    },
  },
  presets: [
    presetUno(),
    presetWind(),
    presetIcons(),
    presetWebFonts(),
    presetAutoprefixer(),
  ],
});
