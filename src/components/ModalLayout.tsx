import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
// import { GridCloseIcon } from '@mui/x-data-grid';
import CloseIcon from '@mui/icons-material/Close';

interface ModalProps {
  children?: React.ReactNode;
  openModal?: any;
  setOpenModal?: any;
  id?: string;
  large?: boolean;
  extralarge?: boolean;
  giantModal?: boolean;
  globalStyle?: any;
  className?: string;
}

const ModalLayout = ({
  children,
  openModal,
  setOpenModal,
  id,
  large,
  extralarge,
  giantModal,
  globalStyle,
  className,
}: ModalProps) => {
  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: large ? 650 : extralarge ? 800 : giantModal ? 1000 : 450,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    // paddingTop: '10px',
    paddingBottom: '15px',
  };
  return (
    <Modal
      id={id}
      sx={{ border: 'none', overflow: 'scroll' }}
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={openModal}
      onClose={() => setOpenModal(false)}
      closeAfterTransition
      BackdropComponent={Backdrop}
      className={`fix__layout ${className ? className : ''}`}
      BackdropProps={{
        timeout: 500,
      }}>
      <Fade
        in={openModal}
        className="fix__layout"
        style={{
          borderRadius: '12px',
          ...(globalStyle || {}),
        }}>
        <Box sx={style}>
          <div
            className="mui_modal_close_icon"
            style={{
              cursor: 'pointer',
              position: 'absolute',
              right: '3%',
              top: '10px',
              zIndex: '9',
            }}>
            <CloseIcon
              onClick={() => {
                setOpenModal(false);
              }}
            />
          </div>

          {children}
        </Box>
      </Fade>
    </Modal>
  );
};

export default ModalLayout;
