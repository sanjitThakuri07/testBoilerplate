import { faCamera, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box } from "@mui/material";
import DragAndUploadFields from "src/modules/Bookings/components/FormContainer/BookingDynamicForms/DragAndUploadFields";
import React from "react";
import MultiUploader from "../../../../components/MultiFileUploader/index";
import { useReportLayoutDataSets } from "../store/ReportStoreDataSets";

export default function LayoutProfile({
  layoutObj,
  layoutParams,
  previewMode,
  initialState = {},
}: any) {
  // title
  let inspectorName = `{inspector}`;
  // image host
  const IMAGE_HOST = process.env.VITE_HOST_URL;

  const { cover_page, logo } = layoutObj || { cover_page: "", logo: "" };
  const { updateLayoutProperties, getDatasFromTemplates, profileLabelLoading } =
    useReportLayoutDataSets();

  // for profile image
  const [uploadProfileImage, setUploadProfileImage] = React.useState(false);
  const [clearProfile, setClearProfile] = React.useState(false);
  const [profilePreview, setProfilePreview] = React.useState<any>(null);

  // for cover image
  const [uploadCoverImage, setUploadCoverImage] = React.useState(false);
  const [clearCover, setClearCover] = React.useState(false);
  const [coverPreview, setCoverPreview] = React.useState<any>(null);

  return (
    <>
      {/* profile image */}
      <MultiUploader
        setOpenMultiImage={() => {
          // item.isImageOpened = !item.isImageOpened;
          setUploadProfileImage(!uploadProfileImage);
        }}
        openMultiImage={uploadProfileImage}
        getFileData={(files: any) => {
          updateLayoutProperties("logo", files[0]?.documents[0]?.base64);
          setProfilePreview(files);
        }}
        requireDescription={false}
        defaultViewer={false}
        initialData={[]}
        clearData={clearProfile}
        setClearData={setClearProfile}
        accept={{
          "image/jpeg": [".jpeg", ".jpg"],
          "image/png": [".png"],
        }}
        maxFileSize={2}
      />

      {/* cover image */}
      <MultiUploader
        setOpenMultiImage={() => {
          // item.isImageOpened = !item.isImageOpened;
          setUploadCoverImage(!uploadCoverImage);
        }}
        openMultiImage={uploadCoverImage}
        getFileData={(files: any) => {
          updateLayoutProperties("cover_page", files[0]?.documents[0]?.base64);
          setCoverPreview(files);
        }}
        requireDescription={false}
        defaultViewer={false}
        initialData={[]}
        clearData={clearCover}
        setClearData={setClearCover}
        accept={{
          "image/jpeg": [".jpeg", ".jpg"],
          "image/png": [".png"],
        }}
        maxFileSize={2}
      />

      <Box className="layout_profile_container">
        {/* cover image */}
        <Box
          className="upload_layout_cover"
          sx={{
            height: previewMode !== "pdf" ? "250px" : "180px",
          }}
        >
          {cover_page ? (
            <img
              style={{
                height: "100%",
                width: "100%",
                objectFit: "cover",
                overflow: "hidden",
              }}
              className="upload_layout_cover-img"
              src={coverPreview?.[0]?.documents?.[0]?.preview || `${IMAGE_HOST}/` + cover_page}
              alt="cover_page"
            />
          ) : (
            <DragAndUploadFields title="Click to upload files for your layout cover" />
          )}
          {/* cover image */}
          {previewMode !== "pdf" && (
            <Box className="cover_photo" onClick={() => setUploadCoverImage(true)}>
              <FontAwesomeIcon icon={faPenToSquare} />
            </Box>
          )}
        </Box>
        {/* profile image */}
        <Box
          className="layout_profile_image"
          sx={{ bottom: previewMode !== "pdf" ? "-60px" : "-45px" }}
        >
          <Box
            className="profile_inner_container"
            sx={{
              height: previewMode !== "pdf" ? "100px" : "70px",
              width: previewMode !== "pdf" ? "100px" : "70px",
            }}
          >
            <img
              style={{
                height: "100%",
                width: "100%",
                objectFit: "cover",
                overflow: "hidden",
              }}
              src={profilePreview?.[0]?.documents?.[0]?.preview || `${IMAGE_HOST}/` + logo}
              alt="logo"
            />
          </Box>
          {previewMode !== "pdf" && (
            <Box className="profile_photo" onClick={() => setUploadProfileImage(true)}>
              <FontAwesomeIcon icon={faCamera} />
            </Box>
          )}
        </Box>
        {/* layout title */}
        <Box
          className="layout_title_container"
          sx={{
            left: previewMode !== "pdf" ? "8.7rem" : "7.1rem",
            bottom: previewMode !== "pdf" ? "-2.6rem" : "-2.2rem",
          }}
        >
          <Box
            sx={{
              fontWeight: 500,
              fontSize: previewMode !== "pdf" ? "22px" : "19px",
            }}
          >
            {initialState?.template
              ? `${initialState?.template} :${initialState?.inspected_by}`
              : layoutParams
              ? `${getDatasFromTemplates?.profileLabel}`
              : "Untitled Layout"}
          </Box>
        </Box>
      </Box>
    </>
  );
}
