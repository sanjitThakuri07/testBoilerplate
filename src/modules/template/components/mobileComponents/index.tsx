import React, { useEffect, useState } from "react";
import MobileTextAnswer from "./MobileTextAnswer/MobileTextAnswer";
import MobileSlider from "./MobileSlider/MobileSlider";
import { useTemplate } from "globalStates/templates/templateData";
import { useTemplateFieldsStore } from "containers/template/store/templateFieldsStore";
import responseItems from "constants/template/responseItems";
import { Formik, FieldArray, Form, Field, getIn } from "formik";

import MobileDateTime from "./MobileDateTime/MobileDateTime";
import MobileInspectionDate from "./MobileInspectionDate/MobileInspectionDate";
import ReusableMobileComponent from "./ReusableMobileComponent/ReusableMobileComponent";
import { fetchApI } from "src/modules/apiRequest/apiRequest";
import useDebounceSearch from "hooks/useDebounceSearch";
import SelectInternalResponse from "./SelectInternalResponse";
import SelectMultipleResponse from "./SelectMultipleResponse";
import MobileNumber from "./MobileNumber";
import MobileSpeechRecognition from "./MobileSpeechRecognition/MobileSpeechRecognition";
import MobileLocation from "./MobileLocation/MobileLocation";
import MobileTemperature from "./MobileTemperature/mobileTemperature";
import MobileSignature from "./MobileSignature";
import MobileInstruction from "./MobileInstruction";
import { Button } from "@mui/material";
// validation
import { validateInput } from "containers/template/validation/inputLogicCheck";
import { findData } from "containers/template/validation/keyValidationFunction";
import { DynamicSchemaGenerator } from "containers/template/validation/index";
import MobileAnnotation from "./MobileAnnotation/mobileAnnotation";
import MobileCheckbox from "./MobileCheckbox/mobileCheckbox";
import MobileMedia from "./MobileMedia/MobileMedia";

interface MobilePreviewProps {
  children?: React.ReactNode;
}

function InputFields({
  responseChoice,
  responseItems,
  data,
  handleFormikFields,
  internalResponseData,
  foundLogic,
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
                logic={foundLogic}
                onChange={(e: any, field: any) => {
                  let values = Array.isArray(e)
                    ? e?.map((data: any) => data?.[field]).filter((data: any) => Boolean(data))
                    : [e?.[field]]?.filter((data: any) => Boolean(data));

                  setFieldValue(`${data?.component}__${data?.id}.value`, values);
                  let flaggedResponse = foundLogic?.flaggedResponse || [];
                  let flaggedValue = values?.filter((data: any) => flaggedResponse?.includes(data));
                  setFieldValue(`${data?.component}__${data?.id}.flaggedValue`, flaggedValue);
                }}
                value={values?.[`${data?.component}__${data?.id}`]?.value}
                name={`${values?.[`${data?.component}__${data?.id}`]}.value`}
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

                  let flaggedResponse = foundLogic?.flaggedResponse || [];
                  let flaggedValue = values?.filter((data: any) => flaggedResponse?.includes(data));
                  setFieldValue(`${data?.component}__${data?.id}.flaggedValue`, flaggedValue);
                  setFieldValue(`${data?.component}__${data?.id}.value`, values);
                }}
                logic={foundLogic}
                value={values?.[`${data?.component}__${data?.id}`]?.value}
                item={data}
                errors={errors?.[`${data?.component}__${data?.id}`]}
              />
            )}
            {data?.response_choice === "default" &&
              (() => {
                let type =
                  responseItems.find((option: any) => option.id === data.response_type)?.type || "";

                switch (type) {
                  case "text":
                    return (
                      <MobileTextAnswer
                        item={data}
                        handleFormikFields={handleFormikFields}
                        logic={foundLogic}
                        // value={values.datasets?.[index]?.value}
                        name={`${data?.component}__${data?.id}.value`}
                        value={values?.[`${data?.component}__${data?.id}`]?.value}
                        errors={errors?.[`${data?.component}__${data?.id}`]}
                        onChange={(e: any) => {
                          setFieldValue(`${data?.component}__${data?.id}.value`, e.target.value);
                        }}
                      />
                    );
                  case "inspection_date":
                    return (
                      <MobileInspectionDate
                        item={data}
                        handleFormikFields={handleFormikFields}
                        logic={foundLogic}
                        errors={errors?.[`${data?.component}__${data?.id}`]}
                        value={values?.[`${data?.component}__${data?.id}`]?.value}
                        onChange={(e: any) => {
                          setFieldValue(`${data?.component}__${data?.id}.value`, e.target.value);
                        }}
                      />
                    );
                  case "date":
                    return (
                      <MobileDateTime
                        item={data}
                        handleFormikFields={handleFormikFields}
                        logic={foundLogic}
                        errors={errors?.[`${data?.component}__${data?.id}`]}
                        onChange={(e: any) => {
                          setFieldValue(`${data?.component}__${data?.id}.value`, e.target.value);
                        }}
                      />
                    );
                  case "range":
                    return (
                      <MobileSlider
                        item={data}
                        handleFormikFields={handleFormikFields}
                        logic={foundLogic}
                        name={`${data?.component}__${data?.id}.value`}
                        value={values?.[`${data?.component}__${data?.id}`]?.value}
                        errors={errors?.[`${data?.component}__${data?.id}`]}
                        onChange={(e: any) => {
                          setFieldValue(`${data?.component}__${data?.id}.value`, e.target.value);
                        }}
                      />
                    );
                  case "number":
                    return (
                      <MobileNumber
                        item={data}
                        handleFormikFields={handleFormikFields}
                        logic={foundLogic}
                        name={`${data?.component}__${data?.id}.value`}
                        value={values?.[`${data?.component}__${data?.id}`]?.value}
                        errors={errors?.[`${data?.component}__${data?.id}`]}
                        onChange={(e: any) => {
                          setFieldValue(`${data?.component}__${data?.id}.value`, e.target.value);
                        }}
                      />
                    );
                  case "speech_recognition":
                    return (
                      <MobileSpeechRecognition
                        dataItem={data}
                        errors={errors?.[`${data?.component}__${data?.id}`]}
                      />
                    );
                  case "location":
                    return (
                      <MobileLocation
                        dataItem={data}
                        errors={errors?.[`${data?.component}__${data?.id}`]}
                      />
                    );
                  case "temp":
                    return (
                      <MobileTemperature
                        errors={errors?.[`${data?.component}__${data?.id}`]}
                        handleFormikFields={handleFormikFields}
                        logic={foundLogic}
                        item={data}
                        name={`${data?.component}__${data?.id}.value`}
                        value={values?.[`${data?.component}__${data?.id}`]?.value}
                        onChange={(e: any) => {
                          setFieldValue(`${data?.component}__${data?.id}.value`, e.target.value);
                        }}
                      />
                    );
                  case "anno":
                    return (
                      <MobileAnnotation
                        dataItem={data}
                        errors={errors?.[`${data?.component}__${data?.id}`]}
                      />
                    );
                  case "checkbox":
                    return (
                      <MobileCheckbox
                        dataItem={data}
                        value={values?.[`${data?.component}__${data?.id}`]?.value}
                        errors={errors?.[`${data?.component}__${data?.id}`]}
                        onChange={(e: any) => {
                          setFieldValue(`${data?.component}__${data?.id}.value`, e.target.checked);
                        }}
                      />
                    );
                  case "instruction":
                    return (
                      <MobileInstruction
                        errors={errors?.[`${data?.component}__${data?.id}`]}
                        item={data}
                        handleFormikFields={handleFormikFields}
                        logic={foundLogic}
                        // value={values.datasets?.[index]?.value}
                        // onChange={(e: any) =>
                        //   setFieldValue(`datasets.${index}.value`, e.target.value)
                        // }
                      />
                    );
                  case "signature":
                    return (
                      <MobileSignature
                        item={data}
                        errors={errors?.[`${data?.component}__${data?.id}`]}
                        handleFormikFields={handleFormikFields}
                        logic={foundLogic}
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
            borderRadius: "10px",
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
                  logicDataSet={dataSetSeperator?.logicDataSet}
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
              <div key={index}>
                {/* <h1>{data?.label}</h1> */}
                <GenerateQuestion
                  data={it}
                  dataSetSeperator={dataSetSeperator}
                  formikData={formikData}
                  internalResponseData={internalResponseData}
                />
              </div>
            );
          }
        })}
      </>
    );
  }
  return <></>;
}

const FormNode = ({ dataSetSeperator, data, formikData, internalResponseData }: any) => {
  let { values, handleChange, handleSubmit, setFieldValue, errors, touched } = formikData;

  //   const [setTrigger, updateTrigger]
  const foundLogic = dataSetSeperator.logicDataSet?.find((datas: any) => data.logicId === datas.id);

  if (!foundLogic) return null;

  //   useEffect(() => {}, []);
  let trigger = {};

  const conditionQuestions = foundLogic?.logics
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
            allOptions: foundLogic?.logicOptions || [],
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
                    logicDataSet={dataSetSeperator?.logicDataSet}
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
                  <h1> {data?.label}</h1>
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

const MobileIndex = ({ children }: MobilePreviewProps) => {
  const { templateDatasets, setTemplateDatasets } = useTemplateFieldsStore();
  const {} = useTemplate();

  const [internalResponseData, setInternalResponseData] = React.useState<any>([]);
  const [searchInternalResponse, setSearchInternalResponse] = React.useState<string>("");

  const InternalSearchResponse = useDebounceSearch(searchInternalResponse, 1000);

  const handleSearchInternalResponse = async () => {
    await fetchApI({
      setterFunction: setInternalResponseData,
      url: `internal-response/?q=${InternalSearchResponse}&page=1&size=50`,
    });
  };

  useEffect(() => {
    handleSearchInternalResponse();
  }, [InternalSearchResponse]);

  const dataSetSeperator = templateDatasets.reduce(
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

  const keyFields = ["component", "id"];

  const initialValues = templateDatasets.reduce((values: any, field: any) => {
    if (field?.component?.toLowerCase() === "question") {
      return {
        ...values,
        [`${keyFields?.map((keyField: any) => field?.[keyField])?.join("__")}`]: {
          value: field?.type !== "Array" ? "" : [],
          trigger: {},
          keyName: `${keyFields?.map((keyField: any) => field?.[keyField])?.join("__")}`,
        },
      };
    }
    return values;
  }, {});

  const getValidation = DynamicSchemaGenerator({
    questions: templateDatasets,
    keyFields,
    dataSetSeperator,
    key: "id",
    initialValues,
  });
  return (
    <div id="MobilePreview_container" style={{ marginTop: "1rem", padding: "0.5rem" }}>
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        validationSchema={getValidation}
        onSubmit={(values) => {
          console.log({ values }, "submit");
        }}
      >
        {({ handleSubmit, handleChange, values, setFieldValue, errors, touched }: any) => {
          // console.log(values);
          return (
            <form onSubmit={handleSubmit}>
              {dataSetSeperator?.questionDataSet?.map((data: any) => {
                const foundLogic = dataSetSeperator?.logicDataSet?.find(
                  (lg: any) => lg?.id === data?.logicId,
                );
                return (
                  <div key={data?.id}>
                    {/* <label htmlFor={`question${data?.id}`}>{data?.label}</label> */}
                    {data.component === "question" && (
                      <div>
                        <div className="mobile_component_box">
                          <div className="mobile_component_box_wrapper">
                            <div className="mobile_component_box_wrapper_heading">
                              {data?.response_choice === "internal" && (
                                <SelectInternalResponse
                                  item={data}
                                  apiItem={
                                    internalResponseData.length &&
                                    internalResponseData.find(
                                      (responseData: any) => responseData.id === data.response_type,
                                    )
                                  }
                                  onChange={(e: any, field: string) => {
                                    let values = Array.isArray(e)
                                      ? e
                                          ?.map((data: any) => data?.[field])
                                          .filter((data: any) => Boolean(data))
                                      : [e?.[field]]?.filter((data: any) => Boolean(data));

                                    let flaggedResponse = foundLogic?.flaggedResponse || [];
                                    let flaggedValue = values?.filter((data: any) =>
                                      flaggedResponse?.includes(data),
                                    );
                                    setFieldValue(
                                      `${data?.component}__${data?.id}.flaggedValue`,
                                      flaggedValue,
                                    );

                                    setFieldValue(`${data?.component}__${data?.id}.value`, values);
                                  }}
                                  value={values?.[`${data?.component}__${data?.id}`]?.value}
                                  logic={foundLogic}
                                  errors={errors?.[`${data?.component}__${data?.id}`]}
                                  handleFormikFields={{
                                    setFieldValue,
                                    values,
                                    handleChange,
                                  }}
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
                                    let flaggedResponse = foundLogic?.flaggedResponse || [];
                                    let flaggedValue = values?.filter((data: any) =>
                                      flaggedResponse?.includes(data),
                                    );
                                    setFieldValue(
                                      `${data?.component}__${data?.id}.flaggedValue`,
                                      flaggedValue,
                                    );
                                    setFieldValue(`${data?.component}__${data?.id}.value`, values);
                                  }}
                                  value={values?.[`${data?.component}__${data?.id}`]?.value}
                                  item={data}
                                  logic={foundLogic}
                                  name={`${data?.component}__${data?.id}.value`}
                                  errors={errors?.[`${data?.component}__${data?.id}`]}
                                  handleFormikFields={{
                                    setFieldValue,
                                    values,
                                    handleChange,
                                  }}
                                />
                              )}

                              {data?.response_choice === "default" && (
                                <>
                                  {(() => {
                                    let type = responseItems.find(
                                      (option: any) => option.id === data.response_type,
                                    )?.type;

                                    let handleFormikFields = {
                                      handleSubmit,
                                      handleChange,
                                      values,
                                      setFieldValue,
                                    };

                                    switch (type) {
                                      case "text":
                                        return (
                                          <MobileTextAnswer
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
                                            // handleFormikFields={{
                                            //   handleSubmit,
                                            //   handleChange,
                                            //   values,
                                            //   setFieldValue,
                                            // }}
                                            handleFormikFields={handleFormikFields}
                                            logic={foundLogic}
                                          />
                                        );
                                      case "inspection_date":
                                        return (
                                          <MobileInspectionDate
                                            item={data}
                                            handleFormikFields={handleFormikFields}
                                            logic={foundLogic}
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
                                        );
                                      case "date":
                                        return (
                                          <MobileDateTime
                                            handleFormikFields={handleFormikFields}
                                            logic={foundLogic}
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
                                        );
                                      case "range":
                                        return (
                                          <MobileSlider
                                            handleFormikFields={handleFormikFields}
                                            logic={foundLogic}
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
                                        );
                                      case "number":
                                        return (
                                          <MobileNumber
                                            handleFormikFields={handleFormikFields}
                                            logic={foundLogic}
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
                                            // handleFormikFields={{
                                            //   handleSubmit,
                                            //   handleChange,
                                            //   values,
                                            //   setFieldValue,
                                            // }}
                                          />
                                        );
                                      case "speech_recognition":
                                        return (
                                          <MobileSpeechRecognition
                                            handleFormikFields={handleFormikFields}
                                            logic={foundLogic}
                                            dataItem={data}
                                          />
                                        );
                                      case "location":
                                        return <MobileLocation />;
                                      case "temp":
                                        return (
                                          <MobileTemperature
                                            handleFormikFields={handleFormikFields}
                                            logic={foundLogic}
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
                                            // handleFormikFields={{
                                            //   handleSubmit,
                                            //   handleChange,
                                            //   values,
                                            //   setFieldValue,
                                            // }}
                                          />
                                        );
                                      case "anno":
                                        return (
                                          <MobileAnnotation
                                            dataItem={data}
                                            handleFormikFields={handleFormikFields}
                                            logic={foundLogic}
                                            errors={errors?.[`${data?.component}__${data?.id}`]}
                                          />
                                        );
                                      case "checkbox":
                                        return (
                                          <MobileCheckbox
                                            dataItem={data}
                                            value={
                                              values?.[`${data?.component}__${data?.id}`]?.value
                                            }
                                            handleFormikFields={handleFormikFields}
                                            logic={foundLogic}
                                            errors={errors?.[`${data?.component}__${data?.id}`]}
                                            onChange={(e: any) => {
                                              setFieldValue(
                                                `${data?.component}__${data?.id}.value`,
                                                e.target.checked,
                                              );
                                            }}
                                          />
                                        );
                                      case "instruction":
                                        return (
                                          <MobileInstruction
                                            errors={errors?.[`${data?.component}__${data?.id}`]}
                                            item={data}
                                            handleFormikFields={handleFormikFields}
                                            logic={foundLogic}
                                            // value={values.datasets?.[index]?.value}
                                            // onChange={(e: any) =>
                                            //   setFieldValue(`datasets.${index}.value`, e.target.value)
                                            // }
                                          />
                                        );
                                      case "signature":
                                        return (
                                          <MobileSignature
                                            item={data}
                                            // logic={foundLogic}
                                            handleFormikFields={handleFormikFields}
                                            logic={foundLogic}
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
                                        );
                                      case "mobile_number":
                                        return (
                                          <MobileNumber
                                            handleFormikFields={handleFormikFields}
                                            logic={foundLogic}
                                          />
                                        );
                                      default:
                                        return <></>;
                                    }
                                  })()}
                                </>
                              )}
                              <div>
                                {data?.trigger?.Require_Evidence && (
                                  <div>{data?.trigger?.Require_Evidence?.map((ev: any) => ev)}</div>
                                )}
                                {data?.trigger?.Require_Action && <div>Require Action</div>}
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
                            errors,
                          }}
                        />
                      </div>
                    )}
                    {data.component === "section" && (
                      <>
                        {/* <h1> {data?.label}</h1> */}
                        <GenerateQuestion
                          data={data}
                          dataSetSeperator={dataSetSeperator}
                          formikData={{ values, setFieldValue, touched, errors }}
                          internalResponseData={internalResponseData}
                        />
                      </>
                    )}
                  </div>
                );
              })}
              <Button variant="contained" type="submit" style={{ margin: "1rem 0" }}>
                Submit
              </Button>
            </form>
          );
        }}
      </Formik>
    </div>
  );
};

export default MobileIndex;
