import { useTextAnswer } from "src/store/zustand/globalStates/templates/TextAnswer";
import {
  Button,
  Checkbox,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  ListItemText,
  Menu,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from "@mui/material";
import React, { FC, MouseEvent, useEffect, useState, useRef } from "react";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import AddIcon from "@mui/icons-material/Add";
import ModalLayout from "src/components/ModalLayout";
import { useTemplateFieldsStore } from "src/store/zustand/templates/templateFieldsStore";
import { Field, FieldArray, Form, Formik } from "formik";
import { v4 as uuidv4 } from "uuid";
import EvidenceBlankIcon from "src/assets/icons/Evidence__blank.svg";
import { Close, Diversity2 } from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useParams } from "react-router-dom";
import { jaJP } from "@mui/x-data-grid";
import CloseIcon from "@mui/icons-material/Close";

type ResponseInputLogicProps = {
  responseTypeId?: any;
  logicOptions?: any;
  data?: any;
  renderConditionOptionOption?: any;
  dataItem?: any;
};

// logic options takes in object that has options field with array of objects containing name as a key property

// trigger
// { value: [''], name: '' }

const KeyOptionsName = {
  EVIDENCE: "Require Evidence",
  ACTION: "Require Action",
  NOTIFY: "Notify",
  ASK_QUESTION: "Ask Question",
};

const triggerActions = [
  KeyOptionsName?.ACTION,
  KeyOptionsName?.EVIDENCE,
  KeyOptionsName?.NOTIFY,
  KeyOptionsName.ASK_QUESTION,
];

const renderConditionDeafaultOptions: any = {
  multiple: ["is", "is not", "is selected", "is not selected", "is one of", "is not one of"],
  global: ["is", "is not", "is selected", "is not selected", "is one of", "is not one of"],
  internal: ["is", "is not", "is selected", "is not selected", "is one of", "is not one of"],
  TEMP_001: [""],
  CHECK_001: ["is checked", "is not checked"],
  TEXT_001: ["is", "is not"],
  SLID_001: [
    "less than",
    "less than or equal to",
    "equal to",
    "not equal to",
    "greater than or equal to",
    "is greater than",
    "between",
    "not between",
  ],
  NUM_001: [
    "less than",
    "less than or equal to",
    "equal to",
    "not equal to",
    "greater than or equal to",
    "is greater than",
    "between",
    "not between",
  ],
  SIGN_001: ["name is", "name is not", "exist", "does not exist"],
};

const ModalEvidenceConformation = ({
  values,
  setFieldValue,
  parentIndex,
  submitForm,
  openModal,
  setOpenModal,
}: any) => {
  let triggerValues = values?.logics?.[`${parentIndex}`]?.trigger || [];
  let [prevEvidences, setPrevEvidences] = useState<any>(
    triggerValues
      ?.find((item: any) => item?.name === KeyOptionsName?.EVIDENCE)
      ?.value?.filter((data: any) => Boolean(data)) || [],
  );

  const handleCheckboxes = ({ checked, key, action }: any) => {
    let prevValues: any = [...prevEvidences];
    let prevTriggerEvidenceValues: any = values?.logics?.[`${parentIndex}`]?.trigger.find(
      (item: any) => item?.name === KeyOptionsName?.EVIDENCE,
    );
    if (!action) {
      if (checked) {
        setPrevEvidences((prev: any) => [...prev, key]);
      } else {
        setPrevEvidences((prev: any) => prev?.filter((data: string) => data !== key));
      }
    } else if (action === "save") {
      prevTriggerEvidenceValues.value = prevValues;
    }
  };

  return (
    <ModalLayout
      id="EvidenceModal"
      children={
        <>
          <div className="config_modal_form_css user__department-field container__box-item">
            <div className="config_modal_heading">
              <div className="config_modal_title">Require Evidence</div>
              <div className="config_modal_text">
                <div>Choose the evidence that will be required when this answer is selected.</div>
              </div>
              <div className="box">
                <img src={EvidenceBlankIcon} alt="" />
                <span>If answer is not blank require</span>
              </div>
              <div className="form__control">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={prevEvidences.includes("notes") || false}
                      onChange={(e) => {
                        let checked = e.target.checked;
                        handleCheckboxes({ checked, key: "notes" });
                      }}
                    />
                  }
                  label="Notes"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={prevEvidences.includes("media") || false}
                      onChange={(e) => {
                        let checked = e.target.checked;
                        handleCheckboxes({ checked, key: "media" });
                      }}
                    />
                  }
                  label="Media"
                />
              </div>
              <div
                className="document_number_format_footer"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "1rem",
                }}
              >
                <Button
                  variant="outlined"
                  className="buttonContainer"
                  onClick={() => {
                    setOpenModal(false);
                    setPrevEvidences(
                      (prev: any) =>
                        triggerValues
                          ?.find((item: any) => item?.name === KeyOptionsName?.EVIDENCE)
                          ?.value?.filter((data: any) => Boolean(data)) || [],
                    );
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  className="buttonContainer"
                  onClick={() => {
                    setOpenModal(false);
                    handleCheckboxes({ action: "save" });
                    submitForm();
                  }}
                >
                  {" "}
                  Save & Apply
                </Button>
              </div>
            </div>
          </div>
        </>
      }
      openModal={openModal}
      setOpenModal={setOpenModal}
    />
  );
};

const ChipComponent = ({ onClick, onDelete }: any) => {};

const DynamicAdditionFormField = ({
  index,
  formikValues,
  remove,
  submitForm,
  createQuestion,
  renderConditionOption,
  logicOptions,
  selectField,
  dataItem,
}: any) => {
  const {
    selectedDataset,
    addTemplateQuestion,
    templateDatasets,
    updateTemplateDatasets,
    deleteTemplateContents,
    setTemplateDatasets,
    setLogicBlocks,
    activeLogicBlocks,
  } = useTemplateFieldsStore();
  const containerRef = useRef<any>(null);
  const [openModal, setOpenModal] = useState(true);
  const [enableInputBlankField, setEnableInputBlankField] = useState({
    first: false,
    second: false,
  });

  let { values, handleBlur, handleChange, setFieldValue } = formikValues;

  return (
    <div key={index} className="logic__section-block" ref={containerRef}>
      <Grid container spacing={2}>
        <Grid
          item
          xs={12}
          sx={{
            backgroundColor: "#F4F6FA;",
            paddingBottom: "15px",
            // marginLeft: '30px',
            marginTop: "10px",
          }}
        >
          <div className="text_answer_add_logic">
            <div className="text_answer_add_logic_inner">
              If the answer
              <Select
                className="logic__section-select"
                MenuProps={{
                  PaperProps: { style: { maxHeight: 200, maxWidth: 150 } },
                }}
                sx={{ width: "auto" }}
                id={`logics.${index}.condition`}
                size="small"
                fullWidth
                data-testid={`logics.${index}.condition`}
                autoComplete="off"
                disabled={false}
                name={`logics.${index}.condition`}
                value={`${values?.logics?.[`${index}`]?.condition}`}
                onChange={(e) => {
                  handleChange(e);
                  if (!["is one of", "is not one of"]?.includes(e.target.value)) {
                    if (Array.isArray(values?.logics?.[`${index}`]?.value)) {
                      values?.logics?.[`${index}`]?.value?.length > 0 &&
                        setFieldValue(
                          `logics.${index}.value`,
                          values?.logics?.[`${index}`]?.value?.[0],
                        );
                    }
                  } else {
                    setFieldValue(`logics.${index}.value`, [values?.logics?.[`${index}`]?.value]);
                  }
                  submitForm();
                }}
                onBlur={handleBlur}
              >
                {renderConditionOption?.map((item: any, index: number) => (
                  <MenuItem key={item} value={`${item}`}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
              {selectField ? (
                <>
                  {!["is selected", "is not selected"]?.includes(
                    values?.logics?.[`${index}`]?.condition,
                  ) && (
                    <Select
                      className="logic__section-select"
                      MenuProps={{
                        PaperProps: { style: { maxHeight: 200, maxWidth: 150 } },
                      }}
                      sx={{ width: "auto" }}
                      multiple={
                        ["is one of", "is not one of"]?.includes(
                          values?.logics?.[`${index}`]?.condition,
                        )
                          ? true
                          : false
                      }
                      id={`logics.${index}.value`}
                      size="small"
                      fullWidth
                      data-testid={`logics.${index}.value`}
                      autoComplete="off"
                      disabled={false}
                      name={`logics.${index}.value`}
                      value={
                        ["is one of", "is not one of"]?.includes(
                          values?.logics?.[`${index}`]?.condition,
                        )
                          ? Array.isArray(values?.logics?.[`${index}`]?.value)
                            ? values?.logics?.[`${index}`]?.value
                            : []
                          : values?.logics?.[`${index}`]?.value
                      }
                      displayEmpty
                      defaultValue={logicOptions?.[0]}
                      onChange={(e) => {
                        handleChange(e);
                        submitForm();
                      }}
                      renderValue={(selected) => {
                        return Array.isArray(selected) ? selected?.join(", ") : selected;
                      }}
                      onBlur={handleBlur}
                    >
                      {logicOptions?.map((item: any, idx: number) => (
                        <MenuItem key={item} value={`${item}`}>
                          {["is one of", "is not one of"]?.includes(
                            values?.logics?.[`${index}`]?.condition,
                          ) && (
                            <Checkbox
                              checked={values?.logics?.[`${index}`]?.value?.indexOf(item) > -1}
                            />
                          )}
                          {item}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                </>
              ) : (
                <>
                  <div
                    className="input__field-select"
                    onClick={() => {
                      setEnableInputBlankField((prev) => ({ ...prev, first: true }));
                    }}
                    style={{ marginRight: "4px" }}
                  >
                    {enableInputBlankField?.first ? (
                      <input
                        autoFocus
                        type="text"
                        disabled={!enableInputBlankField?.first}
                        id={`logics.${index}.value.[0]`}
                        name={`logics.${index}.value.[0]`}
                        value={values?.logics?.[`${index}`]?.value?.[0]}
                        onChange={(e: any) => {
                          handleChange(e);
                          submitForm();
                        }}
                        placeholder={"_blank"}
                        onBlur={() => {
                          setEnableInputBlankField((prev) => ({ ...prev, first: false }));
                        }}
                      />
                    ) : (
                      <span>
                        <span>
                          {values?.logics?.[`${index}`]?.value?.[0]
                            ? values?.logics?.[`${index}`]?.value?.[0]
                            : "blank"}
                        </span>
                        <DriveFileRenameOutlineIcon />
                      </span>
                    )}
                  </div>
                  {["between", "not between"]?.includes(values?.logics?.[`${index}`]?.condition) ? (
                    <>
                      and
                      <div
                        className="input__field-select"
                        onClick={() => {
                          setEnableInputBlankField((prev) => ({ ...prev, second: true }));
                        }}
                      >
                        {enableInputBlankField?.second ? (
                          <input
                            autoFocus
                            type="text"
                            disabled={!enableInputBlankField?.second}
                            id={`logics.${index}.value.[1]`}
                            name={`logics.${index}.value.[1]`}
                            value={values?.logics?.[`${index}`]?.value?.[1]}
                            onChange={(e: any) => {
                              handleChange(e);
                              submitForm();
                            }}
                            placeholder={"_blank"}
                            onBlur={() => {
                              setEnableInputBlankField((prev) => ({ ...prev, second: false }));
                            }}
                          />
                        ) : (
                          <span>
                            <span>
                              {values?.logics?.[`${index}`]?.value?.[1]
                                ? values?.logics?.[`${index}`]?.value?.[1]
                                : "blank"}
                            </span>
                            <DriveFileRenameOutlineIcon />
                          </span>
                        )}
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                </>
              )}
              then {/* <span onClick={handleMenuClickTrigger}>Trigger</span> */}
              <div className="logic__section-select select__box-trigger">
                <Select
                  className="logic__section-select"
                  MenuProps={{
                    PaperProps: { style: { maxHeight: 200, maxWidth: 150 } },
                  }}
                  sx={{ width: "auto" }}
                  id={`logics.${index}.trigger`}
                  size="small"
                  fullWidth
                  autoComplete="off"
                  disabled={false}
                  name={`logics.${index}.trigger`}
                  // value={values?.logic[`${index}`]?.value}
                  value={"+ trigger"}
                  onChange={(e: any) => {
                    e.stopPropagation();
                    let prevFormValues = { ...values };
                    let updatedValue: any = values?.logics?.[`${index}`]?.trigger
                      ? [...values?.logics?.[`${index}`]?.trigger]
                      : [];
                    let previousData: any = { ...values?.logics?.[`${index}`] };
                    if (!updatedValue.some((updated: any) => updated.name === e.target.value)) {
                      if (e.target.value === KeyOptionsName?.ASK_QUESTION) {
                        const uniqueId = createQuestion(values?.logics?.[`${index}`]?.id);
                        updatedValue?.push({
                          value: [uniqueId],
                          name: KeyOptionsName?.ASK_QUESTION,
                        });
                        previousData.linkQuestions = [...previousData?.linkQuestions, uniqueId];
                        submitForm();
                      } else if (e.target.value === KeyOptionsName?.ACTION) {
                        updatedValue.push({ value: ["Require Action"], name: e.target.value });
                      } else if (e.target.value === KeyOptionsName?.EVIDENCE) {
                        updatedValue.push({ value: [], name: e.target.value });
                        setOpenModal(true);
                        // return;
                      }
                    }

                    setFieldValue(`logics.${index}`, previousData);
                    setFieldValue(`logics.${index}.trigger`, updatedValue);
                    submitForm();
                  }}
                  onBlur={handleBlur}
                >
                  {triggerActions?.map((item: any, index: number) => (
                    <MenuItem key={item} value={`${item}`}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
                <span>
                  <span>+ Add Trigger</span>
                  <ExpandMoreIcon />
                </span>
              </div>
            </div>
            <div className="trigger_value">
              {values?.logics?.[`${index}`]?.trigger
                ? values?.logics?.[`${index}`]?.trigger.map((parentItem: any, i: number) => {
                    return (
                      <>
                        <div
                          key={i}
                          className="chip__container"
                          onClick={() => {
                            if (parentItem?.name === KeyOptionsName?.ASK_QUESTION) {
                              const uniqueId = createQuestion(values?.logics?.[`${index}`]?.id);
                              let prevTriggerQuestionValues: any = values?.logics?.[
                                `${index}`
                              ]?.trigger.find(
                                (item: any) => item?.name === KeyOptionsName?.ASK_QUESTION,
                              );
                              let previousQuestions = {
                                ...values?.logics?.[`${index}`],
                              };
                              prevTriggerQuestionValues?.value.push(uniqueId);
                              previousQuestions.linkQuestions = [
                                uniqueId,
                                ...(previousQuestions?.linkQuestions || []),
                              ];
                              setFieldValue(`logics.${index}`, previousQuestions);
                              submitForm();
                              // setActiveBlocksId({
                              //   blockId: selectedDataset?.id,
                              //   setLogicBlocks,
                              //   activeLogicBlocks,
                              //   logicBlockId: previousQuestions?.id,
                              //   linkQuestions: previousQuestions?.linkQuestions,
                              // });
                            } else if (parentItem?.name === KeyOptionsName?.EVIDENCE) {
                              setOpenModal(true);
                            }
                          }}
                        >
                          <span>{parentItem?.name}</span>
                          <span>
                            <CloseIcon
                              onClick={() => {
                                const newTriggerValue = values?.logics?.[
                                  `${index}`
                                ]?.trigger.filter(
                                  (item: any, i: any) => item?.name !== parentItem?.name,
                                );
                                if (parentItem?.name === KeyOptionsName?.ASK_QUESTION) {
                                  // remove from global store
                                  // const idToExclude = parentItem?.value;
                                  const idToExclude = values?.logics?.[`${index}`]?.linkQuestions;
                                  // updating in form
                                  setFieldValue(`logics.${index}.linkQuestions`, []);
                                  const filteredData = templateDatasets.filter(
                                    (obj: any) => !idToExclude.includes(obj?.id),
                                  );
                                  setTemplateDatasets(filteredData);
                                }
                                setFieldValue(`logics.${index}.trigger`, newTriggerValue);
                                submitForm();
                              }}
                            />
                          </span>
                          {/* <Chip
                          key={i}
                          label={parentItem?.name}
                          size="small"
                          variant="outlined"
                          className="new__chip"
                         
                        /> */}
                          {/* parentItem?.name === KeyOptionsName?.EVIDENCE && */}
                        </div>
                        {parentItem?.name === KeyOptionsName?.EVIDENCE && (
                          <ModalEvidenceConformation
                            values={values}
                            parentIndex={index}
                            setFieldValue={setFieldValue}
                            submitForm={submitForm}
                            openModal={openModal}
                            setOpenModal={setOpenModal}
                          />
                        )}
                      </>
                    );
                  })
                : ""}
            </div>
          </div>
        </Grid>
      </Grid>
      <button
        type="button"
        onClick={() => {
          let prevTemplateDatasets: any = [...templateDatasets];
          let linkQuestions = values?.logics[`${index}`]?.linkQuestions || [];
          setTemplateDatasets(
            prevTemplateDatasets?.filter(
              (templateData: any) => !linkQuestions?.includes(templateData?.id),
            ),
          );
          remove(index);
          submitForm();
        }}
      >
        Remove
      </button>
    </div>
  );
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function setActiveBlocksId({
  setLogicBlocks,
  blockId,
  linkQuestions,
  activeLogicBlocks,
  logicBlockId,
}: any) {
  let prevLogicBlocks: any = {
    ...activeLogicBlocks,
    [`${blockId}`]: { [`${logicBlockId}`]: [...linkQuestions] },
  };
  console.log("here");

  setLogicBlocks({ ...prevLogicBlocks });
}

// creating tabbed section and showing only active one
const TabbedFormikField = React.forwardRef((props: any, ref: any) => {
  let { values, createQuestion, addLogic, submitForm, dataItem, ...rest } = props;
  const [activeTab, setActiveTab] = useState(values?.logics?.[0]?.id);
  const [nextTabClicked, setNextTabClicked] = useState(false);
  const { setLogicBlocks, activeLogicBlocks, selectedDataset, updateTemplateDatasets } =
    useTemplateFieldsStore();

  useEffect(() => {
    if (nextTabClicked && activeTab) {
      setNextTabClicked(false);
      setActiveBlocksId({
        setLogicBlocks,
        activeLogicBlocks,
        blockId: selectedDataset?.id,
        logicBlockId: activeTab,
        linkQuestions: [],
      });
    }
  }, [nextTabClicked, activeTab]);

  return (
    <div className="logic__blocks">
      {values?.logics?.length ? <div className="color-pattern"></div> : <></>}
      <div className="logic__blocks-content">
        <div className="move__logic">
          {/* <div className=""> */}
          <Button
            type="button"
            variant="outlined"
            ref={ref}
            onClick={() => {
              const createdId = addLogic();
              setActiveTab(createdId);
              setNextTabClicked(true);
              // updateTemplateDatasets(dataItem|, 'required', checked);
              // setActiveBlocksId({
              //   setLogicBlocks,
              //   activeLogicBlocks,
              //   blockId: selectedDataset?.id,
              //   logicBlockId: createdId,
              //   linkQuestions: [],
              // });
              submitForm();
            }}
          >
            Add Logic
          </Button>
        </div>
        <div className={`${values?.logics?.length ? "logic__tab-container" : ""}`}>
          {values?.logics?.map((logic: any, index: number) => (
            <button
              key={logic?.id}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab(logic?.id);
                setActiveBlocksId({
                  setLogicBlocks,
                  activeLogicBlocks,
                  blockId: dataItem?.id,
                  logicBlockId: logic?.id,
                  linkQuestions:
                    [...(logic?.linkQuestions || []), values?.logics?.[`${index}`]?.id] || [],
                });
              }}
              className={activeTab === logic?.id ? "active" : ""}
            >
              {logic?.value}
            </button>
          ))}
        </div>
        {values?.logics?.map((item: any, index: number) => {
          return (
            <>
              {item?.id === activeTab ? (
                <DynamicAdditionFormField
                  {...rest}
                  key={index}
                  index={index}
                  item={item}
                  values={values}
                  createQuestion={() => createQuestion(item?.id)}
                  submitForm={submitForm}
                  dataItem={dataItem}
                />
              ) : (
                <></>
              )}
            </>
          );
        })}
      </div>
    </div>
  );
});

const ResponseInputLogic: any = React.forwardRef(({ responseTypeId, data, dataItem }: any, ref) => {
  let createGlobalLogicId = uuidv4();

  let { selectField, logicOptions } = dataItem;

  const {
    selectedDataset,
    addTemplateQuestion,
    templateDatasets,
    updateTemplateDatasets,
    deleteTemplateContents,
    setTemplateDatasets,
    setSelectedData,
  } = useTemplateFieldsStore();

  const parentData: any = templateDatasets?.find((data: any) => data?.id === dataItem?.parent);

  const renderConditionOption =
    renderConditionDeafaultOptions?.[
      `${
        parentData?.response_choice === "default"
          ? parentData?.response_type
          : parentData?.response_choice
      }`
    ];

  const [isAddLogicClicked, setIsAddLogicClicked] = React.useState<boolean>(false);

  const [initialValues, setInitialValues] = useState<any>({
    logics: [
      // {
      //   id: createGlobalLogicId,
      //   condition: '',
      //   value: '',
      //   trigger: [],
      //   linkQuestions: [],
      // },
    ],
  });

  const param = useParams();

  const { setRightSectionTabValue, selectedInputType, setSelectedInputId } = useTextAnswer();

  const textFieldStyle = {};

  function createQuestion(logicId?: string) {
    let uniqueId = uuidv4();
    addTemplateQuestion(dataItem, dataItem?.id, uniqueId, logicId);
    return uniqueId;
  }

  useEffect(() => {
    if (dataItem?.logics.length) {
      setInitialValues({ logics: dataItem?.logics || [] });
    }
  }, [dataItem]);
  return (
    <>
      <div
        onClick={(e: any) => {
          e.stopPropagation();
          setSelectedData?.(dataItem);
        }}
        className={`logic__container logic__container-body`}
      >
        <Formik
          key={responseTypeId}
          initialValues={initialValues}
          onSubmit={(values) => {
            if (selectedDataset.component === "logic") {
              updateTemplateDatasets(dataItem, "logics", values?.logics);
            } else {
              const selectLogic = templateDatasets.find(
                (lg: any) => lg.id === selectedDataset.logicId,
              );
              if (!selectLogic) return;
              updateTemplateDatasets(dataItem, "logics", values?.logics);
            }
          }}
          enableReinitialize={true}
        >
          {({ values, handleChange, handleBlur, setFieldValue, handleSubmit }: any) => {
            return (
              <>
                <Form className="logic__display-part">
                  <FieldArray name="logics">
                    {({ insert, remove, push }: any) => (
                      <>
                        <TabbedFormikField
                          logicOptions={logicOptions}
                          formikValues={{
                            values,
                            handleBlur,
                            handleChange,
                            setFieldValue,
                          }}
                          submitForm={handleSubmit}
                          renderConditionOption={renderConditionOption}
                          createQuestion={createQuestion}
                          remove={remove}
                          values={values}
                          selectField={selectField}
                          dataItem={dataItem}
                          addLogic={(e: any) => {
                            const newId = uuidv4();
                            push({
                              id: newId,
                              condition: renderConditionOption?.[0] || "",
                              trigger: [],
                              linkQuestions: [],
                              value: logicOptions?.[0] || [""],
                            });
                            return newId;
                          }}
                          ref={ref}
                        />
                      </>
                    )}
                  </FieldArray>
                </Form>
              </>
            );
          }}
        </Formik>
      </div>
    </>
  );
});

export default ResponseInputLogic;
