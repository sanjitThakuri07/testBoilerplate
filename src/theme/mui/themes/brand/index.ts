import { PaletteMode } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import defaultTheme from "../default";
import primary from "./primary";

const brand = createTheme({
  ...defaultTheme,
  palette: { ...defaultTheme.palette, mode: "brand" as PaletteMode, primary },
});

export default brand;
