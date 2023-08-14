import { Alert, Snackbar } from '@mui/material';
import React, { useEffect } from 'react';

interface IProps {
  type: 'success' | 'error' | 'info' | 'warning';
  //   heading?: string;
  message: string;
}

/**
 * @description Generic function for the toaster
 * @param toastProps
 * @returns
 */
export const Toast = (toastProps: IProps): JSX.Element => {
  const [open, setOpen] = React.useState(false);
  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };
  const { message, type } = toastProps;

  useEffect(() => {
    setOpen(true);

    return () => {
      setOpen(false);
    }
  }, [])
  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity={type} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};
