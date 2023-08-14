/* eslint-disable @typescript-eslint/explicit-function-return-type */
// import React from 'react'
import InputAdornment from '@mui/material/InputAdornment';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import { ThemeProvider } from '@mui/material/styles';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { TextField } from '@mui/material';
import globalSearchTheme from './globalSearchTheme';

export default function GlobalSearch() {
  return (
    <Grid
      container
      className="h-100 global-search-padding"
      justifyContent={'center'}
      alignContent={'center'}
      alignItems={'center'}>
      <Grid item>
        <ThemeProvider theme={globalSearchTheme}>
          <TextField
            // label="TextField"
            placeholder="Activate “Compact Mode” now."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Chip label="New Features" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <ArrowForwardIcon />
                </InputAdornment>
              )
            }}
            // variant="standard"
          />
        </ThemeProvider>
      </Grid>
    </Grid>
  );
}
