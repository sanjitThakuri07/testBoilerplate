import React, { useState } from "react";
import { Button, Grid, TextField, Typography } from "@mui/material";
import MultiUploader from "src/components/MultiFileUploader/index";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { postAPI } from "src/lib/axios";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";

const ImageUploader = ({ item, onChangeNotes, handleFormikFields }: any) => {
  const [openMultiImage, setOpenMultiImage] = useState(false);
  const [clearData, setClearData] = React.useState(false);

  return (
    <Grid container spacing={2} justifyContent="center" alignItems="center">
      <MultiUploader
        setOpenMultiImage={setOpenMultiImage}
        openMultiImage={openMultiImage}
        initialData={handleFormikFields?.values?.[`${item?.component}__${item.id}`]?.media || []}
        For={"Objects"}
        clearData={clearData}
        setClearData={setClearData}
        maxFileSize={2}
        requireDescription={false}
        accept={{
          "image/jpeg": [".jpeg", ".jpg"],
          "image/png": [".png"],
          "application/pdf": [".pdf"],
        }}
        icon={
          <div className="attach__files-icon">
            <Button variant="contained" component="span" fullWidth startIcon={<InsertPhotoIcon />}>
              Add Media
            </Button>
          </div>
        }
        getFileData={async (files: any = []) => {
          const formData = new FormData();
          formData.append("id", item.id);

          let Files = files[0]?.documents?.map((doc: any, index: number) => {
            formData.append(`files`, doc?.file);
          });
          const { data } = await postAPI("/templates/upload-media/", formData);
          if (data) {
            handleFormikFields?.setFieldValue(`${item?.component}__${item.id}.value`, data?.media);
          } else {
            handleFormikFields?.setFieldValue(`${item?.component}__${item.id}.value`, []);
          }
        }}
      />
    </Grid>
  );
};

export default ImageUploader;
