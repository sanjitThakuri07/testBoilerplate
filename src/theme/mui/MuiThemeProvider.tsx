import CssBaseline from "@mui/material/CssBaseline";
import {
  Experimental_CssVarsProvider as CssVarsProvider,
  ThemeProvider,
  experimental_extendTheme as extendTheme,
  createTheme,
} from "@mui/material/styles";
import themeManager from "src/theme/mui/themeManager";

import { PropsWithChildren, useEffect, useState } from "react";
import { useReactTheme } from "src/theme/custom/ReactThemeProvider";
import useAppStore from "src/store/zustand/app";

import { hexToHSLA, getHSLA, getContrastColor } from "src/utils/keyFunction";

export function MuiThemeProvider({ children }: PropsWithChildren<Record<string, unknown>>) {
  // const { theme } = useReactTheme();
  const theme = themeManager("blue");
  // const cssVarsTheme = extendTheme(theme);
  const [newTheme, setNewTheme] = useState(theme);

  const { organization: user }: any = useAppStore();
  useEffect(() => {
    if (user?.brand_color) {
      let hslaColor: string = hexToHSLA(user?.brand_color, 1);
      console.log({ hslaColor });
      const [h, s, l, a] = getHSLA(hslaColor);

      const textColor = getContrastColor(h, s, l, a);
      setNewTheme((prev: any) => ({
        ...prev,
        palette: {
          ...(prev.palette || {}),
          primary: {
            ...(prev?.palette?.primary || {}),
            main: hslaColor,
            [`primary-bg-text`]: textColor,
          },
        },
        components: {
          ...(prev?.components || {}),
          MuiButton: {
            styleOverrides: {
              ...(prev?.components?.MuiButton?.styleOverrides || {}),
              outlined: {
                border: `1px solid ${hslaColor}`,
                color: `#424242`,
              },
            },
          },
        },
      }));
    }
  }, [user]);

  return (
    <ThemeProvider theme={createTheme(newTheme)}>
      <CssBaseline enableColorScheme />
      <CssVarsProvider theme={extendTheme(createTheme(newTheme))}>{children}</CssVarsProvider>
    </ThemeProvider>
  );
}
