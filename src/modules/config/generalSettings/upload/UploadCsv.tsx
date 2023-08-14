import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Link,
  Typography,
} from "@mui/material";
import React, { FC, MouseEvent, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import FileUploader from "src/components/upload";
import { postAPI } from "src/lib/axios";
import { useSnackbar } from "notistack";

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose?: () => void;
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

const UploadCsv: FC<{
  sampleLink: string;
  sampleLinkHandler?: (event: MouseEvent<HTMLAnchorElement>) => void;
  open: boolean;
  onClose: () => void;
  uploadUri: string;
}> = ({ onClose, open, uploadUri, sampleLink, sampleLinkHandler }) => {
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  const onUploadCsv = (file: File): void => {
    setFile(file);
  };

  const handleUploadCSV = (): void => {
    try {
      if (!file) return;
      setLoading(true);
      const formdata = new FormData();
      formdata.append("file", file);

      postAPI(uploadUri, formdata)
        .then((res) => {
          setFile(null);
          setLoading(false);
          onClose();
          enqueueSnackbar("CSV uploaded successfully", { variant: "success" });
        })
        .catch((err) => {
          setFile(null);
          setLoading(false);
          enqueueSnackbar(err?.response?.data?.detail?.message || "Unable to upload file", {
            variant: "error",
          });
        });
    } catch (error) {
      setFile(null);
      setLoading(false);
      enqueueSnackbar("Something went wrong", { variant: "error" });
    }
  };

  const handleReplaceFile = () => {
    setFile(null);
    // document.getElementsByClassName('IMAGE_UPLOAD_DELETE_BTN')?.click();

    document.getElementById("upload_csv_icon")?.click();
  };

  return (
    <Dialog
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      className="dialog-box"
      open={open}
    >
      {/* {loading && <CircularProgress />} */}
      <BootstrapDialogTitle id="customized-dialog-title">
        Upload CSV
        <Typography variant="body1" component="p">
          Please refer{" "}
          <Link target="_blank" onClick={sampleLinkHandler} href={sampleLink}>
            to this sample
          </Link>{" "}
          CSV file for your reference. Also, the notes are optional for the users to fill.
        </Typography>
      </BootstrapDialogTitle>
      <DialogContent>
        <FileUploader maxCount={1} onUpload={onUploadCsv} allowMultiple={false} type="csv" />
      </DialogContent>
      <DialogActions>
        {!!file && (
          <Grid container spacing={2} justifyContent="flex-start">
            <Grid item>
              <Button
                sx={{ background: "#C1C6D4", marginLeft: "13px" }}
                onClick={() => handleReplaceFile()}
              >
                Replace File
              </Button>
            </Grid>
          </Grid>
        )}

        <Grid container spacing={2} justifyContent="flex-end">
          <Grid item>
            <Button variant="outlined" onClick={onClose}>
              Cancel
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" type="submit" disabled={!!!file} onClick={handleUploadCSV}>
              Proceed
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Dialog>
  );
};

export default UploadCsv;
