import React, { useState } from "react";
import { makeStyles } from "@mui/styles";
import { Button, CircularProgress, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface Props {
  data: string;
  children?: React.ReactNode;
  openInNewWindow?: boolean;
  width?: any;
}

const useStyles = makeStyles({
  modal: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
  modalContent: {
    position: "relative",
    width: "90%",
    height: "90%",
    maxWidth: 1000,
    maxHeight: 800,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 4,
    overflow: "hidden",
  },
  close: {
    position: "absolute",
    top: "8px",
    right: "8px",
    cursor: "pointer",
    fontSize: "2rem",
  },
  iframe: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
});

const FileDataModal: React.FC<Props> = ({ data, children, openInNewWindow, width = "100%" }) => {
  const [showModal, setShowModal] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const classes = useStyles();

  const imageFormat = ["jpeg", "jpg", "png", "svg"];

  const handleFileDataClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setImageLoaded(false);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const renderContent = () => {
    if (imageFormat.some((format) => data?.toString().includes(format))) {
      return (
        <>
          {/* {imageLoaded ? <img src={data} style={{ width: '100%' }} alt="" /> : <CircularProgress />} */}
          <div>
            <img
              src={data}
              alt=""
              style={{ width: "100%" }}
              // onLoad={handleImageLoad}
            />
          </div>
        </>
      );
    } else {
      return <iframe className={classes.iframe} src={data} />;
    }
  };

  return (
    <>
      <div onClick={handleFileDataClick} style={{ width }}>
        {children}
      </div>
      {showModal && (
        <div className={classes.modal}>
          <div
            className={classes.modalContent}
            style={{
              overflow: imageFormat.some((format) => data?.toString().includes(format))
                ? "auto"
                : "hidden",
            }}
          >
            <IconButton
              className={classes.close}
              onClick={handleCloseModal}
              sx={{
                position: "absolute",
                fontSize: "2rem",
                background: "rgba(0, 0, 0, 0.5)",
                color: "white",
              }}
            >
              <CloseIcon />
            </IconButton>
            {renderContent()}
            {!!openInNewWindow && (
              <Button variant="outlined" sx={{ marginTop: "5px" }}>
                <a href={data} target="_blank" style={{ textDecoration: "none" }}>
                  Open in a new tab
                </a>
              </Button>
            )}
            {/* {!!openInNewWindow && (
              <Button variant="outlined" sx={{ marginTop: '5px' }}>
                <a href={data} target="_blank">
                  Open in a new tab
                </a>
              </Button>
            )} */}
          </div>
        </div>
      )}
    </>
  );
};

export default FileDataModal;
