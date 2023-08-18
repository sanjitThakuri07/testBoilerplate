import Typography from "@material-ui/core/Typography";
import GetAppIcon from "@mui/icons-material/GetApp";
import { Box, Button, styled } from "@mui/material";
import ServerStyleSheets from "@mui/styles/ServerStyleSheets";
import FullPageLoader from "src/components/FullPageLoader";
import { fetchApI, fetchIndividualApi } from "src/modules/apiRequest/apiRequest";
import { useCurrentLayout, useReportDataSets } from "src/store/zustand/inspectionTemp/inspection";
import { validateInput } from "src/modules/template/validation/inputLogicCheck";
import { findData } from "src/modules/template/validation/keyValidationFunction";
import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { apiRoutes } from "src/routers/apiRoutes";
import Actions from "../Components/Actions";
import Disclaimer from "../Components/Disclaimer";
import FlaggedItems from "../Components/FlaggedItems";
import Media from "../Components/Media";
import Overview from "../Components/Overview";
import Questions from "../Components/Question";
import PdfTableOfContents from "./PdfTableOfContents";
import PdfCountingDatas from "./pdfCountingDatas";

const PrintStyles = styled("div")`
  /* .page-header,
  .page-header-space {
    height: 70px;
    font-size: 1.3em;
    font-weight: 600;
    color: whitesmoke;
    z-index: 1000;
    text-align: center;
  } */

  .page-footer,
  .page-footer-space {
    height: 50px;
    font-weight: 500;
    color: #292828;
    font-size: 1.1em;
    text-align: center;
  }

  .page-header {
    position: fixed;
    top: 0mm;
    width: 100%;
    background: #e9ecf0;
  }
  .page-footer {
    position: fixed;
    bottom: 0mm;
    width: 100%;
    background: #e9ecf082;
  }

  .page {
    page-break-after: always;
  }

  .page-break-avoid {
    break-inside: avoid;
    visibility: visible;
  }

  @page {
    size: auto; // A4,letter
  }

  @media print {
    thead {
      display: table-header-group;
    }
    tfoot {
      display: table-footer-group;
    }
    .no-break {
      position: relative;
      display: block !important;
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }
  }
`;
// https://plnkr.co/edit/lWk6Yd?preview

const PublicPDFPreview = ({}: any) => {
  const { publicInspectionId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [layoutLoading, setLayoutLoading] = useState(false);

  const [templateId, setTemplateId] = useState<any>(null);
  const { currentReportLayout, setCurrentState } = useCurrentLayout();

  const [currentLayout, setCurrentLayout] = useState<any>(null);

  const { initialState, setInitialState } = useReportDataSets();
  const [searchParams, setSearchParams] = useSearchParams();

  // for printing
  const componentRef = useRef<any>(null);
  const sheets = useRef<ServerStyleSheets | null>(null);
  const [isPrinting, setIsPrinting] = useState(false);

  const handleBeforePrint = async () => {
    setIsPrinting(true);

    // function addPageNumbers() {
    //   var totalPages = Math.ceil(document.body.scrollHeight / 1123); //842px A4 pageheight for 72dpi, 1123px A4 pageheight for 96dpi,
    //   for (var i = 1; i <= totalPages; i++) {
    //     var pageNumberDiv = document.createElement('div');
    //     var pageNumber = document.createTextNode('Page ' + i + ' of ' + totalPages);
    //     pageNumberDiv.style.position = 'absolute';
    //     pageNumberDiv.style.top = 'calc((' + i + ' * (297mm - 0.5px)) - 100px)'; //297mm A4 pageheight; 0,5px unknown needed necessary correction value; additional wanted 40px margin from bottom(own element height included)
    //     pageNumberDiv.style.height = '16px';
    //     pageNumberDiv.style.background = 'red';
    //     pageNumberDiv.appendChild(pageNumber);
    //     document.body.insertBefore(pageNumberDiv, document.getElementById('INSPECTION_REPORT'));
    //     pageNumberDiv.style.left = 'calc(100% - (' + pageNumberDiv.offsetWidth + 'px + 20px))';
    //   }
    // }

    // Server-side rendering for MUI styles
    sheets.current = new ServerStyleSheets();
    const content: any = sheets.current.collect(<PublicPDFPreview />);

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve(content);
      }, 0);
    });
  };

  const handleAfterPrint = () => {
    // Clean up the server-side rendered styles
    sheets.current = null;
    setIsPrinting(false);
  };

  // Create a custom hook to handle the printing action
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    // pageStyle: '',
    onBeforeGetContent: handleBeforePrint,
    onAfterPrint: handleAfterPrint,
  });

  // activity
  // template-data
  const getInspectedData = (id: any, token?: string) => {
    fetchIndividualApi({
      // id: `${Number(id)}/public/`,
      id: `${id}/public/`,
      // url: apiRoutes.inspections.getSingleAPI,
      url: `${apiRoutes.inspections.getSingleAPI}`,
      setterLoading: setIsLoading,
      setterFunction: (data: any) => {
        setInitialState(data);
        setTemplateId(data?.template_id);
      },
      token,
    });
  };

  useEffect(() => {
    const token = searchParams.get("token");
    if (publicInspectionId && token) {
      getInspectedData(publicInspectionId, token);
    }
  }, [publicInspectionId, searchParams]);

  // template-report
  const getLayouts = (token?: string, publicInspectionId?: any) => {
    setIsLoading(true);
    fetchApI({
      // url: apiRoutes.layout.getAPI,
      url: `${apiRoutes.layout.getAPI}${publicInspectionId}/public/`,
      queryParam: `master=${false}&page=${1}&size=${100}`,
      setterLoading: setLayoutLoading,
      setterFunction: (data: any) => {
        setCurrentLayout(data);
        setCurrentState(data);
      },
      token,
      getAll: true,
    });
    setIsLoading(false);
  };

  useEffect(() => {
    const token = searchParams.get("token");
    if (templateId && token) {
      getLayouts(token, publicInspectionId);
    }
  }, [publicInspectionId, templateId, searchParams]);

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

  const pagesWithSections =
    pages && pages?.length
      ? pages.map((page: any, index: number, arr: any[]) => {
          const sections = (initialState?.fields || []).filter(
            (field: any) => field.component === "section" && field?.parentPage === page.id,
          );
          return {
            ...page,
            sections,
          };
        })
      : [];

  const dataSetSeperators = initialState?.fields?.reduce(
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
      return acc;
    },
    { logicDataSet: [], questionDataSet: [], logicQuestion: [] },
  );

  function dataNode({ dataSetSeperator, data, acc }: any) {
    const findLogic = dataSetSeperator.logicDataSet?.find(
      (datas: any) => data.logicId === datas.id,
    );
    if (!findLogic) return null;

    let trigger = {};

    const conditionQuestions = findLogic?.logics
      ?.map((logic: any, index: any) => {
        if (logic) {
          let datas = [];
          let conditionDataset = {
            condition: logic?.condition,
            trigger: logic?.trigger,
          };
          if (
            validateInput({
              operator: conditionDataset?.condition,
              userInput: data?.value,
              authorizedValues: Array.isArray(logic?.value) ? logic?.value : [logic?.value],
            })
          ) {
            trigger = logic?.trigger.reduce((acc: any, curr: any) => {
              if (curr?.name) {
                acc[`${curr.name?.toString()?.split(" ").join("_")}`] = curr.value;
              }
              return acc;
            }, {});
            datas = logic.linkQuestions.map((data: any) =>
              findData(dataSetSeperator.logicQuestion, data, "id"),
            );
          }
          return datas;
        } else {
          return;
        }
      })
      .flat();

    if (!conditionQuestions?.length) return;
    conditionQuestions?.map((data: any) => {
      const qnLogic = dataSetSeperator?.logicDataSet?.find((lg: any) => lg?.id === data?.logicId);

      if (data?.component === "question") {
        // do saving
        // recursive vall
        acc.filterQuestion.push(data);
        data?.media?.[0]?.documents?.length && acc.medias.push(...data?.media?.[0]?.documents);

        data?.action?.length && acc.actions.push(...data?.action);
        data?.flaggedValue?.length && acc.flaggedQuestions.push(...data?.flaggedValue);
        dataNode({ dataSetSeperator: dataSetSeperator, data: data, acc });
      } else if (data.component === "section") {
        dataSection({ dataSetSeperator: dataSetSeperator, data: data, acc });
      }
    });
  }

  function dataSection({ dataSetSeperator, data, acc }: any) {
    const findChildren = dataSetSeperator?.logicQuestion?.filter((item: any) => {
      return data?.id === item?.parent;
    });

    if (!findChildren?.length) return;
    findChildren?.map((child: any) => {
      if (child.component === "question") {
        acc.filterQuestion.push(child);
        child?.media?.[0]?.documents?.length && acc.medias.push(...child?.media?.[0]?.documents);
        child?.action?.length && acc.actions.push(...child?.action);
        child?.flaggedValue?.length && acc.flaggedQuestions.push(...child?.flaggedValue);

        dataNode({ dataSetSeperator: dataSetSeperator, data: child, acc });
      } else if (child.component === "section") {
        dataSection({ dataSetSeperator: dataSetSeperator, data: child, acc });
      }
    });
  }
  // create a collection of media from active lists
  const datass = dataSetSeperators?.questionDataSet?.reduce(
    (acc: any, curr: any) => {
      const foundLogic = dataSetSeperators?.logicDataSet?.find(
        (lg: any) => lg?.id === curr?.logicId,
      );
      if (curr?.component === "question") {
        acc.filterQuestion.push(curr);
        curr?.media?.[0]?.documents?.length && acc.medias.push(...curr?.media?.[0]?.documents);
        curr?.action?.length && acc.actions.push(...curr?.action);
        curr?.flaggedValue?.length && acc.flaggedQuestions.push(...curr?.flaggedValue);

        dataNode({ dataSetSeperator: dataSetSeperators, data: curr, acc });
      } else if (curr.component === "section") {
        dataSection({ dataSetSeperator: dataSetSeperators, data: curr, acc });
      }
      return acc;
    },
    { flaggedQuestions: [], medias: [], actions: [], filterQuestion: [] },
  );

  const rest = { pages, currentLayout, dataSetSeperator };

  if (isLoading || !currentLayout) return <FullPageLoader />;

  const downloadButton = isPrinting ? (
    <div
      style={{
        marginLeft: "auto",
        marginRight: "auto",
        width: "fit-content",
        position: "absolute",
        right: 10,
        top: 10,
        zIndex: 99,
      }}
    >
      <Button
        variant="outlined"
        className={"active"}
        onClick={handlePrint}
        startIcon={<GetAppIcon sx={{ fontSize: 24 }} />}
      >
        Loading...
      </Button>
    </div>
  ) : (
    <div
      style={{
        marginLeft: "auto",
        marginRight: "auto",
        width: "fit-content",
        position: "absolute",
        right: 10,
        top: 10,
        zIndex: 99,
      }}
    >
      <Button
        variant="outlined"
        className={"active"}
        onClick={handlePrint}
        startIcon={<GetAppIcon sx={{ fontSize: 24 }} />}
      >
        {isPrinting ? "Loading..." : "Download PDF"}
      </Button>
    </div>
  );

  return (
    <div style={{ position: "relative" }}>
      {downloadButton}
      <PrintStyles
        ref={componentRef}
        style={{
          backgroundColor: "#e1e4e6d6",
          paddingTop: isPrinting ? 0 : 10,
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <Box
          id="INSPECTION_REPORT"
          style={{
            marginLeft: "auto",
            marginRight: "auto",
            // width: 'fit-content',
            width: "650px",
            padding: "10px 16px",
            boxSizing: "border-box",
          }}
        >
          <table style={{ width: "100%" }}>
            {isPrinting ? (
              <thead>
                <tr>
                  <td>
                    {/* <div className="page-header-space">
                    <div className="page-header">I'm The Header</div>
                  </div> */}
                  </td>
                </tr>
              </thead>
            ) : null}
            <tbody>
              <tr>
                <td>
                  <div className="page">
                    <div id="overview">
                      <Box>
                        <Overview
                          badgeContent={{ value: "Incomplete", status: "Pending" }}
                          mode="pdf"
                          currentLayout={currentLayout}
                        />
                      </Box>
                    </div>
                    <PdfCountingDatas
                      datass={datass}
                      has_flagged={currentLayout?.has_flagged}
                      has_action={currentLayout?.has_action}
                      has_checkboxes={currentLayout?.has_checkboxes}
                    />

                    {currentLayout?.has_table_of_contents && (
                      <div
                        style={{
                          marginTop: 10,
                        }}
                      >
                        <PdfTableOfContents
                          pagesWithSections={pagesWithSections}
                          currentLayout={currentLayout}
                        />
                      </div>
                    )}
                  </div>

                  {currentLayout?.has_disclaimer && (
                    <div
                      style={{
                        marginTop: isPrinting ? 0 : 10,
                      }}
                      id="disclaimer"
                      className="page"
                    >
                      <Disclaimer mode="pdf" />
                    </div>
                  )}
                  {currentLayout?.has_flagged_summary && (
                    <div
                      style={{
                        marginTop: isPrinting ? 0 : 10,
                      }}
                      id="flaggedItems"
                      className="page"
                    >
                      <FlaggedItems {...rest} mode="pdf" />
                    </div>
                  )}
                  {currentLayout?.has_action_summary && (
                    <div
                      style={{
                        marginTop: isPrinting ? 0 : 10,
                      }}
                      id="actions"
                      className="page"
                    >
                      <Actions token={searchParams.get("token")} {...rest} mode="pdf" />
                    </div>
                  )}
                  <div
                    id="questions"
                    className="page"
                    style={{
                      marginTop: isPrinting ? 0 : 10,
                    }}
                  >
                    <Questions {...rest} mode="pdf" />
                  </div>

                  {currentLayout?.has_media_summary && (
                    <div
                      id="media"
                      style={{
                        marginTop: isPrinting ? 0 : 10,
                      }}
                    >
                      <Media {...rest} mode="pdf" />
                    </div>
                  )}
                </td>
              </tr>
            </tbody>
            {isPrinting && currentLayout?.has_footer ? (
              <tfoot>
                <tr>
                  <td>
                    <div
                      className="page-footer-space"
                      style={{
                        padding: "auto 4px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <div
                        className="page-footer"
                        style={{
                          padding: "auto 4px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          color: "#4d4d4db4",
                        }}
                      >
                        <Typography>{currentLayout?.footer_text}</Typography>
                      </div>
                    </div>
                  </td>
                </tr>
              </tfoot>
            ) : null}
          </table>
        </Box>
      </PrintStyles>
    </div>
  );
};

export default PublicPDFPreview;
