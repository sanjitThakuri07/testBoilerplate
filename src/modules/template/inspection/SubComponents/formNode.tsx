import React, { useState } from "react";
import useApiOptionsStore from "src/store/zustand/templates/apiOptionsTemplateStore";
import { useTemplateStore } from "src/store/zustand/templates/templateStore";
import { validateInput } from "src/modules/template/validation/inputLogicCheck";
import { findData } from "src/modules/template/validation/keyValidationFunction";
import { InputFields } from "./inspectionSubComponents";
import responseItems from "src/constants/template/responseItems";
import { KeyboardArrowUp, KeyboardArrowDown, DeleteOutline } from "@mui/icons-material";
import { Button } from "@mui/material";
import { GroupFields } from "./inspectionSection";
import { checkActionTrigger } from "./activeScroll";

export const FormNode = ({
  dataSetSeperator,
  data,
  formikData,
  internalResponseData,
  readOnly,
  userInput,
  isOpenSection,
  toggleSection,
  inputBlur,
  tempDatas,
  setTempDatas,
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
            // userInput: values?.[`${data?.component}__${data?.id}`]?.value,
            // userInput:
            //   data?.response_choice !== 'default'
            //     ? values?.[`${data?.component}__${data?.id}`]?.value
            //     : userInput,
            userInput:
              typeof userInput === "boolean"
                ? userInput
                : userInput || values?.[`${data?.component}__${data?.id}`]?.value,
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
                  <GroupFields
                    key={`${data?.id}-index`}
                    it={data}
                    isOpenSection={isOpenSection}
                    toggleSection={toggleSection}
                    formikData={formikData}
                    qnLogic={qnLogic}
                    checkActionTrigger={checkActionTrigger}
                    internalResponseData={internalResponseData}
                    readOnly={readOnly}
                    inputBlur={inputBlur}
                    toggle={toggle}
                    setToggle={setToggle}
                    dataSetSeperator={dataSetSeperator}
                    tempDatas={tempDatas}
                    setTempDatas={setTempDatas}
                  ></GroupFields>
                  {/* <InputFields
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
                  /> */}
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
                    tempDatas={tempDatas}
                    setTempDatas={setTempDatas}
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
