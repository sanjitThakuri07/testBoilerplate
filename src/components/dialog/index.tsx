/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  DialogProps,
} from "@mui/material";
import React from "react";
import CloseIcon from "@mui/icons-material/Close";

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}
interface CustomDialogProps {
  title: string;
  handleClose: () => void;
  content?: React.ReactNode;
  open: boolean;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  subtitle?: string;
  wrapperClass?: string;
}

function BootstrapDialogTitle(props: DialogTitleProps) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

const CustomDialog: React.FC<CustomDialogProps> = ({
  title,
  open,
  handleClose,
  content,
  actions,
  subtitle,
  children,
  wrapperClass,
}) => {
  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      className={`dialog-box ${wrapperClass ? wrapperClass : ""}`}
      open={open}
    >
      <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
        {title}
        {subtitle && (
          <Typography variant="body1" component="p">
            {subtitle}
          </Typography>
        )}
      </BootstrapDialogTitle>
      <DialogContent>{content || children}</DialogContent>
      {actions && <DialogActions>{actions}</DialogActions>}
    </Dialog>
  );
};

export default CustomDialog;
