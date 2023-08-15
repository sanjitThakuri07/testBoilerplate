import { Theme } from "@mui/material";
import blueTheme from "src/theme/mui/themes/blueTheme/index";
// import greenTheme from "./green";

const themeManager = (theme: string): Theme => {
  switch (theme) {
    case "blue":
      return blueTheme;

    case "green":
      return blueTheme;

    default:
      return blueTheme;
  }
};
export default themeManager;
