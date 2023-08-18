import { useTextAnswer } from "src/store/zustand/globalStates/templates/TextAnswer";
import {
  Grid,
  TextField,
  InputAdornment,
  Button,
  Chip,
  IconButton,
  Typography,
  Tooltip,
} from "@mui/material";
import React, { useEffect } from "react";
import SelectResponseType from "../SelectResponseType/SelectResponseType";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Collapse, ListItemButton, ListItemText } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MCRModal from "./MultipleChoiceResponse/MCRModal";
import GRSModal from "./GlobalResponseSet/GRSModal";
import EditIcon from "src/assets/template/icons/chip_edit_icon.png";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { fetchApI } from "src/modules/apiRequest/apiRequest";
import useDebounceSearch from "src/hooks/useDebounceSearch";
import { useTemplateFieldsStore } from "src/store/zustand/templates/templateFieldsStore";
import { itemTypes, responseChoice } from "src/modules/template/itemTypes/itemTypes";
import { withDragHOC } from "src/hoc/withDragDropHoc";

import useApiOptionsStore from "src/store/zustand/templates/apiOptionsTemplateStore";
import { moduleIdsFnR } from "src/utils/url";

interface CustomDropDownProps {
  children?: React.ReactNode;
  heading?: string;
}

export const DefaultWrapper = ({ children }: any) => {
  return <>{children}</>;
};

export const CustomDropDown = ({ children, heading }: CustomDropDownProps) => {
  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <div>
      <div id="CustomDropDown">
        <Grid container direction="row" alignItems="center" spacing={2}>
          <ListItemButton onClick={handleClick} sx={{ PaddingLeft: "0px ", width: "100%" }}>
            <ListItemText primary={heading} />
            {open ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>

          <Collapse
            in={open}
            timeout="auto"
            unmountOnExit
            style={{
              width: "100%",
            }}
          >
            <div
              className="dropdown_menu_conatiner"
              style={{
                padding: "1px 10px 17px",
                width: "100%",
              }}
            >
              {children}
            </div>
          </Collapse>
        </Grid>
      </div>
    </div>
  );
};

export const IndividualMultipleResponseData = withDragHOC({
  WrappedComponent: ({ dataItem, selectedDataset, onClick, onEditClick }: any) => {
    return (
      <div
        onClick={onClick}
        className="response__container"
        style={{ pointerEvents: selectedDataset?.lock ? "none" : "auto" }}
      >
        <div
          className="rendering_multiple_choice_response"
          style={{
            marginTop: "10px 0",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div className="label-chips-container">
            {dataItem.options.slice(0, 2).map((option: any, index: number) => (
              <Tooltip title={option.name} placement="top-start">
                <div className="label-chips" key={index}>
                  <>
                    <Chip
                      icon={
                        <FiberManualRecordIcon
                          style={{
                            fontSize: "10px",
                            marginLeft: "3px",
                            color: option.color_code === "#FFFFFF" ? "#000000" : option.color_code,
                          }}
                        />
                      }
                      style={{
                        // backgroundColor: option.color_code,
                        color: option.color_code === "#FFFFFF" ? "#000000" : option.color_code,
                      }}
                      label={option.name}
                      size="small"
                      variant="outlined"
                    />{" "}
                  </>
                </div>
              </Tooltip>
            ))}
            {dataItem?.options.length > 2 ? (
              <span>
                <Tooltip
                  title={dataItem.options
                    .slice(2)
                    ?.map((op: any) => op?.name)
                    .join(", ")}
                >
                  <span>+{dataItem.options.length - 2}</span>
                </Tooltip>
              </span>
            ) : (
              <></>
            )}
          </div>

          <div className="edit-chips">
            <IconButton aria-label="delete" onClick={onEditClick}>
              <img src={EditIcon} alt="" height={22} width={20} />
            </IconButton>
          </div>
        </div>
      </div>
    );
  },
  item: {
    responseChoice: responseChoice?.MULTIPLE,
  },
  dragType: itemTypes.RESPONSE_CHOICE_SET,
});

export const GlobalResponseSet = withDragHOC({
  WrappedComponent: ({ dataItem, selectedDataset, onClick, onEditClick }: any) => {
    return (
      <div onClick={onClick} style={{ pointerEvents: selectedDataset?.lock ? "none" : "auto" }}>
        <div
          className="rendering_multiple_choice_response"
          style={{
            marginTop: "10px 0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div className="label-chips">
            <Typography
              variant="h6"
              style={{
                fontSize: "15px",
              }}
              gutterBottom
            >
              {dataItem?.name}
            </Typography>
          </div>

          <div className="edit-chips">
            <IconButton aria-label="delete" onClick={onEditClick}>
              <img src={EditIcon} alt="" height={18} width={16} />
            </IconButton>
          </div>
        </div>
      </div>
    );
  },
  dragType: itemTypes.RESPONSE_CHOICE_SET,
  item: { responseChoice: responseChoice?.GLOBAL },
});

export const InternalResponseSet = withDragHOC({
  WrappedComponent: ({ dataItem, selectedDataset, onClick, onEditClick }: any) => {
    const canDragStatus = !moduleIdsFnR?.includes(dataItem?.module_id);

    return (
      <div
        onClick={canDragStatus ? onClick : () => {}}
        style={{
          opacity: canDragStatus ? 1 : 0.4,
          cursor: canDragStatus ? "drag" : "cursor: not-allowed",
          pointerEvents: selectedDataset?.lock ? "none" : "auto",
        }}
      >
        <div
          className="rendering_multiple_choice_response"
          style={{
            marginTop: "18px 0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div className="label-chips">
            <Typography
              variant="h6"
              className="element__interal"
              style={{
                fontWeight: 400,
                fontSize: "15px",
              }}
              gutterBottom
            >
              {dataItem?.name}
            </Typography>
          </div>
        </div>
      </div>
    );
  },
  item: {
    responseChoice: responseChoice?.INTERNAL_RESPONSE_SET,
  },
  dragType: itemTypes.INTERNAL_RESPONSE,
  canDrag: (data: any) => {
    return !moduleIdsFnR?.includes(data?.module_id);
  },
});

export const ExternalResponseSet = withDragHOC({
  WrappedComponent: ({ dataItem, onClick, onEditClick }: any) => {
    return (
      <div onClick={onClick}>
        <div
          className="rendering_multiple_choice_response"
          style={{
            marginTop: "18px 0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div className="label-chips">
            <Typography
              variant="h6"
              style={{
                fontWeight: 400,
                fontSize: "15px",
              }}
              gutterBottom
            >
              {dataItem?.name}
            </Typography>
          </div>
        </div>
      </div>
    );
  },
  item: {
    responseChoice: responseChoice?.EXTERNAL_RESPONSE_SET,
  },
  dragType: itemTypes.RESPONSE_CHOICE_SET,
});

// dropdown component
export const MultipleChoiceResponseDropdown = ({
  handleEditGlobalResponse,
  searchResponse,
  setSearchResponse,
  multipleResponseData,
  updateTemplateDatasets,
  updateTemplateDatasetsBeta,
  selectedDataset,
  setResponseSetId,
  templateDatasets,
  responseSetId,
  setOpenMCRModal,
  openMCRModal,
  setSelectedData,
}: any) => {
  return (
    <div id="MultipleChoiceQuestions">
      <TextField
        fullWidth
        id="fullWidth"
        placeholder="Search for Responses"
        onChange={(e) => {
          setSearchResponse(e.target.value);
        }}
        value={searchResponse}
        InputProps={{
          startAdornment: (
            <InputAdornment position="end">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      <Button
        variant="contained"
        id="addResponseButton"
        className="action__button"
        fullWidth
        onClick={() => {
          setOpenMCRModal(!openMCRModal);
        }}
      >
        Add Response
      </Button>

      {multipleResponseData.map((item: any, keyIndexing: number) => (
        <>
          <IndividualMultipleResponseData
            key={keyIndexing}
            dataItem={item}
            id={item?.id}
            selectedDataset={selectedDataset}
            onClick={() => {
              let parent: any;
              if (selectedDataset?.component === "logic") {
                const findParent = templateDatasets.find(
                  (it: any) => it?.id === selectedDataset.parent,
                );
                setSelectedData(findParent);
                parent = findParent;
              } else {
                parent = selectedDataset;
              }

              // updateTemplateDatasets(parent, 'response_type', item?.id);
              // updateTemplateDatasets(parent, 'response_choice', 'multiple');
              // updateTemplateDatasets(parent, 'type', 'Array');
              const foundLogic = templateDatasets?.find(
                (logic: any) => logic?.parent === parent?.id,
              );
              let objectState: any = {};

              if (foundLogic) {
                // objectState = {
                //   ...objectState,
                //   response_choice: 'multiple',
                //   response_type: item?.response_type,
                //   logicOptions: item?.options?.map((it: any) => it?.name),
                //   logicApi: {
                //     url: item?.url || item?.id,
                //     response_choice: 'multiple',
                //     field: 'name',
                //     storeKey: item?.response_type,
                //     // apiOptions: responseOptionsData?.options || null,
                //   },

                //   selectField: true,
                // };
                updateTemplateDatasetsBeta({
                  selectedDataset: foundLogic,
                  key: "logic",
                  dataObjects: {
                    response_choice: "multiple",
                    response_type: item?.response_type,
                    logicOptions: item?.options?.map((it: any) => it?.name),
                    logicApi: {
                      url: item?.url || item?.id,
                      response_choice: "multiple",
                      field: "name",
                      storeKey: item?.response_type,
                      // apiOptions: responseOptionsData?.options || null,
                    },

                    selectField: true,
                  },
                });
                // updateTemplateDatasets(
                //   foundLogic,
                //   'logicOptions',
                //   item?.options?.map((it: any) => it?.name),
                // );
                // updateTemplateDatasets(foundLogic, 'selectField', true);
              }
              updateTemplateDatasetsBeta({
                selectedDataset: parent,
                dataObjects: {
                  response_type: item?.id,
                  type: "Array",
                  response_choice: responseChoice.MULTIPLE,
                  // ...objectState,
                },
              });
            }}
            onEditClick={() => handleEditGlobalResponse("MCR", item?.id)}
          />
        </>
      ))}

      <MCRModal
        setOpenModal={() => {
          setResponseSetId(null);
          setOpenMCRModal(!openMCRModal);
        }}
        openModal={openMCRModal}
        responseSetId={responseSetId}
      />
    </div>
  );
};

export const GlobalChoiceResponseDropdown = ({
  handleEditGlobalResponse,
  globalResponseData,
  openGRSModal,
  setGsrResponseSetId,
  updateTemplateDatasets,
  updateTemplateDatasetsBeta,
  selectedDataset,
  gsrResponseSetId,
  templateDatasets,
  setOpenGRSModal,
  searchResponse,
  setSearchResponse,
}: any) => {
  return (
    <>
      <TextField
        fullWidth
        id="fullWidth"
        placeholder="Search for Responses"
        onChange={(e) => {
          setSearchResponse(e.target.value);
        }}
        value={searchResponse}
        InputProps={{
          startAdornment: (
            <InputAdornment position="end">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      <Button
        variant="contained"
        id="addResponseButton"
        fullWidth
        className="action__button"
        onClick={() => {
          setOpenGRSModal(!openGRSModal);
        }}
      >
        Create New
      </Button>
      {globalResponseData?.map((item: any, index: number) => {
        return (
          <GlobalResponseSet
            selectedDataset={selectedDataset}
            onClick={() => {
              const foundLogic = templateDatasets?.find(
                (logic: any) => logic?.parent === selectedDataset?.id,
              );
              let objectState: any = {};

              if (foundLogic) {
                updateTemplateDatasetsBeta({
                  selectedDataset: foundLogic,
                  key: "logic",
                  dataObjects: {
                    response_choice: "global",
                    response_type: item?.response_type,
                    logicOptions: item?.options?.map((it: any) => it?.name),
                    logicApi: {
                      url: item?.url || item?.id,
                      response_choice: "global",
                      field: "name",
                      storeKey: item?.response_type,
                      // apiOptions: responseOptionsData?.options || null,
                    },

                    selectField: true,
                  },
                });
              }
              updateTemplateDatasetsBeta({
                selectedDataset: selectedDataset,
                dataObjects: {
                  response_type: item?.id,
                  type: "Array",
                  response_choice: "global",
                  // ...objectState,
                },
              });
            }}
            id={item?.id}
            onEditClick={() => {
              handleEditGlobalResponse("GRS", item?.id);
            }}
            dataItem={item}
            key={item?.id || index}
          />
        );
      })}

      <GRSModal
        responseSetId={gsrResponseSetId}
        setOpenModal={() => {
          setGsrResponseSetId(null);
          setOpenGRSModal(!openGRSModal);
        }}
        openModal={openGRSModal}
      />
    </>
  );
};

export const ExternalChoiceResopseDropdown = ({
  setSearchExternalResponse,
  searchExternalResponse,
  externalResponseData,
  openGRSModal,
  setGsrResponseSetId,
  updateTemplateDatasets,
  updateTemplateDatasetsBeta,
  selectedDataset,
  gsrResponseSetId,
  setOpenGRSModal,
}: any) => {
  return (
    <>
      {" "}
      <TextField
        fullWidth
        id="fullWidth"
        placeholder="Search for Responses"
        onChange={(e: any) => {
          setSearchExternalResponse(e.target.value);
        }}
        value={searchExternalResponse}
        InputProps={{
          startAdornment: (
            <InputAdornment position="end">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment
              position="start"
              style={{
                cursor: "pointer",
                opacity: 0.5,
              }}
              onClick={() => {
                setSearchExternalResponse("");
              }}
            >
              x
            </InputAdornment>
          ),
        }}
      />
      {/* <Button
        variant="contained"
        id="addResponseButton"
        fullWidth
        className="action__button"
        onClick={() => {
          // setOpenGRSModal(!openGRSModal);
        }}>
        Create New
      </Button> */}
      <div
        className="external_response_set_container"
        style={{
          marginTop: "15px",
        }}
      >
        {externalResponseData.length === 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h6"
              style={{
                fontSize: "15px",
                fontWeight: 400,
                color: "#000000",
                opacity: 0.5,
              }}
              gutterBottom
            >
              No Responses Found
            </Typography>
          </div>
        )}
        {externalResponseData?.map((item: any, index: number) => {
          return (
            <ExternalResponseSet
              key={index}
              dataItem={item}
              id={item?.id}
              onClick={() => {
                updateTemplateDatasetsBeta({
                  selectedDataset: selectedDataset,
                  dataObjects: {
                    response_type: item?.id,
                    response_choice: responseChoice.EXTERNAL_RESPONSE_SET,
                    logicApi: {
                      url: item?.id,
                      response_choice: "external",
                      storeKey: item?.id,
                      field: item?.field || "name",
                    },
                  },
                });
                // updateTemplateDatasets(selectedDataset, 'response_type', item?.id);
                // updateTemplateDatasets(
                //   selectedDataset,
                //   'response_choice',
                //   responseChoice.EXTERNAL_RESPONSE_SET,
                // );
              }}
              onEditClick={() => {}}
            />
          );
        })}
      </div>
      <GRSModal
        responseSetId={gsrResponseSetId}
        setOpenModal={() => {
          setGsrResponseSetId(null);
          setOpenGRSModal(!openGRSModal);
        }}
        openModal={openGRSModal}
      />
    </>
  );
};

export const InternalChoiceResponseDropdown = ({
  setSearchInternalResponse,
  searchInternalResponse,
  internalResponseData,
  openGRSModal,
  setGsrResponseSetId,
  updateTemplateDatasets,
  updateTemplateDatasetsBeta,
  selectedDataset,
  gsrResponseSetId,
  setOpenGRSModal,
  InternalSearchResponse,
  templateDatasets,
  setSelectedData,
}: any) => {
  return (
    // <CustomDropDown
    //   children={

    //   }
    // />
    <>
      {" "}
      <TextField
        fullWidth
        id="fullWidth"
        placeholder="Search for Responses"
        onChange={(e: any) => {
          setSearchInternalResponse(e.target.value);
        }}
        value={searchInternalResponse}
        InputProps={{
          startAdornment: (
            <InputAdornment position="end">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment
              position="start"
              style={{
                cursor: "pointer",
                opacity: 0.5,
              }}
              onClick={() => {
                setSearchInternalResponse("");
              }}
            >
              x
            </InputAdornment>
          ),
        }}
      />
      {/* <Button
        variant="contained"
        id="addResponseButton"
        className="action__button"
        fullWidth
        onClick={() => {
          // setOpenGRSModal(!openGRSModal);
        }}>
        Create New
      </Button> */}
      <div
        className="internal_response_set_container"
        style={{
          marginTop: "15px",
        }}
      >
        {internalResponseData.length === 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h6"
              style={{
                fontSize: "15px",
                fontWeight: 400,
                color: "#000000",
                opacity: 0.5,
              }}
              gutterBottom
            >
              No Responses Found
            </Typography>
          </div>
        )}
        {internalResponseData?.map((item: any, index: number) => {
          return (
            <InternalResponseSet
              key={index}
              dataItem={item}
              id={item?.id}
              selectedDataset={selectedDataset}
              onClick={async () => {
                let parent: any;
                if (selectedDataset?.component === "logic") {
                  const findParent = templateDatasets.find(
                    (it: any) => it?.id === selectedDataset.parent,
                  );
                  setSelectedData(findParent);
                  parent = findParent;
                } else {
                  parent = selectedDataset;
                }

                // updateTemplateDatasetsBeta({
                //   selectedDataset: parent,
                //   dataObjects: {
                //     response_type: item?.id,
                //     type: 'Array',
                //     response_choice: responseChoice.INTERNAL_RESPONSE_SET,
                //   },
                // });

                const foundLogic = templateDatasets?.find(
                  (logic: any) => logic?.parent === parent?.id,
                );
                let objectState: any = {};
                if (foundLogic) {
                  updateTemplateDatasetsBeta({
                    selectedDataset: foundLogic,
                    key: "logic",
                    dataObjects: {
                      response_choice: "internal",
                      response_type: item?.id,
                      // logicOptions: item?.options?.map((it: any) => it?.name),
                      logicApi: {
                        url: item?.options || item?.id,
                        response_choice: "internal",
                        field: item?.field,
                        storeKey: item?.id,
                        // apiOptions: responseOptionsData?.options || null,
                      },

                      selectField: true,
                    },
                  });

                  // await fetchApI({
                  //   setterFunction: (data: any) => {
                  //     if (data?.length >= 0) {
                  //       objectState = {
                  //         ...objectState,
                  //         logicOptions: data?.map((it: any) => it?.[item?.field] || it?.name),
                  //         selectField: true,
                  //       };
                  //     }
                  //   },
                  //   url: item?.options,
                  //   // queryParam: 'size=99',
                  //   replace: true,
                  // });
                }

                updateTemplateDatasetsBeta({
                  selectedDataset: parent,
                  dataObjects: {
                    response_type: item?.id,
                    type: "Array",
                    response_choice: responseChoice.INTERNAL_RESPONSE_SET,
                    // ...objectState,
                  },
                });
              }}
              onEditClick={() => {}}
              canDrag={(data: any) => {}}
            />
          );
        })}
      </div>
      <GRSModal
        responseSetId={gsrResponseSetId}
        setOpenModal={() => {
          setGsrResponseSetId(null);
          setOpenGRSModal(!openGRSModal);
        }}
        openModal={openGRSModal}
      />
    </>
  );
};

const ResponseTab = ({ activeTab }: any) => {
  const selectedDataset = useTemplateFieldsStore((state: any) => state?.selectedDataset);
  const templateDatasets = useTemplateFieldsStore((state: any) => state?.templateDatasets);

  const updateTemplateDatasets = useTemplateFieldsStore(
    (state: any) => state.updateTemplateDatasets,
  );
  const { updateTemplateDatasetsBeta } = useTemplateFieldsStore();

  const setSelectedData = useTemplateFieldsStore((state: any) => state.setSelectedData);

  const { question, setQuestion } = useTextAnswer();
  const [searchResponse, setSearchResponse] = React.useState("");
  const [open, setOpen] = React.useState(true);
  const [openMCRModal, setOpenMCRModal] = React.useState(false);

  const [openGRSModal, setOpenGRSModal] = React.useState(false);
  // const [multipleResponseData, setResponseData] = React.useState([]);
  // const [globalResponseData, setGlobalResponseData] = React.useState([]);
  const [responseSetId, setResponseSetId] = React.useState<number | null>(null);
  const [gsrResponseSetId, setGsrResponseSetId] = React.useState<number | null>(null);

  const [searchInternalResponse, setSearchInternalResponse] = React.useState<string>("");
  const [searchExternalResponse, setSearchExternalResponse] = React.useState<string>("");

  const [internalResponseData, setInternalResponseData] = React.useState<any>([]);
  const [externalResponseData, setExternalResponseData] = React.useState<any>([]);

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(e.target.value);
  };

  const { multipleResponseData, fetchMultipleResponseData, globalResponseData }: any =
    useApiOptionsStore();
  const globalResponseDataFilter = globalResponseData.filter((item: any) => {
    return item.name.toLowerCase().indexOf(searchResponse.toLowerCase()) !== -1;
  });

  const multipleResponseDataFilter = multipleResponseData.filter((item: any) => {
    const options = item.options || [];
    return options.some((option: any) =>
      option.name?.toLowerCase().includes(searchResponse?.toLowerCase()),
    );
  });

  const fetchResponseData = async () => {
    // await fetchApI({
    //   setterFunction: setResponseData,
    //   url: 'multiple-response/',
    // });
    // await fetchApI({
    //   setterFunction: setGlobalResponseData,
    //   url: 'global-response/',
    // });
  };

  const handleEditGlobalResponse = (text: string, id: number) => {
    if (text === "GRS") {
      setGsrResponseSetId(id);
      setOpenGRSModal(true);
    } else if (text === "MCR") {
      setResponseSetId(id);
      setOpenMCRModal(true);
    }
  };

  const InternalSearchResponse = useDebounceSearch(searchInternalResponse, 1000);
  const ExternalSearchResponse = useDebounceSearch(searchExternalResponse, 1000);

  const handleSearchInternalResponse = async () => {
    await fetchApI({
      setterFunction: setInternalResponseData,
      url: `internal-response/?q=${InternalSearchResponse}&page=1&size=50`,
    });
  };

  useEffect(() => {
    handleSearchInternalResponse();
  }, [InternalSearchResponse]);

  const handleSearchExternalResponse = async () => {
    await fetchApI({
      setterFunction: setExternalResponseData,
      url: `external-response/?q=${ExternalSearchResponse}&page=1&size=50`,
    });
  };

  useEffect(() => {
    handleSearchExternalResponse();
  }, [ExternalSearchResponse]);

  useEffect(() => {
    fetchResponseData();
  }, []);

  return (
    <div>
      <div id="ResponseTab" className="custom-template-sidebar-padding-tb">
        <div className={activeTab !== "default" ? "custom__response-padding" : ""}>
          {(() => {
            switch (activeTab) {
              case "multiple":
                return (
                  <MultipleChoiceResponseDropdown
                    handleEditGlobalResponse={handleEditGlobalResponse}
                    searchResponse={searchResponse}
                    setSearchResponse={setSearchResponse}
                    multipleResponseData={multipleResponseDataFilter}
                    updateTemplateDatasets={updateTemplateDatasets}
                    updateTemplateDatasetsBeta={updateTemplateDatasetsBeta}
                    selectedDataset={selectedDataset}
                    setResponseSetId={setResponseSetId}
                    templateDatasets={templateDatasets}
                    responseSetId={responseSetId}
                    setOpenMCRModal={setOpenMCRModal}
                    openMCRModal={openMCRModal}
                    setSelectedData={setSelectedData}
                  />
                );
              case "global":
                return (
                  <GlobalChoiceResponseDropdown
                    handleEditGlobalResponse={handleEditGlobalResponse}
                    globalResponseData={globalResponseDataFilter}
                    openGRSModal={openGRSModal}
                    searchResponse={searchResponse}
                    setSearchResponse={setSearchResponse}
                    setGsrResponseSetId={setGsrResponseSetId}
                    updateTemplateDatasets={updateTemplateDatasets}
                    updateTemplateDatasetsBeta={updateTemplateDatasetsBeta}
                    selectedDataset={selectedDataset}
                    gsrResponseSetId={gsrResponseSetId}
                    setOpenGRSModal={setOpenGRSModal}
                    templateDatasets={templateDatasets}
                    setSelectedData={setSelectedData}
                  />
                );
              case "internal":
                return (
                  <InternalChoiceResponseDropdown
                    setSearchInternalResponse={setSearchInternalResponse}
                    searchInternalResponse={searchInternalResponse}
                    internalResponseData={internalResponseData}
                    openGRSModal={openGRSModal}
                    setGsrResponseSetId={setGsrResponseSetId}
                    updateTemplateDatasets={updateTemplateDatasets}
                    updateTemplateDatasetsBeta={updateTemplateDatasetsBeta}
                    selectedDataset={selectedDataset}
                    gsrResponseSetId={gsrResponseSetId}
                    setOpenGRSModal={setOpenGRSModal}
                    InternalSearchResponse={InternalSearchResponse}
                    setSelectedData={setSelectedData}
                    templateDatasets={templateDatasets}
                  />
                );
              case "external":
                return (
                  <ExternalChoiceResopseDropdown
                    setSearchExternalResponse={setSearchExternalResponse}
                    searchExternalResponse={searchExternalResponse}
                    externalResponseData={externalResponseData}
                    openGRSModal={openGRSModal}
                    setGsrResponseSetId={setGsrResponseSetId}
                    updateTemplateDatasets={updateTemplateDatasets}
                    updateTemplateDatasetsBeta={updateTemplateDatasetsBeta}
                    selectedDataset={selectedDataset}
                    gsrResponseSetId={gsrResponseSetId}
                    setOpenGRSModal={setOpenGRSModal}
                    setSelectedData={setSelectedData}
                    templateDatasets={templateDatasets}
                  />
                );

              default:
                return <SelectResponseType />;
            }
          })()}
        </div>
      </div>
    </div>
  );
};

export default ResponseTab;
