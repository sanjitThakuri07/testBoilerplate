import React from "react";
import { Box, Fade, Modal, Stack } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import TimesIcon from "../../../assets/icons/times_icon.svg";
import { style } from "src/components/ConfirmationModal/ConfirmationModal";
import { useAlertPopup } from "globalStates/alertPopup";

interface UserAlertModalLayoutI {
  children: React.ReactNode;
  modal: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  subTitle: string;
}

export default function UserAlertModalLayout({
  children,
  modal,
  setModal,
  title,
  subTitle,
}: UserAlertModalLayoutI) {
  const { alertContainerValue, setAlertContainerValue } = useAlertPopup();
  return (
    <>
      <Modal
        sx={{ border: "none", borderRadius: "8px" }}
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={modal}
        onClose={() => {
          setModal(false);
        }}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={modal} className={"full__container"}>
          <Box
            sx={{
              ...style,
              width: 600,
              paddingTop: alertContainerValue !== "user-alert" ? "2.8rem" : "",
            }}
          >
            <Stack direction="column" className="notifcation__header">
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ color: "#384874", fontSize: "18px", fontWeight: 500 }}
              >
                <Box>{title ?? title}</Box>
                <Box sx={{ top: "17px", right: "17px", position: "fixed" }}>
                  <img
                    src={TimesIcon}
                    alt="cross"
                    className="user-alert-times-icon"
                    onClick={() => setModal(false)}
                  />
                </Box>
              </Stack>
              <Box sx={{ color: "#475467", mt: 0.3, fontWeight: 300 }}>{subTitle ?? subTitle}</Box>
            </Stack>
            {children}
          </Box>
        </Fade>
      </Modal>
    </>
  );
}
