import { Theme } from "@mui/material";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import defaultTheme, {
  ThemeModesType,
  getPreferredTheme,
  getTheme,
  themeStorageKey,
} from "src/theme";

import blueTheme from "src/theme/mui/themes/blueTheme";

type ReactThemeContextType = {
  theme?: Theme;
  // setTheme?: Dispatch<SetStateAction<Theme>>;
  switchTheme: (themeStorageKey: ThemeModesType) => void;
  toggleLightDarkTheme?: () => void;
};

// creating context
export const ReactThemeContext = createContext<ReactThemeContextType>({});

function ReactThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState(blueTheme);

  const switchTheme = (mode: ThemeModesType) => {
    const theme = getTheme(mode);
    setTheme(theme);
    window.localStorage.setItem(themeStorageKey, mode);
  };

  const toggleLightDarkTheme = () => {
    theme?.palette.mode === "dark" ? switchTheme("light") : switchTheme("dark");
  };

  useEffect(() => {
    const currentTheme = getPreferredTheme();
    setTheme(currentTheme);
  }, []);

  return (
    <ReactThemeContext.Provider value={{ theme, switchTheme, toggleLightDarkTheme }}>
      {/* <CssVarsProvider
        theme={{
          colors: customTheme.color,
        }}
      > */}
      {children}
      {/* </CssVarsProvider> */}
    </ReactThemeContext.Provider>
  );
}

export default ReactThemeProvider;

// Usage or Consumption
function useReactTheme() {
  const value: ReactThemeContextType = useContext(ReactThemeContext);
  return value;
}

export { useReactTheme };
