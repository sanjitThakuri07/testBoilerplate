import { useTextAnswer } from 'globalStates/templates/TextAnswer';
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
} from '@mui/material';
import React, { FC, MouseEvent, useEffect, useState, useRef } from 'react';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import AddIcon from '@mui/icons-material/Add';
import ModalLayout from 'components/ModalLayout';
import { useTemplateFieldsStore } from 'containers/template/store/templateFieldsStore';
import { Field, FieldArray, Form, Formik } from 'formik';
import { v4 as uuidv4 } from 'uuid';
import EvidenceBlankIcon from 'assets/icons/Evidence__blank.svg';
import './responseInputLogic.scss';
import { Diversity2 } from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useParams } from 'react-router-dom';
import { jaJP } from '@mui/x-data-grid';

type ResponseInputLogicProps = {
  responseTypeId?: any;
  logicOptions?: any;
  data?: any;
  renderConditionOption: any;
  selectField: boolean;
};

// logic options takes in object that has options field with array of objects containing name as a key property

// trigger
// { value: [''], name: '' }

const KeyOptionsName = {
  EVIDENCE: 'Require Evidence',
  ACTION: 'Require Action',
  NOTIFY: 'Notify',
  ASK_QUESTION: 'Ask Question',
};

const triggerActions = [
  KeyOptionsName?.ACTION,
  KeyOptionsName?.EVIDENCE,
  KeyOptionsName?.NOTIFY,
  KeyOptionsName.ASK_QUESTION,
];

const ModalEvidenceConformation = ({
  values,
  setFieldValue,
  parentIndex,
  submitForm,
  openModal,
  setOpenModal,
}: any) => {
  let triggerValues = values?.logic?.logics?.[`${parentIndex}`]?.trigger || [];
  let [prevEvidences, setPrevEvidences] = useState<any>(
    triggerValues
      ?.find((item: any) => item?.name === KeyOptionsName?.EVIDENCE)
      ?.value?.filter((data: any) => Boolean(data)) || [],
  );

  const handleCheckboxes = (checked: boolean, key: string) => {
    let prevValues: any = [...prevEvidences];
    let prevTriggerEvidenceValues: any = values?.logic?.logics?.[`${parentIndex}`]?.trigger.find(
      (item: any) => item?.name === KeyOptionsName?.EVIDENCE,
    );
    if (checked) {
      setPrevEvidences((prev: any) => [...prev, key]);
      prevValues.push(key);
      prevTriggerEvidenceValues.value = prevValues;
      setFieldValue();
    } else {
      setPrevEvidences((prev: any) => prev?.filter((data: string) => data !== key));
      const updatedData = prevValues?.filter((data: string) => data !== key);
      prevTriggerEvidenceValues.value = updatedData;
    }
  };

  return (
    <ModalLayout
      id="MCRModal"
      children={
        <>
          <div className="config_modal_form_css user__department-field">
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
                      checked={prevEvidences.includes('notes') || false}
                      onChange={(e) => {
                        let checked = e.target.checked;
                        handleCheckboxes(checked, 'notes');
                      }}
                    />
                  }
                  label="Notes"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={prevEvidences.includes('media') || false}
                      onChange={(e) => {
                        let checked = e.target.checked;
                        handleCheckboxes(checked, 'media');
                      }}
                    />
                  }
                  label="Media"
                />
              </div>
              <div
                className="document_number_format_footer"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '1rem',
                }}>
                <Button
                  variant="outlined"
                  className="buttonContainer"
                  onClick={() => setOpenModal(false)}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  className="buttonContainer"
                  onClick={() => {
                    submitForm();
                  }}>
                  {' '}
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

const DynamicAdditionFormField = ({
  index,
  formikValues,
  isAddLogicClicked,
  remove,
  submitForm,
  createQuestion,
  renderCondition,
  logicOptions,
  selectField,
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
  const [enableInputBlankField, setEnableInputBlankField] = useState(false);

  let { values, handleBlur, handleChange, setFieldValue } = formikValues;

  return (
    <div key={index} className="logic__section-block" ref={containerRef}>
      <Grid container spacing={2}>
        {isAddLogicClicked && (
          <Grid
            item
            xs={12}
            sx={{
              backgroundColor: '#F4F6FA;',
              paddingBottom: '15px',
              marginLeft: '30px',
              marginTop: '10px',
            }}>
            <div className="text_answer_add_logic">
              <div className="text_answer_add_logic_inner">
                If the answer
                <Select
                  className="logic__section-select"
                  MenuProps={{
                    PaperProps: { style: { maxHeight: 200, maxWidth: 150 } },
                  }}
                  sx={{ width: 'auto' }}
                  id={`logic.logics.${index}.condition`}
                  size="small"
                  fullWidth
                  data-testid={`logic.logics.${index}.condition`}
                  autoComplete="off"
                  disabled={false}
                  name={`logic.logics.${index}.condition`}
                  value={`${values?.logic?.logics?.[`${index}`]?.condition}`}
                  onChange={(e) => {
                    handleChange(e);
                    submitForm();
                  }}
                  onBlur={handleBlur}>
                  {renderCondition?.map((item: any, index: number) => (
                    <MenuItem key={item} value={`${item}`}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
                {selectField ? (
                  <Select
                    className="logic__section-select"
                    MenuProps={{
                      PaperProps: { style: { maxHeight: 200, maxWidth: 150 } },
                    }}
                    sx={{ width: 'auto' }}
                    id={`logic.logics.${index}.value`}
                    size="small"
                    fullWidth
                    data-testid={`logic.logics.${index}.value`}
                    autoComplete="off"
                    disabled={false}
                    name={`logic.logics.${index}.value`}
                    value={values?.logic?.logics?.[`${index}`]?.value}
                    displayEmpty
                    defaultValue={logicOptions?.options?.[0]?.name}
                    onChange={(e) => {
                      handleChange(e);
                      submitForm();
                    }}
                    onBlur={handleBlur}>
                    {logicOptions?.options?.map((item: any, index: number) => (
                      <MenuItem key={item?.name} value={`${item?.name}`}>
                        {item?.name}
                      </MenuItem>
                    ))}
                  </Select>
                ) : (
                  <div
                    className="input__field-select"
                    onClick={() => {
                      setEnableInputBlankField(true);
                    }}>
                    {enableInputBlankField ? (
                      <input
                        autoFocus
                        type="text"
                        disabled={!enableInputBlankField}
                        id={`logic.logics.${index}.value`}
                        name={`logic.logics.${index}.value`}
                        value={values?.logic?.logics?.[`${index}`]?.value}
                        onChange={handleChange}
                        placeholder={'_blank'}
                        onBlur={() => {
                          setEnableInputBlankField(false);
                        }}
                      />
                    ) : (
                      <span>
                        <span>
                          {values?.logic?.logics?.[`${index}`]?.value
                            ? values?.logic?.logics?.[`${index}`]?.value
                            : 'blank'}
                        </span>
                        <DriveFileRenameOutlineIcon />
                      </span>
                    )}
                  </div>
                )}
                then{' '}
                <div className="trigger_value">
                  {values?.logic?.logics?.[`${index}`]?.trigger
                    ? values?.logic?.logics?.[`${index}`]?.trigger.map(
                        (parentItem: any, i: number) => {
                          return (
                            <>
                              <Chip
                                label={parentItem?.name}
                                size="small"
                                sx={{
                                  border: 'none',
                                  marginLeft: '5px',
                                  transform: 'scale(0.9)',
                                  backgroundColor: '#FFFAEB',
                                  color: '#B14608',
                                }}
                                variant="outlined"
                                onClick={() => {
                                  if (parentItem?.name === KeyOptionsName?.ASK_QUESTION) {
                                    const uniqueId = createQuestion();
                                    let prevTriggerQuestionValues: any = values?.logic?.logics?.[
                                      `${index}`
                                    ]?.trigger.find(
                                      (item: any) => item?.name === KeyOptionsName?.ASK_QUESTION,
                                    );
                                    prevTriggerQuestionValues?.value.push(uniqueId);
                                    let previousQuestions = {
                                      ...values?.logic?.logics?.[`${index}`],
                                    };
                                    prevTriggerQuestionValues?.value.push(uniqueId);
                                    previousQuestions.linkQuestions.push(uniqueId);
                                    setFieldValue(`logic.logics.${index}`, previousQuestions);
                                    setActiveBlocksId({
                                      blockId: selectedDataset?.id,
                                      setLogicBlocks,
                                      activeLogicBlocks,
                                      logicBlockId: previousQuestions?.id,
                                      linkQuestions: previousQuestions?.linkQuestions,
                                    });
                                  } else if (parentItem?.name === KeyOptionsName?.EVIDENCE) {
                                    setOpenModal(true);
                                  }
                                }}
                                onDelete={() => {
                                  const newTriggerValue = values?.logic?.logics?.[
                                    `${index}`
                                  ]?.trigger.filter(
                                    (item: any, i: any) => item?.name !== parentItem?.name,
                                  );
                                  if (parentItem?.name === KeyOptionsName?.ASK_QUESTION) {
                                    // remove from global store
                                    const idToExclude = parentItem?.value;
                                    const filteredData = templateDatasets.filter(
                                      (obj: any) => !idToExclude.includes(obj?.id),
                                    );
                                    setTemplateDatasets(filteredData);
                                  }
                                  setFieldValue(`logic.logics.${index}.trigger`, newTriggerValue);
                                }}
                              />
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
                        },
                      )
                    : ''}
                </div>
                {/* <span onClick={handleMenuClickTrigger}>Trigger</span> */}
              </div>
              <div className="logic__section-select select__box-trigger">
                <Select
                  className="logic__section-select"
                  MenuProps={{
                    PaperProps: { style: { maxHeight: 200, maxWidth: 150 } },
                  }}
                  sx={{ width: 'auto' }}
                  id={`logic.logics.${index}.trigger`}
                  size="small"
                  fullWidth
                  autoComplete="off"
                  disabled={false}
                  name={`logic.logics.${index}.trigger`}
                  // value={values?.logic[`${index}`]?.value}
                  value={'+ trigger'}
                  onChange={(e) => {
                    let prevFormValues = { ...values };
                    let updatedValue: any = values?.logic?.logics?.[`${index}`]?.trigger
                      ? [...values?.logic?.logics?.[`${index}`]?.trigger]
                      : [];
                    let previousData: any = {
                      ...values?.logic?.logics?.[`${index}`],
                    };
                    if (!updatedValue.some((updated: any) => updated.name === e.target.value)) {
                      if (e.target.value === KeyOptionsName?.ASK_QUESTION) {
                        const uniqueId = createQuestion();
                        updatedValue?.push({
                          value: [uniqueId],
                          name: KeyOptionsName?.ASK_QUESTION,
                        });
                        setActiveBlocksId({
                          blockId: selectedDataset?.id,
                          setLogicBlocks,
                          activeLogicBlocks,
                          logicBlockId: previousData?.id,
                          linkQuestions: [uniqueId],
                        });
                        previousData?.linkQuestions.push(uniqueId);
                      } else {
                        updatedValue.push({
                          value: [''],
                          name: e.target.value,
                        });
                      }
                    }

                    if (e.target.value === KeyOptionsName?.EVIDENCE) {
                      setOpenModal(true);
                    }
                    // prevFormValues.logic =
                    // setFieldValue();
                    // previousData.logicQuestion
                    setFieldValue(`logic.logics.${index}`, previousData);
                    setFieldValue(`logic.logics.${index}.trigger`, updatedValue);

                    submitForm();
                  }}
                  onBlur={handleBlur}>
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
          </Grid>
        )}
      </Grid>
      <button
        type="button"
        onClick={() => {
          remove(index);
          submitForm();
          let prevTemplateDatasets: any = [...templateDatasets];
          let linkQuestions = values?.logic?.logics[`${index}`]?.linkQuestions || [];
          setTemplateDatasets(
            prevTemplateDatasets?.filter(
              (templateData: any) => !linkQuestions?.includes(templateData?.id),
            ),
          );
        }}>
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

  setLogicBlocks({ ...prevLogicBlocks });
}

// creating tabbed section and showing only active one
const TabbedFormikField = (props: any) => {
  let { values, createQuestion, isAddLogicClicked, addLogic, submitForm, ...rest } = props;
  const [activeTab, setActiveTab] = useState(values?.logic?.logics?.[0]?.id);
  const [nextTabClicked, setNextTabClicked] = useState(false);
  const { setLogicBlocks, activeLogicBlocks, selectedDataset } = useTemplateFieldsStore();

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
      submitForm();
    }
  }, [nextTabClicked, activeTab]);
  return (
    <>
      {!!isAddLogicClicked && (
        <div className="logic__tab-container">
          {values?.logic?.logics?.map((logic: any, index: number) => (
            <button
              key={logic?.id}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab(logic?.id);
                setActiveBlocksId({
                  setLogicBlocks,
                  activeLogicBlocks,
                  blockId: selectedDataset?.id,
                  logicBlockId: logic?.id,
                  linkQuestions: logic?.linkQuestions || [],
                });
              }}
              className={activeTab === logic?.id ? 'active' : ''}>
              {logic?.value}
            </button>
          ))}
        </div>
      )}
      {values?.logic?.logics?.map((item: any, index: number) => {
        return (
          <>
            {item?.id === activeTab ? (
              <DynamicAdditionFormField
                {...rest}
                key={index}
                index={index}
                item={item}
                values={values}
                isAddLogicClicked={isAddLogicClicked}
                createQuestion={() => createQuestion(item?.id)}
                submitForm={submitForm}
              />
            ) : (
              <></>
            )}
          </>
        );
      })}
      <button
        type="button"
        onClick={() => {
          const createdId = addLogic();
          setActiveTab(createdId);
          setNextTabClicked(true);

          // setActiveBlocksId({
          //   setLogicBlocks,
          //   activeLogicBlocks,
          //   blockId: selectedDataset?.id,
          //   logicBlockId: createdId,
          //   linkQuestions: [],
          // });
          // submitForm();
        }}>
        Add Logic
      </button>
    </>
  );
};

const ResponseInputLogic: FC<ResponseInputLogicProps> = ({
  responseTypeId,
  logicOptions,
  data,
  renderConditionOption,
  selectField,
}) => {
  const [isAddLogicClicked, setIsAddLogicClicked] = React.useState<boolean>(false);
  const [renderCondition, setRenderCondition] = useState<any>(renderConditionOption);
  let createGlobalLogicId = uuidv4();

  const [initialValues, setInitialValues] = useState<any>({
    logic: {
      required: false,
      multipleSelection: false,
      flaggedResponse: [],
      logics: [
        {
          id: createGlobalLogicId,
          condition: '',
          value: '',
          trigger: [],
          logicQuestions: [],
        },
      ],
    },
  });
  const param = useParams();
  const {
    selectedDataset,
    addTemplateQuestion,
    templateDatasets,
    updateTemplateDatasets,
    deleteTemplateContents,
    setTemplateDatasets,
  } = useTemplateFieldsStore();
  const { setRightSectionTabValue, selectedInputType, setSelectedInputId } = useTextAnswer();

  const textFieldStyle = {};

  function createQuestion(logicId?: string) {
    let uniqueId = uuidv4();
    addTemplateQuestion(selectedDataset, selectedDataset?.id, uniqueId, logicId);
    return uniqueId;
  }

  useEffect(() => {
    if (responseTypeId) {
      let logic = {
        required: false,
        multipleSelection: false,
        flaggedResponse: [],
        logics: [
          {
            condition: '',
            value: '',
            trigger: [],
            linkQuestions: [],
          },
        ],
      };
      setInitialValues(() => ({
        logic: {
          required: false,
          multipleSelection: false,
          flaggedResponse: [],
          logics: [
            {
              id: createGlobalLogicId,
              condition: renderCondition?.[0] || '',
              value: selectField ? logicOptions?.options?.[0]?.name : '',
              trigger: [],
              linkQuestions: [],
            },
          ],
        },
      }));
      updateTemplateDatasets(selectedDataset, 'logic', logic);
    }
  }, [responseTypeId]);

  useEffect(() => {
    if (param?.templateId) {
      setInitialValues({ logic: data?.logic });
    }
  }, [param?.templateId]);

  return (
    <>
      <div className="addLogic_button">
        <Button
          variant="outlined"
          onClick={() => {
            setIsAddLogicClicked(!isAddLogicClicked);
          }}>
          {isAddLogicClicked ? 'Hide ' : 'Show '}
          Logic
        </Button>
      </div>
      <Formik
        key={responseTypeId}
        initialValues={initialValues}
        onSubmit={(values) => {
          updateTemplateDatasets(selectedDataset, 'logic', values?.logic);
        }}
        enableReinitialize={true}>
        {({ values, handleChange, handleBlur, setFieldValue, submitForm }: any) => {
          return (
            <Form className="logic__display-part">
              <div className="heading__options">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={values?.logic?.required || false}
                      onChange={(e) => {
                        let checked = e.target.checked;
                        setFieldValue(`logic.required`, checked);
                      }}
                      value={values?.logic?.required}
                    />
                  }
                  label="Required"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={values?.logic?.multipleSelection || false}
                      onChange={(e) => {
                        let checked = e.target.checked;
                        setFieldValue(`logic.multipleSelection`, checked);
                      }}
                      value={values?.logic?.multipleSelection}
                    />
                  }
                  label="Multiple Selection"
                />
                {/* flagged response */}
                <div style={{ overflow: 'hidden' }}>
                  <FormControl sx={{ m: 1, width: 300 }}>
                    <InputLabel id="demo-multiple-checkbox-label">Flagged Response</InputLabel>
                    <Select
                      labelId="demo-multiple-checkbox-label"
                      id="demo-multiple-checkbox"
                      className="multiple__checkbox"
                      multiple
                      value={values?.logic?.flaggedResponse || []}
                      onChange={(event: any) => {
                        const {
                          target: { value },
                        } = event;
                        let newValue = typeof value === 'string' ? value.split(',') : value;
                        setFieldValue(`logic.flaggedResponse`, newValue);
                        submitForm();
                      }}
                      input={<OutlinedInput label="Flagged Response" />}
                      renderValue={(selected) => selected.join(', ')}
                      MenuProps={MenuProps}>
                      {logicOptions?.options?.map((item: any) => (
                        <MenuItem
                          key={item?.name}
                          value={item?.name}
                          className="menu__options-logic">
                          <Checkbox
                            checked={values?.logic?.flaggedResponse?.indexOf(item?.name) > -1}
                          />
                          <ListItemText primary={item?.name} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </div>
              <FieldArray name="logic.logics">
                {({ insert, remove, push }: any) => (
                  <>
                    <TabbedFormikField
                      logicOptions={logicOptions}
                      isAddLogicClicked={isAddLogicClicked}
                      formikValues={{
                        values,
                        handleBlur,
                        handleChange,
                        setFieldValue,
                      }}
                      submitForm={submitForm}
                      renderCondition={renderCondition}
                      createQuestion={createQuestion}
                      remove={remove}
                      selectField={selectField}
                      values={values}
                      addLogic={(e: any) => {
                        const newId = uuidv4();
                        push({
                          id: newId,
                          condition: renderCondition?.[0] || '',
                          value: selectField ? logicOptions?.options?.[0]?.name : '',
                          trigger: [],
                          linkQuestions: [],
                        });
                        return newId;
                      }}
                    />
                  </>
                )}
              </FieldArray>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default ResponseInputLogic;
