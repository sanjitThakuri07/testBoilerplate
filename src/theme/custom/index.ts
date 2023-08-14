import { isClient } from "src/utils";
import darkColors from "./colors/darkColors";
import lightColors from "./colors/lightColors";
import action from "./common/action";
import constant from "./common/constant";
import shadows from "./common/shadows";
import shape from "./common/shape";
import transition from "./common/transition";
import typography from "./common/typography";
import zIndex from "./common/zIndex";

const theme = {
  themeName: "default",
  color: lightColors,
  action,
  typography,
  shape,
  shadows,
  transition,
  zIndex,
  constant,
};

export type ThemeType = typeof theme;
export type ThemeModesType = "default" | "dark" | "light";
export type ActionType = typeof action;
export type TransitionType = typeof transition;
export type ConstantType = typeof constant;
export type ZIndexType = typeof zIndex;
export type ShapeType = typeof shape;

export const createTheme = (themeFields = {}) => {
  const clone = structuredClone(theme);
  return { ...clone, ...themeFields };
};

const lightTheme = createTheme({
  mode: "light",
});

const darkTheme = createTheme({
  mode: "dark",
  color: darkColors,
});

export const getTheme = (mode: ThemeModesType): ThemeType => {
  switch (mode) {
    case "light":
      return lightTheme;

    case "dark":
      return darkTheme;

    default:
      return theme;
  }
};

export const themeStorageKey = "themeMode";
export const getPreferredTheme = () => {
  let preferredTheme = theme; // lightTheme is default theme
  if (isClient) {
    const storageKey = localStorage.getItem(themeStorageKey);
    const storedTheme = storageKey ? getTheme(storageKey as ThemeModesType) : null;
    const prefersDark =
      window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    // first priority is theme set in localStorage and then fallback to prefers-color-scheme
    preferredTheme = storedTheme || (prefersDark && darkTheme) || theme;
  }
  return preferredTheme;
};

export default lightTheme;
