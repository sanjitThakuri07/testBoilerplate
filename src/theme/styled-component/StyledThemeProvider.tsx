import { PropsWithChildren } from "react";
import { useReactTheme } from "src/theme/custom/ReactThemeProvider";
import GlobalStyle from "src/theme/styled-component/Global";
import { ThemeProvider } from "styled-components";

function StyledThemeProvider({ children }: PropsWithChildren<NonNullable<unknown>>) {
  // const selectedTheme = useSelector((state) => state.themeState.theme);
  const { theme } = useReactTheme();
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      {children}
    </ThemeProvider>
  );
}
export default StyledThemeProvider;
