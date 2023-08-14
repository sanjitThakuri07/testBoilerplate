import FileUploader from "src/components/upload";
import {
  Box,
  Divider,
  FormGroup,
  FormHelperText,
  Grid,
  Input,
  OutlinedInput,
  Typography,
} from "@mui/material";
import React, { ChangeEvent, useEffect, useState } from "react";
import "./TemplateHeading.scss";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import { FormikProps } from "formik";
import { TemplateCreationFields } from "interfaces/templates/templateFields";
import { useTemplateFieldsStore } from "containers/template/store/templateFieldsStore";
import MultiUploader from "src/components/MultiFileUploader/index";
import BASTooltip from "src/components/BASTooltip/BASTooltip";
import { loggedUserDataStore } from "globalStates/loggedUserData";
import { useParams } from "react-router-dom";
import BASLogo from "assets/icons/logo.png";

interface TemplateHeadingProps {
  formikBag: any;
  isViewOnly?: boolean;
  isTab?: boolean;
  handleUploadImage?: (image: File) => Promise<void>;
  loading?: boolean;
}

const TemplateHeading = ({ formikBag, isViewOnly, isTab = false }: TemplateHeadingProps) => {
  const { templateHeading, setTemplateHeading } = useTemplateFieldsStore();
  const [isNameFocused, setIsNamedFocused] = React.useState(false);
  const [OpenImageUPloadModal, setOpenImageUploadModal] = useState<boolean>(false);
  const [clearData, setClearData] = React.useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState("");
  const [formValues, setFormValues] = useState({ name: "", description: "" });
  const param = useParams();

  const { logo } = loggedUserDataStore();
  const logoPic = logo ? `${process.env.VITE_HOST_URL}/${logo}` : BASLogo;

  const renderIcon = () => {
    return (
      <div className={` template-image-upload-container`}>
        <Box>
          {/* {imagePreview || formikBag?.values?.headingBar?.headerImagePreview ? (
            <>
              <img
                src={isTab ? formikBag?.values?.headingBar?.headerImagePreview : imagePreview}
                style={{ overflow: 'hidden', height: '100%', width: '100%' }}
                alt="img"
              />
              <div className="hidden-edit-profile-template">
                <DriveFileRenameOutlineIcon className="inner-pen" />
              </div>
            </>
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
              }}>
              <img
                id="upload_csv_icon"
                // src="/assets/icons/upload.svg"
                style={{ overflow: 'hidden', height: '100%', width: '100%' }}
                src={
                  templateHeading.headerImage
                    ? `${process.env.VITE_HOST_URL}/${templateHeading.headerImage}`
                    : '/assets/icons/upload.svg'
                }
                alt="upload here"
              />
              <Typography variant="body1" component="p" sx={{ mt: 0.5 }}>
                Add an Image
              </Typography>
            </div>
          )} */}
          <img
            src={`${process.env.VITE_HOST_URL}/${logo}`}
            style={{ overflow: "hidden", height: "100%", width: "100%" }}
            alt="img"
          />
        </Box>
      </div>
    );
  };

  return (
    <div>
      <div id="TemplateHeading">
        <div className="TemplateHeading_wrapper">
          <div
            style={{
              display: "flex",
              gap: "1rem",
              padding: "0.5rem 0",
            }}
          >
            <div className="upload-main-container">
              {/* <MultiUploader
                setOpenMultiImage={setOpenImageUploadModal}
                openMultiImage={OpenImageUPloadModal}
                getFileData={(files: [{ documents: any[]; title: string }]) => {
                  if (isTab) {
                    formikBag.setFieldValue(
                      'headingBar.headerImage',
                      files[0]?.documents?.[0]?.base64,
                    );
                    formikBag.setFieldValue(
                      'headingBar.headerImagePreview',
                      files[0]?.documents[0]?.preview,
                    );
                  } else {
                    setTemplateHeading('headerImage', files[0]?.documents?.[0]?.base64);
                    setImagePreview(files[0]?.documents[0]?.preview);
                  }
                }}
                icon={renderIcon()}
                requireDescription={false}
                defaultViewer={false}
                initialData={[]}
                clearData={clearData}
                setClearData={setClearData}
                accept={{
                  'image/jpeg': ['.jpeg', '.jpg'],
                  'image/png': ['.png'],
                  'application/pdf': ['.pdf'],
                }}
                maxFileSize={2}
              /> */}
              <img
                src={logoPic}
                style={{ overflow: "hidden", height: "100%", width: "100%", objectFit: "contain" }}
                alt="img"
              />
            </div>

            <div style={{ width: "75%" }}>
              <div>
                <Input
                  sx={{
                    border: "none",
                    borderBottom: "1px solid #b4b4b4",
                    borderRadius: "0",
                    background: "transparent",
                    fontSize: "16px",
                    width: "100%",
                    fontWeight: "600",
                  }}
                  // isTab ? formikBag?.values?.headingBar?.name : templateHeading['templateTitle']
                  value={formValues?.name || templateHeading?.templateTitle || ""}
                  type="text"
                  placeholder={formikBag?.initialValues?.headingBar?.name || "Untitled Form"}
                  fullWidth
                  name="templateTitle"
                  required={true}
                  style={{
                    outline:
                      formikBag?.touched?.name && formikBag?.errors?.name ? "1px solid red" : "",
                  }}
                  onChange={(event) => {
                    setFormValues?.((prev: any) => ({ ...prev, name: event?.target?.value }));
                  }}
                  onBlur={(event) => {
                    if (isTab) {
                      formikBag?.setFieldValue("headingBar.name", event.target.value);
                    } else {
                      formikBag?.setFieldValue("name", event.target.value);
                      setTemplateHeading("templateTitle", event.target.value);
                    }
                    setIsNamedFocused(false);
                  }}
                  // error={Boolean(touched.name && errors.name)}
                  disabled={isViewOnly}
                />
                {Boolean(formikBag?.touched.name && formikBag?.errors.name) && (
                  <FormHelperText error>{formikBag?.errors?.name}</FormHelperText>
                )}
              </div>

              <div>
                <Input
                  sx={{
                    border: "none",
                    borderBottom: "1px solid #b4b4b4",
                    borderRadius: "0",
                    background: "transparent",
                    fontSize: "14px",
                    marginTop: "5px",
                  }}
                  value={formValues?.description || templateHeading?.templateDescription || ""}
                  type="text"
                  placeholder={"Form description (Optional)"}
                  fullWidth
                  name="templateDescription"
                  onChange={(event) => {
                    setFormValues?.((prev: any) => ({
                      ...prev,
                      description: event?.target?.value,
                    }));
                  }}
                  onBlur={(event) => {
                    formikBag?.setFieldValue("desc", event.target.value);
                    isTab
                      ? formikBag?.setFieldValue("desc", event.target.value)
                      : setTemplateHeading("templateDescription", event.target.value);
                  }}
                  disabled={isViewOnly || isTab}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <Divider sx={{ marginTop: '20px' }} /> */}
    </div>
  );
};

export default TemplateHeading;
