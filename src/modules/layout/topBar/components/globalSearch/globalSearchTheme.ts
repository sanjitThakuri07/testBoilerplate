import { createTheme } from '@mui/material/styles';

const globalSearchTheme = createTheme({
  components: {
    // Name of the component
    MuiInputBase: {
      styleOverrides: {
        root: {
          padding: '6px',
          outline: 'none',
          border: 'none',
          borderRadius: 16,
          //   height: '15px'
          background: '#F2F4F7'
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        input: {
          padding: '0px 6px',
          height: '26px',
          fontSize: 12,
          fontWeight: 500,
          lineHeight: '18px'
        },
        root: {
          padding: '6px',
          borderRadius: 16,
          //   height: '15px'
          background: '#F2F4F7'
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          height: 26,
          background: '#F2F4F7',
          mixBlendMode: 'multiply'
        },
        label: {
          fontSize: 12,
          fontWeight: 500,
          lineHeight: '18px'
        }
      }
    }
  }
});

export default globalSearchTheme;
