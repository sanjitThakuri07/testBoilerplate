import { createTheme } from "@mui/material/styles";
import defaultTheme from "../default";
import primary from "./primary";

const dark = createTheme({
  ...defaultTheme,
  palette: { ...defaultTheme.palette, mode: "dark", primary },
});

export default dark;
