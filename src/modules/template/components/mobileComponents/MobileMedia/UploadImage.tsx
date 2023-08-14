import React, { useState } from 'react';
import { Button, Grid, TextField, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';

const Input = styled('input')({
  display: 'none',
});

const UploadImage = ({ handleImage }: any) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length) {
      const selectedFile = event.target.files[0];
      const objectUrl = URL.createObjectURL(selectedFile);
      setFile(selectedFile);
      setImagePreview(objectUrl);
    }
  };

  const handleFileUpload = () => {
    handleImage(imagePreview, file);
  };

  return (
    <Grid container spacing={2} justifyContent="center" alignItems="center">
      <Grid item xs={12}>
        <label htmlFor="file-input">
          <Input id="file-input" type="file" onChange={handleFileInputChange} />

          <Button variant="contained" component="span" fullWidth startIcon={<InsertPhotoIcon />}>
            Add Media
          </Button>
        </label>
      </Grid>

      {imagePreview && (
        <Grid item xs={12}>
          <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%' }} />
        </Grid>
      )}

      {imagePreview !== null && (
        <Grid item xs={12}>
          <Button
            variant="outlined"
            fullWidth
            color="primary"
            disabled={!file}
            onClick={handleFileUpload}>
            Upload
          </Button>
        </Grid>
      )}
    </Grid>
  );
};

export default UploadImage;
