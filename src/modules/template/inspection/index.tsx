import React, { useEffect, useMemo, useState } from "react";

import { useTemplateStore } from "src/modules/template/store/templateStore";
import { useTemplateFieldsStore } from "containers/template/store/templateFieldsStore";
import LogoutIcon from "src/assets/icons/logout_icon.svg";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import FullPageLoader from "src/components/FullPageLoader";
import { fetchApI } from "src/modules/apiRequest/apiRequest";
import responseItems from "constants/template/responseItems";
import { Formik } from "formik";
import { Button } from "@mui/material";
import SelectMultipleResponse from "../components/mobileComponents/SelectMultipleResponse";
import MobileTextAnswer from "../components/mobileComponents/MobileTextAnswer/MobileTextAnswer";
import MobileInspectionDate from "../components/mobileComponents/MobileInspectionDate/MobileInspectionDate";
import MobileDateTime from "../components/mobileComponents/MobileDateTime/MobileDateTime";
import MobileSlider from "../components/mobileComponents/MobileSlider/MobileSlider";
import MobileNumber from "../components/mobileComponents/MobileNumber";
import MobileSpeechRecognition from "../components/mobileComponents/MobileSpeechRecognition/MobileSpeechRecognition";
import MobileLocation from "../components/mobileComponents/MobileLocation/MobileLocation";
import MobileTemperature from "../components/mobileComponents/MobileTemperature/mobileTemperature";
import MobileInstruction from "../components/mobileComponents/MobileInstruction";
import MobileSignature from "../components/mobileComponents/MobileSignature";
import SelectInternalResponse from "../components/mobileComponents/SelectInternalResponse";

import MobileAnnotation from "../components/mobileComponents/MobileAnnotation/mobileAnnotation";
import MobileCheckbox from "../components/mobileComponents/MobileCheckbox/mobileCheckbox";

import { DynamicSchemaGenerator } from "../validation";
import MobileMedia from "../components/mobileComponents/MobileMedia/MobileMedia";
import useApiOptionsStore from "containers/template/store/apiOptionsTemplateStore";
import { useInspectionStore } from "../store/inspectionStore";
import { useSnackbar } from "notistack";
import QuestionToolBar from "./questionToolBar";
import { activeScroll, checkActionTrigger } from "./SubComponents/activeScroll";
import { GenerateQuestion } from "./SubComponents/inspectionSection";
import { FormNode } from "./SubComponents/formNode";
import useInspectionStatusStore from "store/generalSettings/InsepctionStatus";
import { moduleIdsFnR, possibleFnRWithoutMainCategory, url } from "src/utils/url";
import { v4 as uuidv4 } from "uuid";
import ConfirmationModal from "src/components/ConfirmationModal/ConfirmationModal";

const FormComponent = ({
  options,
  isOpenSection,
  toggleSection,
  data,
  readOnly,
  dataSetSeperator,
  internalResponseData,
  multipleResponseData,
  globalResponseData,
  checkActionTrigger,
  inputBlur,
  foundLogic,
  handleFormikFields = {
    setFieldValue: () => {},
    values: {},
    errors: {},
    handleSubmit: () => {},
  },
  template,
  ALL_OPTIONS,
  tempDatas,
  setTempDatas,
}: any) => {
  let { setFieldValue, values, errors, validateForm, touched, handleSubmit, handleChange } =
    handleFormikFields;
  const [typing, setTyping] = useState(values?.[`${data?.component}__${data?.id}`]?.value || "");

  // useEffect(() => {
  //   if (values?.[`${data?.component}__${data?.id}`]?.value) {
  //     setTyping(values?.[`${data?.component}__${data?.id}`]?.value);
  //   }
  // }, [values]);

  return (
    <>
      {data.component === "question" && (
        <>
          <div
            className="mobile_component_box"
            data-item={`${data?.component}__${data?.id}`}
            onClick={() => {
              if (inputBlur?.isBlur) {
                activeScroll("_", "remove");
                inputBlur?.setIsBlur(false);
              }
            }}
          >
            <div className="mobile_component_box_wrapper">
              <div className="mobile_component_box_wrapper_heading" data-item={data?.id}>
                {data?.response_choice === "internal" && (
                  <SelectInternalResponse
                    item={data}
                    options={options}
                    dataSetSeperator={dataSetSeperator}
                    apiItem={
                      internalResponseData.length &&
                      internalResponseData.find(
                        (responseData: any) => responseData.id === data.response_type,
                      )
                    }
                    onBlur={(e: any) => {
                      setFieldValue(`${data?.component}__${data?.id}.value`, typing);
                    }}
                    onChange={(e: any, field: string) => {
                      let value = Array.isArray(e)
                        ? e?.map((data: any) => data)?.filter((data: any) => Boolean(data))
                        : [e]?.filter((data: any) => Boolean(data));
                      setTyping(value);
                      checkActionTrigger({
                        value: [e],
                        logic: foundLogic,
                        ALL_OPTIONS: ALL_OPTIONS,
                        templateTitle: template?.name || "",
                        setFieldValue: setFieldValue,
                        values: values,
                        question: data,
                      });

                      let flaggedResponse = foundLogic?.flaggedResponse || [];
                      let flaggedValue = value?.filter((data: any) =>
                        flaggedResponse?.includes(data),
                      );
                      setFieldValue(`${data?.component}__${data?.id}.flaggedValue`, flaggedValue);

                      setFieldValue(`${data?.component}__${data?.id}.value`, value);
                    }}
                    // value={values?.[`${data?.component}__${data?.id}`]?.value}
                    value={typing}
                    logic={foundLogic}
                    disabled={readOnly}
                    errors={errors?.[`${data?.component}__${data?.id}`]}
                    handleFormikFields={handleFormikFields}
                  />
                )}

                {data?.response_choice === "external" && (
                  <>
                    <MobileTextAnswer
                      item={data}
                      name={`${data?.component}__${data?.id}.value`}
                      value={typing || values?.[`${data?.component}__${data?.id}`]?.value}
                      onBlur={(e: any) => {
                        e.stopPropagation();
                        setFieldValue(`${data?.component}__${data?.id}.value`, typing);
                      }}
                      placeholder={"N/A"}
                      onChange={(e: any) => {
                        setTyping(e.target.value);
                        // setFieldValue(`${data?.component}__${data?.id}.value`, e.target.value);
                        // for notification
                        checkActionTrigger({
                          value: e.target.value,
                          logic: foundLogic,
                          ALL_OPTIONS: ALL_OPTIONS,
                          question: data,
                          templateTitle: template?.name || "",
                          setFieldValue: setFieldValue,
                          values: values,
                        });
                      }}
                      errors={errors?.[`${data?.component}__${data?.id}`]}
                      handleFormikFields={handleFormikFields}
                      logic={foundLogic}
                      disabled={values?.[`${data?.component}__${data?.id}`]?.disabled}
                      setTyping={setTyping}
                    />
                  </>
                  // <SelectExternalResponse
                  //   item={data}
                  //   options={options}
                  //   apiItem={
                  //     internalResponseData.length &&
                  //     internalResponseData.find(
                  //       (responseData: any) =>
                  //         responseData.id === data.response_type,
                  //     )
                  //   }
                  //   onChange={(e: any, field: string) => {
                  //     let values = Array.isArray(e)
                  //       ? e
                  //           ?.map((data: any) => data?.[field])
                  //           .filter((data: any) => Boolean(data))
                  //       : [e?.[field]]?.filter((data: any) => Boolean(data));

                  //     let flaggedResponse = foundLogic?.flaggedResponse || [];
                  //     let flaggedValue = values?.filter((data: any) =>
                  //       flaggedResponse?.includes(data),
                  //     );
                  //     setFieldValue(
                  //       `${data?.component}__${data?.id}.flaggedValue`,
                  //       flaggedValue,
                  //     );

                  //     setFieldValue(
                  //       `${data?.component}__${data?.id}.value`,
                  //       values,
                  //     );
                  //   }}
                  //   value={values?.[`${data?.component}__${data?.id}`]?.value}
                  //   logic={foundLogic}
                  //   disabled={readOnly}
                  //   errors={errors?.[`${data?.component}__${data?.id}`]}
                  // handleFormikFields={handleFormikFields}
                  //     setFieldValue,
                  //     values,
                  //     handleChange,
                  //   }}
                  // />
                )}
                {(data?.response_choice === "multiple" || data?.response_choice === "global") && (
                  <SelectMultipleResponse
                    multipleResponseData={multipleResponseData}
                    globalResponseData={globalResponseData}
                    onBlur={(e: any) => {
                      setFieldValue(`${data?.component}__${data?.id}.value`, typing);
                    }}
                    onChange={(e: any) => {
                      let value = Array.isArray(e)
                        ? e?.map((data: any) => data)?.filter((data: any) => Boolean(data))
                        : [e]?.filter((data: any) => Boolean(data));

                      setTyping(value);

                      checkActionTrigger({
                        value: [e],
                        logic: foundLogic,
                        ALL_OPTIONS: ALL_OPTIONS,
                        templateTitle: template?.name || "",
                        setFieldValue: setFieldValue,
                        values: values,
                        question: data,
                      });

                      let flaggedResponse = foundLogic?.flaggedResponse || [];
                      let flaggedValue = value?.filter((data: any) =>
                        flaggedResponse?.includes(data),
                      );
                      setFieldValue(`${data?.component}__${data?.id}.flaggedValue`, flaggedValue);
                      // setFieldValue(`${data?.component}__${data?.id}.value`, value);
                    }}
                    // value={values?.[`${data?.component}__${data?.id}`]?.value}
                    value={typing || []}
                    item={data}
                    logic={foundLogic}
                    disabled={readOnly}
                    name={`${data?.component}__${data?.id}.value`}
                    errors={errors?.[`${data?.component}__${data?.id}`]}
                    handleFormikFields={handleFormikFields}
                  />
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
                            <MobileTextAnswer
                              item={data}
                              name={`${data?.component}__${data?.id}.value`}
                              // value={
                              //   values?.[`${data?.component}__${data?.id}`]?.value
                              // }
                              value={typing}
                              onBlur={(e: any) => {
                                e.stopPropagation();
                                setFieldValue(`${data?.component}__${data?.id}.value`, typing);
                              }}
                              onChange={(e: any) => {
                                setTyping(e.target.value);
                                // for notification
                                checkActionTrigger({
                                  value: e.target.value,
                                  logic: foundLogic,
                                  ALL_OPTIONS: ALL_OPTIONS,
                                  question: data,
                                  templateTitle: template?.name || "",
                                  setFieldValue: setFieldValue,
                                  values: values,
                                });
                              }}
                              errors={errors?.[`${data?.component}__${data?.id}`]}
                              handleFormikFields={handleFormikFields}
                              logic={foundLogic}
                              disabled={readOnly}
                              setTyping={setTyping}
                            />
                          );
                        case "inspection_date":
                          return (
                            <MobileInspectionDate
                              item={data}
                              name={`${data?.component}__${data?.id}.value`}
                              handleFormikFields={handleFormikFields}
                              onBlur={(e: any) => {
                                e.stopPropagation();
                                setFieldValue(`${data?.component}__${data?.id}.value`, typing);
                              }}
                              logic={foundLogic}
                              disabled={readOnly}
                              errors={errors?.[`${data?.component}__${data?.id}`]}
                              value={typing}
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
                              // onBlur={(e: any) => {
                              //   e.stopPropagation();
                              //   setFieldValue(
                              //     `${data?.component}__${data?.id}.value`,
                              //     e.target.value,
                              //   );
                              // }}
                              logic={foundLogic}
                              name={`${data?.component}__${data?.id}.value`}
                              disabled={readOnly}
                              item={data}
                              errors={errors?.[`${data?.component}__${data?.id}`]}
                              // value={typing}
                              value={values?.[`${data?.component}__${data?.id}`]?.value}
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
                              // onBlur={(e: any) => {
                              //   e.stopPropagation();
                              //   setFieldValue(`${data?.component}__${data?.id}.value`, typing);
                              // }}
                              logic={foundLogic}
                              disabled={readOnly}
                              item={data}
                              value={typing}
                              name={`${data?.component}__${data?.id}.value`}
                              // value={values?.[`${data?.component}__${data?.id}`]?.value}
                              onChange={(e: any) => {
                                setTyping(e.target.value);
                                setFieldValue(`${data?.component}__${data?.id}.value`, typing);
                              }}
                            />
                          );
                        case "number":
                          return (
                            <MobileNumber
                              handleFormikFields={handleFormikFields}
                              onBlur={(e: any) => {
                                e.stopPropagation();
                                setFieldValue(`${data?.component}__${data?.id}.value`, typing);
                              }}
                              logic={foundLogic}
                              disabled={readOnly}
                              item={data}
                              value={typing}
                              name={`${data?.component}__${data?.id}.value`}
                              errors={errors?.[`${data?.component}__${data?.id}`]}
                              onChange={(e: any) => {
                                setTyping(e.target.value);
                                // for notification
                                checkActionTrigger({
                                  value: e.target.value,
                                  logic: foundLogic,
                                  ALL_OPTIONS: ALL_OPTIONS,
                                  question: data,
                                  templateTitle: template?.name || "",
                                  setFieldValue: setFieldValue,
                                  values: values,
                                });
                              }}
                            />
                          );
                        case "speech_recognition":
                          return (
                            <MobileSpeechRecognition
                              handleFormikFields={handleFormikFields}
                              onBlur={(e: any) => {
                                e.stopPropagation();
                                setFieldValue(`${data?.component}__${data?.id}.value`, typing);
                              }}
                              logic={foundLogic}
                              disabled={readOnly}
                              dataItem={data}
                            />
                          );
                        case "location":
                          return <MobileLocation />;
                        case "temp":
                          return (
                            <MobileTemperature
                              handleFormikFields={handleFormikFields}
                              onBlur={(e: any) => {
                                e.stopPropagation();
                                setFieldValue(`${data?.component}__${data?.id}.value`, typing);
                              }}
                              logic={foundLogic}
                              disabled={readOnly}
                              item={data}
                              name={`${data?.component}__${data?.id}.value`}
                              // value={values?.[`${data?.component}__${data?.id}`]?.value}
                              value={typing}
                              onChange={(e: any) => {
                                setTyping(e.target.value);
                                // for notification
                                checkActionTrigger({
                                  value: e.target.value,
                                  logic: foundLogic,
                                  ALL_OPTIONS: ALL_OPTIONS,
                                  question: data,
                                  templateTitle: template?.name || "",
                                  setFieldValue: setFieldValue,
                                  values: values,
                                });
                              }}
                            />
                          );
                        case "anno":
                          return (
                            <MobileAnnotation
                              dataItem={data}
                              handleFormikFields={handleFormikFields}
                              onBlur={(e: any) => {
                                e.stopPropagation();
                                setFieldValue(`${data?.component}__${data?.id}.value`, typing);
                              }}
                              logic={foundLogic}
                              disabled={readOnly}
                              errors={errors?.[`${data?.component}__${data?.id}`]}
                            />
                          );
                        case "checkbox":
                          return (
                            <>
                              <MobileCheckbox
                                dataItem={data}
                                // value={values?.[`${data?.component}__${data?.id}`]?.value}
                                value={typing}
                                handleFormikFields={handleFormikFields}
                                onBlur={(e: any) => {
                                  e.stopPropagation();
                                  setFieldValue(`${data?.component}__${data?.id}.value`, typing);
                                }}
                                logic={foundLogic}
                                disabled={readOnly}
                                errors={errors?.[`${data?.component}__${data?.id}`]}
                                onChange={(e: any) => {
                                  setTyping(e.target.checked);
                                  // setFieldValue(
                                  //   `${data?.component}__${data?.id}.value`,
                                  //   e.target.checked,
                                  // );
                                  // for notification
                                  checkActionTrigger({
                                    value: e.target.value,
                                    logic: foundLogic,
                                    ALL_OPTIONS: ALL_OPTIONS,
                                    question: data,
                                    templateTitle: template?.name || "",
                                    setFieldValue: setFieldValue,
                                    values: values,
                                  });
                                }}
                              />
                            </>
                          );
                        case "instruction":
                          return (
                            <MobileInstruction
                              errors={errors?.[`${data?.component}__${data?.id}`]}
                              item={data}
                              handleFormikFields={handleFormikFields}
                              onBlur={(e: any) => {
                                e.stopPropagation();
                                setFieldValue(`${data?.component}__${data?.id}.value`, typing);
                              }}
                              logic={foundLogic}
                              disabled={readOnly}
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
                              onBlur={(e: any) => {
                                e.stopPropagation();
                                setFieldValue(`${data?.component}__${data?.id}.value`, typing);
                              }}
                              logic={foundLogic}
                              disabled={readOnly}
                              errors={errors?.[`${data?.component}__${data?.id}`]}
                              name={`${data?.component}__${data?.id}.value`}
                              // value={values?.[`${data?.component}__${data?.id}`]?.value}
                              value={typing}
                              onChange={(e: any) => {
                                setTyping(e.target.value);
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
                            <>
                              <MobileNumber
                                handleFormikFields={handleFormikFields}
                                onBlur={(e: any) => {
                                  e.stopPropagation();
                                  setFieldValue(`${data?.component}__${data?.id}.value`, typing);
                                }}
                                value={typing}
                                onChange={(e: any) => {
                                  setTyping(e.target.value);
                                  // for notification
                                  checkActionTrigger({
                                    value: e.target.value,
                                    logic: foundLogic,
                                    ALL_OPTIONS: ALL_OPTIONS,
                                    question: data,
                                    templateTitle: template?.name || "",
                                    setFieldValue: setFieldValue,
                                    values: values,
                                  });
                                }}
                                logic={foundLogic}
                                disabled={readOnly}
                              />
                            </>
                          );
                        case "media":
                          return (
                            <MobileMedia
                              item={data}
                              handleFormikFields={handleFormikFields}
                              onBlur={(e: any) => {
                                e.stopPropagation();
                                setFieldValue(`${data?.component}__${data?.id}.value`, typing);
                              }}
                              logic={foundLogic}
                              disabled={readOnly}
                              errors={errors?.[`${data?.component}__${data?.id}`]}
                              onChange={(e: any) => {
                                setFieldValue(
                                  `${data?.component}__${data?.id}.value`,
                                  e.target.value,
                                );
                              }}
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
            formikData={handleFormikFields}
            readOnly={readOnly}
            multipleResponseData={multipleResponseData}
            globalResponseData={globalResponseData}
            options={options}
            inputBlur={inputBlur}
            userInput={typing}
            isOpenSection={isOpenSection}
            toggleSection={toggleSection}
            tempDatas={tempDatas}
            setTempDatas={setTempDatas}
            // toggle={toggle}
            // setToggle={setToggle}
          />
        </>
      )}
      <br />
      {data.component === "section" && (
        <>
          {/* <h1> {data?.component}</h1> */}
          <GenerateQuestion
            options={options}
            isOpenSection={isOpenSection}
            toggleSection={toggleSection}
            data={data}
            readOnly={readOnly}
            dataSetSeperator={dataSetSeperator}
            formikData={{ values, setFieldValue, errors, touched }}
            internalResponseData={internalResponseData}
            multipleResponseData={multipleResponseData}
            globalResponseData={globalResponseData}
            checkActionTrigger={checkActionTrigger}
            inputBlur={inputBlur}
            tempDatas={tempDatas}
            setTempDatas={setTempDatas}
          />
        </>
      )}
    </>
  );
};

const RenderForm = ({
  handleFormikField,
  dataSetSeperator,
  readOnly,
  pageCount,
  pages,
  setPageCount,
  internalResponseData,
  checkActionTrigger,
  inputBlur,
  isOpenSection,
  toggleSection,
  tempDatas,
  setTempDatas,
}: any) => {
  const {
    multipleResponseData,
    internalResponseData: options,
    globalResponseData,
  }: any = useApiOptionsStore();

  const template = useTemplateStore((state: any) => state?.template);

  let {
    handleSubmit,
    handleChange,
    values,
    setFieldValue,
    errors,
    touched,
    validateForm,
    formHandleSubmit,
  }: any = handleFormikField || {
    values: {},
    setFieldValue: "",
    handleSubmit: () => {},
    handleChange: () => {},
    formHandleSubmit: () => {},
    errors: {},
    touched: false,
  };

  const [typing, setTyping] = useState("");
  const [onFormSubmit, setOnFormSubmit] = useState(false);
  const { isLoading: LoadingTemplateInspection }: any = useTemplateStore();
  const { isLoading: LoadingInspection }: any = useInspectionStore();

  return (
    <>
      <ConfirmationModal
        openModal={onFormSubmit}
        setOpenModal={setOnFormSubmit}
        confirmationIcon={LogoutIcon}
        handelConfirmation={() => {}}
        confirmationHeading={`Are you sure you want to submit this form`}
        confirmationDesc={``}
        status="warning"
      />
      <form onSubmit={handleSubmit} className={readOnly ? "readOnly" : ""}>
        {pages.map((list: any, index: number) => (
          <>
            <div>
              {index === pageCount &&
                dataSetSeperator?.questionDataSet
                  ?.filter((d: any) => d.parentPage === list.id)
                  ?.map((data: any) => {
                    const foundLogic = dataSetSeperator?.logicDataSet?.find(
                      (lg: any) => lg?.id === data?.logicId,
                    );

                    let ALL_OPTIONS: any = [];
                    switch (foundLogic?.logicApi?.response_choice) {
                      case "internal":
                        ALL_OPTIONS = options?.[foundLogic?.logicApi?.storeKey];
                        break;
                      case "multiple":
                        ALL_OPTIONS =
                          multipleResponseData?.find(
                            (opt: any) => opt?.id === foundLogic?.logicApi?.url,
                          )?.options || [];
                        break;
                      case "global":
                        ALL_OPTIONS =
                          globalResponseData?.find(
                            (opt: any) => opt?.id === foundLogic?.logicApi?.url,
                          )?.options || [];
                        break;
                      default:
                        break;
                    }

                    // key={`${data?.id}-${uuidv4()}`}
                    return (
                      <div>
                        <FormComponent
                          options={options}
                          isOpenSection={isOpenSection}
                          toggleSection={toggleSection}
                          data={data}
                          readOnly={readOnly}
                          dataSetSeperator={dataSetSeperator}
                          handleFormikFields={{ values, setFieldValue, errors, handleSubmit }}
                          internalResponseData={internalResponseData}
                          multipleResponseData={multipleResponseData}
                          globalResponseData={globalResponseData}
                          checkActionTrigger={checkActionTrigger}
                          inputBlur={inputBlur}
                          foundLogic={foundLogic}
                          template={template}
                          tempDatas={tempDatas}
                          setTempDatas={setTempDatas}
                        />
                      </div>
                    );
                  })}
            </div>
          </>
        ))}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: `${pageCount + 1 === pages?.length ? "0" : "12px"}`,
          }}
        >
          <div>
            {!readOnly && pageCount < pages?.length - 1 && (
              <Button
                onClick={() => {
                  formHandleSubmit?.(values, "draft");
                }}
                type="button"
                variant="outlined"
                style={{ margin: "1rem 0" }}
              >
                Save as draft
              </Button>
            )}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", flex: "1" }}>
            <div>
              {pageCount > 0 && (
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
              {pages.length === pageCount + 1 && !readOnly && (
                <>
                  <Button
                    onClick={() => {
                      formHandleSubmit?.(values, "draft");
                    }}
                    type="button"
                    variant="outlined"
                    style={{ margin: "1rem 0", marginRight: "12px" }}
                  >
                    Save as draft
                  </Button>

                  <Button
                    variant="contained"
                    type="button"
                    onClick={() => {
                      handleSubmit();
                      // formHandleSubmit?.(values, 'submit');
                    }}
                    style={{ margin: "1rem 0" }}
                    id={"submit-button"}
                    disabled={LoadingTemplateInspection || LoadingInspection}
                  >
                    Save & Continue
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

const InspectionStarter = ({}: any) => {
  const [internalResponseData, setInternalResponseData] = React.useState<any>([]);
  const navigate = useNavigate();
  const { templateId, booking_id, sub_solution_id, inspectionId } = useParams();
  const isLoading = useTemplateStore((state: any) => state?.isLoading);

  const getTemplate = useTemplateStore((state: any) => state?.getTemplate);
  const template = useTemplateStore((state: any) => state?.template);
  const { enqueueSnackbar } = useSnackbar();
  const { notifyUser }: any = useInspectionStore();

  const postTemplateInspection = useTemplateStore((state: any) => state?.postTemplateInspection);

  //Inspection CreateUpdate
  const getInspection = useInspectionStore((state: any) => state?.getInspection);

  const { isLoading: inspectionLoading }: any = useInspectionStore();
  const inspection = useInspectionStore((state: any) => state?.inspection);
  const updateInspection = useInspectionStore((state: any) => state?.updateInspection);

  const [submitLoader, setSubmitLoader] = useState(false);
  // Get the value of the nextPage parameter

  const templateFields = (inspection && inspection.fields) || [];

  const {
    templateDatasets,
    setTemplateDatasets,
    setTemplateHeading,
    updateTemplateDatasets,
    resetTemplateValues,
  } = useTemplateFieldsStore();

  const [tempDatas, setTempDatas] = useState([]);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchObject = Object.fromEntries(searchParams.entries());
  // const BOOKING_ID = searchParams?.get('BOOKING_ID');

  const issueID = searchParams.get("issue");
  const api_token = searchParams.get("token");
  useEffect(() => {
    if (templateId) {
      setTempDatas(templateDatasets);
    } else if (inspectionId) {
      setTempDatas(templateFields);
    }
  }, [templateDatasets, inspection]);

  useEffect(() => {
    if (templateId) {
      getTemplate(templateId);
    }
  }, [templateId]);

  useEffect(() => {
    if (inspectionId) {
      getInspection(inspectionId);
    }
  }, [inspectionId]);
  useEffect(() => {
    if (template) {
      setTemplateDatasets(template?.fields);
      setTemplateHeading("templateDescription", template?.description);
      setTemplateHeading("templateTitle", template?.name);
      setTemplateHeading("headerImage", template?.photo);
    }
  }, [template]);

  const {
    multipleResponseData,
    fetchMultipleResponseData,
    fetchGlobalResponseData,
    fetchInternalResponseData,
    internalResponseData: options,
    globalResponseData,
    fetchExternalResponseData,
    fetchIndividualResponseData,
    individualResponseData,
    externalResponseData,
    loading: ApiOptionsLoading,
  }: any = useApiOptionsStore();

  const { fetchInspectionStatuss, inspectionStatuss }: any = useInspectionStatusStore();

  const fetchResponseData = async () => {
    await fetchMultipleResponseData({});
    await fetchGlobalResponseData({});
    await fetchExternalResponseData({});
    // await fetchInspectionStatuss({
    //   query: {
    //     name: ['Completed', 'In Progress'],
    //   },
    // });
  };

  useEffect(() => {
    if (!globalResponseData?.length) {
      fetchResponseData();
    }
  }, []);

  const handleSearchInternalResponse = async () => {
    await fetchApI({
      setterFunction: setInternalResponseData,
      url: `internal-response/?page=1&size=50`,
    });
  };
  useEffect(() => {
    handleSearchInternalResponse();
  }, []);

  // scrolling directly into that question
  const [scrollToQuestion, setScrollToQuestion] = useState("");
  const [isBlur, setIsBlur] = useState(false);

  useEffect(() => {
    if (scrollToQuestion) {
      const element: any = document.querySelector(`[data-item="${scrollToQuestion}"]`);
      if (element) {
        activeScroll(element);
        setIsBlur(true);
        setScrollToQuestion("");
      }
    }
  }, [scrollToQuestion]);

  const dataSetSeperator = useMemo(() => {
    return tempDatas.reduce(
      (acc: any, curr: any) => {
        if (curr?.component === "question" && curr?.response_choice === "internal") {
          if (!acc.apiRequest?.[curr?.response_type]) {
            if (curr?.filterFields && curr?.value) {
              curr?.filterFields?.forEach((field: any) => {
                let seperateField = field?.split("=>");
                acc.apiRequest[field] = {
                  url: url?.[seperateField?.[1]],
                  key: field,
                  replace: false,
                  queryParam: {
                    id:
                      curr?.value
                        ?.filter((value: any) => !value?.type)
                        ?.map((data: any) => data?.id) || [],
                  },
                  newformat: true,
                };
              });
              acc.apiRequest[curr?.response_type] = {
                url: curr?.response_type,
                parentId: curr?.parent,
              };
            } else {
              acc.apiRequest[curr?.response_type] = {
                url: curr?.response_type,
                parentId: curr?.parent,
              };
            }
          }
        }

        if (curr?.component === "question" && curr?.response_choice === "external") {
          if (!acc.apiRequest?.[`${curr?.logicApi?.response_choice}`]) {
            acc.apiRequest[curr?.logicApi?.response_choice] = { ...(curr?.logicApi || {}) };
          }
        }

        if (curr.component === "page") {
          acc.pages.push(curr);
        }

        if (
          curr.component?.toLowerCase() !== "logic" &&
          curr.logicReferenceId === null &&
          curr.parent === null
        ) {
          acc.questionDataSet.push(curr);
        } else if (curr.component === "logic") {
          acc.logicDataSet.push(curr);

          if (
            curr?.logicApi?.response_choice === "external" &&
            !acc.apiRequest?.[`${curr?.logicApi?.response_choice}`]
          ) {
            acc.apiRequest[curr?.logicApi?.response_choice] = { ...(curr?.logicApi || {}) };
          }
        } else if (curr.logicReferenceId || curr.parent) {
          acc.logicQuestion.push(curr);
        }
        return acc;
      },
      { logicDataSet: [], questionDataSet: [], logicQuestion: [], apiRequest: {}, pages: [] },
    );
  }, [tempDatas]);

  useMemo(
    () =>
      internalResponseData?.length &&
      Object.keys(dataSetSeperator?.apiRequest || {})?.forEach(async (field: any) => {
        // await apiRequest(field, setOptions, internalResponseData);
        if (field !== "external") {
          const FIELD = field?.split("__")?.length > 1 ? field?.split("__")?.[1] : field;

          let internalResponseType = internalResponseData?.find((data: any) => data.id == FIELD);
          const checkdata = dataSetSeperator?.apiRequest?.[FIELD];
          if (checkdata?.newformat) {
            await fetchInternalResponseData({
              key: checkdata?.key,
              url: checkdata?.url,
              replace: false,
              queryParam: checkdata?.queryParam || {},
            });
          } else {
            await fetchInternalResponseData({
              key: moduleIdsFnR?.includes(internalResponseType?.module_id)
                ? `${internalResponseType?.module_id}[=>]${field}`
                : field,
              url: internalResponseData?.find((data: any) => data.id == field)?.options,
              requestApi: moduleIdsFnR?.includes(internalResponseType?.module_id) ? false : true,
            });
          }
        } else if (booking_id && sub_solution_id && field === "external") {
          const findData = externalResponseData?.find(
            (data: any) => data?.id === dataSetSeperator?.apiRequest?.[field]?.url,
          );
          if (findData) {
            await fetchIndividualResponseData({
              key: "external",
              apiOptions: findData?.options,
              apiQuery: findData?.api.toString().endsWith("/")
                ? `${booking_id}/${sub_solution_id}`
                : `/${booking_id}/${sub_solution_id}`,
              token: api_token,
            });
          }
        }
      }),
    [
      dataSetSeperator?.apiRequest,
      internalResponseData,
      booking_id,
      sub_solution_id,
      externalResponseData,
    ],
  );

  const keyFields = ["component", "id"];

  const tempInitialValue = templateDatasets.reduce((values: any, field: any) => {
    if (field?.component?.toLowerCase() === "question") {
      return {
        ...values,
        [`${keyFields?.map((keyField: any) => field?.[keyField])?.join("__")}`]: {
          value:
            field.response_choice !== "external"
              ? field?.type !== "Array"
                ? ""
                : []
              : individualResponseData?.[`${field?.logicApi?.field}`] || "",
          trigger: {},
          disabled: individualResponseData?.[`${field?.logicApi?.field}`] ? true : false,
          notes: "",
          keyName: `${keyFields?.map((keyField: any) => field?.[keyField])?.join("__")}`,
          label: field?.label,
          page: field?.parentPage,
          file_value: field?.file_value,
        },
      };
    }
    return values;
  }, {});

  const inspectInitialValue = templateFields.reduce((values: any, field: any) => {
    if (field?.component?.toLowerCase() === "question") {
      return {
        ...values,
        [`${field?.component}__${field?.id}`]: {
          value: inspectionId ? field.value : "",
          trigger: {},
          notes: inspectionId ? field?.notes : [],
          keyName: `${keyFields?.map((keyField: any) => field?.[keyField])?.join("__")}`,
          media: inspectionId ? field?.media : [],
          label: field?.label,
          page: field?.parentPage,
          file_value: field?.file_value,
        },
      };
    }
    return values;
  }, {});

  const initialValues = templateId ? tempInitialValue : inspectInitialValue;

  const [pageCount, setPageCount] = useState(0);

  const pages = templateId
    ? templateDatasets?.filter((list: any) => list.component === "page")
    : templateFields?.filter((list: any) => list.component === "page");

  const getValidation = DynamicSchemaGenerator({
    questions: dataSetSeperator.questionDataSet,
    keyFields,
    dataSetSeperator,
    key: "id",
    initialValues,
  });

  function getInitialTouched(obj: any, value: any) {
    for (let prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        obj[prop] = value;
      }
    }

    return obj;
  }

  const [openSection, setOpenSection] = useState(() => new Map());
  const [onFormSubmit, setOnFormSubmit] = useState(false);
  const isOpenSection = (item: any) => openSection.get(item.id) ?? true;

  const toggleSection = (item: any, logic: any) => {
    return setOpenSection((m) => new Map(m).set(item.id, !isOpenSection(item)));
  };
  const { resetInspection }: any = useInspectionStore();

  const formHandleSubmit = (values: any, type: string = "submit") => {
    // if (readOnly) return;
    setSubmitLoader(true);
    const valueArray = Object.entries(values).map((a: any) => {
      return {
        id: a[0].split("__")[1],
        value: a[1].value,
        notes: a[1].notes,
        file_value: a[1].file_value,
        ...(a?.[1] || {}),
      };
    });
    const finalValues = tempDatas?.map((obj: any) => {
      let foundObj = valueArray.find((a) => a.id == obj.id);
      if (obj.response_choice !== "default") {
        var foundLogic: any = dataSetSeperator?.logicDataSet.find((a: any) => a.id === obj.logicId);
      }
      if (obj.id === foundObj?.id) {
        let updatedValue: any = valueArray.find((a) => a.id == obj.id)?.value;
        // if (
        //   foundObj.response_choice !== 'default' &&
        //   Array.isArray(updatedValue) &&
        //   foundLogic?.logicApi
        // ) {
        //   updatedValue = updatedValue?.map(
        //     (it: any) => it?.[foundLogic?.logicApi?.field || 'name'],
        //   );
        // }
        return {
          ...obj,
          ...foundObj,
          value: updatedValue,
          notes: valueArray.find((a) => a.id == obj.id)?.notes,
          // file_value: ,
        };
      }
      return obj;
    });

    if (type !== "draft") {
      const mergedArray: any = ([] as unknown[]).concat(
        ...(Object.values(values?.notification || {}) || []),
      );

      if (mergedArray?.length) {
        notifyUser({ values: mergedArray, enqueueSnackbar });
      }
    }
    setSubmitLoader(false);
    if (finalValues && templateId) {
      const params = issueID
        ? {
            template_id: Number(template.id),
            issueID: Number(issueID),
            fields: finalValues,
            inspection_status: type == "submit" ? "Completed" : "In Progress",
            booking_id: Number(searchObject?.BOOKING_ID) || null,
          }
        : {
            template_id: template.id,
            fields: finalValues,
            inspection_status: type == "submit" ? "Completed" : "In Progress",
            booking_id: searchObject?.BOOKING_ID || null,
          };
      postTemplateInspection(params, navigate);
      // if (type !== 'draft') {
      // } else {
      //   postTemplateInspection(params);
      // }
    } else if (finalValues && inspectionId) {
      updateInspection(
        inspection.id,
        {
          template_id: Number(inspectionId),
          fields: finalValues,
          inspection_status: type == "submit" ? "Completed" : "In Progress",
          booking_id: Number(searchObject?.BOOKING_ID) || null,
        },
        navigate,
      );
      // if (type !== 'draft') {
      // } else {
      //   updateInspection(inspection.id, {
      //     template_id: Number(inspectionId),
      //     fields: finalValues,
      //     inspection_status: 'In Progress',
      //     booking_id: Number(searchObject?.BOOKING_ID) || null,
      //   });
      // }
      resetInspection();
    }
  };

  const readOnly = location.pathname.includes("view") ? true : false;

  return (
    <div id="InspectionStarter">
      {(isLoading || inspectionLoading || submitLoader || ApiOptionsLoading) && (
        <FullPageLoader></FullPageLoader>
      )}
      {/* <Button
        variant="contained"
        className="go_back_button"
        style={{ marginTop: '1rem' }}
        onClick={() => {
          navigate(-1);
        }}>
        Go Back
      </Button> */}
      <div className="inspection_starter__wrapper">
        <div>
          <b> {template?.name}</b>
        </div>
        <div>Page {`${pageCount + 1} / ${pages.length}`}</div>
        <Formik
          initialValues={{ ...initialValues, notification: {} }}
          enableReinitialize={true}
          validationSchema={getValidation}
          // validateOnBlur
          // validateOnChange
          // initialTouched={getInitialTouched({ ...initialValues }, true)}
          onSubmit={(values) => {
            setOnFormSubmit(true);
          }}
        >
          {({
            handleSubmit,
            handleChange,
            values,
            setFieldValue,
            errors,
            touched,
            setErrors,
            validateForm,
          }) => {
            return (
              <>
                <ConfirmationModal
                  openModal={onFormSubmit}
                  setOpenModal={setOnFormSubmit}
                  confirmationIcon={LogoutIcon}
                  handelConfirmation={() => {
                    formHandleSubmit(values, "submit");
                  }}
                  confirmationHeading={`Are you sure you want to submit this form`}
                  confirmationDesc={``}
                  status="warning"
                />
                <RenderForm
                  handleFormikField={{
                    values,
                    handleChange,
                    setFieldValue,
                    errors,
                    touched,
                    handleSubmit,
                    validateForm,
                    formHandleSubmit,
                  }}
                  isOpenSection={isOpenSection}
                  toggleSection={toggleSection}
                  dataSetSeperator={dataSetSeperator}
                  readOnly={readOnly}
                  pageCount={pageCount}
                  internalResponseData={internalResponseData}
                  pages={pages}
                  globalResponseData={globalResponseData}
                  multipleResponseData={multipleResponseData}
                  checkActionTrigger={checkActionTrigger}
                  setPageCount={setPageCount}
                  inputBlur={{ setIsBlur, isBlur }}
                  tempDatas={tempDatas}
                  setTempDatas={setTempDatas}
                />

                {/* question status */}
                <QuestionToolBar
                  dataSetSeperator={dataSetSeperator}
                  inputBlur={{ setIsBlur, isBlur }}
                  values={values}
                  activeScroll={activeScroll}
                  setPageCount={setPageCount}
                  setScrollToQuestion={setScrollToQuestion}
                  errors={errors}
                />
              </>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default InspectionStarter;
