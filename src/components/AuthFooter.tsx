import React from "react";
import { Stack } from "@mui/system";
import { Box } from "@mui/material";
import EmailIcon from "src/assets/icons/email_icon.svg";

const AuthFooter: React.FC = () => {
  return (
    <React.Fragment>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-end"
        color="#475467"
        fontSize="11px"
        position="absolute"
        bottom="2%"
        width="90%"
      >
        <div>&copy; Braintip AI 2023</div>
        <div>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            {/* <MailOutlineIcon sx={{ fontSize: '12px', color: '#475467' }} /> */}
            <img src={EmailIcon} alt="email" style={{ height: "12px", width: "12px" }} />
            <Box>help@braintip.ai</Box>
          </Stack>
        </div>
      </Stack>
    </React.Fragment>
  );
};

export default AuthFooter;
