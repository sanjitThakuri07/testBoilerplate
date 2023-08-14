import { createTheme } from "@mui/material/styles";
import { deepmerge } from "@mui/utils";
import defaultTheme from "../default";
import primary from "./primary";
import secondary from "./secondary";

// const light = createTheme({
//   ...defaultTheme,
//   palette: { ...defaultTheme.palette, mode: 'light', primary, secondary },
// });

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary,
    secondary,
  },
});

const light = createTheme(deepmerge(defaultTheme, lightTheme));

export default light;
