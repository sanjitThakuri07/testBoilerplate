import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import '../../../styles/authentication.scss';
import CheckIcon from '../../../assets/icons/check_icon.svg';
import AuthFooter from '../../../components/AuthFooter';
import { Link } from 'react-router-dom';

const PasswordResetSuccess: React.FC = () => {
  return (
    <Box className="main_container">
      <Box className="forgot_password_inner">
        <Box sx={{ width: '40%' }}>
          <Stack
            sx={{
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%'
            }}>
            <div className="password_reset_success">
              <img src={CheckIcon} alt="check" />
            </div>
            <Typography
              mt={3}
              variant="h4"
              component="h4"
              sx={{ fontWeight: '600', color: '#384874', textAlign: 'center' }}>
              Password Reset
            </Typography>
            <Typography
              sx={{
                textAlign: 'center',
                color: '#475467'
              }}
              variant="body2"
              component="p"
              mt={2}>
              Your password has been successfully reset. Click below to log in
              magically.
            </Typography>
            <Box mt={1} width="100%">
              <Link to="/">
                <Button
                  variant="contained"
                  className="login_button"
                  fullWidth
                  type="submit">
                  Back to Log in
                </Button>
              </Link>
            </Box>
          </Stack>
        </Box>
        {/* auth footer */}
        <AuthFooter />
      </Box>
    </Box>
  );
};
export default PasswordResetSuccess;
