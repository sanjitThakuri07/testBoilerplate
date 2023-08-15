import React, { useEffect, useState } from "react";
import AnnotationIcon from "assets/template/icons/annotation.png";
import { textFieldStyle } from "../ChooseResponseType/ChooseResponseType";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Stack } from "@mui/material";
import AddImgIcon from "assets/template/icons/add_image.svg";
import MultiUploader from "src/components/MultiFileUploader/index";
import TemplateImageContainer from "../TemplateImageContainer/TemplateImageContainer";
import { useTemplateFieldsStore } from "src/modules/template/store/templateFieldsStore";

export default function Annotation({ dataItem }: any) {
  const [open, setOpen] = React.useState(false);
  const [OpenImageUPloadModal, setOpenImageUploadModal] = useState(false);
  const [clearData, setClearData] = React.useState<boolean>(false);
  const { updateTemplateDatasets } = useTemplateFieldsStore();
  const [imageLabel, setImageLabel] = useState("");

  const onClick = () => {
    setOpen(!open);
    // setSelectedInputId(responseTypeId);
    return;
  };

  // const annotationImageUpload = (imgFile: any) => {
  //   updateTemplateDatasets(dataItem, "annotationImg", imgFile);
  // };

  useEffect(() => {
    // updating the image label
    // updateTemplateDatasets(dataItem, 'annotationLabel', imageLabel);
  }, [imageLabel]);

  return (
    <>
      <MultiUploader
        setOpenMultiImage={() => {
          setOpenImageUploadModal(!OpenImageUPloadModal);
        }}
        openMultiImage={OpenImageUPloadModal}
        getFileData={(files: [{ documents: any[]; title: string }]) => {
          // annotationImageUpload(files);
          // updateTemplateDatasets(dataItem, 'annotationImg', files);
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
      <Stack direction="row" spacing={2} alignItems="center" sx={{ width: "100%" }}>
        <div style={{ width: "100%" }}>
          <div
            className={`fake_custom_select_field_wrapper `}
            onClick={onClick}
            style={textFieldStyle}
          >
            <div className="fake_custom_select_field_input_type">
              <div className="select_icon_styling">
                <img src={AnnotationIcon} alt="Temperature" />
              </div>
              <div className="inner_field_component_styling_in_template">Annotation</div>
            </div>
            <div className="fake_custom_select_field_input_type_icon">
              <KeyboardArrowUpIcon className="select_item_icon" />
            </div>
          </div>
        </div>

        <div
          onClick={() => setOpenImageUploadModal(true)}
          style={{
            width: "30%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "10px",
            background: "#283352",
            borderRadius: "8px",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          <img src={AddImgIcon} alt="add" />
          <div
            style={{ marginLeft: "10px" }}
            onClick={dataItem?.annotationImg && (() => setOpenImageUploadModal(true))}
          >
            {dataItem?.annotationImg ? "Replace Image" : "Add Image"}
          </div>
        </div>
      </Stack>
      {Boolean(dataItem?.annotationImg) && (
        <TemplateImageContainer
          imgPreview={dataItem?.annotationImg?.[0]?.documents?.[0]?.preview}
          imageLabel={imageLabel}
          setImageLabel={setImageLabel}
          replaceImageHandler={() => {
            setOpenImageUploadModal(!OpenImageUPloadModal);
          }}
          removeImageHandler={() => {
            // setImgContainer(null);
            dataItem.annotationImg = null;
            setClearData(true);
          }}
          dataItem={dataItem}
          editorKey="annotationDesc"
        />
      )}
    </>
  );
}
