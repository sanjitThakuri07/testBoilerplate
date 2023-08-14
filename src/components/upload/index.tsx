import { FormControl } from '@mui/material';
// import { Image } from 'interfaces/fileResource';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Dropzone from './Dropzone';
import UploadingImage from './UploadingImage';

// import { Image } from '../../../types/global';

export type UploadStatus = 'pending' | 'uploading' | 'success' | 'error' | 'cancel';

export interface SelectedImage {
  file: File;
  fileUrl?: string;
  uploadStatus: UploadStatus;
}

interface Props {
  onUpload(image: File): void;
  maxCount: number;
  allowMultiple?: boolean;
  disabled?: boolean;
  setBtnStatus?: Function;
  type?: 'csv' | 'image';
  alternativeHeading?: boolean;
}

const FileUploader: React.FC<Props> = ({
  onUpload,
  maxCount,
  allowMultiple = false,
  disabled = false,
  alternativeHeading = false,
  type = 'image',
}) => {
  const [images, setImages] = useState<SelectedImage[]>([]);
  const [apiMessage, setApiMessage] = useState<string | null>(null);

  const onDrop = (droppedImages: File[]) => {
    if (images.length >= maxCount) return;
    droppedImages.forEach((image) => {
      setImages((existingImage: SelectedImage[]) => [
        ...existingImage,
        { file: image, uploadStatus: 'pending' },
      ]);
    });
  };

  const changeStatus = (imageIndex: number, status: UploadStatus, message?: string) => {
    setImages((images) => {
      images[imageIndex] = {
        ...images[imageIndex],
        uploadStatus: status,
      };
      return [...images];
    });
    //setBtnStatus(status);
    if (message) {
      setApiMessage(message);
    }
  };

  const onUploadSuccess = (image: File) => {
    onUpload(image);
  };

  const onCancel = () => {
    setImages([]);
  };
  const shouldDisable = disabled || images.length >= maxCount;

  useEffect(() => {
    return () => {
      setImages([]);
    };
  }, []);

  //   images && images.length > 0 && (
  //     <img src={URL.createObjectURL(images[0].file)} />
  //   )
  return (
    <FormControl
      className={`${images && images.length ? 'image-dropped' : ''}`}
      style={{
        width: '100%',
      }}>
      {/* {apiMessage && <ErrorMsg message={apiMessage} icon="wtc-warning" />} */}
      <div className="drag-drop">
        {images.length ? (
          <UploadingImage
            key={uuidv4()}
            image={images[0]}
            index={0}
            changeStatus={changeStatus}
            onUploadSuccess={onUploadSuccess}
            onCancel={onCancel}
            disabled={disabled}
          />
        ) : (
          <Dropzone
            multiple={allowMultiple}
            onFileDrop={onDrop}
            disabled={shouldDisable}
            alternativeHeadiing={alternativeHeading}
            type={type}
            // accept = ""
            accept={
              type === 'csv'
                ? { 'text/csv': ['.csv'] }
                : { 'image/*': ['.png', '.jpeg', '.svg', '.jpg'] }
            }
          />
        )}
      </div>
    </FormControl>
  );
};

export default FileUploader;
