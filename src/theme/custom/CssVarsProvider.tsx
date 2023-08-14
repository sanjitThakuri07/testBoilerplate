import { useEffect } from "react";

function convertColorsToCssVar(input, prefix = "custom") {
  let output = {};

  for (const key in input) {
    const value = input[key];

    if (typeof value === "object" && !Array.isArray(value)) {
      const newParentKey = prefix ? `${prefix}-${key}` : key;
      const nestedOutput = convertColorsToCssVar(value, newParentKey);
      output = { ...output, ...nestedOutput };
    } else {
      const newKey = prefix ? `--${prefix}-${key}` : `--${key}`;
      output[newKey] = value;
    }
  }

  return output;
}

const writeToCssRoot = (customStyles: object) => {
  const headTag = document.getElementsByTagName("head")[0];
  const styleTag = document.createElement("style");

  const styleText = `:root {
    ${Object.entries(customStyles)
      .map(([property, value]) => `${property}: ${value};`)
      .join("\n")}
  }
`;
  styleTag.innerHTML = styleText;
  headTag.appendChild(styleTag);
};

const setVariablesToRoot = (cssVars: object) => {
  const root = document.querySelector<HTMLElement>(":root");
  if (!root || !Object.keys(cssVars)?.length) return;
  const cssVarsObject = convertColorsToCssVar(cssVars);
  writeToCssRoot(cssVarsObject);
};

const getRootVarValue = (rootCssVar = "--my-color") => {
  const root = document.querySelector(":root");
  if (root) getComputedStyle(root).getPropertyValue(rootCssVar);
};

function CssVarsProvider({ children, theme }) {
  useEffect(() => {
    setVariablesToRoot(theme.colors);
  }, [theme.colors]);

  return <>{children}</>;
}

export default CssVarsProvider;
