import React from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import { Button, InputLabel, OutlinedInput, Stack, Typography } from "@mui/material";
import CrossIcon from "src/assets/icons/times_icon.svg";
import ButtonLoaderSpinner from "src/components/ButtonLoaderSpinner/ButtonLoaderSpinner";

export const style = {
  position: "absolute" as "absolute",
  borderRadius: "14px",
  top: "50%",
  right: "25%",
  transform: "translate(-10%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  // border: "2px solid #000",
  boxShadow: 24,
  p: 3,
  zIndex: 1000,
  focus: {
    outline: "none",
  },
};

interface ModalProps {
  children?: React.ReactNode;
  openModal?: any;
  setOpenModal?: any;
  confirmationIcon?: any;
  confirmationHeading?: string;
  confirmationDesc?: string;
  handelConfirmation?: any;
  loader?: boolean;
  IsSingleBtn?: boolean;
  btnText?: string;
  isSuccess?: boolean;
  size?: string;
}

const AddModal = ({
  children,
  openModal,
  setOpenModal,
  confirmationIcon,
  confirmationHeading,
  confirmationDesc,
  handelConfirmation,
  IsSingleBtn,
  loader,
  btnText,
  isSuccess,
  size,
}: ModalProps) => {
  return (
    <>
      <Modal
        sx={{
          border: "none",
          borderRadius: "8px",
        }}
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openModal}
        onClose={() => setOpenModal(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openModal}>
          <Box sx={style}>
            <div className="assign__modal-body">
              <Stack direction="column">
                {/* <Stack
                  direction="row"
                  //     alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography
                    // mt={3}
                    variant="h6"
                    component="h6"
                    sx={{
                      fontWeight: "400",
                      fontSize: "16px",
                      color: "#384874",
                    }}
                  >
                    {`Add ${confirmationHeading} `}
                  </Typography>
                  {!isSuccess && (
                    <div
                      className="deactivate_modal_close"
                      onClick={() => setOpenModal(false)}
                    >
                      <img src={CrossIcon} alt="cross" />
                    </div>
                  )}
                </Stack> */}
                <Typography
                  sx={{
                    color: "#475467",
                  }}
                  variant="body2"
                  component="p"
                  //     mt={1}
                >
                  {confirmationDesc}
                </Typography>

                {children}
              </Stack>
            </div>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default AddModal;
