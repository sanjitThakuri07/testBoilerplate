import CssBaseline from "@mui/material/CssBaseline";
import {
  Experimental_CssVarsProvider as CssVarsProvider,
  ThemeProvider,
  experimental_extendTheme as extendTheme,
} from "@mui/material/styles";

import { PropsWithChildren } from "react";
import { useReactTheme } from "src/theme/custom/ReactThemeProvider";

export function MuiThemeProvider({ children }: PropsWithChildren<Record<string, unknown>>) {
  const { theme } = useReactTheme();
  const cssVarsTheme = extendTheme(theme);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <CssVarsProvider theme={cssVarsTheme}>{children}</CssVarsProvider>
    </ThemeProvider>
  );
}
