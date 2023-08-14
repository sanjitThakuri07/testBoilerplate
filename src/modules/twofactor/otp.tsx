import { Button, Box, Grid, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { getAPI } from "src/lib/axios";
import { useSnackbar } from "notistack";
import { useAuthStore } from "src/store/zustand/globalStates/auth";
import { useLayoutStore } from "src/store/zustand/globalStates/layout";
import { userDataStore } from "src/store/zustand/globalStates/userData";
import "./twofactor.scss";
import OtpInput from "src/components/otpInput";

const OTP = (): JSX.Element => {
  const { enqueueSnackbar } = useSnackbar();
  const [otp, setOtp] = useState("");
  const [qrimage, setQrimage] = useState("");
  const navigate = useNavigate();
  const onChange = (value: string) => setOtp(value);
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);

  const handleverifyOtp = () => {
    getAPI(`user/auth/verify_2factor/${otp}`)
      .then((res) => {
        if (res.status === 200) {
          setAuthenticated(true);
          navigate("/");
        }
      })
      .catch((err) => {
        enqueueSnackbar("Invalid OTP", {
          variant: "error",
        });
      });
  };

  const authStore = useAuthStore((state) => state);
  const layoutStore = useLayoutStore((state) => state);
  const userData = userDataStore((state) => state);

  const logoutAPICall = () => {
    getAPI(`user/auth/logout`)
      .then((res) => {
        // enqueueSnackbar('Logout Successfully', { variant: 'success' });
      })
      .catch((err) => {
        enqueueSnackbar("Logout Failed", { variant: "error" });
      });
  };

  const handleverifycancel = () => {
    logoutAPICall();
    authStore.setAuthenticated(false);
    layoutStore.clearLayoutValues();
    userData.clearUserData();
    localStorage.clear();
    window.location.href = "/";
  };
  return (
    <div className="setting-tab-holder">
      <Grid container spacing={10} direction="column" justifyContent="center" alignItems="center">
        <Grid item>
          <Box className="TwoFactor_QR">
            <Typography variant="h2" color="primary" className="TwoFactor_QR_H2 heading">
              Two Factor Authentication
            </Typography>

            <Typography variant="h4" color="primary" className="TwoFactor_QR_H4 heading">
              Enter the two factor authentication code
            </Typography>

            <Grid item>
              <OtpInput value={otp} valueLength={6} onChange={onChange} />
            </Grid>
            <div className="footer-btn otp-footer">
              <Button onClick={handleverifycancel} className="btnCancel" variant="contained">
                Cancel
              </Button>
              <Button onClick={handleverifyOtp} variant="contained">
                Verify
              </Button>
            </div>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

export default OTP;
