import { Theme } from "@mui/material/styles";
import { isClient } from "src/utils";
import brand from "./mui/themes/brand";
import dark from "./mui/themes/dark";
import defaultTheme from "./mui/themes/default";
import blueTheme from "./mui/themes/blueTheme";

import light from "./mui/themes/light";

export type ThemeType = Theme;
export type ThemeModesType = "default" | "dark" | "light" | "brand" | "blue";

export const getTheme = (mode: ThemeModesType): ThemeType => {
  switch (mode) {
    case "light":
      return light;

    case "dark":
      return dark;

    case "brand":
      return brand;

    case "blue":
      return blueTheme;

    default:
      return defaultTheme;
  }
};

export const themeStorageKey = "themeMode";
export const getPreferredTheme = () => {
  let preferredTheme = defaultTheme; // lightTheme is default theme
  if (isClient) {
    const storageKey = localStorage.getItem(themeStorageKey);
    const storedTheme = storageKey ? getTheme(storageKey as ThemeModesType) : null;
    const prefersDark =
      window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    // first priority is theme set in localStorage and then fallback to prefers-color-scheme
    preferredTheme = storedTheme || (prefersDark && dark) || defaultTheme;
  }
  return preferredTheme;
};

export default defaultTheme;
