// import original module declarations
import "styled-components";
import { type ThemeType } from "../index";

// and extend them!
declare module "styled-components" {
  export interface DefaultTheme extends ThemeType {}
}
