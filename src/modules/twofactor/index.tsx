import { Button, Box, Grid, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { getAPI } from "src/lib/axios";
import { useSnackbar } from "notistack";
import "./twofactor.scss";

const TwoFactor_QR = (): JSX.Element => {
  const { enqueueSnackbar } = useSnackbar();

  const [qrimage, setQrimage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    getAPI(`user/auth/2factor_qrcode`)
      .then((res) => {
        if (res.status === 200) {
          setQrimage(res.data.data);
        }
      })
      .catch((err) => {
        enqueueSnackbar("Two Factor - " + err?.message || "API Error !", {
          variant: "error",
        });
      });
  }, []);
  const handleRedirect = () => {
    navigate("/settings");
  };

  return (
    <div className="setting-tab-holder">
      <Typography variant="h1" color="primary" className="heading">
        Set Up Two Factor Authentication
      </Typography>
      <Grid container spacing={10}>
        <Grid item xs={12}>
          <Box className="TwoFactor_QR">
            <Typography variant="h2" color="primary" className="heading">
              Set Up Two Factor Authentication
            </Typography>
            <div className="sub-title">
              Download the Microsoft Authenticator App From Your App Store or Play Store.
            </div>
            <div>
              <Typography component="p" variant="body1" className="p-bold">
                Scan the image above to display the 6 digit verification code.
              </Typography>
            </div>
            <div>
              <Typography component="p" variant="body1">
                After scanning the QR code image, the app will display a six-digit code that you can
                enter while login.
              </Typography>
            </div>
            <div className="qr-image">
              <img src={qrimage} />
            </div>
            <div className="footer-btn">
              <Button onClick={handleRedirect} variant="contained">
                Done
              </Button>
            </div>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

export default TwoFactor_QR;
