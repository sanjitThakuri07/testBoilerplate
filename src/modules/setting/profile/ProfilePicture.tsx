import FileUploader from "src/components/upload";
import { Avatar, Button, Grid, InputLabel, Menu, MenuItem, Typography } from "@mui/material";
import React, { useState } from "react";
import { FC } from "react";
import { useEffect } from "react";
import { HOST_URL } from "src/lib/axios";
import CustomDialog from "src/components/dialog";
import { ReactNode } from "react";

interface IProps {
  profilePicture?: string;
  isViewOnly: boolean;
  profilePhotoHeading?: string;
  profilePhotoSubHeading?: string;
  handleUploadImage?: (image: File) => Promise<void>;
  loading?: boolean;
}

type IImageProps = "fill" | "contain" | "cover" | "none" | "scale-down";

const ProfilePicture: FC<IProps> = ({
  profilePhotoHeading,
  profilePhotoSubHeading,
  profilePicture,
  isViewOnly,
  handleUploadImage,
  loading,
}) => {
  const [showUploader, setShowUploader] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  // const [imageFit, setImageFit] = useState<IImageProps>('fill');
  const dropOpen = Boolean(anchorEl);
  const handleDropClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleDropClose = () => {
    setAnchorEl(null);
  };
  const imageFit: IImageProps = "fill";
  const handleImageUploaderVisibility = () => {
    if (isViewOnly) return;
    setShowUploader(!showUploader);
  };

  const handleImagePreview = () => {
    setPreviewImage(!previewImage);
  };

  const handleOnImageUpload = async (image: File) => {
    handleUploadImage && (await handleUploadImage(image));
    setShowUploader(false);
  };

  useEffect(() => {
    if (isViewOnly) setShowUploader(false);
  }, [isViewOnly]);

  const actionsButtons: ReactNode = (
    <Grid container spacing={2} className="action-button-holder">
      {/* <Grid item xs={6}>
        <Button variant="outlined" fullWidth onClick={handleImagePreview}>
          Remove
        </Button>
      </Grid>
      <Grid item xs={6}>
        <Button variant="contained" fullWidth>
          Update
        </Button>
      </Grid> */}
    </Grid>
  );

  return (
    <React.Fragment>
      <CustomDialog
        handleClose={handleImagePreview}
        open={previewImage}
        title="Profile Picture"
        subtitle="Ideal image should be 500 x 500 pxs (approx. 300 kb)."
        actions={actionsButtons}
        wrapperClass="dialog-image-edit"
      >
        <div className="upload-image-edit-area">
          <div className="image-edit-options">
            {/* <Button
              id="basic-button"
              aria-controls={dropOpen ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={dropOpen ? 'true' : undefined}
              onClick={handleDropClick}
              endIcon={<img src="/assets/icons/dots-vertical.svg" width={18} height={20} alt="" />}>
              Edit
            </Button> */}
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={dropOpen}
              onClose={handleDropClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <MenuItem onClick={handleDropClose}>Fill</MenuItem>
              <MenuItem onClick={handleDropClose}>Cover</MenuItem>
            </Menu>
          </div>
          <img
            style={{
              objectFit: imageFit,
            }}
            src={
              profilePicture?.includes("data") ? profilePicture : `${HOST_URL}/${profilePicture}`
            }
            alt=""
          />
        </div>
      </CustomDialog>
      <Grid container spacing={4} className="formGroupItem">
        {(profilePhotoHeading || profilePhotoHeading) && (
          <Grid item xs={4}>
            <InputLabel htmlFor="profilePhoto">
              <div className="label-heading">{profilePhotoHeading}</div>
              <Typography variant="body1" component="p">
                {profilePhotoSubHeading}
              </Typography>
            </InputLabel>
          </Grid>
        )}
        <Grid item xs={7}>
          {!showUploader ? (
            <Grid container spacing={2} className="image-preview" alignItems="center">
              <Grid item>
                <Avatar alt="Upload image" sx={{ width: 64, height: 64, background: "#D0D5DD" }}>
                  {profilePicture ? (
                    <img
                      src={
                        profilePicture.includes("data")
                          ? profilePicture
                          : `${HOST_URL}/${profilePicture}`
                      }
                      alt=""
                      data-testid="profile-image"
                      className="img-profile"
                      style={{
                        objectFit: imageFit,
                      }}
                    />
                  ) : (
                    <img src="/assets/icons/image.svg" width={24} height={24} alt="" />
                  )}
                </Avatar>
              </Grid>
              <Grid item>
                <Button
                  disabled={isViewOnly}
                  startIcon={<img src="/assets/icons/share.svg" width={20} height={20} alt="" />}
                  onClick={handleImageUploaderVisibility}
                >
                  Update Photo
                </Button>
              </Grid>
              <Grid item>
                <Button
                  disabled={loading}
                  onClick={handleImagePreview}
                  startIcon={<img src="/assets/icons/eye.svg" width={20} height={20} alt="" />}
                >
                  View Photo
                </Button>
              </Grid>
            </Grid>
          ) : (
            <FileUploader
              onUpload={typeof handleUploadImage === "function" ? handleOnImageUpload : () => {}}
              maxCount={1}
              allowMultiple={false}
              disabled={false}
            />
          )}
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default ProfilePicture;
