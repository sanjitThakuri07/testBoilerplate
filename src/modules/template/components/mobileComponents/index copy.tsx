import React, { useEffect, useState } from "react";
import MobileTextAnswer from "./MobileTextAnswer/MobileTextAnswer";
import MobileSlider from "./MobileSlider/MobileSlider";
import { useTemplate } from "src/store/zustand/globalStates/templates/templateData";
import { useTemplateFieldsStore } from "src/modules/template/store/templateFieldsStore";
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
import { validateInput } from "src/modules/template/validation/inputLogicCheck";
import { findData } from "src/modules/template/validation/keyValidationFunction";
import { DynamicSchemaGenerator } from "src/modules/template/validation/index";
import MobileAnnotation from "./MobileAnnotation/mobileAnnotation";
import MobileCheckbox from "./MobileCheckbox/mobileCheckbox";
import { v4 as uuidv4 } from "uuid";

interface MobilePreviewProps {
  children?: React.ReactNode;
}

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
      {data?.response_choice === "internal" && (
        <SelectInternalResponse
          item={data}
          handleFormikFields={handleFormikFields}
          errors={errors?.[`${data?.label}__${data?.id}`]}
          apiItem={
            internalResponseData.length &&
            internalResponseData.find((responseData: any) => responseData.id === data.response_type)
          }
        />
      )}

      {(data?.response_choice === "multiple" || data?.response_choice === "global") && (
        <SelectMultipleResponse
          onChange={(e: any) => {
            setFieldValue(`${data?.label}__${data?.id}.value`, e?.name);
          }}
          item={data}
          handleFormikFields={handleFormikFields}
          name={`${data?.label}__${data?.id}.value`}
          errors={errors?.[`${data?.label}__${data?.id}`]}
        />
      )}

      {data?.response_choice === "default" &&
        (responseItems.find((option: any) => option.id === data.response_type)?.type === "text" ? (
          <MobileTextAnswer
            item={data}
            handleFormikFields={handleFormikFields}
            // value={values.datasets?.[index]?.value}
            name={`${data?.label}__${data?.id}.value`}
            value={values?.[`${data?.label}__${data?.id}`]?.value}
            errors={errors?.[`${data?.label}__${data?.id}`]}
            onChange={(e: any) => {
              setFieldValue(`${data?.label}__${data?.id}.value`, e.target.value);
            }}
          />
        ) : responseItems.find((option: any) => option.id === data.response_type)?.type ===
          "inspection_date" ? (
          <MobileInspectionDate
            item={data}
            handleFormikFields={handleFormikFields}
            errors={errors?.[`${data?.label}__${data?.id}`]}
          />
        ) : responseItems.find((option: any) => option.id === data.response_type)?.type ===
          "date" ? (
          <MobileDateTime
            item={data}
            handleFormikFields={handleFormikFields}
            errors={errors?.[`${data?.label}__${data?.id}`]}
            onChange={(e: any) => {
              setFieldValue(`${data?.label}__${data?.id}.value`, e.target.value);
            }}
          />
        ) : responseItems.find((option: any) => option.id === data.response_type)?.type ===
          "range" ? (
          <MobileSlider
            item={data}
            handleFormikFields={handleFormikFields}
            name={`${data?.label}__${data?.id}.value`}
            value={values?.[`${data?.label}__${data?.id}`]?.value}
            errors={errors?.[`${data?.label}__${data?.id}`]}
            onChange={(e: any) => {
              setFieldValue(`${data?.label}__${data?.id}.value`, e.target.value);
            }}
          />
        ) : responseItems.find((option: any) => option.id === data.response_type)?.type ===
          "number" ? (
          <MobileNumber
            item={data}
            handleFormikFields={handleFormikFields}
            name={`${data?.label}__${data?.id}.value`}
            value={values?.[`${data?.label}__${data?.id}`]?.value}
            errors={errors?.[`${data?.label}__${data?.id}`]}
            onChange={(e: any) => {
              setFieldValue(`${data?.label}__${data?.id}.value`, e.target.value);
            }}
          />
        ) : responseItems.find((option: any) => option.id === data.response_type)?.type ===
          "speech_recognition" ? (
          <MobileSpeechRecognition
            dataItem={data}
            errors={errors?.[`${data?.label}__${data?.id}`]}
          />
        ) : responseItems.find((option: any) => option.id === data.response_type)?.type ===
          "location" ? (
          <MobileLocation dataItem={data} errors={errors?.[`${data?.label}__${data?.id}`]} />
        ) : responseItems.find((option: any) => option.id === data.response_type)?.type ===
          "temp" ? (
          <MobileTemperature errors={errors?.[`${data?.label}__${data?.id}`]} />
        ) : responseItems.find((option: any) => option.id === data.response_type)?.type ===
          "anno" ? (
          <MobileAnnotation dataItem={data} errors={errors?.[`${data?.label}__${data?.id}`]} />
        ) : responseItems.find((option: any) => option.id === data.response_type)?.type ===
          "checkbox" ? (
          <MobileCheckbox dataItem={data} errors={errors?.[`${data?.label}__${data?.id}`]} />
        ) : responseItems.find((option: any) => option.id === data.response_type)?.type ===
          "instruction" ? (
          <MobileInstruction
            errors={errors?.[`${data?.label}__${data?.id}`]}
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
            handleFormikFields={handleFormikFields}
            errors={errors?.[`${data?.label}__${data?.id}`]}
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
    </>
  );
}

// function GenerateQuestion({ datas, dataSetSeperator, formikData, internalResponseData }: any) {
//   if (datas?.length) {
//     return (
//       <>
//         {datas?.map((data: any, index: number) => {
//           return (
//             <div key={index}>
//               <InputFields
//                 key={data?.id}
//                 responseItems={responseItems}
//                 handleFormikFields={formikData}
//                 internalResponseData={internalResponseData}
//                 data={data}
//               />
//               <FormNode
//                 dataSetSeperator={dataSetSeperator}
//                 data={data}
//                 key={data?.id}
//                 formikData={formikData}
//                 internalResponseData={internalResponseData}
//               />
//             </div>
//           );
//         })}
//       </>
//     );
//   }
//   return <></>;
// }
function GenerateQuestion({ data, dataSetSeperator, formikData, internalResponseData }: any) {
  const findChildren = dataSetSeperator?.logicQuestion?.filter((item: any) => {
    return data?.id === item?.parent;
  });
  if (findChildren?.length) {
    return (
      <>
        {findChildren?.map((data: any, index: number) => {
          if (data.component === "question") {
            return (
              <>
                <FormNode
                  dataSetSeperator={dataSetSeperator}
                  data={data}
                  key={data?.id}
                  formikData={formikData}
                  internalResponseData={internalResponseData}
                />
              </>
            );
          } else if (data.component === "section") {
            return (
              <div key={index}>
                {/* <h1>{data?.label}</h1> */}
                <GenerateQuestion
                  data={data}
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
  if (data.component === "question") {
    const findLogic = dataSetSeperator.logicDataSet?.find(
      (datas: any) => data.logicId === datas.id,
    );

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
              userInput: values?.[`${data?.label}__${data?.id}`]?.value,
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
                <InputFields
                  key={data?.id}
                  responseItems={responseItems}
                  handleFormikFields={formikData}
                  internalResponseData={internalResponseData}
                  data={data}
                />
                {/* {data?.component === 'question' && (
                  <InputFields
                    key={data?.id}
                    responseItems={responseItems}
                    handleFormikFields={formikData}
                    internalResponseData={internalResponseData}
                    data={data}
                  />
                )}
                {data?.component === 'section' && (
                  <>
                    <h1>{data?.label}</h1>
                    <GenerateQuestion
                      data={data}
                      dataSetSeperator={dataSetSeperator}
                      formikData={formikData}
                      internalResponseData={internalResponseData}
                    />
                  </>
                )} */}
              </div>
            );
          })}
        </div>
      );
    }
  } else if (data.component === "section") {
    // const findChildren = dataSetSeperator?.logicQuestion?.filter((item: any) => {
    //   return data?.id === item?.parent;
    // });

    return (
      <>
        <h1> {data?.label}</h1>
        <GenerateQuestion
          data={data}
          dataSetSeperator={dataSetSeperator}
          formikData={formikData}
          internalResponseData={internalResponseData}
        />
        {/* {findChildren?.length ? (
          <GenerateQuestion
            datas={findChildren}
            dataSetSeperator={dataSetSeperator}
            formikData={formikData}
            internalResponseData={internalResponseData}
          />
        ) : (
          <></>
        )} */}
      </>
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

  const keyFields = ["label", "id"];

  const initialValues = templateDatasets.reduce((values: any, field: any) => {
    if (field?.component?.toLowerCase() === "question") {
      return {
        ...values,
        [`${keyFields?.map((keyField: any) => field?.[keyField])?.join("__")}`]: {
          value: "",
          trigger: {},
          keyName: `${keyFields?.map((keyField: any) => field?.[keyField])?.join("__")}`,
        },
      };
    }
    return values;
  }, {});

  const getValidation = DynamicSchemaGenerator({
    questions: dataSetSeperator.questionDataSet,
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
        onSubmit={(values) => {}}
      >
        {({ handleSubmit, handleChange, values, setFieldValue, errors, touched }: any) => {
          // console.log({ errors });
          return (
            <form onSubmit={handleSubmit}>
              {dataSetSeperator?.questionDataSet?.map((data: any) => {
                return (
                  <div key={data?.id}>
                    {/* <label htmlFor={`question${data?.id}`}>{data?.label}</label> */}
                    {(() => {
                      if (data?.component === "question") {
                        return (
                          <>
                            {data?.response_choice === "internal" && (
                              <SelectInternalResponse
                                item={data}
                                handleFormikFields={{
                                  handleSubmit,
                                  handleChange,
                                  values,
                                  setFieldValue,
                                  errors,
                                  touched,
                                }}
                                errors={errors?.[`${data?.label}__${data?.id}`]}
                                apiItem={
                                  internalResponseData.length &&
                                  internalResponseData.find(
                                    (responseData: any) => responseData.id === data.response_type,
                                  )
                                }
                              />
                            )}

                            {(data?.response_choice === "multiple" ||
                              data?.response_choice === "global") && (
                              <SelectMultipleResponse
                                onChange={(e: any) => {
                                  setFieldValue(`${data?.label}__${data?.id}.value`, e?.name);
                                }}
                                item={data}
                                handleFormikFields={{
                                  handleSubmit,
                                  handleChange,
                                  values,
                                  setFieldValue,
                                  errors,
                                  touched,
                                }}
                                name={`${data?.label}__${data?.id}.value`}
                                errors={errors?.[`${data?.label}__${data?.id}`]}
                              />
                            )}

                            {data?.response_choice === "default" &&
                              (responseItems.find((option: any) => option.id === data.response_type)
                                ?.type === "text" ? (
                                <MobileTextAnswer
                                  item={data}
                                  handleFormikFields={{
                                    handleSubmit,
                                    handleChange,
                                    values,
                                    setFieldValue,
                                    errors,
                                    touched,
                                  }}
                                  // value={values.datasets?.[index]?.value}
                                  name={`${data?.label}__${data?.id}.value`}
                                  value={values?.[`${data?.label}__${data?.id}`]?.value}
                                  errors={errors?.[`${data?.label}__${data?.id}`]}
                                  onChange={(e: any) => {
                                    setFieldValue(
                                      `${data?.label}__${data?.id}.value`,
                                      e.target.value,
                                    );
                                  }}
                                />
                              ) : responseItems.find(
                                  (option: any) => option.id === data.response_type,
                                )?.type === "inspection_date" ? (
                                <MobileInspectionDate
                                  item={data}
                                  handleFormikFields={{
                                    handleSubmit,
                                    handleChange,
                                    values,
                                    setFieldValue,
                                    errors,
                                    touched,
                                  }}
                                  errors={errors?.[`${data?.label}__${data?.id}`]}
                                />
                              ) : responseItems.find(
                                  (option: any) => option.id === data.response_type,
                                )?.type === "date" ? (
                                <MobileDateTime
                                  item={data}
                                  handleFormikFields={{
                                    handleSubmit,
                                    handleChange,
                                    values,
                                    setFieldValue,
                                    errors,
                                    touched,
                                  }}
                                  errors={errors?.[`${data?.label}__${data?.id}`]}
                                  onChange={(e: any) => {
                                    setFieldValue(
                                      `${data?.label}__${data?.id}.value`,
                                      e.target.value,
                                    );
                                  }}
                                />
                              ) : responseItems.find(
                                  (option: any) => option.id === data.response_type,
                                )?.type === "range" ? (
                                <MobileSlider
                                  item={data}
                                  handleFormikFields={{
                                    handleSubmit,
                                    handleChange,
                                    values,
                                    setFieldValue,
                                    errors,
                                    touched,
                                  }}
                                  name={`${data?.label}__${data?.id}.value`}
                                  value={values?.[`${data?.label}__${data?.id}`]?.value}
                                  errors={errors?.[`${data?.label}__${data?.id}`]}
                                  onChange={(e: any) => {
                                    setFieldValue(
                                      `${data?.label}__${data?.id}.value`,
                                      e.target.value,
                                    );
                                  }}
                                />
                              ) : responseItems.find(
                                  (option: any) => option.id === data.response_type,
                                )?.type === "number" ? (
                                <MobileNumber
                                  item={data}
                                  handleFormikFields={{
                                    handleSubmit,
                                    handleChange,
                                    values,
                                    setFieldValue,
                                    errors,
                                    touched,
                                  }}
                                  name={`${data?.label}__${data?.id}.value`}
                                  value={values?.[`${data?.label}__${data?.id}`]?.value}
                                  errors={errors?.[`${data?.label}__${data?.id}`]}
                                  onChange={(e: any) => {
                                    setFieldValue(
                                      `${data?.label}__${data?.id}.value`,
                                      e.target.value,
                                    );
                                  }}
                                />
                              ) : responseItems.find(
                                  (option: any) => option.id === data.response_type,
                                )?.type === "speech_recognition" ? (
                                <MobileSpeechRecognition
                                  dataItem={data}
                                  errors={errors?.[`${data?.label}__${data?.id}`]}
                                />
                              ) : responseItems.find(
                                  (option: any) => option.id === data.response_type,
                                )?.type === "location" ? (
                                <MobileLocation
                                  dataItem={data}
                                  errors={errors?.[`${data?.label}__${data?.id}`]}
                                />
                              ) : responseItems.find(
                                  (option: any) => option.id === data.response_type,
                                )?.type === "temp" ? (
                                <MobileTemperature
                                  errors={errors?.[`${data?.label}__${data?.id}`]}
                                />
                              ) : responseItems.find(
                                  (option: any) => option.id === data.response_type,
                                )?.type === "anno" ? (
                                <MobileAnnotation
                                  dataItem={data}
                                  errors={errors?.[`${data?.label}__${data?.id}`]}
                                />
                              ) : responseItems.find(
                                  (option: any) => option.id === data.response_type,
                                )?.type === "checkbox" ? (
                                <MobileCheckbox
                                  dataItem={data}
                                  errors={errors?.[`${data?.label}__${data?.id}`]}
                                />
                              ) : responseItems.find(
                                  (option: any) => option.id === data.response_type,
                                )?.type === "instruction" ? (
                                <MobileInstruction
                                  errors={errors?.[`${data?.label}__${data?.id}`]}
                                  item={data}
                                  handleFormikFields={{
                                    handleSubmit,
                                    handleChange,
                                    values,
                                    setFieldValue,
                                    errors,
                                    touched,
                                  }}
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
                                  handleFormikFields={{
                                    handleSubmit,
                                    handleChange,
                                    values,
                                    setFieldValue,
                                    errors,
                                    touched,
                                  }}
                                  errors={errors?.[`${data?.label}__${data?.id}`]}
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
                          </>
                        );
                      } else if (data?.component === "section") {
                        return (
                          <>
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
                          </>
                        );
                      }
                    })()}

                    {/* <FormNode
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
                    /> */}
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

{
  /* <Formik
enableReinitialize={true}
initialValues={{
  datasets: templateDatasets,
}}
onSubmit={(values) => {
  setTemplateDatasets(values.datasets);
  // setTemplateDatasets(values)
}}>
{({ values, setFieldValue }) => {
  return (
    <Form>
      <>
        <FieldArray name="persons">
          {({ push, remove, insert }) => (
            <>
              {values.datasets.map((data: any, index: any) => {
                return (
                  <>
                    {data.component === 'question' ? (
                      <ReusableMobileComponent
                        item={data}
                         handleFormikFields={{
                            handleSubmit,
                            handleChange,
                            values,
                            setFieldValue,
                            errors,
                            touched,
                          }}
                        label={''}
                        children={
                          <>
                            {data?.response_choice === 'internal' && (
                              <SelectInternalResponse
                                item={data}
                                 handleFormikFields={{
                            handleSubmit,
                            handleChange,
                            values,
                            setFieldValue,
                            errors,
                            touched,
                          }}
                                apiItem={
                                  internalResponseData.length &&
                                  internalResponseData.find(
                                    (responseData: any) =>
                                      responseData.id === data.response_type,
                                  )
                                }
                              />
                            )}
                            {(data?.response_choice === 'multiple' ||
                              data?.response_choice === 'global') && (
                              <SelectMultipleResponse item={data}
                               handleFormikFields={{
                            handleSubmit,
                            handleChange,
                            values,
                            setFieldValue,
                            errors,
                            touched,
                          }} />
                            )}

                            {data?.response_choice === 'default' ? (
                              responseItems.find(
                                (option: any) => option.id === data.response_type,
                              )?.component === 'text' ? (
                                <MobileTextAnswer
                                  item={data}
                                   handleFormikFields={{
                            handleSubmit,
                            handleChange,
                            values,
                            setFieldValue,
                            errors,
                            touched,
                          }}
                                  value={values.datasets?.[index]?.value}
                                  onChange={(e: any) =>
                                    setFieldValue(`datasets.${index}.value`, e.target.value)
                                  }
                                />
                              ) : responseItems.find(
                                  (option: any) => option.id === data.response_type,
                                )?.component === 'date' ? (
                                responseItems.find(
                                  (option: any) => option.id === data.response_type,
                                )?.id === 2 ? (
                                  <MobileInspectionDate item={data}
                                   handleFormikFields={{
                            handleSubmit,
                            handleChange,
                            values,
                            setFieldValue,
                            errors,
                            touched,
                          }} />
                                ) : responseItems.find(
                                    (option: any) => option.id === data.response_type,
                                  )?.id === 3 ? (
                                  <MobileDateTime item={data}
                                   handleFormikFields={{
                            handleSubmit,
                            handleChange,
                            values,
                            setFieldValue,
                            errors,
                            touched,
                          }} />
                                ) : (
                                  ''
                                )
                              ) : responseItems.find(
                                  (option: any) => option.id === data.response_type,
                                )?.component === 'range' ? (
                                <MobileSlider item={data}
                                 handleFormikFields={{
                            handleSubmit,
                            handleChange,
                            values,
                            setFieldValue,
                            errors,
                            touched,
                          }} />
                              ) : responseItems.find(
                                  (option: any) => option.id === data.response_type,
                                )?.component === 'number' ? (
                                <MobileNumber
                                  item={data}
                                   handleFormikFields={{
                            handleSubmit,
                            handleChange,
                            values,
                            setFieldValue,
                            errors,
                            touched,
                          }}
                                  value={values.datasets?.[index]?.value}
                                  onChange={(e: any) =>
                                    setFieldValue(`datasets.${index}.value`, e.target.value)
                                  }
                                />
                              ) : responseItems.find(
                                  (option: any) => option.id === data.response_type,
                                )?.component === 'speech_recognition' ? (
                                <MobileSpeechRecognition dataItem={data} />
                              ) : responseItems.find(
                                  (option: any) => option.id === data.response_type,
                                )?.component === 'location' ? (
                                <MobileLocation />
                              ) : responseItems.find(
                                  (option: any) => option.id === data.response_type,
                                )?.component === 'temp' ? (
                                <MobileTemperature />
                              ) : responseItems.find(
                                  (option: any) => option.id === data.response_type,
                                )?.component === 'instruction' ? (
                                <MobileInstruction
                                  item={data}
                                   handleFormikFields={{
                            handleSubmit,
                            handleChange,
                            values,
                            setFieldValue,
                            errors,
                            touched,
                          }}
                                  // value={values.datasets?.[index]?.value}
                                  // onChange={(e: any) =>
                                  //   setFieldValue(`datasets.${index}.value`, e.target.value)
                                  // }
                                />
                              ) : responseItems.find(
                                  (option: any) => option.id === data.response_type,
                                )?.component === 'signature' ? (
                                <MobileSignature
                                  item={data}
                                   handleFormikFields={{
                            handleSubmit,
                            handleChange,
                            values,
                            setFieldValue,
                            errors,
                            touched,
                          }}
                                  // value={values.datasets?.[index]?.value}
                                  // onChange={(e: any) =>
                                  //   setFieldValue(`datasets.${index}.value`, e.target.value)
                                  // }
                                />
                              ) : (
                                // <MobileNumber />
                                ''
                              )
                            ) : (
                              ''
                            )}

                          
                          </>
                        }
                      />
                    ) : (
                      // <div key={index}>
                      //   <div>{person.label}</div>
                      //   <input
                      //     value={values.datasets?.[index]?.value}
                      //     onChange={(e) =>
                      //       setFieldValue(`datasets.${index}.value`, e.target.value)
                      //     }
                      //   />
                      //   {/* <Field name={`persons.${index}.value`} /> */
}
//   <div className="mobile_component_box_wrapper_footer">
//     <div className="footer_item" onClick={() => {}}>
//       <div className="footer_item_icon">
//         <img src={NoteIcon} alt="" />
//       </div>
//       <div className="footer_item_text">Notes</div>
//     </div>
//     {/* ---Next Item */}
//     <div className="footer_item" onClick={() => {}}>
//       <div className="footer_item_icon">
//         <img src={MediaIcon} alt="" />
//       </div>
//       <div className="footer_item_text">Media</div>
//     </div>
//     {/* ---Next Item */}
//     <div className="footer_item" onClick={() => {}}>
//       <div className="footer_item_icon">
//         <img src={ActionIcon} alt="" />
//       </div>
//       <div className="footer_item_text">Action</div>
//     </div>
//   </div>
// </div>
// ('');
// <div className="mobile_component_box">
//   <div className="mobile_component_box_wrapper">
//     <div className="mobile_component_box_wrapper_heading">
//       {data.label}
//     </div>
//   </div>
// </div>
//                     )}
//                   </>
//                 );
//               })}
//             </>
//           )}
//         </FieldArray>
//       </>
//       <button type="submit">Sumbit</button>
//     </Form>
//   );
// }}
// </Formik> */}
