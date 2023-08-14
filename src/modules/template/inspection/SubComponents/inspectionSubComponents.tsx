import React, { useState, useEffect } from "react";
import useApiOptionsStore from "containers/template/store/apiOptionsTemplateStore";
import { useTemplateStore } from "src/modules/template/store/templateStore";
import ConfirmationModal from "src/components/ConfirmationModal/ConfirmationModal";
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
import { validateInput } from "containers/template/validation/inputLogicCheck";
import { findData } from "containers/template/validation/keyValidationFunction";
import MobileAnnotation from "containers/template/components/mobileComponents/MobileAnnotation/mobileAnnotation";
import MobileCheckbox from "containers/template/components/mobileComponents/MobileCheckbox/mobileCheckbox";
import SelectExternalResponse from "containers/template/components/mobileComponents/SelectExternalResponse";
import MobileMedia from "containers/template/components/mobileComponents/MobileMedia/MobileMedia";
import { checkActionTrigger } from "./activeScroll";

import { activeScroll } from "./activeScroll";

export function InputFields({
  responseItems,
  data,
  handleFormikFields,
  internalResponseData,
  foundLogic,
  readOnly,
  inputBlur,
  userTyping,
  dataSetSeperator,
}: any) {
  const {
    multipleResponseData,
    internalResponseData: options,
    globalResponseData,
  }: any = useApiOptionsStore();

  const template = useTemplateStore((state: any) => state?.template);

  let { errors, values, setFieldValue } = handleFormikFields;

  const { typing, setTyping } = userTyping || { typing: "", setTyping: () => {} };
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
                dataSetSeperator={dataSetSeperator}
                onBlur={(e: any) => {
                  // e.stopPropagation();
                  setFieldValue(`${data?.component}__${data?.id}.value`, typing);
                }}
                onChange={(e: any, field: any) => {
                  let value = Array.isArray(e)
                    ? e?.map((data: any) => data).filter((data: any) => Boolean(data))
                    : [e]?.filter((data: any) => Boolean(data));
                  setTyping((prev: any) => {
                    return value;
                  });
                  setFieldValue(`${data?.component}__${data?.id}.value`, value);

                  checkActionTrigger({
                    value: [e],
                    logic: foundLogic,
                    ALL_OPTIONS: ALL_OPTIONS,
                    templateTitle: template?.name || "",
                    setFieldValue: setFieldValue,
                    values: values,
                    question: data,
                  });

                  // setFieldValue(`${data?.component}__${data?.id}.value`, value);
                  let flaggedResponse = foundLogic?.flaggedResponse || [];
                  let flaggedValue = value?.filter((data: any) => flaggedResponse?.includes(data));
                  setFieldValue(`${data?.component}__${data?.id}.flaggedValue`, flaggedValue);
                }}
                value={values?.[`${data?.component}__${data?.id}`]?.value}
                // value={typing || []}
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
                value={typing || values?.[`${data?.component}__${data?.id}`]?.value}
                onBlur={(e: any) => {
                  e.stopPropagation();
                  setFieldValue(`${data?.component}__${data?.id}.value`, typing);
                }}
                onChange={(e: any) => {
                  // for notification
                  setTyping(e.target.value);
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
            )}

            {(data?.response_choice === "multiple" || data?.response_choice === "global") && (
              <SelectMultipleResponse
                onBlur={(e: any) => {
                  // e.stopPropagation();
                  setFieldValue(`${data?.component}__${data?.id}.value`, typing);
                }}
                onChange={(e: any) => {
                  let value = Array.isArray(e)
                    ? e?.map((data: any) => data).filter((data: any) => Boolean(data))
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
                  let flaggedValue = value?.filter((data: any) => flaggedResponse?.includes(data));
                  setFieldValue(`${data?.component}__${data?.id}.flaggedValue`, flaggedValue);
                  // setFieldValue(`${data?.component}__${data?.id}.value`, value);
                }}
                logic={foundLogic}
                multipleResponseData={multipleResponseData}
                disabled={readOnly}
                // value={values?.[`${data?.component}__${data?.id}`]?.value}
                value={typing}
                item={data}
                errors={errors?.[`${data?.component}__${data?.id}`]}
                handleFormikFields={handleFormikFields}
              />
            )}
            {data?.response_choice === "default" &&
              (() => {
                let type =
                  responseItems.find((option: any) => option.id === data.response_type)?.type || "";

                switch (type) {
                  case "text":
                    return (
                      <>
                        <MobileTextAnswer
                          item={data}
                          handleFormikFields={handleFormikFields}
                          logic={foundLogic}
                          disabled={readOnly}
                          onBlur={(e: any) => {
                            e.stopPropagation();
                            setFieldValue(`${data?.component}__${data?.id}.value`, typing);
                          }}
                          name={`${data?.component}__${data?.id}.value`}
                          // value={values?.[`${data?.component}__${data?.id}`]?.value}
                          value={typing}
                          errors={errors?.[`${data?.component}__${data?.id}`]}
                          onChange={(e: any) => {
                            setTyping(e.target.value);
                            // setFieldValue(`${data?.component}__${data?.id}.value`, e.target.value);
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
                          setTyping={setTyping}
                        />
                      </>
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
                          setTyping(e.target.value);
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
                          setTyping(e.target.value);
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
                        // item={data}
                        // handleFormikFields={handleFormikFields}
                        // logic={foundLogic}
                        // disabled={readOnly}
                        // name={`${data?.component}__${data?.id}.value`}
                        // value={values?.[`${data?.component}__${data?.id}`]?.value}
                        // errors={errors?.[`${data?.component}__${data?.id}`]}
                        // onChange={(e: any) => {
                        //   setFieldValue(`${data?.component}__${data?.id}.value`, e.target.value);
                        // }}

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
                        item={data}
                        handleFormikFields={handleFormikFields}
                        logic={foundLogic}
                        disabled={readOnly}
                        name={`${data?.component}__${data?.id}.value`}
                        onBlur={(e: any) => {
                          e.stopPropagation();
                          setFieldValue(`${data?.component}__${data?.id}.value`, typing);
                        }}
                        // value={values?.[`${data?.component}__${data?.id}`]?.value}
                        value={typing}
                        errors={errors?.[`${data?.component}__${data?.id}`]}
                        onChange={(e: any) => {
                          setTyping(e.target.value);
                          // setFieldValue(`${data?.component}__${data?.id}.value`, );
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
                        onBlur={(e: any) => {
                          e.stopPropagation();
                          setFieldValue(`${data?.component}__${data?.id}.value`, typing);
                        }}
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
                          // setFieldValue(`${data?.component}__${data?.id}.value`, typing);
                        }}
                      />
                    );
                  case "anno":
                    return (
                      <MobileAnnotation
                        handleFormikFields={handleFormikFields}
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
                        logic={foundLogic}
                        handleFormikFields={handleFormikFields}
                        // value={values?.[`${data?.component}__${data?.id}`]?.value}
                        value={typing}
                        errors={errors?.[`${data?.component}__${data?.id}`]}
                        onBlur={(e: any) => {
                          e.stopPropagation();
                          setFieldValue(`${data?.component}__${data?.id}.value`, typing);
                        }}
                        onChange={(e: any) => {
                          setTyping(e.target.checked);
                          // setFieldValue(`${data?.component}__${data?.id}.value`, e.target.checked);
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
                      <>
                        <MobileSignature
                          item={data}
                          errors={errors?.[`${data?.component}__${data?.id}`]}
                          handleFormikFields={handleFormikFields}
                          logic={foundLogic}
                          disabled={readOnly}
                          onBlur={(e: any) => {
                            e.stopPropagation();
                            setFieldValue(`${data?.component}__${data?.id}.value`, typing);
                          }}
                          name={`${data?.component}__${data?.id}.value`}
                          // value={values?.[`${data?.component}__${data?.id}`]?.value}
                          value={typing}
                          onChange={(e: any) => {
                            setTyping(e.target.value);
                            setFieldValue(`${data?.component}__${data?.id}.value`, e.target.value);
                          }}
                        />
                      </>
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
