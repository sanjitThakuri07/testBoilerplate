import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  InputLabel,
  OutlinedInput,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import { ReactComponent as InfoIcon } from "../src/assets/icons/info_icon.svg";
import AddModal from "src/components/AddModal/AddModal";
import { deleteAPI, getAPI, postAPI } from "src/lib/axios";
import { useNavigate, useParams } from "react-router-dom";
import BASTooltip from "src/components/BASTooltip/BASTooltip";
import ConfirmationModal from "src/components/ConfirmationModal/ConfirmationModal";
import NoDataFoundImg from "../src/assets/images/no_data_found.svg";
import { ReactComponent as LayoutIcon } from "../src/assets/icons/layout_icon.svg";
import { useReportLayoutDataSets } from "../../store/ReportStoreDataSets";

export default function CreateLayout({
  setOpenSuccessSnack,
  setOpenErrorSnack,
  setSnackMessage,
}: any) {
  const { setLayoutObj, setLayoutObjLoader, setLayoutParams, layoutParams } =
    useReportLayoutDataSets();
  const { templateId } = useParams();
  const navigate = useNavigate();
  const [layoutLoader, setLayoutLoader] = useState(true);
  const [createLayoutModal, setCreateLayoutModal] = React.useState(false);
  const [layoutValue, setLayoutValue] = React.useState<string>("");
  const [buttonLoader, setButtonLoader] = React.useState(false);
  const [deleteButtonLoader, setDeleteButtonLoader] = React.useState(false);
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
  const [layoutInfos, setLayoutInfos] = React.useState<any>({});
  const [layoutItems, setLayoutItems] = useState([]);
  const [layoutEditId, setLayoutEditId] = React.useState<any>(null);
  const layoutSearchParams = new URLSearchParams(document?.location?.search).get("id");

  // setting up layout params if exists otherwise return null
  useEffect(() => {
    setLayoutParams(layoutSearchParams);
  }, [layoutSearchParams]);

  const createLayoutHandler = async () => {
    setButtonLoader(true);
    const payload = [
      {
        name: layoutValue,
        template_id: templateId,
      },
    ];

    await postAPI("/template-report/", payload)
      .then((res) => {
        setButtonLoader(false);
        setCreateLayoutModal(false);
        setLayoutEditId(null);
        setLayoutValue("");
        setOpenSuccessSnack(true);
        setSnackMessage("Data Saved Successfully");
        fetchLayouts();
      })
      .catch((err: any) => {
        setButtonLoader(false);
        // enqueueSnackbar(err.response.data.message || "Something went wrong!", {
        //   variant: "error",
        // });
        setOpenErrorSnack(true);
        setSnackMessage(err.response.data.message || "Something went wrong!");
      });
  };

  //   get all the layouts
  const fetchLayouts = async () => {
    try {
      const { data } = await getAPI(
        `template-report/?master=${false}&template=${templateId}&page=${1}&size=${100}`,
      );
      setLayoutItems(data?.items);
      setLayoutLoader(false);
    } catch (error) {
      setLayoutLoader(false);
    }
  };

  useEffect(() => {
    fetchLayouts();
  }, []);

  const removeLayoutHandler = async () => {
    setDeleteButtonLoader(true);
    try {
      await deleteAPI("template-report/", {
        config_ids: [layoutInfos.id],
      });
      const filteredLayouts = layoutItems?.filter((item: any) => item?.id !== layoutInfos?.id);
      setDeleteButtonLoader(false);
      setLayoutItems(filteredLayouts);
      setLayoutInfos({});
      setOpenDeleteModal(false);
      setOpenSuccessSnack(true);
      setSnackMessage("Data Saved Successfully");
    } catch (error: any) {
      setDeleteButtonLoader(false);
      setOpenDeleteModal(false);
      setLayoutInfos({});
      setOpenErrorSnack(true);
      setSnackMessage(error?.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <>
      <AddModal
        openModal={createLayoutModal}
        setOpenModal={() => setCreateLayoutModal(!createLayoutModal)}
        confirmationHeading=""
        confirmationDesc=""
      >
        <CreateNewLayoutForm
          setCreateLayoutModal={setCreateLayoutModal}
          createLayoutHandler={createLayoutHandler}
          setLayoutValue={setLayoutValue}
          layoutValue={layoutValue}
          buttonLoader={buttonLoader}
          setButtonLoader={setButtonLoader}
        />
      </AddModal>

      {/* delete modal */}
      <ConfirmationModal
        openModal={openDeleteModal}
        setOpenModal={() => setOpenDeleteModal(!openDeleteModal)}
        handelConfirmation={removeLayoutHandler}
        confirmationHeading={`Are you sure you want to delete ${layoutInfos?.name} layout ?`}
        confirmationDesc={`You can create more layout whenever you want.`}
        status="warning"
        confirmationIcon="/assets/icons/icon-feature.svg"
        loader={deleteButtonLoader}
      />

      <Box sx={{ p: 3 }}>
        {/* <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box sx={{ fontWeight: 500, fontSize: "23px" }}>Report Layout</Box>
          <Box sx={{ cursor: "pointer" }}>
            <InfoIcon />
          </Box>
        </Stack> */}

        <Box>
          <Button
            onClick={() => setCreateLayoutModal(true)}
            variant="contained"
            size="small"
            fullWidth
            startIcon={<img src="/assets/icons/plus-white.svg" alt="plus" />}
          >
            Create Design
          </Button>
        </Box>

        {/* choose default layout */}
        {/* <Stack direction="column" sx={{ width: "100%", mt: 3 }}>
          <InputLabel htmlFor="Text" sx={{ mb: 0.5 }}>
            <div className="label-heading">Default Layout</div>
          </InputLabel>

          <Select
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 200,
                },
              },
            }}
            // id={`address.${index}.status`}
            name={'default_layout'}
            value={''}
            size="small"
            fullWidth
            placeholder="Choose a option"
            sx={{
              overflow: 'hidden',
            }}>
            {layoutItems?.map((option: any, index: number) => {
              return (
                <MenuItem key={index} value={option?.id}>
                  {option?.name}
                </MenuItem>
              );
            })}
          </Select>
        </Stack> */}

        {/* map the created layouts */}
        <Stack direction="column" sx={{ mt: 4 }}>
          <InputLabel htmlFor="Text">
            <div className="label-heading">Your Designs</div>
          </InputLabel>
          <Box>
            {layoutLoader && (
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                justifyContent="center"
                sx={{ mt: 4 }}
              >
                <Box>Loading</Box>
                <CircularProgress style={{ color: "#283352" }} size={20} />
              </Stack>
            )}
            {!layoutLoader && layoutItems?.length === 0 && (
              <Stack
                direction="column"
                spacing={1}
                sx={{ mt: 4 }}
                alignItems="center"
                justifyContent="center"
              >
                <Box>
                  <img
                    style={{ height: "100px", width: "100px" }}
                    src={NoDataFoundImg}
                    alt="no_data_found"
                  />
                </Box>
                <Box sx={{ opacity: 0.8 }}>No Active Layout found</Box>
              </Stack>
            )}
            {/* map the created layouts here */}
            {layoutItems?.map((layout: any, index: any) => {
              return (
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ width: "100%" }}
                  onClick={() => {
                    navigate({
                      pathname: "",
                      search: `?layout=${layout?.name}&id=${layout?.id}`,
                    });
                  }}
                >
                  <Stack
                    direction="row"
                    className={`${
                      layout?.id == layoutParams && "layout_button_active"
                    } layout_button`}
                    key={index}
                    sx={{ mt: 1, width: "100%" }}
                  >
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Box sx={{ alignItems: "center", display: "flex" }}>
                        <LayoutIcon />
                      </Box>
                      <Typography
                        variant="body1"
                        component="p"
                        // noWrap
                        // className="text_inner_content"
                      >
                        {layout?.name}
                      </Typography>
                    </Stack>
                    {/* <Stack direction="row" spacing={1} alignItems="center"> */}
                    {!layout?.template_id && (
                      <Box>
                        <Chip label="Default" size="small" sx={{ fontSize: "14px" }} />
                      </Box>
                    )}
                    {/* <Box className="layout_button_icon">
                        <FontAwesomeIcon icon={faAngleRight} />
                      </Box> */}
                    {/* </Stack> */}
                    {/* delete Icon */}
                  </Stack>
                  {index > 0 && (
                    <Stack direction="row" alignItems="center" justifyContent="center">
                      {/* <BASTooltip label="Edit" tooltipPlacement="top">
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                          className="remove_layout_btn"
                          onClick={() => {
                            setCreateLayoutModal(true);
                            // setLayoutEditId(layout?.id);
                            // setLayoutInfos(layout);
                          }}
                        >
                          <img
                            src="/assets/icons/icon-edit.svg"
                            alt="edit"
                            style={{
                              height: "18px",
                              width: "18px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          />
                        </Box>
                      </BASTooltip> */}
                      <BASTooltip label="Delete" tooltipPlacement="top">
                        <Box
                          className="remove_layout_btn"
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                          onClick={() => {
                            setOpenDeleteModal(true);
                            setLayoutInfos(layout);
                          }}
                        >
                          <img
                            src="/assets/icons/icon-trash.svg"
                            alt="delete"
                            style={{
                              height: "18px",
                              width: "18px",
                            }}
                          />
                        </Box>
                      </BASTooltip>
                    </Stack>
                  )}
                </Stack>
              );
            })}
          </Box>
        </Stack>
      </Box>
    </>
  );
}

export const CreateNewLayoutForm = ({
  setCreateLayoutModal,
  createLayoutHandler,
  layoutValue,
  setLayoutValue,
  buttonLoader,
  setButtonLoader,
}: any) => {
  return (
    <>
      <Box sx={{ pb: 1.5 }}>
        <Typography variant="h3" color="primary">
          Create Layout
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ pt: 3 }}>
        <Stack direction="column">
          <Grid item sx={{ pb: 0.5 }}>
            <InputLabel htmlFor="Text">
              <div className="label-heading">Layout</div>
            </InputLabel>
          </Grid>
          <OutlinedInput
            value={layoutValue}
            name="name"
            size="small"
            fullWidth
            placeholder="Enter layout name"
            onChange={(e: any) => {
              setLayoutValue(e.target.value);
            }}
            sx={{
              overflow: "hidden",
            }}
          />
        </Stack>
      </Box>

      <Box sx={{ pt: 3 }}>
        <Stack direction="row" alignItems="end" justifyContent="end" spacing={1}>
          <Button
            variant="outlined"
            onClick={() => {
              setButtonLoader(false);
              setCreateLayoutModal(false);
              setLayoutValue("");
            }}
          >
            Cancel
          </Button>

          <Button
            sx={{ height: "40px" }}
            disabled={buttonLoader ? true : false}
            variant="contained"
            // className={`buttonContainer ${
            //   status === "warning" ? "errorButton" : "containedButton"
            // }`}
            onClick={createLayoutHandler}
          >
            {buttonLoader ? (
              <Box sx={{ display: "flex", gap: "5px" }}>
                <Box>Saving</Box>
                <CircularProgress style={{ color: "#283352" }} size={20} />
              </Box>
            ) : (
              "Save"
            )}
          </Button>
        </Stack>
      </Box>
    </>
  );
};
