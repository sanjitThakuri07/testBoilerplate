import React, { useEffect } from "react";

import WebPreview from "./WebPreview/WebPreview";
import { Alert, Box, Button, Grid, InputLabel, Snackbar, Stack } from "@mui/material";
import ReportEmailComponent from "src/components/ReportEmailComponent/ReportEmailComponent";
import CreateLayout from "./Components/CreateLayout/CreateLayout";
import { useReportLayoutDataSets } from "./store/ReportStoreDataSets";
import { getAPI } from "src/lib/axios";
import { useParams } from "react-router-dom";
import PDFPreview from "./PDFPreview";
// import { ReactComponent as LayoutIcon } from "../../../assets/icons/layout_icon.svg";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";

// import "./ReportLayout.scss";

const Index = () => {
  const {
    layoutObjLoader,
    layoutObj,
    layoutParams,
    setLayoutObj,
    setLayoutObjLoader,
    setProfileLabelLoading,
    setGetDatasFromTemplates,
    getDatasFromTemplates,
    profileLabelLoading,
  } = useReportLayoutDataSets();
  const [value, setValue] = React.useState(0);

  const { templateId } = useParams();

  // snackbar popup's
  const [openSuccessSnack, setOpenSuccessSnack] = React.useState(false);
  const [openErrorSnack, setOpenErrorSnack] = React.useState(false);
  const [snackMessage, setSnackMessage] = React.useState("");

  const tabValues = {
    value: value,
    tabsName: [
      { label: "Web Preview", value: 0 },
      { label: "PDF Preview", value: 1 },
    ],
    handleChange: (newValue: number) => {
      setValue(newValue);
    },
  };

  const handleFormSubmit = async (values: any) => {};

  //   get individual layout datas when layout id changes
  const fetchLayoutData = async () => {
    if (!layoutParams) return;
    setLayoutObjLoader(true);
    const { status, data } = await getAPI(`template-report/${+layoutParams}`);

    if (status === 200) {
      setOpenSuccessSnack(true);
      setSnackMessage("Layout data fetched successfully");
      setLayoutObjLoader(false);
      setLayoutObj(data);
    } else {
      setOpenErrorSnack(true);
      setSnackMessage("Error while fetching layout datas!");
      setLayoutObjLoader(false);
    }
  };

  useEffect(() => {
    fetchLayoutData();
  }, [layoutParams]);

  const fetchIndividualTemplate = async () => {
    const { status, data } = await getAPI(`templates/${templateId}`);
    if (status === 200) {
      // // get unanswered question from templates
      const reducedDataSets = data?.fields?.reduce(
        (acc: any, curr: any, index: number, wholeArray: any) => {
          if (curr?.component === "question") {
            acc?.unansweredQuestions.push(curr);
          }
          if (curr?.type === "instruction") {
            acc?.instructions.push(curr);
          }
          //  curr => section, question, logic
          if (curr?.component === "logic") {
            if (curr.flaggedResponse?.length) {
              const qn = wholeArray?.find((it: any) => it.logicId === curr?.id);
              acc.flaggedQuestions.push(qn);
            }
          }
          return acc;
        },

        {
          unansweredQuestions: [],
          instructions: [],
          flaggedQuestions: [],
        },
      );

      setGetDatasFromTemplates({
        profileLabel: data?.name,
        reducerDatas: { ...reducedDataSets },
      });
    } else {
      console.log("Something went wrong...");
    }
  };

  useEffect(() => {
    fetchIndividualTemplate();
  }, []);

  return (
    <div id="INSPECTION_REPORT">
      {/* success snack */}
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        open={openSuccessSnack}
        autoHideDuration={3000}
        onClose={() => setOpenSuccessSnack(false)}
      >
        <Alert onClose={() => setOpenSuccessSnack(false)} severity="success" sx={{ width: "100%" }}>
          {snackMessage}
        </Alert>
      </Snackbar>
      {/* error snack */}
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        open={openErrorSnack}
        autoHideDuration={3000}
        onClose={() => setOpenErrorSnack(false)}
      >
        <Alert onClose={() => setOpenErrorSnack(false)} severity="error" sx={{ width: "100%" }}>
          {snackMessage}
        </Alert>
      </Snackbar>
      <Grid container>
        <Grid item xs={2.5} position="sticky" top={0}>
          <CreateLayout
            setOpenErrorSnack={setOpenErrorSnack}
            setOpenSuccessSnack={setOpenSuccessSnack}
            setSnackMessage={setSnackMessage}
          />
        </Grid>
        <Grid
          item
          xs={6.5}
          p={1}
          borderLeft="1px solid silver"
          borderRight="1px solid silver"
          height={"100vh"}
          overflow="auto"
          sx={{
            scrollBehavior: "smooth",
            background: "#f9fafb",
          }}
        >
          {value === 0 ? (
            <WebPreview
              layoutObjLoader={layoutObjLoader}
              layoutObj={layoutObj}
              layoutParams={layoutParams}
            />
          ) : (
            <PDFPreview layoutObj={layoutObj} layoutParams={layoutParams} />
          )}
        </Grid>

        <Grid item xs={3} p={3} sx={{ background: "#f9fafb" }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Box sx={{ fontWeight: 500, fontSize: "17px" }}>Preview Mode</Box>

            <Box sx={{ alignItems: "center", display: "flex" }}>
              <DashboardRoundedIcon style={{ fontSize: "21px" }} />
            </Box>
          </Stack>
          <Stack mt={1} direction="row" alignItems="center" className="CUSTOM_TABS">
            {tabValues?.tabsName?.map((tab: any, i: number) => {
              return (
                <Button
                  key={i}
                  className={tabValues.value == tab.value ? "active" : ""}
                  onClick={() => tabValues?.handleChange(tab.value)}
                >
                  {tab?.label}
                </Button>
              );
            })}
          </Stack>
          <ReportEmailComponent />
        </Grid>
      </Grid>
    </div>
  );
};

export default Index;
