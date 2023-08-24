const blueTheme = {
  palette: {
    common: {
      black: "#475467",
      white: "#FFF",
    },
    primary: {
      main: "#384874",
    },
    secondary: {
      main: "#f50057",
    },
  },
  typography: {
    fontFamily: `'Inter', sans-serif`,
    fontWeightLight: 100,
    fontSize: 14,
    h1: {
      fontSize: 30,
      fontWeight: 500,
    },
    h3: {
      fontSize: 18,
      fontWeight: 500,
      marginBottom: 5,
    },
    body1: {
      fontSize: 14,
    },
    button: {
      fontWeight: 500,
      fontSize: 14,
    },
  },
  spacing: 8,
  shape: {
    borderRadius: 4,
  },
  components: {
    // Name of the component
    // Name of the component
    MuiInputBase: {
      styleOverrides: {
        root: {
          padding: "6px",
          outline: "none",
          borderRadius: 8,
          border: "1px solid #D0D5DD",
          background: "#fff",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        input: {
          padding: "0px 6px",
          height: "44px",
          border: "none",
          fontSize: 16,
          lineHeight: 24,
          fontWeight: 400,
        },
        root: {
          padding: "6px",
          borderRadius: 8,
          height: "44px",
          border: "none",
          //   height: '15px'
          background: "#fff",
        },
      },
    },
    MuiButtonBase: {
      defaultProps: {
        // The props to change the default for.
        disableRipple: true,
        // No more ripple, on the whole application 💣!
      },
    },
    MuiButton: {
      styleOverrides: {
        // Name of the slot
        root: {
          textTransform: "none",
          borderRadius: 8,
          minHeight: 40,
          // Some CSS
          // background: '#283352!important',
          // color: '#fff!important',
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        // Name of the slot
        root: {
          minWidth: "20px!important",
        },
      },
    },

    // MuiTooltip-tooltip: {
    //   styleOverrides: {
    //     root: {
    //       background: '#283352!important',
    //       color: '#fff!important',
    //     }}
    //   }
  },
};

export default blueTheme;
