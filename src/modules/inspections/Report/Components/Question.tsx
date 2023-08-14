import {
  Box,
  Checkbox,
  Collapse,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import responseItems from "constants/template/responseItems";
import { validateInput } from "containers/template/validation/inputLogicCheck";
import { findData } from "containers/template/validation/keyValidationFunction";

import { faAngleRight, faCircle, faFileLines } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GridCloseIcon } from "@mui/x-data-grid";
import ActionIcon from "src/assets/template/mobileIcons/action.png";
import AddAssignActivity from "containers/AssignActivities/AddAssignActivity";
import { fetchIndividualApi } from "src/modules/apiRequest/apiRequest";
import { useCurrentLayout, useReportDataSets } from "containers/inspections/store/inspection";
import { useInspectionStore } from "containers/template/store/inspectionStore";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { RenderMedia } from "./Media";
import Vector from "./Vector";

const returnValue = (value: any, typeOfResponse: any, flaggedValue: any, data: any) => {
  if (value === ("text" || "date")) {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map((v) => {
      if (flaggedValue?.includes(v)) {
        return (
          <div className="status_highlight">
            <Vector />
            <div className="status_highlight_text">{v}</div>
          </div>
        );
      } else {
        return <span>{v}</span>;
      }
    });

    // if (value.map((v) => flaggedValue?.includes(v))) {
    //   return (
    //     <div className="status_highlight">
    //       <div className="status_highlight_text">{v}</div>
    //     </div>
    //   );
    // } else {
    //   <span></span>;
    // }
    // return value;
  }
  if (value?.length <= 0 && data?.type !== "instruction") {
    return "Unanswered";
  }
  if (typeof value === "boolean") {
    return <Checkbox defaultChecked={value ? true : false} disabled />;
  }
  return (
    <>
      <>{value}</>
    </>
  );
};

async function APICall({ type, field, token, setInitialValues, objKey, id }: any) {
  // if (objKey && field?.api) {
  //   setIsLoading(true);
  await fetchIndividualApi({
    setterFunction: (data: any) => {
      setInitialValues?.((prev: any) => [...prev, data]);
    },
    url: "activity",
    id: id,
    queryParam: "",
    token,
    // getAll: true,
  });
  // }
}

const RenderActions = ({ action, mode }: any) => {
  const navigate = useNavigate();
  const [assignData, setAssignData] = useState([]);
  const [currentActivity, setCurrentActivity] = useState([]);
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    action?.map((activity: any) => {
      setCurrentActivity((prev): any => [...prev, activity?.id]);
    });
  }, []);

  useEffect(() => {
    if (currentActivity?.length && !params?.publicInspectionId) {
      console.log("first");
      currentActivity?.forEach(async (it: any) => {
        await APICall({
          field: "data",
          setInitialValues: setAssignData,
          id: it,
        });
      });
    }
  }, [currentActivity, params]);

  useEffect(() => {
    const token = searchParams?.get("token");

    if (currentActivity?.length && token) {
      currentActivity?.forEach(async (it: any) => {
        await APICall({
          field: "data",
          setInitialValues: setAssignData,
          id: `${it}/public/`,
          token,
        });
      });
    }
  }, [searchParams, currentActivity]);

  return (
    <Box
      bgcolor={mode === "pdf" ? "transparent" : "#f9fafb"}
      display="flex"
      gap={"10px"}
      flexDirection="column"
      borderRadius={"4px"}
      padding={"10px 5px"}
    >
      <>Activity</>

      {assignData?.map((activity: any) => {
        if (mode === "pdf") {
          return (
            <Box className="individual_box_container">
              <Box>{activity?.title}</Box>
              <Stack direction="row" spacing={2} mt={3}>
                {/* Priority Status Due Date Assignee Title Created By */}
                <Grid
                  container
                  //   spacing={{ xs: 2, md: 3 }}
                  columns={{ xs: 4, sm: 8, md: 12 }}
                >
                  <Grid item xs={2} sm={4} md={4}>
                    <Stack direction="row" spacing={1}>
                      <Box sx={{ fontWeight: 500 }}>Priority:</Box>
                      <Box sx={{ opacity: "0.8" }}>{activity?.priority}</Box>
                    </Stack>
                  </Grid>
                  <Grid item xs={2} sm={4} md={4}>
                    <Stack direction="row" spacing={1}>
                      <Box sx={{ fontWeight: 500 }}>Status:</Box>
                      <Box sx={{ opacity: "0.8" }}>{activity?.status?.name}</Box>
                    </Stack>
                  </Grid>
                  <Grid item xs={2} sm={4} md={4}>
                    <Stack direction="row" spacing={1}>
                      <Box sx={{ fontWeight: 500 }}>Assignee:</Box>
                      <Box sx={{ opacity: "0.8" }}>
                        {activity?.users_obj?.map((a: any) => a?.name)?.join(", ")}
                      </Box>
                    </Stack>
                  </Grid>
                  <Grid item xs={2} sm={4} md={4} mt={0.5}>
                    <Stack direction="row" spacing={1}>
                      <Box sx={{ fontWeight: 500 }}>Created By:</Box>
                      <Box sx={{ opacity: "0.8" }}>{activity?.created_by}</Box>
                    </Stack>
                  </Grid>
                </Grid>
              </Stack>
            </Box>
          );
        }
        return (
          <Box>
            <div className="report__action-actions">
              <div className="actions__details">
                <div className="title__status">
                  <div className="status_highlight">
                    <FontAwesomeIcon icon={faCircle} size="xs" />
                    <div className="status_highlight_text">{activity?.status?.name}</div>
                  </div>
                  <div>{activity?.title}</div>
                </div>
                <div onClick={() => navigate(`/assign-activities/edit/${activity?.id}`)}>
                  <FontAwesomeIcon icon={faAngleRight} />
                </div>
              </div>
            </div>
          </Box>
        );
      })}
    </Box>
  );
};
const mediaTypes = {
  image: [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp", ".svg"],
};
const FileRender = ({ file }: any) => {
  const images: JSX.Element[] = [];
  const otherFiles: JSX.Element[] = [];

  if (Array.isArray(file)) {
    file?.forEach((v: any) => {
      const fileType = v?.documents?.[0]?.split("/").pop()?.split(".").pop();

      if (fileType && mediaTypes.image.includes(`.${fileType}`)) {
        images.push(
          <img
            src={`${process.env.VITE_HOST_URL}/${v?.documents?.[0]}`}
            alt="not_found"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100px",
              width: "100px",
              objectFit: "contain",
            }}
          />,
        );
      } else {
        otherFiles.push(
          <Box margin={"16px 0"} padding={"16px 4px"} borderRadius="6px">
            <Box display={"flex"} alignItems={"center"} gap="10px">
              <FontAwesomeIcon icon={faFileLines} />
              <Link to={`${process.env.VITE_HOST_URL}/${v?.documents?.[0]}`}>
                {v?.documents?.[0].split("/").pop()}
              </Link>
            </Box>
          </Box>,
        );
      }
    });
  }
  return (
    <>
      {images} {otherFiles}
    </>
  );
};

const ConditionalQN = ({ icon, data, typeOfResponse, handleAction, mode }: any) => {
  if (data?.type) {
  }
  if (mode === "pdf") {
    return (
      <>
        <Box sx={{ maxWidth: 900 }} className="individual_box_container custom_border_bottom">
          <Stack direction="row" justifyContent="space-between">
            <Box sx={{ fontSize: "15px", textAlign: "justify", textJustify: "inter-word" }}>
              {data?.label}
            </Box>
            <Box sx={{ opacity: "0.7", mt: 0.3 }}>
              <div className="icon__custom_with-text">
                {returnValue(data.value, typeOfResponse, data?.flaggedValue, data)}
              </div>
            </Box>
          </Stack>
          {data?.notes?.length > 0 && <>{data?.notes}</>}
          {data?.media?.length && <FileRender file={data?.media} />}
          {typeOfResponse === "signature" && data?.file_value && (
            <div style={{ width: "100%", height: "100%", paddingLeft: "3px", paddingTop: "7px" }}>
              <div
                style={{
                  outline: "1px solid #474646e2",
                  display: "block",
                  width: "75px",
                  height: "75px",
                  padding: "0.3px",
                  boxSizing: "border-box",
                }}
              >
                <img
                  src={`${process.env.VITE_HOST_URL}/${data?.file_value}` || ""}
                  alt="signature"
                  style={{
                    // border: '1px solid #343cb7',
                    width: "inherit",
                    height: "inherit",
                  }}
                />
              </div>
            </div>
          )}
          {data?.action?.length > 0 && <RenderActions action={data?.action} mode={mode} />}
        </Box>
      </>
    );
  }
  return (
    <>
      <Box borderRadius={"4px"} p={2}>
        <Box>
          <Typography component="p">{data?.label}</Typography>
        </Box>
        <Stack sx={{ mt: 2 }} direction="row" spacing={2}>
          <div className="icon__custom_with-text">
            {!!icon && !!data.value.length && (
              <span>
                <img src={icon} alt={icon} />
              </span>
            )}{" "}
            {returnValue(data.value, typeOfResponse, data?.flaggedValue, data)}
            {}
          </div>
          {mode === "web" && (
            <div className="actions__report-actionbtn" onClick={handleAction}>
              <div>
                <div className="footer_item_icon">
                  <img src={ActionIcon} alt="" />
                </div>
                <span>Activity</span>
              </div>
            </div>
          )}
        </Stack>
        {data?.notes?.length > 0 && <>{data?.notes}</>}
        {data?.media?.length && <FileRender file={data?.media} />}
        {/* {typeOfResponse === 'signature' && data?.file_value && (
          <img
            src={`${process.env.VITE_HOST_URL}/${data?.file_value}` || ''}
            alt="my signature"
            style={{
              display: 'block',
              width: 'inherit',
              height: 'inherit',
            }}
          />
        )} */}
        {data?.action?.length > 0 && <RenderActions action={data?.action} />}
      </Box>
    </>
  );
};

const RenderQuestion = ({ data, icon, typeOfResponse, mode }: any) => {
  const { initialState, setInitialState } = useReportDataSets();
  const { updateInspection }: any = useInspectionStore();
  const { fields } = initialState;
  const { inspectionId } = useParams();

  const [state, setState] = React.useState({
    addAction: false,
  });
  const { currentReportLayout } = useCurrentLayout();
  const handleAction = () => {
    setState({ ...state, addAction: !state.addAction });
  };
  const [individualAction, setIndividualAction] = React.useState<any>({});

  if (data?.type === "media") {
    return (
      <>
        <Box className="individual_box_container custom_border_bottom">
          <Stack direction="column" justifyContent="space-between">
            <Box sx={{ fontSize: "15px", width: "80%" }}>{data?.label}</Box>
            <Box sx={{ opacity: "0.7", textAlign: "right" }}>
              {data?.value?.length > 0 ? (
                <RenderMedia data={data} mode={mode} fromQN={true} />
              ) : (
                "Unanswered"
              )}
            </Box>
          </Stack>
        </Box>
      </>
    );
  }
  if (data?.type === "Array") {
    return (
      <Box className="individual_box_container custom_border_bottom">
        <Stack direction="row" justifyContent="space-between">
          <Box sx={{ fontSize: "15px", width: "80%" }}>{data?.label}</Box>
          <Box sx={{ opacity: "0.7", textAlign: "right" }}>
            {data?.value?.length > 0
              ? data?.value?.map((v: any, index: number) => {
                  if (typeof v === "object" && !Array.isArray(v) && v !== null) {
                    return <>{v?.name}</>;
                  }
                  return <>{v?.value}</>;
                })
              : "Unanswered"}
          </Box>
        </Stack>
      </Box>
    );
  }
  if (state.addAction) {
    return (
      <>
        <AssignActionModal
          handleClose={() => {
            setState((prev: any) => ({ ...prev, addAction: false }));
          }}
          open={state.addAction}
          title={"Add Activity"}
        >
          {/* assign activity */}
          <AddAssignActivity
            getAssignValue={(datas: any) => {
              let perviousAction = datas?.action || [];
              let newValue = Array.isArray(datas)
                ? [...datas, ...(perviousAction || [])]
                : [datas, ...(perviousAction || [])];
              const updatedFields = fields.map((field: any) => {
                if (field?.id == data?.id) {
                  field.action = [...newValue, ...(field?.action || [])];
                }
                return field;
              });
              const newValues = { ...initialState, fields: updatedFields };
              updateInspection(inspectionId, newValues);
              setInitialState(newValues);
            }}
            isEdit={individualAction?.id ? true : false}
            assignData={individualAction || {}}
            handleClose={() => {
              setState((prev: any) => ({ ...prev, addAction: false }));
            }}
            className="modal__box-assign"
          />
        </AssignActionModal>
      </>
    );
  }

  function AssignActionModal({ handleClose, open, children, title }: any) {
    return (
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth={true}
        className="popup__list-styling assign__modal"
      >
        <DialogTitle className="popup__heading">
          {!!title && title}
          <IconButton onClick={handleClose} className="close__icon">
            <GridCloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className="popup__content">{children}</DialogContent>
      </Dialog>
    );
  }

  if (typeOfResponse === "checkbox") {
    if (currentReportLayout?.has_checkboxes) {
      if (currentReportLayout?.has_checked && data?.value === true) {
        return (
          <Box borderRadius={"4px"} width={"100%"} padding={"10px"}>
            <Box width={"100%"} display={"flex"} alignItems={"center"} borderRadius={"4px"}>
              <Checkbox
                color="primary"
                disabled
                checked={Boolean(data?.value)}
                checkedIcon={<img src="/assets/icons/icon-check.svg" alt="check" />}
                icon={<img src="/assets/icons/icon-uncheck.svg" alt="uncheck" />}
                indeterminateIcon={
                  <img src="/assets/icons/icon-check-remove.svg" alt="indeterminate" />
                }
              />
              <Box>{data?.label}</Box>
              {mode === "web" && (
                <div className="actions__report-actionbtn" onClick={handleAction}>
                  <div>
                    <div className="footer_item_icon">
                      <img src={ActionIcon} alt="" />
                    </div>
                    <span>Activity</span>
                  </div>
                </div>
              )}
            </Box>
            {data?.action?.length > 0 && <RenderActions action={data?.action} />}
            {data?.media?.length && <FileRender file={data?.media} />}
          </Box>
        );
      }
      if (currentReportLayout?.has_unchecked && !data?.value === true) {
        return (
          <Box borderRadius={"4px"} width={"100%"} pt={2}>
            <Box display={"flex"} alignItems={"center"} borderRadius={"4px"} padding="10px 0">
              <Checkbox
                color="primary"
                disabled
                checked={Boolean(data?.value)}
                checkedIcon={<img src="/assets/icons/icon-check.svg" alt="check" />}
                icon={<img src="/assets/icons/icon-uncheck.svg" alt="uncheck" />}
                indeterminateIcon={
                  <img src="/assets/icons/icon-check-remove.svg" alt="indeterminate" />
                }
              />
              <Box>{data?.label}</Box>
              <div className="actions__report-actionbtn" onClick={handleAction}>
                <div>
                  <div className="footer_item_icon">
                    <img src={ActionIcon} alt="" />
                  </div>
                  <span>Activity</span>
                </div>
              </div>
            </Box>
            {data?.action?.length > 0 && <RenderActions action={data?.action} />}
            {data?.media?.length && <FileRender file={data?.media} />}
          </Box>
        );
      }
    }
    return <></>;
  }
  console.log(currentReportLayout, "out");
  if (!currentReportLayout?.has_instruction && data?.type === "instruction") {
    return <></>;
  } else if (currentReportLayout?.has_unanswered_questions) {
    console.log(currentReportLayout, "indie");
    return (
      <ConditionalQN
        mode={mode}
        icon={icon}
        data={data}
        typeOfResponse={typeOfResponse}
        handleAction={handleAction}
      />
    );
  } else if (!currentReportLayout?.has_unanswered_question) {
    if (data?.type === "instruction") {
      return (
        <ConditionalQN
          mode={mode}
          icon={icon}
          data={data}
          typeOfResponse={typeOfResponse}
          handleAction={handleAction}
        />
      );
    }
    if (data?.value?.length > 0) {
      return (
        <ConditionalQN
          mode={mode}
          icon={icon}
          data={data}
          typeOfResponse={typeOfResponse}
          handleAction={handleAction}
        />
      );
    }
    return <></>;
  }

  return <></>;
};

function InputFields({ responseItems, data, icon, typeOfResponse, mode }: any) {
  return (
    <>
      {data?.response_choice === "internal" && (
        <RenderQuestion mode={mode} data={data} icon={icon} typeOfResponse={typeOfResponse} />
      )}

      {(data?.response_choice === "multiple" || data?.response_choice === "global") && (
        <RenderQuestion mode={mode} data={data} icon={icon} typeOfResponse={typeOfResponse} />
      )}
      {data?.response_choice === "default" &&
        (() => {
          let type =
            responseItems.find((option: any) => option.id === data.response_type)?.type || "";

          switch (type) {
            case "text":
              return (
                <RenderQuestion
                  mode={mode}
                  data={data}
                  icon={icon}
                  typeOfResponse={typeOfResponse}
                />
              );
            case "inspection_date":
              return (
                <RenderQuestion
                  mode={mode}
                  data={data}
                  icon={icon}
                  typeOfResponse={typeOfResponse}
                />
              );
            case "date":
              return (
                <RenderQuestion
                  mode={mode}
                  data={data}
                  icon={icon}
                  typeOfResponse={typeOfResponse}
                />
              );
            case "range":
              return (
                <RenderQuestion
                  mode={mode}
                  data={data}
                  icon={icon}
                  typeOfResponse={typeOfResponse}
                />
              );
            case "number":
              return (
                <RenderQuestion
                  mode={mode}
                  data={data}
                  icon={icon}
                  typeOfResponse={typeOfResponse}
                />
              );
            case "speech_recognition":
              return <></>;
            case "location":
              return <>location</>;
            case "temp":
              return (
                <RenderQuestion
                  mode={mode}
                  data={data}
                  icon={icon}
                  typeOfResponse={typeOfResponse}
                />
              );
            case "anno":
              return <>annotation</>;
            case "checkbox":
              return (
                <RenderQuestion
                  mode={mode}
                  data={data}
                  icon={icon}
                  typeOfResponse={typeOfResponse}
                />
              );
            case "instruction":
              return (
                <RenderQuestion
                  mode={mode}
                  data={data}
                  icon={icon}
                  typeOfResponse={typeOfResponse}
                />
              );
            case "signature":
              return (
                <RenderQuestion
                  mode={mode}
                  data={data}
                  icon={icon}
                  typeOfResponse={typeOfResponse}
                />
              );
            case "media":
              return (
                <RenderQuestion
                  mode={mode}
                  data={data}
                  icon={icon}
                  typeOfResponse={typeOfResponse}
                />
              );
            default:
              return <></>;
          }
        })()}

      <div>
        {data?.trigger?.Require_Evidence && (
          <div>{data?.trigger?.Require_Evidence?.map((ev: any) => ev)}</div>
        )}
        {data?.trigger?.Require_Action && <div>Require Action</div>}
      </div>
    </>
  );
}

function GenerateQuestion({ data, dataSetSeperator, mode }: any) {
  const findChildren = dataSetSeperator?.logicQuestion?.filter((item: any) => {
    return data?.id === item?.parent;
  });
  if (findChildren?.length) {
    return (
      <>
        {/* <div
          style={{
            background: '#374974',
            color: '#fff',
            padding: '0.5rem .75rem',
            fontSize: '1rem',
            borderRadius: '3px',
          }}>
          {data?.label}
        </div> */}
        {findChildren?.map((it: any, index: number) => {
          const icon = responseItems?.find((item) => item.id === it?.response_type)?.Icon;
          const typeOfResponse = responseItems?.find((item) => item.id === it?.response_type)?.type;
          if (it.component === "question") {
            const qnLogic = dataSetSeperator?.logicDataSet?.find(
              (lg: any) => lg?.id === it?.logicId,
            );
            return (
              <>
                <InputFields
                  mode={mode}
                  key={it?.tid}
                  responseItems={responseItems}
                  data={it}
                  foundLogic={qnLogic}
                  icon={icon}
                  typeOfResponse={typeOfResponse}
                />
                <FormNode mode={mode} dataSetSeperator={dataSetSeperator} data={it} key={it?.id} />
              </>
            );
          } else if (it.component === "section") {
            return (
              <>
                <React.Fragment key={index}>
                  {/* <h1>{data?.component}</h1> */}
                  <GenerateQuestion mode={mode} data={it} dataSetSeperator={dataSetSeperator} />
                </React.Fragment>
              </>
            );
          }
        })}
      </>
    );
  }
  return <></>;
}

const FormNode = ({ dataSetSeperator, data, mode }: any) => {
  //   const [setTrigger, updateTrigger]
  const findLogic = dataSetSeperator.logicDataSet?.find((datas: any) => data.logicId === datas.id);

  if (!findLogic) return null;

  //   useEffect(() => {}, []);
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
  // data.trigger = trigger;

  if (conditionQuestions?.length) {
    return (
      <>
        {conditionQuestions?.map((data: any) => {
          const icon = responseItems?.find((item) => item.id === data?.response_type)?.Icon;
          const typeOfResponse = responseItems?.find(
            (item) => item.id === data?.response_type,
          )?.type;
          const qnLogic = dataSetSeperator?.logicDataSet?.find(
            (lg: any) => lg?.id === data?.logicId,
          );
          return (
            <React.Fragment key={data?.id}>
              {data?.component === "question" && (
                <>
                  <RenderQuestion
                    mode={mode}
                    data={data}
                    icon={icon}
                    typeOfResponse={typeOfResponse}
                  />

                  <FormNode
                    mode={mode}
                    dataSetSeperator={dataSetSeperator}
                    data={data}
                    key={data?.id}
                  />
                </>
              )}

              {data?.component === "section" && (
                <>
                  <h1> {data?.component}</h1>
                  <FormNode
                    mode={mode}
                    dataSetSeperator={dataSetSeperator}
                    data={data}
                    key={data?.id}
                  />
                  {/* <GenerateQuestion mode={mode}
                    key={data?.id}
                    data={data}
                    dataSetSeperator={dataSetSeperator}
                    formikData={{ values, setFieldValue, touched, errors }}
                   
                  /> */}
                </>
              )}
            </React.Fragment>
          );
        })}
      </>
    );
  }

  return <></>;
};

const Questions = ({
  pages,
  dataSetSeperator,
  currentLayout,
  handleActions,
  mode = "web",
}: any) => {
  return (
    <>
      {pages?.map((list: any, index: number) => (
        <QuestionCopy
          list={list}
          dataSetSeperator={dataSetSeperator}
          currentLayout={currentLayout}
          mode={mode}
        />
      ))}
    </>
  );
};

const LoopQuestions = ({
  requiredQuestions,
  list,
  dataSetSeperator,
  collapseActions,
  mode,
}: any) => {
  return (
    <>
      {
        // dataSetSeperator?.questionDataSet
        requiredQuestions
          .filter((d: any) => d.parentPage === list.id)
          .map((data: any, index: number) => {
            const foundLogic = dataSetSeperator?.logicDataSet?.find(
              (lg: any) => lg?.id === data?.logicId,
            );
            const icon = responseItems?.find((item) => item.id === data?.response_type)?.Icon;
            const typeOfResponse = responseItems?.find(
              (item) => item.id === data?.response_type,
            )?.type;
            return (
              <Collapse
                in={collapseActions}
                timeout="auto"
                unmountOnExit
                sx={{ width: "100%" }}
                key={data?.id}
              >
                {data.component === "question" && (
                  <>
                    {data?.response_choice === "internal" && (
                      <>
                        <RenderQuestion
                          mode={mode}
                          data={data}
                          icon={icon}
                          typeOfResponse={typeOfResponse}
                        />
                      </>
                    )}

                    {(data?.response_choice === "multiple" ||
                      data?.response_choice === "global") && (
                      <>
                        <RenderQuestion
                          mode={mode}
                          data={data}
                          icon={icon}
                          typeOfResponse={typeOfResponse}
                        />
                      </>
                    )}

                    {data?.response_choice === "default" && (
                      <>
                        {(() => {
                          let type = responseItems.find(
                            (option: any) => option.id === data.response_type,
                          )?.type;

                          switch (type) {
                            case "text":
                              return (
                                <RenderQuestion
                                  mode={mode}
                                  data={data}
                                  icon={icon}
                                  typeOfResponse={typeOfResponse}
                                />
                              );
                            case "inspection_date":
                              return (
                                <RenderQuestion
                                  mode={mode}
                                  data={data}
                                  icon={icon}
                                  typeOfResponse={typeOfResponse}
                                />
                              );
                            case "date":
                              return (
                                <RenderQuestion
                                  mode={mode}
                                  data={data}
                                  icon={icon}
                                  typeOfResponse={typeOfResponse}
                                />
                              );
                            case "range":
                              return (
                                <RenderQuestion
                                  mode={mode}
                                  data={data}
                                  icon={icon}
                                  typeOfResponse={typeOfResponse}
                                />
                              );
                            case "number":
                              return (
                                <RenderQuestion
                                  mode={mode}
                                  data={data}
                                  icon={icon}
                                  typeOfResponse={typeOfResponse}
                                />
                              );
                            case "speech_recognition":
                              return (
                                <RenderQuestion
                                  mode={mode}
                                  data={data}
                                  icon={icon}
                                  typeOfResponse={typeOfResponse}
                                />
                              );
                            case "location":
                              return <>Location</>;
                            case "temp":
                              return (
                                <RenderQuestion
                                  mode={mode}
                                  data={data}
                                  icon={icon}
                                  typeOfResponse={typeOfResponse}
                                />
                              );
                            case "anno":
                              return <>Annoitation</>;
                            case "checkbox":
                              return (
                                <RenderQuestion
                                  mode={mode}
                                  data={data}
                                  icon={icon}
                                  typeOfResponse={typeOfResponse}
                                />
                              );
                            case "instruction":
                              return (
                                <RenderQuestion
                                  mode={mode}
                                  data={data}
                                  icon={icon}
                                  typeOfResponse={typeOfResponse}
                                />
                              );
                            case "signature":
                              return (
                                <RenderQuestion
                                  mode={mode}
                                  data={data}
                                  icon={icon}
                                  typeOfResponse={typeOfResponse}
                                />
                              );
                            case "media":
                              return (
                                <RenderQuestion
                                  mode={mode}
                                  data={data}
                                  icon={icon}
                                  typeOfResponse={typeOfResponse}
                                />
                              );
                            case "mobile_number":
                              return (
                                <RenderQuestion
                                  mode={mode}
                                  data={data}
                                  icon={icon}
                                  typeOfResponse={typeOfResponse}
                                />
                              );
                            default:
                              return <></>;
                          }
                        })()}
                      </>
                    )}
                    <>
                      {data?.trigger?.Require_Evidence && (
                        <>{data?.trigger?.Require_Evidence?.map((ev: any) => ev)}</>
                      )}
                      {data?.trigger?.Require_Action && <div>Require Action</div>}
                    </>

                    <FormNode
                      mode={mode}
                      dataSetSeperator={dataSetSeperator}
                      data={data}
                      key={data?.id}
                    />
                  </>
                )}
                {data.component === "section" && (
                  <>
                    <GenerateQuestion mode={mode} data={data} dataSetSeperator={dataSetSeperator} />
                  </>
                )}
              </Collapse>
            );
          })
      }
    </>
  );
};

const QuestionCopy = ({ dataSetSeperator, currentLayout, list, mode }: any) => {
  const [collapseActions, setCollapseActions] = useState<any>(true);
  const requiredQuestions = dataSetSeperator?.questionDataSet;

  if (mode === "pdf") {
    return (
      <Box mb={1} className="no-break">
        <Box className="box-container-pdf">
          <Box
            sx={{
              fontSize: list?.label === "Page" ? "inherit" : "0.8em",
              color: list?.label === "Page" ? "inherit" : "rgba(17, 17, 26, 0.527)",
            }}
            className="pdf_label"
          >
            {list?.label}
          </Box>
          <LoopQuestions
            requiredQuestions={requiredQuestions}
            list={list}
            dataSetSeperator={dataSetSeperator}
            collapseActions={collapseActions}
            mode={mode}
          />
        </Box>
      </Box>
    );
  }

  return (
    <Box className="overview_layout_container">
      <Box display={"flex"} width={"100%"} justifyContent="space-between">
        <Stack direction="row" spacing={2} justifyContent="center" alignItems={"center"}>
          <Box onClick={() => setCollapseActions(!collapseActions)} className="overview_button">
            <FontAwesomeIcon
              icon={faAngleRight}
              className={`${collapseActions && "rotate_arrow_down"} rotate_arrow_straight`}
            />
          </Box>

          <Typography fontSize={18} fontWeight={500} sx={{ select: "none" }}>
            {list?.label}
          </Typography>
        </Stack>
      </Box>
      <LoopQuestions
        requiredQuestions={requiredQuestions}
        list={list}
        dataSetSeperator={dataSetSeperator}
        collapseActions={collapseActions}
        mode={mode}
      />
    </Box>
  );
};

export default Questions;
