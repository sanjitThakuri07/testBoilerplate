import { useTextAnswer } from "src/store/zustand/globalStates/templates/TextAnswer";
import {
  FormGroup,
  Grid,
  OutlinedInput,
  InputLabel,
  TextField,
  InputAdornment,
  Button,
  Stack,
  Chip,
  IconButton,
  Typography,
} from "@mui/material";
import React, { useEffect, CSSProperties } from "react";
import SelectResponseType from "../SelectResponseType/SelectResponseType";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Collapse, List, ListItemButton, ListItemText } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MCRModal from "./MultipleChoiceResponse/MCRModal";
import GRSModal from "./GlobalResponseSet/GRSModal";
import EditIcon from "src/assets/template/icons/chip_edit_icon.png";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { fetchApI } from "src/modules/apiRequest/apiRequest";
import useDebounceSearch from "hooks/useDebounceSearch";
import {
  useTemplateFieldsStore,
  selectFiledOptions,
} from "src/modules/template/store/templateFieldsStore";
import { itemTypes, responseChoice } from "src/modules/template/itemTypes/itemTypes";
import { useDrag, useDrop } from "react-dnd";
import { withDragHOC } from "HOC/withDragDropHoc";
import responseType from "@constants/template/responseType";

interface CustomDropDownProps {
  children?: React.ReactNode;
  heading?: string;
}

export const Description = () => {
  return <p>hii</p>;
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
  WrappedComponent: ({ dataItem, onClick, onEditClick }: any) => {
    return (
      <div onClick={onClick}>
        <div
          className="rendering_multiple_choice_response"
          style={{
            marginTop: "10px 0",
            display: "flex",
            justifyContent: "space-between",
            // alignItems: 'center',
          }}
        >
          <div
            className="label-chips-container"
            style={{
              display: "flex",
            }}
          >
            {dataItem.options.slice(0, 3).map((option: any, index: number) => (
              <div className="label-chips" key={index}>
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
              </div>
            ))}
            {dataItem.options.length > 3 ? (
              <>
                <Chip label={`+${dataItem.options.length - 3}`} size="small" variant="outlined" />
              </>
            ) : (
              ""
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
  WrappedComponent: ({ dataItem, onClick, onEditClick }: any) => {
    return (
      <div onClick={onClick}>
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
    responseChoice: responseChoice?.INTERNAL_RESPONSE_SET,
  },
  dragType: itemTypes.RESPONSE_CHOICE_SET,
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

// wrapping with drag HOC

const ResponseTab = (updateDataState: any) => {
  const selectedDataset = useTemplateFieldsStore((state: any) => state?.selectedDataset);
  const templateDatasets = useTemplateFieldsStore((state: any) => state?.templateDatasets);

  const updateTemplateDatasets = useTemplateFieldsStore(
    (state: any) => state.updateTemplateDatasets,
  );
  const setSelectedData = useTemplateFieldsStore((state: any) => state.setSelectedData);

  const { question, setQuestion } = useTextAnswer();
  const [searchResponse, setSearchResponse] = React.useState("");
  const [open, setOpen] = React.useState(true);
  const [openMCRModal, setOpenMCRModal] = React.useState(false);

  const [openGRSModal, setOpenGRSModal] = React.useState(false);
  const [multipleResponseData, setResponseData] = React.useState([]);
  const [globalResponseData, setGlobalResponseData] = React.useState([]);
  const [responseSetId, setResponseSetId] = React.useState<number | null>(null);
  const [gsrResponseSetId, setGsrResponseSetId] = React.useState<number | null>(null);

  const [searchInternalResponse, setSearchInternalResponse] = React.useState<string>("");
  const [searchExternalResponse, setSearchExternalResponse] = React.useState<string>("");

  const [internalResponseData, setInternalResponseData] = React.useState<any>([]);
  const [externalResponseData, setExternalResponseData] = React.useState<any>([]);

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(e.target.value);
  };

  const fetchResponseData = async () => {
    await fetchApI({
      setterFunction: setResponseData,
      url: "multiple-response/",
    });
    await fetchApI({
      setterFunction: setGlobalResponseData,
      url: "global-response/",
    });
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
      <div id="ResponseTab">
        <Grid container direction="row" alignItems="center" spacing={2}>
          <Grid item>
            <InputLabel htmlFor="Question">
              <div className="label-heading">Question</div>
            </InputLabel>
          </Grid>
          <Grid item>
            <FormGroup className="input-holder">
              <OutlinedInput
                id="Question"
                type="text"
                placeholder="Question"
                onChange={(e: any) => {
                  updateTemplateDatasets(selectedDataset, "label", e.target.value);
                  // handleQuestionChange(e);
                  // updateDataState.updateDataState.updateDataState(
                  //   {
                  //     id: "fca3bad2-ccf3-4a46-88e8-95c7648c5616",

                  //     name: "New Question",
                  //     label: "New Question",
                  //     parent: null,
                  //   },
                  //   e.target.value
                  // );
                }}
                // size="small"
                fullWidth
                name="Question"
                value={
                  templateDatasets?.find((list: any) => list.id === selectedDataset?.id)?.label
                }

                // onChange={handleChange}
                // onBlur={handleBlur}
                // value={values.Question}
                // error={Boolean(touched.Question && errors.Question)}
              />
              {/* {Boolean(touched.Question && errors.Question) && (
                <FormHelperText error>{errors.Question}</FormHelperText>
              )} */}
            </FormGroup>
          </Grid>
        </Grid>

        <Grid container direction="row" alignItems="center" spacing={2}>
          <SelectResponseType />
        </Grid>

        <CustomDropDown
          heading={"Multiple Choice Response"}
          children={
            <>
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
                      id={item.id}
                      onClick={() => {
                        updateTemplateDatasets(selectedDataset, "response_type", item?.id);
                        updateTemplateDatasets(selectedDataset, "response_choice", "multiple");
                        updateTemplateDatasets(selectedDataset, "type", "Array");
                        const foundLogic = templateDatasets?.find(
                          (logic: any) => logic?.parent === selectedDataset?.id,
                        );
                        if (foundLogic) {
                          updateTemplateDatasets(
                            foundLogic,
                            "logicOptions",
                            item?.options?.map((it: any) => it?.name),
                          );
                          updateTemplateDatasets(foundLogic, "selectField", true);
                        }
                      }}
                      onEditClick={() => handleEditGlobalResponse("MCR", item.id)}
                    />
                  </>
                ))}

                {/* <div
                  className="rendering_multiple_choice_response"
                  style={{
                    marginTop: '10px 0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <div className="label-chips">
                    <Chip
                      icon={
                        <FiberManualRecordIcon style={{ fontSize: '10px', marginLeft: '3px' }} />
                      }
                      label="Fair"
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      icon={
                        <FiberManualRecordIcon style={{ fontSize: '10px', marginLeft: '3px' }} />
                      }
                      label="Poor"
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      icon={
                        <FiberManualRecordIcon style={{ fontSize: '10px', marginLeft: '3px' }} />
                      }
                      label="N/A"
                      size="small"
                      variant="outlined"
                    />
                  </div>

                  <div className="edit-chips">
                    <IconButton aria-label="delete" onClick={() => console.log('jj')}>
                      <img src={EditIcon} alt="" height={22} width={20} />
                    </IconButton>
                  </div>
                </div>

                <div
                  className="rendering_multiple_choice_response"
                  style={{
                    marginTop: '10px 0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <div className="label-chips">
                    <Chip
                      label="Fair"
                      style={{ borderRadius: '5px', paddingTop: '2px' }}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      label="Good"
                      style={{ borderRadius: '5px', paddingTop: '2px' }}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      label="Safe"
                      style={{ borderRadius: '5px', paddingTop: '2px' }}
                      size="small"
                      variant="outlined"
                    />
                  </div>
                  <div className="edit-chips">
                    <IconButton aria-label="delete" onClick={() => console.log('jj')}>
                      <img src={EditIcon} alt="" height={22} width={20} />
                    </IconButton>
                  </div>
                </div> */}

                <MCRModal
                  setOpenModal={() => {
                    setResponseSetId(null);
                    setOpenMCRModal(!openMCRModal);
                  }}
                  openModal={openMCRModal}
                  responseSetId={responseSetId}
                />
              </div>
            </>
          }
        />
        <CustomDropDown
          heading={"Global Response Sets"}
          children={
            <>
              <Button
                variant="contained"
                id="addResponseButton"
                fullWidth
                onClick={() => {
                  setOpenGRSModal(!openGRSModal);
                }}
              >
                Create New
              </Button>
              {globalResponseData?.map((item: any, index: number) => {
                return (
                  <GlobalResponseSet
                    onClick={() => {
                      updateTemplateDatasets(selectedDataset, "response_type", item?.id);
                      updateTemplateDatasets(selectedDataset, "response_choice", "global");
                      updateTemplateDatasets(selectedDataset, "type", "Array");
                      const foundLogic = templateDatasets?.find(
                        (logic: any) => logic?.parent === selectedDataset?.id,
                      );
                      if (foundLogic) {
                        updateTemplateDatasets(
                          foundLogic,
                          "logicOptions",
                          item?.options?.map((it: any) => it?.name),
                        );
                        updateTemplateDatasets(foundLogic, "selectField", true);
                      }
                    }}
                    id={item?.id}
                    onEditClick={() => {
                      handleEditGlobalResponse("GRS", item.id);
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
          }
        />
        <CustomDropDown
          heading={"Internal Response Sets"}
          children={
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
              <Button
                variant="contained"
                id="addResponseButton"
                fullWidth
                onClick={() => {
                  // setOpenGRSModal(!openGRSModal);
                }}
              >
                Create New
              </Button>
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
                      onClick={() => {
                        updateTemplateDatasets(selectedDataset, "response_type", item?.id);
                        updateTemplateDatasets(
                          selectedDataset,
                          "response_choice",
                          responseChoice.INTERNAL_RESPONSE_SET,
                        );
                        console.log({ InternalSearchResponse });
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
          }
        />

        <CustomDropDown
          heading={"External Response Sets"}
          children={
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
              <Button
                variant="contained"
                id="addResponseButton"
                fullWidth
                onClick={() => {
                  // setOpenGRSModal(!openGRSModal);
                }}
              >
                Create New
              </Button>
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
                        updateTemplateDatasets(selectedDataset, "response_type", item?.id);
                        updateTemplateDatasets(
                          selectedDataset,
                          "response_choice",
                          responseChoice.EXTERNAL_RESPONSE_SET,
                        );
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
          }
        />
      </div>
    </div>
  );
};

export default ResponseTab;
