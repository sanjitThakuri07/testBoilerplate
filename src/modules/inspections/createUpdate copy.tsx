import React, { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";
import FullPageLoader from "src/components/FullPageLoader";
import { fetchApI } from "src/modules/apiRequest/apiRequest";

import responseItems from "constants/template/responseItems";
import { Formik } from "formik";

import { Button } from "@mui/material";
import SelectMultipleResponse from "containers/template/components/mobileComponents/SelectMultipleResponse";
import MobileTextAnswer from "containers/template/components/mobileComponents/MobileTextAnswer/MobileTextAnswer";
import MobileInspectionDate from "containers/template/components/mobileComponents/MobileInspectionDate/MobileInspectionDate";
import MobileDateTime from "containers/template/components/mobileComponents/MobileDateTime/MobileDateTime";
import MobileSlider from "containers/template/components/mobileComponents/MobileSlider/MobileSlider";
import MobileNumber from "containers/template/components/mobileComponents/MobileNumber";
import MobileSpeechRecognition from "containers/template/components/mobileComponents/MobileSpeechRecognition/MobileSpeechRecognition";
import MobileLocation from "containers/template/components/mobileComponents/MobileLocation/MobileLocation";
import MobileTemperature from "containers/template/components/mobileComponents/MobileTemperature/mobileTemperature";
import MobileInstruction from "containers/template/components/mobileComponents/MobileInstruction";
import MobileSignature from "containers/template/components/mobileComponents/MobileSignature";
import SelectInternalResponse from "containers/template/components/mobileComponents/SelectInternalResponse";
import { useInspectionStore } from "containers/template/store/inspectionStore";
import { validateInput } from "containers/template/validation/inputLogicCheck";
import { findData } from "containers/template/validation/keyValidationFunction";
import MobileAnnotation from "containers/template/components/mobileComponents/MobileAnnotation/mobileAnnotation";
import MobileCheckbox from "containers/template/components/mobileComponents/MobileCheckbox/mobileCheckbox";

function InputFields({
  responseChoice,
  responseItems,
  data,
  handleFormikFields,
  internalResponseData,
}: any) {
  let { errors, values, setFieldValue } = handleFormikFields;
  return (
    <>
      <div className="mobile_component_box">
        <div className="mobile_component_box_wrapper">
          <div className="mobile_component_box_wrapper_heading">
            {data?.response_choice === "internal" && (
              <SelectInternalResponse
                item={data}
                handleFormikFields={handleFormikFields}
                errors={errors?.[`${data?.component}__${data?.id}`]}
                apiItem={
                  internalResponseData.length &&
                  internalResponseData.find(
                    (responseData: any) => responseData.id === data.response_type,
                  )
                }
              />
            )}

            {(data?.response_choice === "multiple" || data?.response_choice === "global") && (
              <SelectMultipleResponse
                onChange={(e: any) => {
                  let values = Array.isArray(e)
                    ? e?.map((data: any) => data?.name).filter((data: any) => Boolean(data))
                    : [e?.name]?.filter((data: any) => Boolean(data));

                  setFieldValue(`${data?.component}__${data?.id}.value`, values);
                }}
                value={values?.[`${data?.component}__${data?.id}`]?.value}
                item={data}
                // logic={foundLogic}
                errors={errors?.[`${data?.component}__${data?.id}`]}
              />
            )}

            {data?.response_choice === "default" &&
              (responseItems.find((option: any) => option.id === data.response_type)?.type ===
              "text" ? (
                <MobileTextAnswer
                  item={data}
                  handleFormikFields={handleFormikFields}
                  // value={values.datasets?.[index]?.value}
                  name={`${data?.component}__${data?.id}.value`}
                  value={values?.[`${data?.component}__${data?.id}`]?.value}
                  errors={errors?.[`${data?.component}__${data?.id}`]}
                  onChange={(e: any) => {
                    setFieldValue(`${data?.component}__${data?.id}.value`, e.target.value);
                  }}
                />
              ) : responseItems.find((option: any) => option.id === data.response_type)?.type ===
                "inspection_date" ? (
                <MobileInspectionDate
                  item={data}
                  handleFormikFields={handleFormikFields}
                  errors={errors?.[`${data?.component}__${data?.id}`]}
                  value={values?.[`${data?.component}__${data?.id}`]?.value}
                  onChange={(e: any) => {
                    setFieldValue(`${data?.component}__${data?.id}.value`, e.target.value);
                  }}
                />
              ) : responseItems.find((option: any) => option.id === data.response_type)?.type ===
                "date" ? (
                <MobileDateTime
                  item={data}
                  handleFormikFields={handleFormikFields}
                  errors={errors?.[`${data?.component}__${data?.id}`]}
                  onChange={(e: any) => {
                    setFieldValue(`${data?.component}__${data?.id}.value`, e.target.value);
                  }}
                />
              ) : responseItems.find((option: any) => option.id === data.response_type)?.type ===
                "range" ? (
                <MobileSlider
                  item={data}
                  handleFormikFields={handleFormikFields}
                  name={`${data?.component}__${data?.id}.value`}
                  value={values?.[`${data?.component}__${data?.id}`]?.value}
                  errors={errors?.[`${data?.component}__${data?.id}`]}
                  onChange={(e: any) => {
                    setFieldValue(`${data?.component}__${data?.id}.value`, e.target.value);
                  }}
                />
              ) : responseItems.find((option: any) => option.id === data.response_type)?.type ===
                "number" ? (
                <MobileNumber
                  item={data}
                  handleFormikFields={handleFormikFields}
                  name={`${data?.component}__${data?.id}.value`}
                  value={values?.[`${data?.component}__${data?.id}`]?.value}
                  errors={errors?.[`${data?.component}__${data?.id}`]}
                  onChange={(e: any) => {
                    setFieldValue(`${data?.component}__${data?.id}.value`, e.target.value);
                  }}
                />
              ) : responseItems.find((option: any) => option.id === data.response_type)?.type ===
                "speech_recognition" ? (
                <MobileSpeechRecognition
                  dataItem={data}
                  errors={errors?.[`${data?.component}__${data?.id}`]}
                />
              ) : responseItems.find((option: any) => option.id === data.response_type)?.type ===
                "location" ? (
                <MobileLocation
                  dataItem={data}
                  errors={errors?.[`${data?.component}__${data?.id}`]}
                />
              ) : responseItems.find((option: any) => option.id === data.response_type)?.type ===
                "temp" ? (
                <MobileTemperature errors={errors?.[`${data?.component}__${data?.id}`]} />
              ) : responseItems.find((option: any) => option.id === data.response_type)?.type ===
                "anno" ? (
                <MobileAnnotation
                  dataItem={data}
                  errors={errors?.[`${data?.component}__${data?.id}`]}
                />
              ) : responseItems.find((option: any) => option.id === data.response_type)?.type ===
                "checkbox" ? (
                <MobileCheckbox
                  dataItem={data}
                  errors={errors?.[`${data?.component}__${data?.id}`]}
                />
              ) : responseItems.find((option: any) => option.id === data.response_type)?.type ===
                "instruction" ? (
                <MobileInstruction
                  errors={errors?.[`${data?.component}__${data?.id}`]}
                  item={data}
                  handleFormikFields={handleFormikFields}
                  // value={values.datasets?.[index]?.value}
                  // onChange={(e: any) =>
                  //   setFieldValue(`datasets.${index}.value`, e.target.value)
                  // }
                />
              ) : responseItems.find((option: any) => option.id === data.response_type)?.type ===
                "signature" ? (
                <MobileSignature
                  item={data}
                  errors={errors?.[`${data?.component}__${data?.id}`]}
                  handleFormikFields={handleFormikFields}
                  name={`${data?.component}__${data?.id}.value`}
                  value={values?.[`${data?.component}__${data?.id}`]?.value}
                  onChange={(e: any) => {
                    setFieldValue(`${data?.component}__${data?.id}.value`, e.target.value);
                  }}
                  // value={values.datasets?.[index]?.value}
                  // onChange={(e: any) =>
                  //   setFieldValue(`datasets.${index}.value`, e.target.value)
                  // }
                />
              ) : (
                // <MobileNumber />
                ""
              ))}

            <div>
              {data?.trigger?.Require_Evidence && (
                <div>{data?.trigger?.Require_Evidence?.map((ev: any) => ev)}</div>
              )}
              {data?.trigger?.Require_Action && <div>Require Action</div>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function GenerateQuestion({ data, dataSetSeperator, formikData, internalResponseData }: any) {
  const findChildren = dataSetSeperator?.logicQuestion?.filter((item: any) => {
    return data?.id === item?.parent;
  });
  if (findChildren?.length) {
    return (
      <>
        <div
          style={{
            background: "#374974",
            color: "#fff",
            padding: "0.5rem .75rem",
            fontSize: "1rem",
            borderRadius: "3px",
          }}
        >
          {data?.label}
        </div>
        {findChildren?.map((it: any, index: number) => {
          if (it.component === "question") {
            return (
              <>
                <InputFields
                  key={it?.tid}
                  responseItems={responseItems}
                  handleFormikFields={formikData}
                  internalResponseData={internalResponseData}
                  data={it}
                />
                <FormNode
                  dataSetSeperator={dataSetSeperator}
                  data={it}
                  key={it?.id}
                  formikData={formikData}
                  internalResponseData={internalResponseData}
                />
              </>
            );
          } else if (it.component === "section") {
            return (
              <>
                <br />

                <div key={index}>
                  {/* <h1>{data?.component}</h1> */}
                  <GenerateQuestion
                    data={it}
                    dataSetSeperator={dataSetSeperator}
                    formikData={formikData}
                    internalResponseData={internalResponseData}
                  />
                </div>
              </>
            );
          }
        })}
      </>
    );
  }
  return <></>;
}

const FormNode = ({ dataSetSeperator, data, formikData, internalResponseData }: any) => {
  let { values, setFieldValue } = formikData;

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
            userInput: values?.[`${data?.component}__${data?.id}`]?.value,
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
      <div>
        {conditionQuestions?.map((data: any) => {
          return (
            <div key={data?.id}>
              {data?.component === "question" && (
                <>
                  <InputFields
                    key={data?.id}
                    responseItems={responseItems}
                    handleFormikFields={formikData}
                    internalResponseData={internalResponseData}
                    data={data}
                  />
                  <FormNode
                    dataSetSeperator={dataSetSeperator}
                    data={data}
                    key={data?.id}
                    formikData={formikData}
                  />
                </>
              )}

              {data?.component === "section" && (
                <>
                  <h1> {data?.component}</h1>
                  <FormNode
                    dataSetSeperator={dataSetSeperator}
                    data={data}
                    key={data?.id}
                    formikData={formikData}
                  />
                  {/* <GenerateQuestion
                    key={data?.id}
                    data={data}
                    dataSetSeperator={dataSetSeperator}
                    formikData={{ values, setFieldValue, touched, errors }}
                    internalResponseData={internalResponseData}
                  /> */}
                </>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return <></>;
};

const InspectionCreateUpdate = ({}: any) => {
  const [internalResponseData, setInternalResponseData] = React.useState<any>([]);

  const navigate = useNavigate();
  const param = useParams();
  const isLoading = useInspectionStore((state: any) => state?.isLoading);

  const getInspection = useInspectionStore((state: any) => state?.getInspection);
  const inspection = useInspectionStore((state: any) => state?.inspection);
  const updateInspection = useInspectionStore((state: any) => state?.updateInspection);
  const templateFields = (inspection && inspection.fields) || [];

  useEffect(() => {
    if (param?.inspectionId) {
      getInspection(param?.inspectionId);
    }
  }, [param?.inspectionId]);

  const handleSearchInternalResponse = async () => {
    await fetchApI({
      setterFunction: setInternalResponseData,
      url: `internal-response/?page=1&size=50`,
    });
  };
  useEffect(() => {
    handleSearchInternalResponse();
  }, []);

  const dataSetSeperator = templateFields.reduce(
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
  const keyFields = ["label", "id"];

  const initialValues = templateFields.reduce((values: any, field: any) => {
    if (field?.component?.toLowerCase() === "question") {
      return {
        ...values,
        [`${field?.component}__${field?.id}`]: {
          value: param?.inspectionId ? field.value : "",
          trigger: {},
          notes: "",
          keyName: `${keyFields?.map((keyField: any) => field?.[keyField])?.join("__")}`,
        },
      };
    }
    return values;
  }, {});

  const [pageCount, setPageCount] = useState(0);

  const pages = templateFields.filter((list: any) => list.component === "page");

  return (
    <div id="InspectionStarter">
      {!!isLoading && <FullPageLoader></FullPageLoader>}
      <div className="inspection_starter__wrapper">
        <div>
          <b> {inspection?.template}</b>
        </div>
        <div>Page {`${pageCount + 1} / ${pages.length}`}</div>

        <Formik
          initialValues={initialValues}
          enableReinitialize={true}
          onSubmit={(values) => {
            const valueArray = Object.entries(values).map((a: any) => {
              return {
                id: a[0].split("__")[1],
                value: a[1].value,
                notes: a[1].notes,
              };
            });
            const finalValues = templateFields?.map((obj: any) => {
              if (obj.id === valueArray.find((a) => a.id == obj.id)?.id) {
                return {
                  ...obj,
                  value: valueArray.find((a) => a.id == obj.id)?.value,
                  notes: valueArray.find((a) => a.id == obj.id)?.notes,
                };
              }
              return obj;
            });
            if (finalValues) {
              updateInspection(
                inspection.id,
                { template_id: inspection.template_id, fields: finalValues },
                navigate,
              );
            }
          }}
        >
          {({ handleSubmit, handleChange, values, setFieldValue, errors, touched }) => {
            return (
              <form onSubmit={handleSubmit}>
                {pages.map((list: any, index: number) => (
                  <>
                    <div>
                      {index === pageCount &&
                        dataSetSeperator?.questionDataSet
                          .filter((d: any) => d.parentPage === list.id)
                          .map((data: any) => {
                            return (
                              <div key={data?.id}>
                                {data.component === "question" && (
                                  <>
                                    <div className="mobile_component_box">
                                      <div className="mobile_component_box_wrapper">
                                        <div className="mobile_component_box_wrapper_heading">
                                          {data?.response_choice === "internal" && (
                                            <SelectInternalResponse
                                              item={data}
                                              apiItem={
                                                internalResponseData.length &&
                                                internalResponseData.find(
                                                  (responseData: any) =>
                                                    responseData.id === data.response_type,
                                                )
                                              }
                                              onChange={(e: any) => {
                                                let values = Array.isArray(e)
                                                  ? e
                                                      ?.map((data: any) => data?.name)
                                                      .filter((data: any) => Boolean(data))
                                                  : [e?.name]?.filter((data: any) => Boolean(data));

                                                setFieldValue(
                                                  `${data?.component}__${data?.id}.value`,
                                                  values,
                                                );
                                              }}
                                              // logic={foundLogic}
                                              errors={errors?.[`${data?.component}__${data?.id}`]}
                                            />
                                          )}

                                          {(data?.response_choice === "multiple" ||
                                            data?.response_choice === "global") && (
                                            <SelectMultipleResponse
                                              onChange={(e: any) => {
                                                let values = Array.isArray(e)
                                                  ? e
                                                      ?.map((data: any) => data?.name)
                                                      .filter((data: any) => Boolean(data))
                                                  : [e?.name]?.filter((data: any) => Boolean(data));

                                                setFieldValue(
                                                  `${data?.component}__${data?.id}.value`,
                                                  values,
                                                );
                                              }}
                                              value={
                                                values?.[`${data?.component}__${data?.id}`]?.value
                                              }
                                              item={data}
                                              // logic={foundLogic}
                                              errors={errors?.[`${data?.component}__${data?.id}`]}
                                            />
                                          )}

                                          {data?.response_choice === "default" &&
                                            (responseItems.find(
                                              (option: any) => option.id === data.response_type,
                                            )?.type === "text" ? (
                                              <MobileTextAnswer
                                                item={data}
                                                // value={values.datasets?.[index]?.value}
                                                name={`${data?.component}__${data?.id}.value`}
                                                value={
                                                  values?.[`${data?.component}__${data?.id}`]?.value
                                                }
                                                onChange={(e: any) => {
                                                  setFieldValue(
                                                    `${data?.component}__${data?.id}.value`,
                                                    e.target.value,
                                                  );
                                                }}
                                                handleFormikFields={{
                                                  handleSubmit,
                                                  handleChange,
                                                  values,
                                                  setFieldValue,
                                                }}
                                              />
                                            ) : responseItems.find(
                                                (option: any) => option.id === data.response_type,
                                              )?.type === "inspection_date" ? (
                                              <MobileInspectionDate
                                                item={data}
                                                errors={errors?.[`${data?.component}__${data?.id}`]}
                                                value={
                                                  values?.[`${data?.component}__${data?.id}`]?.value
                                                }
                                                onChange={(e: any) => {
                                                  setFieldValue(
                                                    `${data?.component}__${data?.id}.value`,
                                                    e.target.value,
                                                  );
                                                }}
                                              />
                                            ) : responseItems.find(
                                                (option: any) => option.id === data.response_type,
                                              )?.type === "date" ? (
                                              <MobileDateTime
                                                item={data}
                                                errors={errors?.[`${data?.component}__${data?.id}`]}
                                                value={
                                                  values?.[`${data?.component}__${data?.id}`]?.value
                                                }
                                                onChange={(e: any) => {
                                                  setFieldValue(
                                                    `${data?.component}__${data?.id}.value`,
                                                    e.target.value,
                                                  );
                                                }}
                                              />
                                            ) : responseItems.find(
                                                (option: any) => option.id === data.response_type,
                                              )?.type === "range" ? (
                                              <MobileSlider
                                                item={data}
                                                name={`${data?.component}__${data?.id}.value`}
                                                value={
                                                  values?.[`${data?.component}__${data?.id}`]?.value
                                                }
                                                onChange={(e: any) => {
                                                  setFieldValue(
                                                    `${data?.component}__${data?.id}.value`,
                                                    e.target.value,
                                                  );
                                                }}
                                              />
                                            ) : responseItems.find(
                                                (option: any) => option.id === data.response_type,
                                              )?.type === "number" ? (
                                              <MobileNumber
                                                item={data}
                                                name={`${data?.component}__${data?.id}.value`}
                                                value={
                                                  values?.[`${data?.component}__${data?.id}`]?.value
                                                }
                                                onChange={(e: any) => {
                                                  setFieldValue(
                                                    `${data?.component}__${data?.id}.value`,
                                                    e.target.value,
                                                  );
                                                }}
                                                handleFormikFields={{
                                                  handleSubmit,
                                                  handleChange,
                                                  values,
                                                  setFieldValue,
                                                }}
                                              />
                                            ) : responseItems.find(
                                                (option: any) => option.id === data.response_type,
                                              )?.type === "speech_recognition" ? (
                                              <MobileSpeechRecognition dataItem={data} />
                                            ) : responseItems.find(
                                                (option: any) => option.id === data.response_type,
                                              )?.type === "location" ? (
                                              <MobileLocation />
                                            ) : responseItems.find(
                                                (option: any) => option.id === data.response_type,
                                              )?.type === "temp" ? (
                                              <MobileTemperature
                                                item={data}
                                                name={`${data?.component}__${data?.id}.value`}
                                                value={
                                                  values?.[`${data?.component}__${data?.id}`]?.value
                                                }
                                                onChange={(e: any) => {
                                                  setFieldValue(
                                                    `${data?.component}__${data?.id}.value`,
                                                    e.target.value,
                                                  );
                                                }}
                                                handleFormikFields={{
                                                  handleSubmit,
                                                  handleChange,
                                                  values,
                                                  setFieldValue,
                                                }}
                                              />
                                            ) : responseItems.find(
                                                (option: any) => option.id === data.response_type,
                                              )?.type === "instruction" ? (
                                              <MobileInstruction
                                                item={data}
                                                // value={values.datasets?.[index]?.value}
                                                // onChange={(e: any) =>
                                                //   setFieldValue(`datasets.${index}.value`, e.target.value)
                                                // }
                                              />
                                            ) : responseItems.find(
                                                (option: any) => option.id === data.response_type,
                                              )?.type === "signature" ? (
                                              <MobileSignature
                                                item={data}
                                                // logic={foundLogic}
                                                errors={errors?.[`${data?.component}__${data?.id}`]}
                                                name={`${data?.component}__${data?.id}.value`}
                                                value={
                                                  values?.[`${data?.component}__${data?.id}`]?.value
                                                }
                                                onChange={(e: any) => {
                                                  setFieldValue(
                                                    `${data?.component}__${data?.id}.value`,
                                                    e.target.value,
                                                  );
                                                }}
                                                // value={values.datasets?.[index]?.value}
                                                // onChange={(e: any) =>
                                                //   setFieldValue(`datasets.${index}.value`, e.target.value)
                                                // }
                                              />
                                            ) : (
                                              // <MobileNumber />
                                              ""
                                            ))}

                                          <div>
                                            {data?.trigger?.Require_Evidence && (
                                              <div>
                                                {data?.trigger?.Require_Evidence?.map(
                                                  (ev: any) => ev,
                                                )}
                                              </div>
                                            )}
                                            {data?.trigger?.Require_Action && (
                                              <div>Require Action</div>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <FormNode
                                      dataSetSeperator={dataSetSeperator}
                                      internalResponseData={internalResponseData}
                                      data={data}
                                      key={data?.id}
                                      formikData={{
                                        handleSubmit,
                                        handleChange,
                                        values,
                                        setFieldValue,
                                        touched,
                                      }}
                                    />
                                  </>
                                )}
                                <br />
                                {data.component === "section" && (
                                  <>
                                    {/* <h1> {data?.component}</h1> */}
                                    <GenerateQuestion
                                      data={data}
                                      dataSetSeperator={dataSetSeperator}
                                      formikData={{ values, setFieldValue, errors, touched }}
                                      internalResponseData={internalResponseData}
                                    />
                                  </>
                                )}
                              </div>
                            );
                          })}
                    </div>
                  </>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>
                    {pageCount !== 0 && pages.length - 1 <= pageCount && (
                      <Button
                        variant="contained"
                        type="button"
                        style={{ margin: "1rem 0" }}
                        onClick={() => setPageCount(pageCount - 1)}
                      >
                        Prev Page
                      </Button>
                    )}
                  </div>
                  <div>
                    {pages.length - 1 > pageCount && (
                      <Button
                        variant="contained"
                        type="button"
                        style={{ margin: "1rem 0" }}
                        onClick={() => setPageCount(pageCount + 1)}
                      >
                        Next Page
                      </Button>
                    )}
                    {pages.length === pageCount + 1 && (
                      <Button variant="contained" type="submit" style={{ margin: "1rem 0" }}>
                        Save & Continue
                      </Button>
                    )}
                  </div>
                </div>
              </form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default InspectionCreateUpdate;
