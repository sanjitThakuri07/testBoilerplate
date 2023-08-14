import commonColors from "../common/commonColors";

const lightColors = {
  common: commonColors,
  primary: {
    default: "#cd171f",
    hover: "",
    focus: "",
    active: "",
    selected: "",
    contrastText: "#fff",
  },
  secondary: {
    default: "#2c27b0",
    hover: "",
    focus: "",
    active: "",
    selected: "",
    contrastText: "#fff",
  },

  tertiary: {
    default: "#222734",
    hover: "",
    focus: "",
    active: "",
    selected: "",
    contrastText: "#fff",
  },
  divider: "#E7EBF0",
  text: {
    primary: "#1A2027",
    secondary: "#3E5060",
    disabled: "rgba(0, 0, 0, 0.38)",
  },
};

export type LightColorsType = typeof lightColors;
export default lightColors;
