import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import MultiUploader from "src/components/MultiFileUploader/index";
import { useTemplateFieldsStore } from "containers/template/store/templateFieldsStore";

export default function MobileAnnotation({ dataItem }: any) {
  const [OpenImageUPloadModal, setOpenImageUploadModal] = useState(false);
  const [clearData, setClearData] = React.useState<boolean>(false);
  const { updateTemplateDatasets } = useTemplateFieldsStore();
  return (
    <>
      <MultiUploader
        setOpenMultiImage={() => {
          setOpenImageUploadModal(!OpenImageUPloadModal);
        }}
        openMultiImage={OpenImageUPloadModal}
        getFileData={(files: [{ documents: any[]; title: string }]) => {
          // annotationImageUpload(files);
          updateTemplateDatasets(dataItem, "value", files);
        }}
        requireDescription={false}
        defaultViewer={false}
        initialData={[]}
        clearData={clearData}
        setClearData={setClearData}
        accept={{
          "image/jpeg": [".jpeg", ".jpg"],
          "image/png": [".png"],
          "application/pdf": [".pdf"],
        }}
        maxFileSize={2}
      />
      <div id="MobileLocation">
        <Box mt={1}>
          <Button
            fullWidth
            sx={{ py: 1.5 }}
            variant="contained"
            onClick={() => setOpenImageUploadModal(true)}
          >
            Annotate
          </Button>
        </Box>

        {/* dynamic image preview */}
        <Box>
          <img
            style={{
              height: "120px",
              marginTop: "10px",
              borderRadius: "10px",
              width: "100%",
              objectFit: "cover",
            }}
            src={dataItem?.value?.[0]?.documents?.[0]?.preview}
            alt="annotation"
          />
        </Box>
      </div>
    </>
  );
}
