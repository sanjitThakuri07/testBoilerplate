import { Box, Typography } from "@mui/material";
import React, { useState, useCallback, useEffect } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import "./uploader.scss";

interface Accept {
  [key: string]: string[];
}

type Props = {
  title?: string;
  accept: Accept;
  onFileDrop(files: File[]): void;
  disabled?: boolean;
  multiple?: boolean;
  maxSize?: number; // in MB (1MB = 1048576 bytes)
  error?: string;
  required?: boolean;
  type: "csv" | "image";
  alternativeHeadiing?: boolean;
};

const Dropzone: React.FC<Props> = ({
  title,
  accept,
  onFileDrop,
  disabled = false,
  multiple = false,
  maxSize = 10,
  error = "",
  required = false,
  type = "image",
  alternativeHeadiing = false,
}) => {
  const [rejected, setRejected] = useState(false);
  const [passedError, setPassedError] = useState<string>(error || "");
  const [rejectMessages, setRejectMessages] = useState<string[]>([]);

  useEffect(() => {
    setPassedError(error);
  }, [error]);

  const validateFileSize = (acceptedFiles: File[]): Promise<string[]> => {
    const messages: string[] = [];

    if (type === "csv") return new Promise((r) => r(messages));

    return new Promise((res, rej) => {
      acceptedFiles.forEach((file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = (theFile) => {
          var image = new Image();
          image.src = theFile?.target?.result as any;

          image.onload = () => {
            const { width, height } = image;

            if (height > 500 || width > 500) {
              messages.push("Incorrect image dimension");
              res(messages);
              return;
            }
            res([]);
          };
        };
      });
    });
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      setRejected(false);
      setRejectMessages([]);
      if (rejectedFiles && rejectedFiles.length > 0) {
        setRejected(true);
        setPassedError("");
        rejectedFiles.forEach((rejectedFile) => {
          setRejectMessages((prevErrors) => [
            ...prevErrors,
            ...rejectedFile.errors.map((error: any) => {
              if (error.code === "file-too-large") {
                return `File Size Larger ${maxSize}MB`;
              }

              if (error.code === "file-invalid-type") {
                return `Only ${Object.values(accept).join("").replaceAll(".", " ")} allowed`;
              }

              return error.message;
            }),
          ]);
        });
      }

      const checkImageSize = await validateFileSize(acceptedFiles);

      if (checkImageSize.length > 0 && type !== "csv") {
        setRejectMessages([...rejectMessages, ...checkImageSize]);
        setRejected(true);
      } else {
        if (acceptedFiles && acceptedFiles.length > 0) onFileDrop(acceptedFiles);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onFileDrop, maxSize],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept ? accept : {},
    maxSize: maxSize * 1048576,
  });

  const renderError = () => {
    if (passedError) return passedError;

    const errorSet: any = new Set([...rejectMessages]);
    return [...errorSet].join();
  };

  const renderRejection = () => (
    // <ErrorMsg message={renderError()} icon="wtc-warning" />
    <p style={{ color: "red" }}>{renderError()}</p>
  );

  const renderArea = (
    <Box className="text-center" id="hell">
      <img
        id="upload_csv_icon"
        src="src/assets/icons/upload.svg"
        width={40}
        height={40}
        alt="upload here"
      />
      {alternativeHeadiing ? (
        <Typography variant="body1" component="p">
          Add an Image
        </Typography>
      ) : (
        <Typography variant="body1" component="p">
          <strong className="info-title">Click to upload</strong> or drag and drop <br />
          <small className="info">
            {type === "csv" ? "CSV (max. 2 MB)" : "SVG, PNG or JPG. (max. 400x400px)"}
          </small>
        </Typography>
      )}
    </Box>
  );

  return (
    <>
      <div className="error-block">
        <Typography component="h6" variant="h6">
          {title} {required && <span className="text-danger">*</span>}
        </Typography>
        {(rejected || error) && renderRejection()}
      </div>
      <div
        className={`drop-input ${disabled ? "dimmed" : ""} ${isDragActive ? "drag-active" : ""}
        `}
        {...getRootProps()}
      >
        <input {...getInputProps()} multiple={multiple} disabled={disabled} />
        {renderArea}
      </div>
      {/* <span className="font-size-12 color-nobel">
        Maximum upload file size is {maxSize}MB.
      </span> */}
    </>
  );
};

export default Dropzone;
