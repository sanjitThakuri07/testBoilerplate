import React, { useState, useEffect } from "react";
import { Button, Grid, IconButton, LinearProgress, Paper } from "@mui/material";
import MultiUpload, { RenderArea } from "./PopupMultiFileUploader";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import CropIcon from "@mui/icons-material/Crop";
import { previousDay } from "date-fns";
import UploadImage from "src/assets/icons/Icon.svg";
import FileDataModal from "components/FileDataModal";
import ImageCropper from "components/ImageCropper/index";
import MaterialModal from "components/MaterailModal";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import { fileExtensions } from "utils/fileExtensionChecker";
import BASTooltip from "components/BASTooltip/BASTooltip";
import { CommonTooltip } from "components/tooltips";
import { fileTypes } from "interfaces/utils";

type file = {
  documents: any[];
  title: string;
  id?: number;
};

type IndexProps = {
  setOpenMultiImage: React.Dispatch<React.SetStateAction<boolean>>;
  openMultiImage: boolean;
  // it must be a callback function that gets the file data for you
  getFileData?: any;
  clearData: boolean;
  setClearData: React.Dispatch<React.SetStateAction<boolean>>;
  initialData?: any;
  accept?: any;
  maxFileSize: any;
  icon?: any;
  requireDescription?: boolean;
  For?: string;
  defaultViewer?: boolean;
  multiple?: boolean;
  disabled?: boolean;
  title?: string;
};

// individual file
export const IndividualFile = ({
  isDesignOne,
  file,
  onDelete,
  openInNewWindow,
  updateFile,
  disabled,
}: any) => {
  const [cropActive, setCropActive] = useState(false);
  let { fileOpen, isFile, fileInModal } = fileExtensions(file);

  let newFileName = "";
  let fileSize = "";
  if (!file?.preview) {
    let fileFullName = file?.toString().split("/")?.reverse()[0];
    newFileName = fileFullName?.toString().split("--")?.reverse()[0] || "";
    fileSize = fileFullName?.toString().split("--")[0] || "";
  } else {
    newFileName = file?.name;
    fileSize = file?.formatedFileSize;
  }

  let fileType = file?.file?.type;

  return (
    <>
      {cropActive && (
        <MaterialModal
          openModal={cropActive}
          setOpenModal={setCropActive}
          className="image__cropper-container"
        >
          <ImageCropper file={file} updateFile={updateFile} />
        </MaterialModal>
      )}
      <FileDataModal data={fileInModal} openInNewWindow={openInNewWindow}>
        <div className="upload upload__box">
          <Grid container spacing={0} className="upload__box-wrapper">
            <div className="image__container">
              {/* {fileType === 'application/pdf' ? (
                <PictureAsPdfOutlinedIcon />
              ) : ( */}
              <img
                src={fileOpen ? fileOpen : "/assets/icons/uploaded.svg"}
                width={40}
                height={40}
                alt="upload here"
                className="img-upload-icon"
              />
              {/* )} */}
            </div>

            <Grid item className="progress-holder">
              {!disabled && !!onDelete && (
                <div className="pull-right">
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete();
                    }}
                    size="small"
                  >
                    {/* <DeleteOutlinedIcon /> */}
                    <img src={UploadImage} alt="" />
                  </IconButton>
                </div>
              )}
              <span className="file-name-details">{newFileName}</span>
              <span className="size">{fileSize}</span>
              {file?.progress ? (
                <Grid container spacing={1} justifyContent="center" alignItems="center">
                  <Grid item xs={11}>
                    <LinearProgress
                      variant="determinate"
                      value={file?.progress || 0}
                      color={"primary"}
                      className="progress"
                    />
                  </Grid>
                  <Grid item xs={1}>
                    {/* {progress.toFixed(0)}% */}
                    {file?.progress || ""}
                  </Grid>
                </Grid>
              ) : (
                <></>
              )}
            </Grid>
          </Grid>
          {file?.preview && fileTypes?.[fileType] && (
            // <div
            //   style={{ float: 'right' }}
            //   onClick={(e: any) => {
            //     e.stopPropagation();
            //     setCropActive((prev: any) => !prev);
            //   }}>
            //   {/* {file?.update ? 'Re-crop Image' : 'Crop Image'} */}
            //   <CropIcon />
            // </div>
            <>
              <CommonTooltip title={"Crop Image"} placement="top" style={{ width: "min-content" }}>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    setCropActive((prev: any) => !prev);
                  }}
                  style={{ width: "min-content" }}
                  size="small"
                >
                  {/* <DeleteOutlinedIcon /> */}
                  <CropIcon />
                </IconButton>
              </CommonTooltip>
            </>
          )}
          {isDesignOne && <>Design One</>}
        </div>
      </FileDataModal>
    </>
  );
};

const Index = ({
  setOpenMultiImage,
  openMultiImage,
  getFileData,
  clearData,
  setClearData,
  initialData,
  accept,
  maxFileSize,
  icon = null,
  defaultViewer = true,
  requireDescription = true,
  For = "normal",
  multiple,
  disabled,
  title,
}: IndexProps) => {
  // handling outer file upload
  const [files, setFiles] = useState<file>({ documents: [], title: "" });
  const [showFileData, setShowFileData] = useState("");

  const handleRemoveFile = (index: number) => {
    const updatedFiles = { ...files };
    // currently there is only one element created
    updatedFiles?.documents?.splice(index, 1);
    getFileData(updatedFiles);
    setFiles(updatedFiles);
  };

  useEffect(() => {
    if (clearData) {
      setFiles({ documents: [], title: "" });
      setClearData(false);
    }
  }, [clearData]);

  useEffect(() => {
    if (initialData?.length) {
      setFiles({
        documents: initialData[0]?.documents,
        title: initialData[0]?.title,
        id: initialData[0]?.id,
      });
    }
  }, [initialData]);

  return (
    <>
      <div className="file__uploader-container">
        {!disabled && (
          <Grid>
            {icon !== null ? (
              <div
                onClick={() => {
                  setOpenMultiImage(true);
                }}
                style={{ cursor: "pointer" }}
              >
                {icon}
              </div>
            ) : defaultViewer ? (
              <RenderArea
                accept={accept}
                maxFileSize={maxFileSize}
                onClick={() => {
                  setOpenMultiImage(true);
                }}
              ></RenderArea>
            ) : (
              <></>
            )}
          </Grid>
        )}

        <MultiUpload
          open={openMultiImage}
          onClose={({ reset, closePopup }: any) => {
            if (reset === true) {
              setFiles({ documents: [], title: "" });
              getFileData({ documents: [], title: "" });
            }
            closePopup && setOpenMultiImage(false);
          }}
          onUpload={(files) => {
            setOpenMultiImage(false);
            setFiles((prev) => ({
              ...prev,
              documents: [...files[0]?.documents],
              title: files[0]?.title,
            }));
            getFileData(files);
          }}
          currentFiles={files}
          accept={accept}
          maxFileSize={maxFileSize}
          requireDescription={requireDescription}
          multiple={multiple}
          disabled={disabled}
          title={title}
        />
      </div>
      {!!defaultViewer &&
        files?.documents?.map((doc, index) => (
          <Grid item xs={12} md={12} key={index} className="individual__file-container-box">
            <div style={{ display: "flex", alignItems: "center" }}>
              <IndividualFile
                file={doc}
                openInNewWindow={!openMultiImage}
                onDelete={() => {
                  handleRemoveFile(index);
                }}
                updateFile={(data: any) => {
                  let docs = [...(files?.documents || [])];
                  docs?.splice(index, 1, {
                    ...doc,
                    ...data,
                    base64: data?.base64,
                    preview: data?.preview,
                  });
                  setFiles?.((prev: any) => {
                    return { documents: docs, title: prev?.title || "" };
                  });
                }}
                disabled={disabled}
              ></IndividualFile>
            </div>
          </Grid>
        ))}
    </>
  );
};

export default Index;
