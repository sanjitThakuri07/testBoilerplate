import React, { useEffect, useMemo, useState } from "react";

import { useTemplateStore } from "src/store/zustand/templates/templateStore";
import { useTemplateFieldsStore } from "src/store/zustand/templates/templateFieldsStore";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import FullPageLoader from "src/components/FullPageLoader";
import { fetchApI, fetchExternalApI } from "src/modules/apiRequest/apiRequest";

import responseItems from "src/constants/template/responseItems";
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
import { validateInput } from "src/modules/template/validation/inputLogicCheck";
import { findData } from "src/modules/template/validation/keyValidationFunction";
import MobileAnnotation from "../components/mobileComponents/MobileAnnotation/mobileAnnotation";
import MobileCheckbox from "../components/mobileComponents/MobileCheckbox/mobileCheckbox";
import { KeyboardArrowUp, KeyboardArrowDown, DeleteOutline } from "@mui/icons-material";
import { v4 as uuidv4 } from "uuid";
import ConfirmationModal from "src/components/ConfirmationModal/ConfirmationModal";
import { reduceDataSet } from "src/modules/utils/reducedDataSet";
import { deepCloneArray } from "src/modules/utils/deepCloneArray";
import { DynamicSchemaGenerator } from "../validation";
import MobileMedia from "../components/mobileComponents/MobileMedia/MobileMedia";
import useApiOptionsStore from "src/store/zustand/templates/apiOptionsTemplateStore";
import SelectExternalResponse from "../components/mobileComponents/SelectExternalResponse";
import { KeyOptionsName } from "src/modules/template/components/InputComponents/ResponseInputLogicNew";
import { useInspectionStore } from "src/store/zustand/templates/inspectionStore";
import { useSnackbar } from "notistack";
import QuestionToolBar from "./questionToolBar";

function activeScroll(element: any, state: string = "hide") {
  const blurOtherElement = document.querySelectorAll(`[data-item]`);
  if (state !== "remove") {
    blurOtherElement.forEach((el: any) => {
      el.classList.add("blur__question");
    });
    element.classList.remove("blur__question");
    element.style.scrollMarginTop = "100px";
    element.scrollIntoView({ block: "start", behavior: "smooth" });
    // element.style.border = '1px solid red';
    element.classList.add("focus__question");
  } else {
    blurOtherElement.forEach((element: any) => {
      element.classList.remove("blur__question");
    });
  }
}

function InputFields({
  responseItems,
  data,
  handleFormikFields,
  internalResponseData,
  foundLogic,
  readOnly,
  checkActionTrigger,
  inputBlur,
}: any) {
  const {
    multipleResponseData,
    fetchMultipleResponseData,
    fetchGlobalResponseData,
    fetchInternalResponseData,
    internalResponseData: options,
    globalResponseData,
    individualResponseData,
  }: any = useApiOptionsStore();

  const template = useTemplateStore((state: any) => state?.template);

  let { errors, values, setFieldValue } = handleFormikFields;

  let ALL_OPTIONS: any = [];
  switch (foundLogic?.logicApi?.response_choice) {
    case "internal":
      ALL_OPTIONS = options?.[foundLogic?.logicApi?.storeKey];
      break;
    case "multiple":
      ALL_OPTIONS =
        multipleResponseData?.find((opt: any) => opt?.id === foundLogic?.logicApi?.url)?.options ||
        [];
      break;
    case "global":
      ALL_OPTIONS =
        globalResponseData?.find((opt: any) => opt?.id === foundLogic?.logicApi?.url)?.options ||
        [];
      break;
    default:
      break;
  }

  return (
    <>
      <div
        className="mobile_component_box"
        data-item={`${data?.component}__${data?.id}`}
        data-show=""
        onClick={() => {
          if (inputBlur?.isBlur) {
            activeScroll("_", "remove");
            inputBlur?.setIsBlur(false);
          }
        }}
      >
        <div className="mobile_component_box_wrapper">
          <div className="mobile_component_box_wrapper_heading">
            {data?.response_choice === "internal" && (
              <SelectInternalResponse
                options={options}
                item={data}
                handleFormikFields={handleFormikFields}
                logic={foundLogic}
                disabled={readOnly}
                onChange={(e: any, field: any) => {
                  // let values = Array.isArray(e)
                  //   ? e?.map((data: any) => data?.[field]).filter((data: any) => Boolean(data))
                  //   : [e?.[field]]?.filter((data: any) => Boolean(data));
                  let value = Array.isArray(e)
                    ? e?.map((data: any) => data).filter((data: any) => Boolean(data))
                    : [e]?.filter((data: any) => Boolean(data));

                  checkActionTrigger({
                    value: [e],
                    logic: foundLogic,
                    ALL_OPTIONS: ALL_OPTIONS,
                    templateTitle: template?.name || "",
                    setFieldValue: setFieldValue,
                    values: values,
                    question: data,
                  });

                  setFieldValue(`${data?.component}__${data?.id}.value`, value);
                  let flaggedResponse = foundLogic?.flaggedResponse || [];
                  let flaggedValue = value?.filter((data: any) => flaggedResponse?.includes(data));
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
            {data?.response_choice === "external" && (
              <MobileTextAnswer
                item={data}
                name={`${data?.component}__${data?.id}.value`}
                value={values?.[`${data?.component}__${data?.id}`]?.value}
                onChange={(e: any) => {
                  setFieldValue(`${data?.component}__${data?.id}.value`, e.target.value);
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
                disabled={true}
              />
            )}

            {(data?.response_choice === "multiple" || data?.response_choice === "global") && (
              <SelectMultipleResponse
                onChange={(e: any) => {
                  // let values = Array.isArray(e)
                  //   ? e?.map((data: any) => data?.name).filter((data: any) => Boolean(data))
                  //   : [e?.name]?.filter((data: any) => Boolean(data));
                  let value = Array.isArray(e)
                    ? e?.map((data: any) => data).filter((data: any) => Boolean(data))
                    : [e]?.filter((data: any) => Boolean(data));

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
                  let flaggedValue = value?.filter((data: any) => flaggedResponse?.includes(data));
                  setFieldValue(`${data?.component}__${data?.id}.flaggedValue`, flaggedValue);
                  setFieldValue(`${data?.component}__${data?.id}.value`, value);
                }}
                logic={foundLogic}
                multipleResponseData={multipleResponseData}
                disabled={readOnly}
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
                        disabled={readOnly}
                        // value={values.datasets?.[index]?.value}
                        name={`${data?.component}__${data?.id}.value`}
                        value={values?.[`${data?.component}__${data?.id}`]?.value}
                        errors={errors?.[`${data?.component}__${data?.id}`]}
                        onChange={(e: any) => {
                          setFieldValue(`${data?.component}__${data?.id}.value`, e.target.value);
                          checkActionTrigger({
                            value: e.target.value,
                            logic: foundLogic,
                            ALL_OPTIONS: ALL_OPTIONS,
                            templateTitle: template?.name || "",
                            setFieldValue: setFieldValue,
                            values: values,
                            question: data,
                          });
                        }}
                      />
                    );
                  case "inspection_date":
                    return (
                      <MobileInspectionDate
                        item={data}
                        handleFormikFields={handleFormikFields}
                        logic={foundLogic}
                        disabled={readOnly}
                        errors={errors?.[`${data?.component}__${data?.id}`]}
                        value={values?.[`${data?.component}__${data?.id}`]?.value}
                        onChange={(e: any) => {
                          setFieldValue(`${data?.component}__${data?.id}.value`, e.target.value);
                          checkActionTrigger({
                            value: e.target.value,
                            logic: foundLogic,
                            ALL_OPTIONS: ALL_OPTIONS,
                            templateTitle: template?.name || "",
                            setFieldValue: setFieldValue,
                            values: values,
                            question: data,
                          });
                        }}
                      />
                    );
                  case "date":
                    return (
                      <MobileDateTime
                        item={data}
                        handleFormikFields={handleFormikFields}
                        logic={foundLogic}
                        disabled={readOnly}
                        errors={errors?.[`${data?.component}__${data?.id}`]}
                        onChange={(e: any) => {
                          setFieldValue(`${data?.component}__${data?.id}.value`, e.target.value);
                          checkActionTrigger({
                            value: e.target.value,
                            logic: foundLogic,
                            ALL_OPTIONS: ALL_OPTIONS,
                            templateTitle: template?.name || "",
                            setFieldValue: setFieldValue,
                            values: values,
                            question: data,
                          });
                        }}
                      />
                    );
                  case "range":
                    return (
                      <MobileSlider
                        item={data}
                        handleFormikFields={handleFormikFields}
                        logic={foundLogic}
                        disabled={readOnly}
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
                        disabled={readOnly}
                        name={`${data?.component}__${data?.id}.value`}
                        value={values?.[`${data?.component}__${data?.id}`]?.value}
                        errors={errors?.[`${data?.component}__${data?.id}`]}
                        onChange={(e: any) => {
                          setFieldValue(`${data?.component}__${data?.id}.value`, e.target.value);
                          checkActionTrigger({
                            value: e.target.value,
                            logic: foundLogic,
                            ALL_OPTIONS: ALL_OPTIONS,
                            templateTitle: template?.name || "",
                            setFieldValue: setFieldValue,
                            values: values,
                            question: data,
                          });
                        }}
                      />
                    );
                  case "speech_recognition":
                    return (
                      <MobileSpeechRecognition
                        dataItem={data}
                        disabled={readOnly}
                        errors={errors?.[`${data?.component}__${data?.id}`]}
                      />
                    );
                  case "location":
                    return (
                      <MobileLocation
                        dataItem={data}
                        disabled={readOnly}
                        errors={errors?.[`${data?.component}__${data?.id}`]}
                      />
                    );
                  case "temp":
                    return (
                      <MobileTemperature
                        errors={errors?.[`${data?.component}__${data?.id}`]}
                        handleFormikFields={handleFormikFields}
                        logic={foundLogic}
                        disabled={readOnly}
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
                        disabled={readOnly}
                        errors={errors?.[`${data?.component}__${data?.id}`]}
                      />
                    );
                  case "checkbox":
                    return (
                      <MobileCheckbox
                        dataItem={data}
                        disabled={readOnly}
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
                        disabled={readOnly}
                      />
                    );
                  case "signature":
                    return (
                      <MobileSignature
                        item={data}
                        errors={errors?.[`${data?.component}__${data?.id}`]}
                        handleFormikFields={handleFormikFields}
                        logic={foundLogic}
                        disabled={readOnly}
                        name={`${data?.component}__${data?.id}.value`}
                        value={values?.[`${data?.component}__${data?.id}`]?.value}
                        onChange={(e: any) => {
                          setFieldValue(`${data?.component}__${data?.id}.value`, e.target.value);
                        }}
                      />
                    );
                  case "signature":
                    return (
                      <MobileSignature
                        item={data}
                        errors={errors?.[`${data?.component}__${data?.id}`]}
                        handleFormikFields={handleFormikFields}
                        logic={foundLogic}
                        disabled={readOnly}
                        name={`${data?.component}__${data?.id}.value`}
                        value={values?.[`${data?.component}__${data?.id}`]?.value}
                        onChange={(e: any) => {
                          setFieldValue(`${data?.component}__${data?.id}.value`, e.target.value);
                        }}
                      />
                    );
                  case "media":
                    return (
                      <MobileMedia
                        item={data}
                        handleFormikFields={handleFormikFields}
                        logic={foundLogic}
                        disabled={readOnly}
                        errors={errors?.[`${data?.component}__${data?.id}`]}
                        onChange={(e: any) => {
                          setFieldValue(`${data?.component}__${data?.id}.value`, e.target.value);
                        }}
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

function GenerateQuestion({
  data,
  dataSetSeperator,
  tempDatas,
  formikData,
  internalResponseData,
  setTempDatas,
  templateDatasets,
  readOnly,
  checkActionTrigger,
  inputBlur,
}: any) {
  const {
    multipleResponseData,
    fetchMultipleResponseData,
    fetchGlobalResponseData,
    fetchInternalResponseData,
    internalResponseData: options,
    globalResponseData,
  }: any = useApiOptionsStore();

  const template = useTemplateStore((state: any) => state?.template);

  const [toggle, setToggle] = useState(true);
  const [selectedItem, setSelectedItem] = useState<any>();
  const [sectionDeleteModal, setSectionDeleteModal] = useState(false);

  const findChildren = dataSetSeperator?.logicQuestion?.filter((item: any) => {
    return data?.id === item?.parent;
  });

  const handleRepeatSectionBeta = (item: any) => {
    let reducedDatas = reduceDataSet(tempDatas, item.id, true);
    let finalDataSetClone = deepCloneArray(reducedDatas?.childDataSet);
    finalDataSetClone.forEach((e: any, i: any, a: any) => {
      var puid = uuidv4();
      var logicuid = uuidv4();
      a.forEach((f: any) => {
        f.parent == e.id && (f.parent = puid);
        f.logicId == e.id && (f.logicId = puid);
        f?.logics?.map((lg: any, index: any) => {
          lg.linkQuestions.map((qn: any, idx: any) => {
            qn === e.id && f.logics[index].linkQuestions.splice(idx, 1, puid);
          });
        });
      });
      e.id = puid;
    });
    setTempDatas([...tempDatas, ...finalDataSetClone]);
  };

  const handleSelectedRepeatSection = (item: any) => {
    setSectionDeleteModal(true);
    setSelectedItem(item);
  };
  const handleDeleteRepeatSection = () => {
    const filterOut = tempDatas.filter(
      (templateData: any) => (templateData["parent"] || templateData["id"]) !== selectedItem?.id,
    );
    // const filterIdOut = filterOut.map((list: any, index: any) => {});
    setTempDatas(filterOut);
    setSectionDeleteModal(false);
  };
  if (findChildren?.length) {
    return (
      <>
        <ConfirmationModal
          openModal={sectionDeleteModal}
          setOpenModal={setSectionDeleteModal}
          // confirmationIcon={LogoutIcon}
          handelConfirmation={handleDeleteRepeatSection}
          confirmationHeading={`Do you want to delete this section?`}
          confirmationDesc={`Entire children along with it's layouts will be removed permanently.`}
          status="warning"
        />
        <div
          style={{
            cursor: "pointer",
            background: "#374974",
            color: "#fff",
            padding: "0.5rem .75rem",
            fontSize: "1rem",
            borderRadius: "3px",
            transition: "1s ease ",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
          className="inspection__section"
        >
          {!toggle ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <span className="inspection__section-image" onClick={() => setToggle(!toggle)}>
                <KeyboardArrowDown />
              </span>
              <div onClick={() => setToggle(!toggle)}>{data?.label}</div>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <span className="inspection__section-image" onClick={() => setToggle(!toggle)}>
                <KeyboardArrowUp />
              </span>
              <div onClick={() => setToggle(!toggle)}>{data?.label}</div>
            </div>
          )}
          {data.repeat ? (
            <Button variant="contained" type="button" onClick={() => handleRepeatSectionBeta(data)}>
              Add
            </Button>
          ) : (
            <div>
              {data.repeatChild ? (
                <DeleteOutline onClick={() => handleSelectedRepeatSection(data)} />
              ) : (
                ""
              )}
            </div>
          )}
        </div>
        {findChildren?.map((it: any, index: number) => {
          if (toggle && it.component === "question") {
            const qnLogic = dataSetSeperator?.logicDataSet?.find(
              (lg: any) => lg?.id === it?.logicId,
            );
            return (
              <>
                <InputFields
                  key={it?.id}
                  responseItems={responseItems}
                  handleFormikFields={formikData}
                  internalResponseData={internalResponseData}
                  data={it}
                  foundLogic={qnLogic}
                  readOnly={readOnly}
                  checkActionTrigger={checkActionTrigger}
                  inputBlur={inputBlur}
                />
                <FormNode
                  dataSetSeperator={dataSetSeperator}
                  data={it}
                  key={`${it?.id}-index`}
                  formikData={formikData}
                  internalResponseData={internalResponseData}
                  readOnly={readOnly}
                  toggle={toggle}
                  setToggle={setToggle}
                  checkActionTrigger={checkActionTrigger}
                  inputBlur={inputBlur}
                />
              </>
            );
          } else if (it.component === "section") {
            return (
              <>
                <br />

                <div key={index}>
                  {/* <h1>{data?.label}</h1> */}
                  <GenerateQuestion
                    data={it}
                    templateDatasets={templateDatasets}
                    tempDatas={tempDatas}
                    setTempDatas={setTempDatas}
                    dataSetSeperator={dataSetSeperator}
                    formikData={formikData}
                    internalResponseData={internalResponseData}
                    readOnly={readOnly}
                    checkActionTrigger={checkActionTrigger}
                    inputBlur={inputBlur}
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

function checkActionTrigger({
  value,
  logic,
  ALL_OPTIONS,
  question,
  templateTitle,
  setFieldValue,
  values,
}: any) {
  // need to check if it is for immediate or
  // if immediate notify
  // if not set in the formik values
  // hit api on inspection completion
  // for now on whole form submit

  let keyName = !question.globalLogicReferenceId
    ? question.logicId
    : question.globalLogicReferenceId?.split("[logicParentId]")?.[0];
  for (let i = 0; i < logic.logics.length; i++) {
    let conditionDataset = {
      condition: logic?.logics?.[`${i}`].condition,
      trigger: logic?.logics?.[`${i}`].trigger,
      value: logic?.logics?.[`${i}`].value,
      linkQuestions: logic?.logics?.[`${i}`]?.linkQuestions || [],
    };

    if (
      validateInput({
        operator: conditionDataset?.condition,
        userInput: value,
        authorizedValues: Array.isArray(conditionDataset?.value)
          ? conditionDataset?.value
          : [conditionDataset?.value],
        allOptions: ALL_OPTIONS,
      })
    ) {
      const indexOfTrigger = conditionDataset?.trigger?.findIndex((tr: any) => {
        return tr?.name === KeyOptionsName?.NOTIFY;
      });
      if (indexOfTrigger != -1) {
        // api request or set value to form
        const triggerValue = conditionDataset?.trigger[indexOfTrigger];
        let updatedValue = value;
        if (question.response_choice !== "default" && Array.isArray(value) && logic?.logicApi) {
          // updatedValue = updatedValue?.map((it: any) => it?.[logic?.logicApi?.field || 'name']);
          updatedValue = updatedValue?.[0]?.[logic?.logicApi?.field || "name"];
        }
        let finalValues = {
          inspection_url: window.location.href,
          question: question.label || "",
          answer: updatedValue,
          form: templateTitle,
          to: [
            ...(triggerValue?.value?.[0]?.inspection_groups || []),
            ...(triggerValue?.value?.[0]?.inspection_users || []),
          ],
          type: triggerValue?.value?.[0]?.inspection_available_type,
          id: question.id,
        };

        setFieldValue("notification", {
          ...(values.notification || {}),
          [keyName]: [finalValues, ...(values?.notification?.[keyName] || [])],
        });
      }
      break;
    } else {
      let prevNotification: any = { ...values?.notification };
      if (!prevNotification?.[`${keyName}`]) return;
      if (prevNotification[question?.logicId]) {
        delete prevNotification?.[question?.logicId];
        setFieldValue("notification", prevNotification);
      } else {
        const updatedNotificationData = prevNotification?.[keyName]?.filter(
          (it: any) => it?.id !== question?.id,
        );
        setFieldValue("notification", {
          ...(values.notification || {}),
          [keyName]: updatedNotificationData,
        });
      }
    }
  }
}

const FormNode = ({
  dataSetSeperator,
  data,
  formikData,
  internalResponseData,
  readOnly,
  inputBlur,
}: // toggle,
// setToggle,
any) => {
  let { values, setFieldValue } = formikData;

  // template title will be needed to notify user
  const template = useTemplateStore((state: any) => state?.template);

  const {
    multipleResponseData,
    fetchMultipleResponseData,
    fetchGlobalResponseData,
    fetchInternalResponseData,
    internalResponseData: options,
    globalResponseData,
  }: any = useApiOptionsStore();

  const [toggle, setToggle] = useState(true);

  //   const [setTrigger, updateTrigger]
  const findLogic = dataSetSeperator.logicDataSet?.find((datas: any) => data.logicId === datas.id);

  if (!findLogic) return null;

  //   useEffect(() => {}, []);
  let trigger = {};
  let ALL_OPTIONS: any = [];
  switch (findLogic?.logicApi?.response_choice) {
    case "internal":
      ALL_OPTIONS = options?.[findLogic?.logicApi?.storeKey];
      break;
    case "multiple":
      ALL_OPTIONS =
        multipleResponseData?.find((opt: any) => opt?.id === findLogic?.logicApi?.url)?.options ||
        [];
      break;
    case "global":
      ALL_OPTIONS =
        globalResponseData?.find((opt: any) => opt?.id === findLogic?.logicApi?.url)?.options || [];
      break;
    default:
      break;
  }

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
            allOptions: ALL_OPTIONS,
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
          const qnLogic = dataSetSeperator?.logicDataSet?.find(
            (lg: any) => lg?.id === data?.logicId,
          );
          return (
            <div key={data?.id}>
              {data?.component === "question" && toggle ? (
                <>
                  <InputFields
                    key={data?.id}
                    responseItems={responseItems}
                    handleFormikFields={formikData}
                    internalResponseData={internalResponseData}
                    data={data}
                    foundLogic={qnLogic}
                    readOnly={readOnly}
                  />
                  <FormNode
                    dataSetSeperator={dataSetSeperator}
                    data={data}
                    key={data?.id}
                    formikData={formikData}
                    readOnly={readOnly}
                    toggle={toggle}
                    setToggle={setToggle}
                  />
                </>
              ) : null}

              {data?.component === "section" && (
                <>
                  <div
                    style={{
                      cursor: "pointer",
                      background: "#374974",
                      color: "#fff",
                      padding: "0.5rem .75rem",
                      fontSize: "1rem",
                      borderRadius: "3px",
                      transition: "1s ease ",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                    className="inspection__section"
                  >
                    {!toggle ? (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <span
                          className="inspection__section-image"
                          onClick={() => setToggle(!toggle)}
                        >
                          <KeyboardArrowDown />
                        </span>
                        <div onClick={() => setToggle(!toggle)}>{data?.label}</div>
                      </div>
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <span
                          className="inspection__section-image"
                          onClick={() => setToggle(!toggle)}
                        >
                          <KeyboardArrowUp />
                        </span>
                        <div onClick={() => setToggle(!toggle)}>{data?.label}</div>
                      </div>
                    )}
                    {data.repeat ? (
                      <Button
                        variant="contained"
                        type="button"
                        // onClick={() => handleRepeatSectionBeta(data)}
                      >
                        Add
                      </Button>
                    ) : (
                      <div>
                        {data.repeatChild ? (
                          <DeleteOutline
                          //  onClick={() => handleSelectedRepeatSection(data)}
                          />
                        ) : (
                          ""
                        )}
                      </div>
                    )}
                  </div>
                  <FormNode
                    dataSetSeperator={dataSetSeperator}
                    data={data}
                    key={data?.id}
                    formikData={formikData}
                    readOnly={readOnly}
                    toggle={toggle}
                    setToggle={setToggle}
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
}: any) => {
  const {
    multipleResponseData,
    fetchMultipleResponseData,
    fetchGlobalResponseData,
    fetchInternalResponseData,
    internalResponseData: options,
    globalResponseData,
    individualResponseData,
  }: any = useApiOptionsStore();

  const template = useTemplateStore((state: any) => state?.template);

  let { handleSubmit, handleChange, values, setFieldValue, errors, touched, validateForm }: any =
    handleFormikField || {
      values: {},
      setFieldValue: "",
      handleSubmit: () => {},
      handleChange: () => {},
      errors: {},
      touched: false,
    };

  return (
    <form onSubmit={handleSubmit} className={readOnly ? "readOnly" : ""}>
      {pages.map((list: any, index: number) => (
        <>
          <div>
            {index === pageCount &&
              dataSetSeperator?.questionDataSet
                .filter((d: any) => d.parentPage === list.id)
                .map((data: any) => {
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

                  return (
                    <div key={data?.id}>
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
                              <div
                                className="mobile_component_box_wrapper_heading"
                                data-item={data?.id}
                              >
                                {data?.response_choice === "internal" && (
                                  <SelectInternalResponse
                                    item={data}
                                    options={options}
                                    apiItem={
                                      internalResponseData.length &&
                                      internalResponseData.find(
                                        (responseData: any) =>
                                          responseData.id === data.response_type,
                                      )
                                    }
                                    onChange={(e: any, field: string) => {
                                      // let values = Array.isArray(e)
                                      //   ? e
                                      //       ?.map((data: any) => data?.[field])
                                      //       .filter((data: any) => Boolean(data))
                                      //   : [e?.[field]]?.filter((data: any) => Boolean(data));
                                      let value = Array.isArray(e)
                                        ? e
                                            ?.map((data: any) => data)
                                            .filter((data: any) => Boolean(data))
                                        : [e]?.filter((data: any) => Boolean(data));

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
                                      setFieldValue(
                                        `${data?.component}__${data?.id}.flaggedValue`,
                                        flaggedValue,
                                      );

                                      setFieldValue(`${data?.component}__${data?.id}.value`, value);
                                    }}
                                    value={values?.[`${data?.component}__${data?.id}`]?.value}
                                    logic={foundLogic}
                                    disabled={readOnly}
                                    errors={errors?.[`${data?.component}__${data?.id}`]}
                                    handleFormikFields={{
                                      setFieldValue,
                                      values,
                                      handleChange,
                                      validateForm,
                                    }}
                                  />
                                )}

                                {data?.response_choice === "external" && (
                                  <>
                                    <MobileTextAnswer
                                      item={data}
                                      name={`${data?.component}__${data?.id}.value`}
                                      value={values?.[`${data?.component}__${data?.id}`]?.value}
                                      onChange={(e: any) => {
                                        setFieldValue(
                                          `${data?.component}__${data?.id}.value`,
                                          e.target.value,
                                        );
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
                                      handleFormikFields={{
                                        setFieldValue,
                                        values,
                                        handleChange,
                                        validateForm,
                                      }}
                                      logic={foundLogic}
                                      disabled={true}
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
                                  //   handleFormikFields={{
                                  //     setFieldValue,
                                  //     values,
                                  //     handleChange,
                                  //   }}
                                  // />
                                )}
                                {(data?.response_choice === "multiple" ||
                                  data?.response_choice === "global") && (
                                  <SelectMultipleResponse
                                    multipleResponseData={multipleResponseData}
                                    globalResponseData={globalResponseData}
                                    onChange={(e: any) => {
                                      let value = Array.isArray(e)
                                        ? e
                                            ?.map((data: any) => data)
                                            .filter((data: any) => Boolean(data))
                                        : [e]?.filter((data: any) => Boolean(data));

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
                                      setFieldValue(
                                        `${data?.component}__${data?.id}.flaggedValue`,
                                        flaggedValue,
                                      );
                                      setFieldValue(`${data?.component}__${data?.id}.value`, value);
                                    }}
                                    value={values?.[`${data?.component}__${data?.id}`]?.value}
                                    item={data}
                                    logic={foundLogic}
                                    disabled={readOnly}
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
                                            />
                                          );
                                        case "inspection_date":
                                          return (
                                            <MobileInspectionDate
                                              item={data}
                                              handleFormikFields={handleFormikFields}
                                              logic={foundLogic}
                                              disabled={readOnly}
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
                                              disabled={readOnly}
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
                                              disabled={readOnly}
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
                                              disabled={readOnly}
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
                                        case "speech_recognition":
                                          return (
                                            <MobileSpeechRecognition
                                              handleFormikFields={handleFormikFields}
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
                                              logic={foundLogic}
                                              disabled={readOnly}
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
                                        case "anno":
                                          return (
                                            <MobileAnnotation
                                              dataItem={data}
                                              handleFormikFields={handleFormikFields}
                                              logic={foundLogic}
                                              disabled={readOnly}
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
                                              disabled={readOnly}
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
                                              logic={foundLogic}
                                              disabled={readOnly}
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
                                              disabled={readOnly}
                                            />
                                          );
                                        case "media":
                                          return (
                                            <MobileMedia
                                              item={data}
                                              handleFormikFields={handleFormikFields}
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
                                    <div>
                                      {data?.trigger?.Require_Evidence?.map((ev: any) => ev)}
                                    </div>
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
                              touched,
                              errors,
                            }}
                            readOnly={readOnly}
                            multipleResponseData={multipleResponseData}
                            globalResponseData={globalResponseData}
                            options={options}
                            inputBlur={inputBlur}
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
                            data={data}
                            readOnly={readOnly}
                            dataSetSeperator={dataSetSeperator}
                            formikData={{ values, setFieldValue, errors, touched }}
                            internalResponseData={internalResponseData}
                            multipleResponseData={multipleResponseData}
                            globalResponseData={globalResponseData}
                            checkActionTrigger={checkActionTrigger}
                            inputBlur={inputBlur}
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
            <Button
              variant="contained"
              type="submit"
              style={{ margin: "1rem 0" }}
              id={"submit-button"}
            >
              Save & Continue
            </Button>
          )}
        </div>
      </div>
    </form>
  );
};

const InspectionStarter = ({ readOnly }: any) => {
  const [internalResponseData, setInternalResponseData] = React.useState<any>([]);
  const navigate = useNavigate();
  const { templateId, booking_id, sub_solution_id } = useParams();
  const isLoading = useTemplateStore((state: any) => state?.isLoading);

  const getTemplate = useTemplateStore((state: any) => state?.getTemplate);
  const template = useTemplateStore((state: any) => state?.template);

  const postTemplateInspection = useTemplateStore((state: any) => state?.postTemplateInspection);
  const { templateDatasets, setTemplateDatasets, setTemplateHeading, updateTemplateDatasets } =
    useTemplateFieldsStore();

  const { notifyUser }: any = useInspectionStore();

  const [tempDatas, setTempDatas] = useState([]);

  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const searchParams = new URLSearchParams(location.search);
  const issueID = searchParams.get("issue");
  const api_token = searchParams.get("token");
  useEffect(() => {
    setTempDatas(templateDatasets);
  }, [templateDatasets]);

  useEffect(() => {
    if (templateId) {
      getTemplate(templateId);
    }
  }, [templateId]);
  useEffect(() => {
    if (template) {
      setTemplateDatasets(template?.fields);
      setTemplateHeading("templateDescription", template?.description);
      setTemplateHeading("templateTitle", template?.name);
      setTemplateHeading("headerImage", template?.photo);
    }
  }, [template]);

  // const [multipleResponseData, setMultipleResponseData] = React.useState<any[]>([]);
  // const [globalResponseData, setGlobalResponseData] = React.useState<any[]>([]);

  const {
    multipleResponseData,
    fetchMultipleResponseData,
    fetchGlobalResponseData,
    fetchInternalResponseData,
    internalResponseData: options,
    globalResponseData,
    fetchExternalResponseData,
    externalResponseData,
    individualResponseData,
    fetchIndividualResponseData,
  }: any = useApiOptionsStore();
  // const [externalResponseData, setExternalResponseData] = React.useState<any>([]);

  const fetchResponseData = async () => {
    // await fetchApI({
    await fetchMultipleResponseData({});
    await fetchGlobalResponseData({});
    await fetchExternalResponseData({});
  };
  // const fetchExternalResponseData = async () => {
  //   await fetchExternalApI({
  //     setterFunction: (data: any) => {
  //       setExternalResponseData(data);
  //       // set
  //       // templateDatasets  => find
  //       // updateTemplateDataset => value
  //     },
  //     host: `https://uat.api.bridge.propelmarine.com`,
  //     url: `api/operation/external-booking-template/${booking_id}/${sub_solution_id}`,
  //     // url: `api/operation/external-booking-template/1275/9`,
  //     api_token: api_token,
  //   });
  // };

  useEffect(() => {
    if (!globalResponseData?.length) {
      fetchResponseData();
    }
  }, []);
  // useEffect(() => {
  //   if (booking_id && sub_solution_id) {
  //     fetchExternalResponseData();
  //   }
  // }, [booking_id, sub_solution_id]);

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
            acc.apiRequest[curr?.response_type] = { url: curr?.response_type };
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
  // const [options, setOptions] = useState({});

  useMemo(
    () =>
      internalResponseData?.length &&
      Object.keys(dataSetSeperator?.apiRequest || {})?.forEach(async (field: any) => {
        // await apiRequest(field, setOptions, internalResponseData);
        if (field !== "external") {
          await fetchInternalResponseData({
            key: field,
            url: internalResponseData?.find((data: any) => data.id == field)?.options,
          });
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

  const initialValues = templateDatasets.reduce((values: any, field: any) => {
    if (field?.component?.toLowerCase() === "question") {
      return {
        ...values,
        [`${keyFields?.map((keyField: any) => field?.[keyField])?.join("__")}`]: {
          value:
            field.response_choice !== "external"
              ? field?.type !== "Array"
                ? ""
                : []
              : individualResponseData?.[`${field?.logicApi?.field}`] || "N/A",
          trigger: {},
          notes: "",
          keyName: `${keyFields?.map((keyField: any) => field?.[keyField])?.join("__")}`,
          label: field?.label,
          page: field?.parentPage,
        },
      };
    }
    return values;
  }, {});

  const [pageCount, setPageCount] = useState(0);

  // const pages = templateDatasets.filter((list: any) => list.component === 'page');
  const pages = dataSetSeperator.pages;

  const getValidation = DynamicSchemaGenerator({
    questions: dataSetSeperator.questionDataSet,
    keyFields,
    dataSetSeperator,
    key: "id",
    initialValues,
  });

  const handleValidate = async (values: any, setErrors: any) => {
    try {
      await getValidation.validate(values, { abortEarly: false });
    } catch (validationErrors: any) {
      const errors = validationErrors.inner.reduce((acc: any, error: any) => {
        acc[error.path] = error.message;
        return acc;
      }, {});
      setErrors(errors);
    }
  };

  function getInitialTouched(obj: any, value: any) {
    for (let prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        obj[prop] = value;
      }
    }

    return obj;
  }

  return (
    <div id="InspectionStarter">
      {!!isLoading && <FullPageLoader></FullPageLoader>}
      <div className="inspection_starter__wrapper">
        <div>
          <b> {template?.name}</b>
        </div>
        <div>Page {`${pageCount + 1} / ${pages.length}`}</div>
        <Formik
          initialValues={{ ...initialValues, notification: {} }}
          enableReinitialize={true}
          validationSchema={getValidation}
          validateOnBlur={true}
          validateOnChange={true}
          initialTouched={getInitialTouched({ ...initialValues }, true)}
          onSubmit={(values) => {
            console.log("i am in");
            if (readOnly) return;
            const valueArray = Object.entries(values).map((a: any) => {
              return {
                id: a[0].split("__")[1],
                value: a[1].value,
                notes: a[1].notes,
                ...(a?.[1] || {}),
              };
            });
            const finalValues = tempDatas?.map((obj: any) => {
              let foundObj = valueArray.find((a) => a.id == obj.id);
              if (obj.response_choice !== "default") {
                var foundLogic: any = dataSetSeperator?.logicDataSet.find(
                  (a: any) => a.id === obj.logicId,
                );
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
                };
              }
              return obj;
            });

            const mergedArray: any = ([] as unknown[]).concat(
              ...(Object.values(values?.notification || {}) || []),
            );

            if (mergedArray?.length) {
              notifyUser({ values: mergedArray, enqueueSnackbar });
            }
            if (finalValues) {
              postTemplateInspection({
                values: { template_id: template.id, issueID: issueID, fields: finalValues },
                navigate,
              });
            }
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
                <RenderForm
                  handleFormikField={{
                    values,
                    handleChange,
                    setFieldValue,
                    errors,
                    touched,
                    handleSubmit,
                    validateForm,
                  }}
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
