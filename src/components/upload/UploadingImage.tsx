import React, { useEffect, useCallback } from 'react';
import axios from 'axios';

import { UploadStatus, SelectedImage } from './index';
// import { Image } from 'interfaces/fileResource'
import { Grid, IconButton, LinearProgress } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ErrorIcon from '@mui/icons-material/Error';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { fileExtensions } from 'utils/fileExtensionChecker';

interface Props {
  image: SelectedImage;
  index: number;
  changeStatus(imageIndex: number, status: UploadStatus, message?: string | null): void;
  onUploadSuccess(image: File): void;
  disabled: boolean;
  onCancel(): void;
}
const CancelToken = axios.CancelToken;
let source = CancelToken.source();

const regenerateCancelToken = (): void => {
  source = CancelToken.source();
};

const faker = async (): Promise<{
  data: any;
  error?: any;
  message?: any;
}> => {
  return new Promise((res, rej) => {
    setTimeout(() => {
      res({ data: [] });
    }, 500);
  });
};

const convertFileSizes = (bytes: number, decimals = 2) => {
  if (!+bytes) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};
const UploadingImage: React.FC<Props> = ({
  image,
  index,
  changeStatus,
  onUploadSuccess,
  disabled,
  onCancel,
}) => {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    if (progress >= 99) return;
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (uploadStatus === 'pending' || uploadStatus === 'uploading') {
          const diff = Math.random() * 10;
          return Math.min(oldProgress + diff, 100);
        }
        return 100;
      });
    }, 500);

    return () => {
      clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { file, uploadStatus }: any = image;

  let { fileOpen, isFile, fileInModal } = fileExtensions(file);
  console.log({ fileOpen, file, uploadStatus }, 'file open extensito');

  const upload = useCallback(async () => {
    if (uploadStatus !== 'pending' || disabled) return;
    changeStatus(index, 'uploading');
    const token = source.token;

    // const { data, error, message } = await postAPI(
    //   file as File,
    //   token
    // );

    const { data, error, message } = await faker();

    if (error) {
      changeStatus(index, 'error', message);
    }

    if (data) {
      changeStatus(index, 'success');
      // onUploadSuccess(data)

      onUploadSuccess(image.file);
    }
    if (token.reason) {
      changeStatus(index, 'cancel');
      regenerateCancelToken();
      onCancel();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, disabled, file, uploadStatus, changeStatus, onUploadSuccess]);

  useEffect(() => {
    upload();
  }, [upload]);

  const cancelUpload = (): void => {
    source.cancel('Request cancelled by user');
  };
  let fileType = file?.file?.type;

  const progressVariant =
    image.uploadStatus === 'error'
      ? 'danger'
      : image.uploadStatus === 'success'
      ? 'success'
      : 'info';
  return (
    <>
      <div className="upload">
        {/* <span className="font-size-14 mb-2">{`${
          image.uploadStatus === 'uploading' ? 'uploadingPhoto' : ''
        }${
          image.uploadStatus === 'success' ? 'uploaded' : ''
        }`}</span> */}
        {/* <ProgressBar
          animated={image.uploadStatus === 'uploading'}
          variant={progressVariant}
          striped
          className="progress-bar--sm"
          now={100}
        /> */}
        <Grid container spacing={0}>
          <Grid item xs={2}>
            <img
              // src="/assets/icons/uploaded.svg"
              src={fileOpen ? fileOpen : '/assets/icons/uploaded.svg'}
              // src={
              //   fileType === 'text/csv'
              //     ? '/assets/icons/uploaded.svg'
              //     : '/assets/icons/uploaded.svg'
              // }
              width={40}
              height={40}
              alt="upload here"
              className="img-upload-icon"
            />
          </Grid>
          <Grid item xs={10} className="progress-holder">
            <div className="pull-right">
              {image.uploadStatus === 'uploading' && (
                <>
                  <IconButton onClick={() => cancelUpload()}>
                    <DeleteOutlineIcon />
                  </IconButton>

                  <IconButton onClick={() => cancelUpload()}>
                    <CancelIcon />
                  </IconButton>
                </>
              )}
              {image.uploadStatus === 'success' && (
                <>
                  <IconButton onClick={() => onCancel()}>
                    <DeleteOutlineIcon />
                  </IconButton>

                  <IconButton>
                    <CheckCircleIcon />{' '}
                  </IconButton>
                </>
              )}
              {image.uploadStatus === 'error' && (
                <IconButton>
                  <ErrorIcon />{' '}
                </IconButton>
              )}
            </div>
            <span className="file-name-details">{file.name}</span>
            <span className="size">{convertFileSizes(file.size)}</span>
            <Grid container spacing={1} justifyContent="center" alignItems="center">
              <Grid item xs={11}>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  color={progressVariant as any}
                  className="progress"
                />
              </Grid>
              <Grid item xs={1}>
                {progress.toFixed(0)}%
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default React.memo(UploadingImage);
