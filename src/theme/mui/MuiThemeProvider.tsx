import CssBaseline from "@mui/material/CssBaseline";
import {
  Experimental_CssVarsProvider as CssVarsProvider,
  ThemeProvider,
  experimental_extendTheme as extendTheme,
} from "@mui/material/styles";
import themeManager from "src/theme/mui/themeManager";

import { PropsWithChildren } from "react";
import { useReactTheme } from "src/theme/custom/ReactThemeProvider";

export function MuiThemeProvider({ children }: PropsWithChildren<Record<string, unknown>>) {
  // const { theme } = useReactTheme();
  const theme = themeManager("blue");
  const cssVarsTheme = extendTheme(theme);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <CssVarsProvider theme={cssVarsTheme}>{children}</CssVarsProvider>
    </ThemeProvider>
  );
}
