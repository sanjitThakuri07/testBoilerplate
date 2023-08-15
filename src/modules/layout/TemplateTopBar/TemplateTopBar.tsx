import React, { useEffect, useRef, useState } from "react";
import { Alert, Box, Button, CircularProgress, Grid, Snackbar, Stack } from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
// import Logo from "src/assets/images/logo.svg";
// import "./TemplateTopBar.scss";
import PublishIcon from "src/assets/icons/publish_icon.svg";

import { useTemplateStore } from "src/modules/template/store/templateStore";
import { userDataStore } from "src/store/zustand/globalStates/userData";
import { useReportRequestStore } from "src/modules/template/ReportLayout/store/ReportRequestStore";
import { useReportLayoutDataSets } from "src/modules/template/ReportLayout/store/ReportStoreDataSets";
import { useSnackbar } from "notistack";
import { loggedUserDataStore } from "src/store/zustand/globalStates/loggedUserData";
import ConfirmationModal from "src/components/ConfirmationModal/ConfirmationModal";
import BASLogo from "src/assets/icons/logo.png";

interface ReactNodeProps {
  hasLogo?: boolean;
  publicPage?: boolean;
  urls: any;
}

export default function TemplateTopBar({
  // collapsed,
  hasLogo = false,
  publicPage = false,
  urls,
}: ReactNodeProps) {
  const [isBackModal, setIsBackModal] = React.useState(false);
  const removeAccessViewModal = [
    "/bookings/all-bookings/view",
    "/quotations/all-quotations/view",
    "/bookings/all-booking-templates/view",
    "/quotations/all-quotation-templates/view",
    "/quotations/all-converted-quotes/view",
    "/bookings/all-booking-templates/preview",
    "/quotations/all-quotation-templates/preview",
  ];
  // getting the layout id
  const layoutSearchParams = new URLSearchParams(document?.location?.search).get("id");

  const { layoutObj } = useReportLayoutDataSets();

  const updateTemplateLayoutValue = useReportRequestStore(
    (state: any) => state?.updateTemplateLayout,
  );

  const layoutButtonLoader = useReportRequestStore((state: any) => state?.isLayoutLoading);

  const { buttonReference } = userDataStore();

  const template = useTemplateStore((state: any) => state?.template);

  const navigate = useNavigate();
  const location = useLocation();

  const { enqueueSnackbar } = useSnackbar();
  const { logo } = loggedUserDataStore();
  const logoPic = logo ? `${process.env.VITE_HOST_URL}/${logo}` : BASLogo;

  if (publicPage)
    return (
      <Grid
        container
        className="template-top-bar"
        justifyContent={hasLogo ? "space-between" : "flex-end"}
        spacing={0}
      >
        {hasLogo && (
          <Grid item alignItems="center" display="flex" xs={2} pl={1}>
            <img src={logoPic} alt="logo" />
          </Grid>
        )}
      </Grid>
    );
  const { userType } = userDataStore();
  const homepageRedirect = () => {
    if (userType === "Organization") {
      navigate("/organization/no-data");
    } else {
      navigate("/dashboard");
    }
  };

  const templatePreviewHandler = () => {};

  const templatePublishHandler = () => {
    // template layout
    if (location.pathname.includes("template/layout")) {
      updateTemplateLayoutValue({ ...layoutObj }, layoutSearchParams, enqueueSnackbar);
    }
  };

  const btn: any = document.querySelector(`#${buttonReference}`);

  // getting the current url
  const paramsDatas = urls?.reduce((acc: any, curr: any) => {
    if (location.pathname.includes(curr)) {
      return curr?.split("/")[0];
    }

    return acc;
  }, "");

  return (
    <>
      <ConfirmationModal
        openModal={isBackModal}
        setOpenModal={setIsBackModal}
        confirmationIcon={"src/assets/icons/icon-feature.svg"}
        handelConfirmation={() => navigate(-1)}
        confirmationHeading={`Are you sure you want to go back?`}
        confirmationDesc={`Your entire ${paramsDatas} data will be erased completely!`}
        status="warning"
        loader={false}
      />

      <Box id="TemplateTopBar">
        {/* success toaster  */}
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={successOpen}
          autoHideDuration={3000}
          onClose={(reason) => handleCloseSnack(reason)}
        >
          <Alert
            onClose={(reason) => handleCloseSnack(reason)}
            severity="success"
            sx={{ width: "100%" }}
          >
            {successMessage || "Booking template created successfully"}
          </Alert>
        </Snackbar>

        <Grid
          container
          className="top-bar-container"
          justifyContent={hasLogo ? "space-between" : "flex-end"}
          spacing={0}
        >
          {hasLogo && (
            <Grid item alignItems="center" display="flex" xs={2}>
              <img
                src={logoPic}
                alt="logo"
                onClick={homepageRedirect}
                style={{ cursor: "pointer", height: "40px" }}
              />
              <Button
                variant="contained"
                className="go_back_button"
                onClick={() => {
                  if (
                    removeAccessViewModal?.some((path: any) => location?.pathname?.includes(path))
                  ) {
                    setIsBackModal(false);
                    navigate(-1);
                  } else {
                    setIsBackModal(true);
                  }
                }}
              >
                Go Back
              </Button>
            </Grid>
          )}

          <Grid item xs="auto" alignItems="center" display="flex">
            <Grid container spacing={0} justifyContent="flex-end">
              {!(
                location.pathname.includes("bookings/add-bookings/") ||
                location.pathname.includes("bookings/all-booking-templates/view") ||
                location.pathname.includes("bookings/all-bookings/edit") ||
                location.pathname.includes("quotations/add-quotations/") ||
                location.pathname.includes("quotations/all-quotations/edit") ||
                location.pathname.includes("template/layout/") ||
                location.pathname.includes("quotations/all-quotations/view") ||
                location.pathname.includes("bookings/all-bookings/view") ||
                location.pathname.includes("/quotations/all-quotation-templates/view") ||
                location.pathname.includes("template/create") ||
                location.pathname.includes("template/edit") ||
                location.pathname.includes("template/view")
              ) && (
                <Button
                  variant="outlined"
                  onClick={templatePreviewHandler}
                  disabled={
                    location.pathname.includes("/bookings/all-booking-templates/preview") ||
                    location.pathname.includes("/quotations/all-quotation-templates/preview")
                      ? true
                      : false
                  }
                  sx={{
                    mr: 2,
                    color: "#fff",
                    "&:hover": {
                      color: "#eee",
                    },
                    "&.Mui-disabled": {
                      color: "#c2c2c2",
                    },
                  }}
                >
                  Preview
                </Button>
              )}

              {(location.pathname.includes("template/create") ||
                location.pathname.includes("template/edit")) && (
                <Button
                  onClick={(e) => {
                    // if (buttonReference) {
                    const btn: any = document.querySelector(`#${"draft-template"}`);
                    btn?.click();
                    // }
                  }}
                  variant="contained"
                  type="submit"
                  disabled={isLoading || isTemplateLoading ? true : false}
                  sx={{
                    background: "#fff",
                    marginRight: "0.5rem",
                    color: "#1D2939",
                    "&:hover": {
                      background: "#eee",
                    },
                    "&.Mui-disabled": {
                      background: "#dbd9d9",
                      color: "#1D2939",
                    },
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Box>{isLoading ? "Saving" : "Save as draft"}</Box>
                    {isLoading ? (
                      <CircularProgress style={{ color: "#283352" }} size={20} />
                    ) : (
                      <img src={PublishIcon} alt="publish" />
                    )}
                  </Stack>
                </Button>
              )}

              <Grid item>
                {location.pathname.includes("bookings/add-bookings/") ||
                location.pathname.includes("bookings/all-bookings/edit") ? (
                  <Button
                    onClick={(e) => {
                      if (buttonReference) {
                        const btn: any = document.querySelector(`#${buttonReference}`);
                        btn?.click();
                      }
                    }}
                    variant="contained"
                    type="submit"
                    disabled={isLoading ? true : false}
                    sx={{
                      background: "#fff",
                      color: "#1D2939",
                      "&:hover": {
                        background: "#eee",
                      },
                      "&.Mui-disabled": {
                        background: "#dbd9d9",
                        color: "#1D2939",
                      },
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Box>{isLoading ? "Saving" : "Save booking"}</Box>
                      {isLoading ? (
                        <CircularProgress style={{ color: "#283352" }} size={20} />
                      ) : (
                        <img src={PublishIcon} alt="publish" />
                      )}
                    </Stack>
                  </Button>
                ) : location.pathname.includes("quotations/add-quotations") ||
                  location.pathname.includes("quotations/all-quotations/edit") ? (
                  <Button
                    onClick={() => {
                      if (buttonReference) {
                        const btn: any = document.querySelector(`#${buttonReference}`);
                        btn?.click();
                      }
                    }}
                    variant="contained"
                    type="submit"
                    disabled={isLoading ? true : false}
                    sx={{
                      background: "#fff",
                      color: "#1D2939",
                      "&:hover": {
                        background: "#eee",
                      },
                      "&.Mui-disabled": {
                        background: "#dbd9d9",
                        color: "#1D2939",
                      },
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Box>{isLoading ? "Saving" : "Save Quotation"}</Box>
                      {isLoading ? (
                        <CircularProgress style={{ color: "#283352" }} size={20} />
                      ) : (
                        <img src={PublishIcon} alt="publish" />
                      )}
                    </Stack>
                  </Button>
                ) : location.pathname.includes("/bookings/all-booking-templates/preview") ||
                  location.pathname?.includes("/quotations/all-quotation-templates/preview") ||
                  location.pathname.includes("bookings/all-bookings/view") ||
                  location.pathname?.includes("/quotations/all-quotations/view") ||
                  location.pathname.includes("/bookings/all-booking-templates/view") ||
                  location.pathname.includes("/quotations/all-quotation-templates/view") ? (
                  ""
                ) : (
                  <Button
                    onClick={() => {
                      if (buttonReference) {
                        const btn: any = document.querySelector(`#${buttonReference}`);
                        btn?.click();
                      }
                      templatePublishHandler();
                    }}
                    variant="contained"
                    disabled={
                      isLoading || isQuotationBtnLoading || isTemplateLoading ? true : false
                    }
                    sx={{
                      background: "#fff",
                      color: "#1D2939",
                      "&:hover": {
                        background: "#eee",
                      },
                      "&.Mui-disabled": {
                        background: "#dbd9d9",
                        color: "#1D2939",
                      },
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={1}>
                      {bookingTemplateId ? (
                        <Box>{isLoading || isQuotationBtnLoading ? "Updating" : "Update now"}</Box>
                      ) : (
                        <Box>
                          {isLoading || isQuotationBtnLoading || layoutButtonLoader
                            ? btn?.textContent || "Building"
                            : btn?.textContent || "Build"}
                        </Box>
                      )}
                      {isLoading || isQuotationBtnLoading || layoutButtonLoader ? (
                        <CircularProgress style={{ color: "#283352" }} size={20} />
                      ) : (
                        <img src={PublishIcon} alt="publish" />
                      )}
                    </Stack>
                  </Button>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
