import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Collapse, Grid, Stack, Typography } from "@mui/material";
import responseItems from "constants/template/responseItems";
import { fetchIndividualApi } from "src/modules/apiRequest/apiRequest";
import { validateInput } from "src/modules/template/validation/inputLogicCheck";
import { findData } from "src/modules/template/validation/keyValidationFunction";
import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

export default function Actions({ pages, dataSetSeperator, mode = "web" }: any) {
  const [collapseActions, setCollapseActions] = React.useState<any>(true);
  if (mode === "pdf") {
    return (
      <Box>
        <Box className="box-container-pdf">
          <Box sx={{ fontWeight: 500 }} className="pdf_label">
            <Stack direction="row" justifyContent="space-between">
              <Box>Assigned Activity Summary</Box>
              {/* {has_action && <Box>1</Box>} */}
            </Stack>
          </Box>
          <div style={{ padding: 8 }}>
            {pages?.map((list: any, index: number) => (
              <>
                <QuestionCopy
                  list={list}
                  dataSetSeperator={dataSetSeperator}
                  collapseActions={collapseActions}
                  mode={mode}
                  // currentLayout={currentLayout}
                />
              </>
            ))}
          </div>
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
            Activities
          </Typography>
        </Stack>
      </Box>

      {/* collapse items */}
      <Collapse in={collapseActions} style={{ width: "100%" }} timeout="auto" unmountOnExit>
        <>
          {pages?.map((list: any, index: number) => (
            <>
              <QuestionCopy
                list={list}
                dataSetSeperator={dataSetSeperator}
                collapseActions={collapseActions}
                // currentLayout={currentLayout}
              />
            </>
          ))}
        </>

        {/* action fields */}
      </Collapse>
    </Box>
  );
}
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

                  <FormNode dataSetSeperator={dataSetSeperator} data={data} key={data?.id} />
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
                  {/* <GenerateQuestion
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

const CustomBadge = ({ value, haveParent = false, parentLabel }: any) => {
  let created_date = "";
  if (parentLabel === "Due Date") {
    const date_ = new Date(value);

    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    };
    created_date = date_.toLocaleDateString("en-US", options);
  }
  return (
    <>
      {haveParent ? (
        <div className="status_highlight-parent-child">
          <div className="status__wrapper">
            <div className="__parent">{parentLabel}</div>
            <div className="__children">{parentLabel === "Due Date" ? created_date : value}</div>
          </div>
        </div>
      ) : (
        <div className="status_highlight-custom">
          <div className="status_highlight_text">{value}</div>
        </div>
      )}
    </>
  );
};
async function APICall({ type, field, setInitialValues, objKey, id, token }: any) {
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
    getAll: true,
  });
  // }
}

const RenderQuestion = ({ data, mode }: any) => {
  const [assignData, setAssignData] = useState([]);
  const [currentActivity, setCurrentActivity] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const params = useParams();

  useEffect(() => {
    if (Array.isArray(data?.action)) {
      data?.action?.map((activity: any) => {
        setCurrentActivity((prev): any => [...prev, activity?.id]);
      });
    }
  }, []);

  useEffect(() => {
    if (currentActivity?.length && !params?.publicInspectionId) {
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
    const token = searchParams.get("token");
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

  // if (Array.isArray(data?.action)) {

  // }
  // if (data?.type === 'Array') {
  //   return (
  //     <>
  //       {data?.value?.map((v: any, index: number) => (
  //         <>{v?.value}</>
  //       ))}
  //     </>
  //   );
  // }
  return (
    <>
      {assignData?.map((v: any) => {
        if (mode === "pdf") {
          return (
            <Box className="individual_box_container">
              <Box>{v?.title}</Box>
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
                      <Box sx={{ opacity: "0.8" }}>{v?.priority}</Box>
                    </Stack>
                  </Grid>
                  <Grid item xs={2} sm={4} md={4}>
                    <Stack direction="row" spacing={1}>
                      <Box sx={{ fontWeight: 500 }}>Status:</Box>
                      <Box sx={{ opacity: "0.8" }}>{v?.status?.name}</Box>
                    </Stack>
                  </Grid>
                  <Grid item xs={2} sm={4} md={4}>
                    <Stack direction="row" spacing={1}>
                      <Box sx={{ fontWeight: 500 }}>Assignee:</Box>
                      <Box sx={{ opacity: "0.8" }}>
                        {v?.users_obj?.map((a: any) => a?.name)?.join("")}
                      </Box>
                    </Stack>
                  </Grid>
                  <Grid item xs={2} sm={4} md={4} mt={0.5}>
                    <Stack direction="row" spacing={1}>
                      <Box sx={{ fontWeight: 500 }}>Created By:</Box>
                      <Box sx={{ opacity: "0.8" }}>{v?.created_by}</Box>
                    </Stack>
                  </Grid>
                </Grid>
              </Stack>
            </Box>
          );
        }
        return (
          <>
            <Box pt={2}>
              <Typography component="p">
                {`Tokyo Organization created a ${v?.priority} priority action for Fred Smith`}
              </Typography>
            </Box>
            <Stack sx={{ mt: 2 }} direction="row" spacing={2} flexWrap="wrap" gap={"10px"}>
              <CustomBadge value={v?.priority} />
              <CustomBadge value={v?.status?.name} haveParent={true} parentLabel="Status" />
              <CustomBadge value={v?.due_date} haveParent={true} parentLabel="Due Date" />
              <CustomBadge
                value={v?.users_obj?.map((a: any) => a?.name)?.join(", ")}
                haveParent={true}
                parentLabel="Assignee"
              />
              <CustomBadge value={v?.created_by} haveParent={true} parentLabel="Created By" />
            </Stack>
            <Stack
              direction="column"
              spacing={1.5}
              sx={{ mt: 3, color: "#667085", opacity: "0.5" }}
            >
              <Box>{v?.title}</Box>
              {/* <Box>Hard Hats (available, worn by crew and in safe condition)</Box> */}
            </Stack>
          </>
        );
      })}
    </>
  );
};

const QuestionCopy = ({ dataSetSeperator, list, collapseActions, mode }: any) => {
  const requiredQuestions = true
    ? dataSetSeperator?.questionDataSet
    : dataSetSeperator?.onlyAnsweredDataSet;

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
                    {/* <h1> {data?.component}</h1> */}
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
