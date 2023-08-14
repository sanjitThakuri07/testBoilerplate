import { createTheme } from '@mui/material/styles';

const badgeTabTheme = createTheme({
  components: {
    // Name of the component
    MuiTabs: {
      styleOverrides: {
        root: { minHeight: '44px' }
      }
    },

    MuiTab: {
      styleOverrides: {
        root: {
          color: '#667085',
          textTransform: 'none',
          minHeight: '44px',
          height: '44px',
          padding: '6px 30px',
          outline: 'none',
          fontWeight: 600,
          border: 'none',
          borderRadius: 0,
          //   height: '15px'

          '&.Mui-selected': {
            background: '#EBEDF1',
            color: '#283352'
          }
        }
      }
    },

    MuiChip: {
      styleOverrides: {
        root: {
          marginLeft: '20px',
          background: '#EBEDF1',
          mixBlendMode: 'multiply'
        },
        label: {
          fontSize: 12,
          fontWeight: 500
        }
      }
    }
  }
});

export default badgeTabTheme;
