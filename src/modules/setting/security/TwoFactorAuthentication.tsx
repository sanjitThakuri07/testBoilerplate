import React, { useState, useEffect } from "react";
import { PublicRoute } from "src/constants/variables";
import { Box, Button, Chip, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { getAPI, postAPI } from "src/lib/axios";
import { AuthApis } from "src/modules/auth/constants";
import { CircularProgress } from "@mui/material";

const TwoFactorAuthentication = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isTwoFactor, setIsTwoFactor] = useState(false);
  const handleRedirect = () => {
    navigate("/two-factor");
  };

  const toggleTwoFactorAuthentication = async () => {
    setIsLoading(true);
    try {
      setIsLoading(true);
      const { data } = await getAPI(`${AuthApis.TOGGLE_TWO_FACTOR_AUTHORIZATION}`);
      // console.log({ data });
      // send notification
      setIsTwoFactor((prev) => !prev);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const fetchTwoFactorAuthenticationDetails = async () => {
    try {
      setIsLoading(true);
      const { data } = await getAPI(`${AuthApis.GET_TWO_FACTOR_AUTHORIZATION_STATUS}`);
      setIsTwoFactor(data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTwoFactorAuthenticationDetails();
  }, []);

  return (
    <Box className="two-fa-holder">
      <div className="holder">
        <div className="ico-holder">
          <img src="/assets/icons/shield.svg" alt="sheild" />
        </div>
        <Typography component="h2" variant="h5">
          Dual Layer Security System <Chip label="TFA" />
        </Typography>
        <Typography component="p" variant="body1">
          Two-factor authentication adds an additional layer of security to your account by
          requiring more than just a password to sign in.
        </Typography>

        {isLoading ? (
          <CircularProgress className="page-loader" />
        ) : (
          <Button
            onClick={async () => {
              if (!isTwoFactor) {
                handleRedirect();
              }
              await toggleTwoFactorAuthentication();
            }}
            variant={`${isTwoFactor ? "outlined" : "contained"}`}
            style={{ borderWidth: isTwoFactor ? "2px" : "auto" }}
          >
            {`${isTwoFactor ? "Disable" : "Enable"} Two Factor Authentication`}
          </Button>
        )}
      </div>
      <div className="link-holder">
        <Link to={PublicRoute.TWO_FACTOR_TERMS} className="link-button">
          Learn more <img src="/assets/icons/arrow-up-right.svg" alt="sheild" className="right" />
        </Link>
      </div>
    </Box>
  );
};

export default TwoFactorAuthentication;
