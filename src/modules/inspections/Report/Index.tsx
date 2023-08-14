import { ServerStyleSheets } from "@material-ui/core/styles";
import { Button, Divider, Grid, Stack } from "@mui/material";
import FullPageLoader from "src/components/FullPageLoader";
import ReportEmailComponent from "src/components/ReportEmailComponent/ReportEmailComponent";
import { fetchApI, fetchIndividualApi } from "src/modules/apiRequest/apiRequest";
import { useReportLayoutDataSets } from "src/modules/template/ReportLayout/store/ReportStoreDataSets";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { apiRoutes } from "routers/apiRoutes/index";
import { useCurrentLayout, useReportDataSets } from "../store/inspection";
import CreateLayout from "./Components/CreateLayout/CreateLayout";
import PDFPreview from "./PDFPreview/PDFPreview";
import "./ReportLayout.css";
import WebPreview from "./WebPreview/WebPreview";

const Index = () => {
  const { inspectionId } = useParams();
  const [templateId, setTemplateId] = useState<any>(null);
  const { layoutObj, setLayoutObj } = useReportLayoutDataSets();
  const [value, setValue] = useState(0);
  const { initialState, setInitialState } = useReportDataSets();
  const { currentReportLayout, setCurrentState } = useCurrentLayout();
  const [loading, setLoading] = useState(false);
  const [layoutLoading, setLayoutLoading] = useState(false);
  const [currentLayout, setCurrentLayout] = useState<any>(null);

  // for printing
  const componentRef = useRef<any>(null);
  const sheets = useRef<ServerStyleSheets | null>(null);
  const [isPrinting, setIsPrinting] = useState(false);

  const handleBeforePrint = async () => {
    setIsPrinting(true);
    // Server-side rendering for MUI styles
    sheets.current = new ServerStyleSheets();
    const content: any = sheets.current.collect(<PDFPreview />);

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setIsPrinting(false);
        resolve(content);
      }, 0);
    });
  };

  const handleAfterPrint = () => {
    // Clean up the server-side rendered styles
    sheets.current = null;
  };

  const getInspectedData = (id: any) => {
    setLoading(true);
    fetchIndividualApi({
      id: Number(id),
      url: apiRoutes.inspections.getSingleAPI,
      setterLoading: setLoading,
      setterFunction: (data: any) => {
        setInitialState(data);
        setTemplateId(data?.template_id);
      },
    });
    setLoading(false);
  };

  const getLayouts = () => {
    setLayoutLoading(true);
    fetchApI({
      url: apiRoutes.layout.getAPI,
      queryParam: `master=${false}&template=${templateId}&page=${1}&size=${100}`,
      setterLoading: setLayoutLoading,
      setterFunction: (data: any) => {
        setLayoutObj(data);
        setCurrentLayout(data?.[0]);
        setCurrentState(data?.[0]);
      },
    });
    setLayoutLoading(false);
  };

  useEffect(() => {
    if (inspectionId) {
      getInspectedData(inspectionId);
    }
  }, [inspectionId]);

  useEffect(() => {
    if (templateId) {
      getLayouts();
    }
  }, [templateId]);

  const handleFormSubmit = async (values: any) => {
    // Handle form submission
  };

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

  const layouts = {
    currentLayout: currentLayout,
    layoutList: layoutObj?.length && layoutObj,
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      setCurrentLayout(e?.target?.value);
      setCurrentState(e?.target?.value);
    },
  };

  const dataSetSeperator =
    initialState?.fields &&
    initialState?.fields?.reduce(
      (acc: any, curr: any) => {
        if (
          curr.component?.toLowerCase() !== "logic" &&
          curr.logicReferenceId === null &&
          curr.parent === null
        ) {
          acc.questionDataSet.push(curr);
        } else if (curr.component === "logic") {
          acc.logicDataSet.push(curr);
        } else if (curr.logicReferenceId || curr.parent) {
          acc.logicQuestion.push(curr);
        }

        if (curr?.value?.length > 0) {
          acc.onlyAnsweredDataSet.push(curr);
        }
        return acc;
      },
      {
        logicDataSet: [],
        questionDataSet: [],
        logicQuestion: [],
        onlyAnsweredDataSet: [],
      },
    );

  const pages =
    initialState?.fields && initialState?.fields?.filter((list: any) => list?.component === "page");

  // Create a custom hook to handle the printing action
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    pageStyle: "@page { size: A4; margin: 1cm; }",
    onBeforeGetContent: handleBeforePrint,
    onAfterPrint: handleAfterPrint,
  });

  return (
    <>
      {(loading || layoutLoading) && <FullPageLoader />}
      <div id="INSPECTION_REPORT">
        <Divider />
        <Grid container>
          <Grid item xs={2.5} position="sticky" top={0}>
            <CreateLayout
              layouts={layouts}
              setCurrentLayout={setCurrentLayout}
              currentLayout={currentLayout}
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
              <div>
                <WebPreview
                  currentLayout={currentLayout}
                  dataSetSeperator={dataSetSeperator}
                  pages={pages}
                />
              </div>
            ) : (
              <div ref={componentRef}>
                <PDFPreview
                  currentLayout={currentLayout}
                  dataSetSeperator={dataSetSeperator}
                  pages={pages}
                />
              </div>
            )}
          </Grid>
          <Grid item xs={3} p={3} sx={{ background: "#f9fafb" }}>
            <Stack direction="row" alignItems="center" className="CUSTOM_TABS">
              {tabValues?.tabsName?.map((tab: any, i: number) => {
                return (
                  <Button
                    key={i}
                    className={tabValues.value === tab.value ? "active" : ""}
                    onClick={() => tabValues?.handleChange(tab.value)}
                  >
                    {tab?.label}
                  </Button>
                );
              })}
            </Stack>
            <Button
              variant="outlined"
              className={value === 0 ? "active" : ""}
              disabled={value === 0}
              onClick={handlePrint}
              sx={{ margin: "10px 0" }}
            >
              Download PDF
            </Button>
            <ReportEmailComponent currentLayout={currentLayout} />
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default Index;
