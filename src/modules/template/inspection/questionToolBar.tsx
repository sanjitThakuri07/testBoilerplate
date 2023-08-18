import React, { useState, useEffect } from "react";
import ListIcon from "@mui/icons-material/List";
import Tooltip from "@mui/material/Tooltip";
import { SwitchComponent } from "src/modules/config/Filters/CommonFilter";
import useApiOptionsStore from "src/store/zustand/templates/apiOptionsTemplateStore";
import { findData } from "src/modules/template/validation/keyValidationFunction";
import { validateInput } from "../validation/inputLogicCheck";
import { Button } from "@mui/material";
import MultiSelect from "src/components/CustomMultiSelect/version2";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { ErrorOutline } from "@mui/icons-material";

const options = [
  { label: "Answered", value: 1 },
  { label: "Unanswered", value: 2 },
  { label: "Both", value: 3 },
  { label: "Errors", value: 4 },
];

function filterModeCheck({ formValues, keyName, values, errors }: any) {
  if (formValues?.filterMode) {
    let value = values?.[keyName]?.label || "";

    let checkStatus =
      formValues?.status?.value === 1
        ? !!values?.[keyName]?.value?.length
        : formValues?.status?.value === 2
        ? !values?.[keyName]?.value?.length
        : formValues?.status?.value === 3
        ? !!(!values?.[keyName]?.value?.length || values?.[keyName]?.value?.length)
        : formValues?.status?.value === 4
        ? !!errors?.[keyName]
        : false;

    return value.toLowerCase().indexOf(formValues?.q.toLowerCase()) != -1
      ? checkStatus
        ? 0
        : -1
      : -1;
  } else {
    return false;
  }
}

function DisplayComponent({
  data,
  values,
  errors,
  index,
  inputBlur,
  activeScroll,
  setPageCount,
  setScrollToQuestion,
  dataSetSeperator,
  formValues,
}: any) {
  let it = `${data?.component}__${data?.id}`;
  let check: any = filterModeCheck({ formValues, keyName: it, values, errors });
  return (
    <>
      {check != -1 ? (
        <div
          onClick={() => {
            const element: any = document.querySelector(`[data-item="${it}"]`);
            if (element) {
              inputBlur?.setIsBlur(true);
              activeScroll(element);
            } else {
              const findPageIndex = dataSetSeperator?.pages?.findIndex(
                (pg: any) => pg?.id === values?.[it]?.page,
              );
              setPageCount(findPageIndex);
              setScrollToQuestion(it);
            }
          }}
          className={errors?.[it] ? "error__box-question" : ""}
        >
          <span className="counter">{/* {index + 1}. */}</span>
          <Tooltip title={data.label} placement="top-start">
            <span className="text__body">{data.label}</span>
          </Tooltip>
          <input
            type="checkbox"
            disabled
            checked={
              values?.[`${data?.component}__${data?.id}`]?.value?.length &&
              !errors?.[`${data?.component}__${data?.id}`]
            }
          />
        </div>
      ) : (
        <></>
      )}
    </>
  );
}

function ValidateQuestion({
  dataSetSeperator,
  data,
  values,
  errors,
  inputBlur,
  activeScroll,
  setPageCount,
  setScrollToQuestion,
  formValues,
}: any) {
  const findLogic = dataSetSeperator.logicDataSet?.find((datas: any) => data.logicId === datas.id);

  const {
    multipleResponseData,
    fetchMultipleResponseData,
    fetchGlobalResponseData,
    fetchInternalResponseData,
    internalResponseData: options,
    globalResponseData,
  }: any = useApiOptionsStore();

  if (!findLogic) return <></>;

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

  if (conditionQuestions?.length) {
    return (
      <>
        {conditionQuestions?.map((data: any, index: number) => {
          return (
            <>
              {data?.component === "question" && (
                <>
                  <DisplayComponent
                    key={`${data?.component}__${data?.id}__index`}
                    values={values}
                    errors={errors}
                    index={index}
                    data={data}
                    activeScroll={activeScroll}
                    setPageCount={setPageCount}
                    setScrollToQuestion={setScrollToQuestion}
                    inputBlur={inputBlur}
                    dataSetSeperator={dataSetSeperator}
                    formValues={formValues}
                  />
                  <ValidateQuestion
                    dataSetSeperator={dataSetSeperator}
                    data={data}
                    key={data?.id}
                    values={values}
                    errors={errors}
                    activeScroll={activeScroll}
                    setPageCount={setPageCount}
                    setScrollToQuestion={setScrollToQuestion}
                    inputBlur={inputBlur}
                    formValues={formValues}
                  />
                </>
              )}
              {data.component === "section" && (
                <>
                  <ValidateQuestion
                    dataSetSeperator={dataSetSeperator}
                    data={data}
                    key={data?.id}
                    values={values}
                    errors={errors}
                    activeScroll={activeScroll}
                    setPageCount={setPageCount}
                    setScrollToQuestion={setScrollToQuestion}
                    inputBlur={inputBlur}
                    formValues={formValues}
                  />
                </>
              )}
            </>
          );
        })}
      </>
    );
  }

  return <></>;
}

function SectionFilter({
  data,
  values,
  errors,
  index,
  dataSetSeperator,
  inputBlur,
  activeScroll,
  setPageCount,
  setScrollToQuestion,
  formValues,
}: any) {
  const findChildren = dataSetSeperator?.logicQuestion?.filter((item: any) => {
    return data?.id === item?.parent;
  });

  if (!findChildren.length) return <></>;

  return (
    <>
      {findChildren?.map((it: any, index: number) => {
        if (it.component === "question") {
          const qnLogic = dataSetSeperator?.logicDataSet?.find((lg: any) => lg?.id === it?.logicId);
          return (
            <>
              <DisplayComponent
                key={`${it?.component}__${it?.id}__index`}
                values={values}
                errors={errors}
                index={index}
                data={it}
                activeScroll={activeScroll}
                setPageCount={setPageCount}
                setScrollToQuestion={setScrollToQuestion}
                inputBlur={inputBlur}
                dataSetSeperator={dataSetSeperator}
                formValues={formValues}
              />
            </>
          );
        } else if (it.component === "section") {
          return (
            <SectionFilter
              key={`${it?.component}__${it?.id}-00`}
              data={it}
              values={values}
              errors={errors}
              dataSetSeperator={dataSetSeperator}
              index={index}
              activeScroll={activeScroll}
              setPageCount={setPageCount}
              setScrollToQuestion={setScrollToQuestion}
              inputBlur={inputBlur}
              formValues={formValues}
            />
          );
        }
      })}
    </>
  );
}

const QuestionToolBar = ({
  values,
  inputBlur,
  activeScroll,
  setPageCount,
  setScrollToQuestion,
  dataSetSeperator,
  errors,
}: any) => {
  const [pageCountQn, setPageCountQn] = useState(0);
  const [closeQnSidebar, setCloseQnSidebar] = useState(true);
  const [formValues, setFormValues] = useState({
    completed: false,
    q: "",
    filterMode: false,
    status: options?.[2],
  });
  const [questionData, setQuestionData] = useState(Object.keys(values || {}));

  function handleSearch(e: any) {
    let value = e?.target.type === "checkbox" ? e?.target.checked : e?.target.value;
    setFormValues((prev: any) => ({ ...prev, [e.target.name]: value }));
  }

  useEffect(() => {
    if (Object?.keys(errors || {})?.length) {
      setFormValues((prev: any) => ({ ...prev, status: options?.[3], filterMode: true }));
    }
  }, [errors]);

  return (
    <div
      className={`error-message__modal ${closeQnSidebar ? "close" : ""} ${
        Object.keys(errors || {})?.length ? "error-style" : ""
      }`}
    >
      <header
        className="question__list-header"
        onClick={() => {
          setCloseQnSidebar((prev: any) => !prev);
        }}
      >
        <ListIcon />
        <span className="heading__body">
          List of Inspection Questions
          {!!Object.keys(errors || {})?.length && <ErrorOutline />}
        </span>
        <KeyboardArrowDownIcon className={closeQnSidebar ? "rotate" : ""} />
      </header>
      <section className="filter">
        <div className="switch__group">
          <label htmlFor="filterMode">Filter Mode</label>
          <input
            type="checkbox"
            id="filterMode"
            name="filterMode"
            checked={formValues?.filterMode}
            onChange={handleSearch}
            autoComplete={"off"}
          />
        </div>
        <div className="search__text">
          <input
            type="text"
            placeholder="Search Question"
            name="q"
            onChange={handleSearch}
            disabled={!formValues?.filterMode}
            className={!formValues?.filterMode ? "disabled" : ""}
          />
        </div>
        <div className="switch__group">
          <MultiSelect
            options={options}
            value={formValues?.status}
            onChange={(data: any) => {
              setFormValues((prev: any) => ({ ...prev, status: data }));
            }}
            disabled={!formValues?.filterMode}
          />
        </div>
      </section>
      <main className="question__list-main">
        {!formValues?.filterMode
          ? dataSetSeperator?.pages?.map((list: any, index: number) => {
              return (
                <>
                  {index === pageCountQn &&
                    dataSetSeperator?.questionDataSet
                      .filter((d: any) => d.parentPage === list.id)
                      ?.map((data: any, index: number) => {
                        return (
                          <>
                            {data.component === "question" && (
                              <>
                                <DisplayComponent
                                  key={`${data?.component}__${data?.id}__idx`}
                                  values={values}
                                  errors={errors}
                                  index={index}
                                  data={data}
                                  activeScroll={activeScroll}
                                  setPageCount={setPageCount}
                                  setScrollToQuestion={setScrollToQuestion}
                                  inputBlur={inputBlur}
                                  dataSetSeperator={dataSetSeperator}
                                />
                                <ValidateQuestion
                                  key={`${data?.component}__${data?.id}__index`}
                                  values={values}
                                  errors={errors}
                                  index={index}
                                  data={data}
                                  dataSetSeperator={dataSetSeperator}
                                  activeScroll={activeScroll}
                                  setPageCount={setPageCount}
                                  setScrollToQuestion={setScrollToQuestion}
                                />
                              </>
                            )}
                            {data.component === "section" && (
                              <SectionFilter
                                key={`${data?.component}__${data?.id}-22`}
                                data={data}
                                values={values}
                                errors={errors}
                                dataSetSeperator={dataSetSeperator}
                                index={index}
                                activeScroll={activeScroll}
                                setPageCount={setPageCount}
                                setScrollToQuestion={setScrollToQuestion}
                                inputBlur={inputBlur}
                              />
                            )}
                          </>
                        );
                      })}
                </>
              );
            })
          : dataSetSeperator?.questionDataSet?.map((data: any, index: number) => {
              return (
                <>
                  {data.component === "question" && (
                    <>
                      <DisplayComponent
                        key={`${data?.component}__${data?.id}__idx`}
                        values={values}
                        errors={errors}
                        index={index}
                        data={data}
                        activeScroll={activeScroll}
                        setPageCount={setPageCount}
                        setScrollToQuestion={setScrollToQuestion}
                        inputBlur={inputBlur}
                        dataSetSeperator={dataSetSeperator}
                        formValues={formValues}
                      />
                      <ValidateQuestion
                        key={`${data?.component}__${data?.id}__index`}
                        values={values}
                        errors={errors}
                        index={index}
                        data={data}
                        dataSetSeperator={dataSetSeperator}
                        activeScroll={activeScroll}
                        setPageCount={setPageCount}
                        setScrollToQuestion={setScrollToQuestion}
                        formValues={formValues}
                        inputBlur={inputBlur}
                      />
                    </>
                  )}
                  {data.component === "section" && (
                    <SectionFilter
                      key={`${data?.component}__${data?.id}-22`}
                      data={data}
                      values={values}
                      errors={errors}
                      dataSetSeperator={dataSetSeperator}
                      index={index}
                      activeScroll={activeScroll}
                      setPageCount={setPageCount}
                      setScrollToQuestion={setScrollToQuestion}
                      formValues={formValues}
                      inputBlur={inputBlur}
                    />
                  )}
                </>
              );
            })}
      </main>
      {!formValues?.filterMode && (
        <footer>
          <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
            <div>
              {pageCountQn > 0 && (
                <Button
                  variant="outlined"
                  type="button"
                  style={{ margin: "1rem 0" }}
                  onClick={() => setPageCountQn(pageCountQn - 1)}
                >
                  Prev Page
                </Button>
              )}
            </div>
            <div>
              {dataSetSeperator?.pages?.length - 1 > pageCountQn && (
                <Button
                  variant="contained"
                  type="button"
                  style={{ margin: "1rem 0" }}
                  onClick={() => setPageCountQn(pageCountQn + 1)}
                >
                  Next Page
                </Button>
              )}
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default QuestionToolBar;

{
  /* {questionData?.map((it: any, index: number) => {
          return (
            <div
              onClick={() => {
                const element: any = document.querySelector(`[data-item="${it}"]`);
                inputBlur?.setIsBlur(true);
                if (element) {
                  activeScroll(element);
                } else {
                  const findPageIndex = dataSetSeperator?.pages?.findIndex(
                    (pg: any) => pg?.id === values?.[it]?.page,
                  );
                  setPageCount(findPageIndex);
                  setScrollToQuestion(it);
                }
              }}
              key={`${it}__index`}>
              <span className="counter">{index + 1}.</span>
              <Tooltip title={values?.[it]?.label} placement="top-start">
                <span className="text__body">{values?.[it]?.label || ''}</span>
              </Tooltip>
              <input
                type="checkbox"
                disabled
                checked={values?.[it]?.value?.length && !errors?.[it]}
              />
            </div>
          );
        })} */
}
