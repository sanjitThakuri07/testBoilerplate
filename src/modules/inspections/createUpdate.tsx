import React, { useEffect, useMemo, useState } from "react";

import FullPageLoader from "src/components/FullPageLoader";
import responseItems from "src/constants/template/responseItems";
import { fetchApI } from "src/modules/apiRequest/apiRequest";
import { Formik } from "formik";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { DeleteOutline, KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { Button } from "@mui/material";
import ConfirmationModal from "src/components/ConfirmationModal/ConfirmationModal";
import EditView from "src/components/ViewEdit";
import { permissionList } from "src/constants/permission";
import MobileAnnotation from "src/modules/template/components/mobileComponents/MobileAnnotation/mobileAnnotation";
import MobileCheckbox from "src/modules/template/components/mobileComponents/MobileCheckbox/mobileCheckbox";
import MobileDateTime from "src/modules/template/components/mobileComponents/MobileDateTime/MobileDateTime";
import MobileInspectionDate from "src/modules/template/components/mobileComponents/MobileInspectionDate/MobileInspectionDate";
import MobileInstruction from "src/modules/template/components/mobileComponents/MobileInstruction";
import MobileLocation from "src/modules/template/components/mobileComponents/MobileLocation/MobileLocation";
import MobileNumber from "src/modules/template/components/mobileComponents/MobileNumber";
import MobileSignature from "src/modules/template/components/mobileComponents/MobileSignature";
import MobileSlider from "src/modules/template/components/mobileComponents/MobileSlider/MobileSlider";
import MobileSpeechRecognition from "src/modules/template/components/mobileComponents/MobileSpeechRecognition/MobileSpeechRecognition";
import MobileTemperature from "src/modules/template/components/mobileComponents/MobileTemperature/mobileTemperature";
import MobileTextAnswer from "src/modules/template/components/mobileComponents/MobileTextAnswer/MobileTextAnswer";
import SelectInternalResponse from "src/modules/template/components/mobileComponents/SelectInternalResponse";
import SelectMultipleResponse from "src/modules/template/components/mobileComponents/SelectMultipleResponse";
import { useInspectionStore } from "src/store/zustand/templates/inspectionStore";
import { validateInput } from "src/modules/template/validation/inputLogicCheck";
import { findData } from "src/modules/template/validation/keyValidationFunction";
import { deepCloneArray } from "src/modules/utils/deepCloneArray";
import { reduceDataSet } from "src/modules/utils/reducedDataSet";
import { v4 as uuidv4 } from "uuid";
import MobileMedia from "src/modules/template/components/mobileComponents/MobileMedia/MobileMedia";
import useApiOptionsStore from "src/store/zustand/templates/apiOptionsTemplateStore";

function InputFields({
  responseChoice,
  responseItems,
  data,
  handleFormikFields,
  internalResponseData,
  foundLogic,
  readOnly,
}: // options,
any) {
  const {
    multipleResponseData,
    fetchMultipleResponseData,
    fetchGlobalResponseData,
    fetchInternalResponseData,
    internalResponseData: options,
    globalResponseData,
  }: any = useApiOptionsStore();
  let { errors, values, setFieldValue } = handleFormikFields;
  return (
    <>
      <div className="mobile_component_box">
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
                    : [e]?.filter((data: any) => Boolean(data));

                  let flaggedResponse = foundLogic?.flaggedResponse || [];
                  let flaggedValue = values?.filter((data: any) => flaggedResponse?.includes(data));
                  setFieldValue(`${data?.component}__${data?.id}.flaggedValue`, flaggedValue);
                  setFieldValue(`${data?.component}__${data?.id}.value`, values);
                }}
                logic={foundLogic}
                disabled={readOnly}
                // value={values?.[`${data?.component}__${data?.id}`]?.value}
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
                        disabled={readOnly}
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
  options,
  data,
  dataSetSeperator,
  tempDatas,
  formikData,
  internalResponseData,
  multipleResponseData,
  setTempDatas,
  templateDatasets,
  readOnly,
}: any) {
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
                  options={options}
                  key={it?.id}
                  responseItems={responseItems}
                  handleFormikFields={formikData}
                  internalResponseData={internalResponseData}
                  data={it}
                  foundLogic={qnLogic}
                  readOnly={readOnly}
                />
                <FormNode
                  options={options}
                  dataSetSeperator={dataSetSeperator}
                  data={it}
                  key={`${it?.id}-index`}
                  formikData={formikData}
                  internalResponseData={internalResponseData}
                  multipleResponseData={multipleResponseData}
                  readOnly={readOnly}
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
                    options={options}
                    data={it}
                    templateDatasets={templateDatasets}
                    tempDatas={tempDatas}
                    setTempDatas={setTempDatas}
                    dataSetSeperator={dataSetSeperator}
                    formikData={formikData}
                    internalResponseData={internalResponseData}
                    multipleResponseData={multipleResponseData}
                    readOnly={readOnly}
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

async function apiRequest(key?: any, setData?: any, internalResponseData?: any) {
  await fetchApI({
    url: internalResponseData?.find((data: any) => data.id == key)?.options.replace("/api/v1/", ""),
    setterFunction: (data: any) => {
      setData?.((prev: any) => ({ ...prev, [key]: data }));
    },
  });
}

const FormNode = ({
  dataSetSeperator,
  data,
  formikData,
  internalResponseData,
  multipleResponseData,
  readOnly,
  options,
}: any) => {
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
          const qnLogic = dataSetSeperator?.logicDataSet?.find(
            (lg: any) => lg?.id === data?.logicId,
          );
          return (
            <div key={data?.id}>
              {data?.component === "question" && (
                <>
                  <InputFields
                    options={options}
                    key={data?.id}
                    responseItems={responseItems}
                    handleFormikFields={formikData}
                    internalResponseData={internalResponseData}
                    data={data}
                    foundLogic={qnLogic}
                    readOnly={readOnly}
                  />
                  <FormNode
                    options={options}
                    dataSetSeperator={dataSetSeperator}
                    data={data}
                    key={data?.id}
                    formikData={formikData}
                    readOnly={readOnly}
                  />
                </>
              )}

              {data?.component === "section" && (
                <>
                  <h1> {data?.component}</h1>
                  <FormNode
                    options={options}
                    dataSetSeperator={dataSetSeperator}
                    data={data}
                    key={data?.id}
                    formikData={formikData}
                    readOnly={readOnly}
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
  internalResponseData,
  pages,
  globalResponseData,
  multipleResponseData,
  setPageCount,
}: any) => {
  const [options, setOptions] = useState({});

  let { handleSubmit, handleChange, values, setFieldValue, errors, touched }: any =
    handleFormikField || {
      values: {},
      setFieldValue: "",
      handleSubmit: () => {},
      handleChange: () => {},
      errors: {},
      touched: false,
    };

  useMemo(
    () =>
      Object.keys(dataSetSeperator?.apiRequest || {})?.forEach(async (field: any) => {
        await apiRequest(field, setOptions, internalResponseData);
      }),
    [dataSetSeperator?.apiRequest, internalResponseData],
  );

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
                  return (
                    <div key={data?.id}>
                      {data.component === "question" && (
                        <>
                          <div className="mobile_component_box">
                            <div className="mobile_component_box_wrapper">
                              <div className="mobile_component_box_wrapper_heading">
                                {data?.response_choice === "internal" && (
                                  <SelectInternalResponse
                                    options={options}
                                    item={data}
                                    apiItem={
                                      internalResponseData.length &&
                                      internalResponseData.find(
                                        (responseData: any) =>
                                          responseData.id === data.response_type,
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

                                      setFieldValue(
                                        `${data?.component}__${data?.id}.value`,
                                        values,
                                      );
                                    }}
                                    value={values?.[`${data?.component}__${data?.id}`]?.value}
                                    logic={foundLogic}
                                    disabled={readOnly}
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
                                    multipleResponseData={multipleResponseData}
                                    globalResponseData={globalResponseData}
                                    onChange={(e: any) => {
                                      let values = Array.isArray(e)
                                        ? e
                                            ?.map((data: any) => data?.name)
                                            .filter((data: any) => Boolean(data))
                                        : [e]?.filter((data: any) => Boolean(data));
                                      let flaggedResponse = foundLogic?.flaggedResponse || [];
                                      let flaggedValue = values?.filter((data: any) =>
                                        flaggedResponse?.includes(data),
                                      );
                                      setFieldValue(
                                        `${data?.component}__${data?.id}.flaggedValue`,
                                        flaggedValue,
                                      );
                                      setFieldValue(
                                        `${data?.component}__${data?.id}.value`,
                                        values,
                                      );
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
                                              }}
                                              // handleFormikFields={{
                                              //   handleSubmit,
                                              //   handleChange,
                                              //   values,
                                              //   setFieldValue,
                                              // }}
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
                            }}
                            readOnly={readOnly}
                          />
                        </>
                      )}
                      <br />
                      {data.component === "section" && (
                        <>
                          {/* <h1> {data?.component}</h1> */}
                          <GenerateQuestion
                            data={data}
                            readOnly={readOnly}
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
            <Button variant="contained" type="submit" style={{ margin: "1rem 0" }}>
              Save & Continue
            </Button>
          )}
        </div>
      </div>
    </form>
  );
};

const InspectionCreateUpdate = ({}: any) => {
  const [internalResponseData, setInternalResponseData] = React.useState<any>([]);

  const navigate = useNavigate();
  const location = useLocation();
  const param = useParams();
  const isLoading = useInspectionStore((state: any) => state?.isLoading);

  const getInspection = useInspectionStore((state: any) => state?.getInspection);
  const inspection = useInspectionStore((state: any) => state?.inspection);
  const updateInspection = useInspectionStore((state: any) => state?.updateInspection);
  const templateFields = (inspection && inspection.fields) || [];
  const readOnly = location?.pathname?.includes("/view/");

  // const [multipleResponseData, setMultipleResponseData] = React.useState<any[]>([]);
  // const [globalResponseData, setGlobalResponseData] = React.useState<any[]>([]);

  const {
    multipleResponseData,
    fetchMultipleResponseData,
    fetchGlobalResponseData,
    fetchInternalResponseData,
    internalResponseData: options,
    globalResponseData,
  }: any = useApiOptionsStore();
  const fetchResponseData = async () => {
    // await fetchApI({
    await fetchMultipleResponseData({});
    await fetchGlobalResponseData({});
  };
  useEffect(() => {
    if (!globalResponseData?.length) {
      fetchResponseData();
    }
  }, []);
  // const fetchResponseData = async () => {
  //   await fetchApI({
  //     setterFunction: setMultipleResponseData,
  //     url: 'multiple-response/',
  //   });
  //   await fetchApI({
  //     setterFunction: setGlobalResponseData,
  //     url: 'global-response/',
  //   });
  // };
  // useEffect(() => {
  //   fetchResponseData();
  // }, []);

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

  const dataSetSeperator = useMemo(() => {
    return templateFields.reduce(
      (acc: any, curr: any) => {
        if (curr?.component === "question" && curr?.response_choice === "internal") {
          if (!acc.apiRequest?.[curr?.response_type]) {
            acc.apiRequest[curr?.response_type] = { url: curr?.response_type };
          }
        }

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
      { logicDataSet: [], questionDataSet: [], logicQuestion: [], apiRequest: {} },
    );
  }, [templateFields]);

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
          media: param?.inspectionId ? field?.media : [],
        },
      };
    }
    return values;
  }, {});

  const [pageCount, setPageCount] = useState(0);

  // const dataSetSeperators = rawData.reduce(
  //   (acc: any, curr: any) => {
  //     if (
  //       curr.component?.toLowerCase() !== 'logic' &&
  //       curr.logicReferenceId === null &&
  //       curr.parent === null
  //     ) {
  //       acc.questionDataSet.push(curr);
  //     } else if (curr.component === 'logic') {
  //       acc.logicDataSet.push(curr);
  //     } else if (curr.logicReferenceId || curr.parent) {
  //       acc.logicQuestion.push(curr);
  //     }
  //     return acc;
  //   },
  //   { logicDataSet: [], questionDataSet: [], logicQuestion: [] },
  // );

  // function dataNode({ dataSetSeperator, data, acc }: any) {
  //   const findLogic = dataSetSeperator.logicDataSet?.find(
  //     (datas: any) => data.logicId === datas.id,
  //   );
  //   if (!findLogic) return null;

  //   let trigger = {};

  //   const conditionQuestions = findLogic?.logics
  //     ?.map((logic: any, index: any) => {
  //       if (logic) {
  //         let datas = [];
  //         let conditionDataset = {
  //           condition: logic?.condition,
  //           trigger: logic?.trigger,
  //         };
  //         if (
  //           validateInput({
  //             operator: conditionDataset?.condition,
  //             userInput: data?.value,
  //             authorizedValues: Array.isArray(logic?.value) ? logic?.value : [logic?.value],
  //           })
  //         ) {
  //           trigger = logic?.trigger.reduce((acc: any, curr: any) => {
  //             if (curr?.name) {
  //               acc[`${curr.name?.toString()?.split(' ').join('_')}`] = curr.value;
  //             }
  //             return acc;
  //           }, {});
  //           datas = logic.linkQuestions.map((data: any) =>
  //             findData(dataSetSeperator.logicQuestion, data, 'id'),
  //           );
  //         }
  //         return datas;
  //       } else {
  //         return;
  //       }
  //     })
  //     .flat();

  //   if (!conditionQuestions?.length) return;
  //   conditionQuestions?.map((data: any) => {
  //     const qnLogic = dataSetSeperator?.logicDataSet?.find((lg: any) => lg?.id === data?.logicId);

  //     if (data?.component === 'question') {
  //       // do saving
  //       // recursive vall
  //       acc.filterQuestion.push(data);
  //       data?.media?.[0]?.documents?.length && acc.medias.push(...data?.media?.[0]?.documents);
  //       dataNode({ dataSetSeperator: dataSetSeperator, data: data, acc });
  //     } else if (data.component === 'section') {
  //       dataSection({ dataSetSeperator: dataSetSeperator, data: data, acc });
  //     }
  //   });
  // }

  // function dataSection({ dataSetSeperator, data, acc }: any) {
  //   const findChildren = dataSetSeperator?.logicQuestion?.filter((item: any) => {
  //     return data?.id === item?.parent;
  //   });

  //   if (!findChildren?.length) return;
  //   findChildren?.map((child: any) => {
  //     if (child.component === 'question') {
  //       acc.filterQuestion.push(child);
  //       child?.media?.[0]?.documents?.length && acc.medias.push(...child?.media?.[0]?.documents);
  //       dataNode({ dataSetSeperator: dataSetSeperator, data: child, acc });
  //     } else if (child.component === 'section') {
  //       dataSection({ dataSetSeperator: dataSetSeperator, data: child, acc });
  //     }
  //   });
  // }
  // // create a collection of media from active lists
  // const datass = dataSetSeperators?.questionDataSet?.reduce(
  //   (acc: any, curr: any) => {
  //     const foundLogic = dataSetSeperators?.logicDataSet?.find(
  //       (lg: any) => lg?.id === curr?.logicId,
  //     );
  //     if (curr?.component === 'question') {
  //       acc.filterQuestion.push(curr);
  //       curr?.media?.[0]?.documents?.length && acc.medias.push(...curr?.media?.[0]?.documents);
  //       dataNode({ dataSetSeperator: dataSetSeperators, data: curr, acc });
  //     } else if (curr.component === 'section') {
  //       dataSection({ dataSetSeperator: dataSetSeperators, data: curr, acc });
  //     }
  //     return acc;
  //   },
  //   { flaggedQuestions: [], medias: [], filterQuestion: [] },
  // );

  const pages = templateFields.filter((list: any) => list.component === "page");
  return (
    <div id="InspectionStarter" className="position-relative">
      {!!isLoading && <FullPageLoader></FullPageLoader>}
      <EditView permission={[permissionList.InspectionName.edit]} />
      <div className="inspection_starter__wrapper">
        <div className="inspection__header">
          <div className="group">
            <div className="page__style">
              Page {`${pageCount + 1} of ${pages.length}`}
              <span>
                <KeyboardArrowDown />
              </span>
            </div>
            <b> {inspection?.template}</b>
          </div>
          <div className="group">
            <div>Score</div>
            {/* <div>Score</div> */}
            <b></b>
            {/* <b>0/103</b> */}
          </div>
        </div>

        <Formik
          initialValues={initialValues}
          enableReinitialize={true}
          onSubmit={(values) => {
            if (readOnly) return;
            const valueArray = Object.entries(values).map((a: any) => {
              return {
                id: a[0].split("__")[1],
                value: a[1].value,
                notes: a[1].notes,
                ...(a?.[1] || {}),
              };
            });
            const finalValues = templateFields?.map((obj: any) => {
              let foundObj = valueArray.find((a) => a.id == obj.id);
              if (obj.id === foundObj?.id) {
                return {
                  ...obj,
                  ...foundObj,
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
              <RenderForm
                handleFormikField={{
                  values,
                  handleChange,
                  setFieldValue,
                  errors,
                  touched,
                  handleSubmit,
                }}
                dataSetSeperator={dataSetSeperator}
                readOnly={readOnly}
                pageCount={pageCount}
                internalResponseData={internalResponseData}
                pages={pages}
                globalResponseData={globalResponseData}
                multipleResponseData={multipleResponseData}
                setPageCount={setPageCount}
              />
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default InspectionCreateUpdate;
