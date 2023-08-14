import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import defaultFont from "src/constants/css/font";

declare module "@mui/material/styles" {
  interface Theme {
    status: {
      danger: string;
    };
    constant: {
      header: {
        height: number;
        zIndex: number;
      };
      sidebar: {
        width: number;
        zIndex: number;
      };
      footer: {
        height: number;
        zIndex: number;
      };
    };
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    constant?: {
      header: {
        height: number;
        zIndex: number;
      };
      sidebar: {
        width: number;
        zIndex: number;
      };
      footer: {
        height: number;
        zIndex: number;
      };
    };
  }
}

let defaultTheme = createTheme({
  typography: {
    fontFamily: defaultFont,
  },
  constant: {
    header: {
      height: 70,
      zIndex: 1,
    },
    sidebar: {
      width: 270,
      zIndex: 2,
    },
    footer: {
      height: 50,
      zIndex: 2,
    },
  },
});

defaultTheme = responsiveFontSizes(defaultTheme);

export default defaultTheme;
