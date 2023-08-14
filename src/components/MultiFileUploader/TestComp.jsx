import React, { useState } from 'react';
import Dropzone from 'react-dropzone';
import './multiFileUploader.scss';

const FileUploader = () => {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleDrop = (acceptedFiles) => {
    setFile(acceptedFiles[0]);
    setProgress(0); // reset progress to 0 when a new file is selected

    const fileSize = acceptedFiles[0].size;
    const chunkSize = Math.max(1024 * 1024, fileSize / 100);
    let start = 0;

    const sendChunks = () => {
      const end = Math.min(start + chunkSize, fileSize);
      const chunk = acceptedFiles[0].slice(start, end);

      setProgress(Math.round((end / fileSize) * 100));

      if (end === fileSize) {
        console.log('File uploaded successfully');
        return;
      }

      setTimeout(() => {
        start += chunkSize;
        sendChunks();
      }, 1000);
    };

    sendChunks();
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) {
      return bytes + ' bytes';
    } else if (bytes < 1024 * 1024) {
      return Math.round(bytes / 1024) + ' KB';
    } else {
      return Math.round(bytes / (1024 * 1024)) + ' MB';
    }
  };

  const progressBarStyle = {
    width: `${progress}%`,
  };

  const progressNumberStyle = {
    width: `${progress}%`,
    animation: `animate-progress-number ${progress / 50}s ease-in-out forwards`,
  };

  return (
    <Dropzone onDrop={handleDrop}>
      {({ getRootProps, getInputProps }) => (
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          <p>Drag and drop your file here, or click to select a file</p>
          {file && (
            <div>
              <p>File name: {file.name}</p>
              <p>File size: {formatFileSize(file.size)}</p>
              <div className="progress-bar">
                <div className="progress-bar-fill" style={progressBarStyle}>
                  <span className="progress-number" style={progressNumberStyle}>
                    {progress}%
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </Dropzone>
  );
};

export default FileUploader;

// export default FileUpload;
