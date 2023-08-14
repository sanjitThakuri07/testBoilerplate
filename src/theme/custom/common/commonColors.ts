import { errorColors, infoColors, successColors, warningColors } from "./stateColors";

const defaultTheme = {
  black: "#1D1D1D",
  white: "#ffffff",
  grey: {
    default: "#E7EBF0",
    "50": "#F3F6F9",
    "100": "#E7EBF0",
    "200": "#E0E3E7",
    "300": "#CDD2D7",
    "400": "#B2BAC2",
    "500": "#A0AAB4",
    "600": "#6F7E8C",
    "700": "#3E5060",
    "800": "#2D3843",
    "900": "#1A2027",
    contrastText: "#6F7E8C",
    A100: "#f5f5f5",
    A200: "#eeeeee",
    A400: "#bdbdbd",
    A700: "#616161",
  },
  info: infoColors,
  success: successColors,
  warning: warningColors,
  error: errorColors,
};

export type defaultThemeType = typeof defaultTheme;

export default defaultTheme;
