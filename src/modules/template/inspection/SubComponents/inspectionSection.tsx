import React, { useState, useEffect } from "react";
import useApiOptionsStore from "src/store/zustand/templates/apiOptionsTemplateStore";
import { useTemplateStore } from "src/store/zustand/templates/templateStore";
import { reduceDataSet } from "src/modules/utils/reducedDataSet";
import { deepCloneArray } from "src/modules/utils/deepCloneArray";
import { v4 as uuidv4 } from "uuid";
import ConfirmationModal from "src/components/ConfirmationModal/ConfirmationModal";
import { KeyboardArrowUp, KeyboardArrowDown, DeleteOutline } from "@mui/icons-material";
import responseItems from "src/constants/template/responseItems";
import { Button } from "@mui/material";
import { InputFields } from "./inspectionSubComponents";
import { FormNode } from "./formNode";

export const GroupFields = ({
  it,
  formikData,
  qnLogic,
  checkActionTrigger,
  internalResponseData,
  readOnly,
  inputBlur,
  dataSetSeperator,
  toggle,
  setToggle,
  isOpenSection,
  toggleSection,
  tempDatas,
  setTempDatas,
}: any) => {
  let { values } = formikData || {};
  const [typing, setTyping] = useState(values?.[`${it?.component}__${it?.id}`]?.value || "");

  // useEffect(() => {
  //   if (values?.[`${it?.component}__${it?.id}`]?.value?.length) {
  //     setTyping(values?.[`${it?.component}__${it?.id}`]?.value);
  //   }
  // }, [values, typing]);
  return (
    <div key={`${it?.id}-data`}>
      <InputFields
        responseItems={responseItems}
        handleFormikFields={formikData}
        internalResponseData={internalResponseData}
        data={it}
        foundLogic={qnLogic}
        readOnly={readOnly}
        checkActionTrigger={checkActionTrigger}
        dataSetSeperator={dataSetSeperator}
        inputBlur={inputBlur}
        userTyping={{ typing, setTyping }}
      />
      <FormNode
        dataSetSeperator={dataSetSeperator}
        data={it}
        formikData={formikData}
        internalResponseData={internalResponseData}
        readOnly={readOnly}
        toggle={toggle}
        setToggle={setToggle}
        checkActionTrigger={checkActionTrigger}
        inputBlur={inputBlur}
        isOpenSection={isOpenSection}
        toggleSection={toggleSection}
        userInput={typing}
        tempDatas={tempDatas}
        setTempDatas={setTempDatas}
        setTyping={setTyping}
      />
    </div>
  );
};

export function GenerateQuestion({
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
  isOpenSection,
  toggleSection,
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

  const handleRepeatSectionDeleteBeta = (item: any) => {
    const tempD = tempDatas?.filter((data: any) => data.id !== item.id);
    setTempDatas(tempD);
    // setTempDatas([...tempDatas, ...finalDataSetClone]);
  };

  const handleSelectedRepeatSection = (item: any) => {
    setSectionDeleteModal(true);
    setSelectedItem(item);
  };
  const handleDeleteRepeatSection = (data: any) => {
    const filterOut = tempDatas.filter(
      (templateData: any) => (templateData["parent"] || templateData["id"]) !== data?.id,
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
          {!isOpenSection(data) ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <span className="inspection__section-image" onClick={() => toggleSection(data)}>
                <KeyboardArrowDown />
              </span>
              <div onClick={() => toggleSection(data)}>{data?.label}</div>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <span className="inspection__section-image" onClick={() => toggleSection(data)}>
                <KeyboardArrowUp />
              </span>
              <div onClick={() => toggleSection(data)}>{data?.label}</div>
            </div>
          )}
          {data.repeat ? (
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <Button
                variant="contained"
                type="button"
                onClick={() => handleRepeatSectionBeta(data)}
              >
                Add
              </Button>
              <DeleteOutline onClick={() => handleDeleteRepeatSection(data)} />
            </div>
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
        {isOpenSection(data) &&
          findChildren?.map((it: any, index: number) => {
            if (it.component === "question") {
              const qnLogic = dataSetSeperator?.logicDataSet?.find(
                (lg: any) => lg?.id === it?.logicId,
              );
              return (
                <GroupFields
                  key={`${it?.id}-index`}
                  it={it}
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
              );
            } else if (it.component === "section") {
              return (
                <>
                  <br />

                  <div key={`${it?.id}-section`}>
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
                      isOpenSection={isOpenSection}
                      toggleSection={toggleSection}
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
