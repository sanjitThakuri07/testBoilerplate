import * as Yup from 'yup';
import {
  generateLogicConditionTriggerDataSet,
  findData,
  ParentPresentValidationLogic,
  IndividualValidationLogic,
  mediaValidationSchema,
  actionValidationSchema,
} from './keyValidationFunction';

import { validateInput, setSchema } from './inputLogicCheck';
import useApiOptionsStore from '../store/apiOptionsTemplateStore';

const YupTypeMap: any = {
  text: Yup.string(),
  email: Yup.string().email(),
  number: Yup.number(),
  boolean: Yup.boolean(),
  date: Yup.string(),
  object: Yup.object(),
  [`multiple-checkbox`]: Yup.array(),
  input: Yup.string(),
  multiple: Yup.array(),
  Array: Yup.array(),
  Question: Yup.string(),
  checkbox: Yup.boolean(),
  media: Yup.array(),
  // ref: Yup.ref(''),
  // lazy: Yup.lazy(),
};

const UpdateValidation = ({
  question,
  parentQuestions,
  dataSetSeperator,
  dataObj,
  schemaObject,
  key,
  subValidationObj,
  keyFields,
  initialValues,
  apiDatas,
}: any) => {
  //   let fieldSchema = YupTypeMap[question?.type];
  if (question.component === 'section') {
    const findChildren = dataSetSeperator?.logicQuestion?.filter((item: any) => {
      return question?.id === item?.parent;
    });

    if (!findChildren?.length) return;
    findChildren?.forEach((qn: any) => {
      UpdateValidation({
        question: qn,
        dataSetSeperator,
        dataObj,
        schemaObject,
        subValidationObj,
        key,
        keyFields,
        initialValues,
        apiDatas,
      });
    });
    // UpdateValidation({
    //   question,
    //   parentQuestions,
    //   dataSetSeperator,
    //   dataObj,
    //   schemaObject,
    //   key,
    //   subValidationObj,
    //   keyFields,
    //   initialValues,
    //   apiDatas,
    // });
    return;
  }

  let { multipleResponseData, options, globalResponseData }: any = apiDatas;

  let fieldSchema = YupTypeMap[question?.type] ? YupTypeMap[question?.type] : YupTypeMap['text'];
  // find logic of that question
  // in that logic we have linkQuestions
  const findLogic = dataSetSeperator?.logicDataSet?.find(
    (logic: any) => question?.logicId == logic.id,
  );

  if (findLogic) {
    if (findLogic?.required || question?.required) {
      fieldSchema = setSchema({ fieldSchema, question, logic: findLogic });
    }

    if (findLogic?.logics?.length >= 0) {
      let datas: any = {};

      (function generateDynamicValidation({
        parentQuestion,
        currentQuestion,
        logic,
        schemaObject,
        parentLogic,
        initialValues,
        apiDatas,
      }: any) {
        let subFieldSchema = YupTypeMap[question?.type]
          ? YupTypeMap[currentQuestion?.type]
          : YupTypeMap['text'];

        if (currentQuestion?.required || logic?.required) {
          subFieldSchema = setSchema({
            fieldSchema: subFieldSchema,
            question: currentQuestion,
          });
        }

        let ALL_OPTIONS: any = [];
        switch (findLogic?.logicApi?.response_choice) {
          case 'internal':
            ALL_OPTIONS = options?.[logic?.logicApi?.storeKey];
            break;
          case 'multiple':
            ALL_OPTIONS =
              multipleResponseData?.find((opt: any) => opt?.id === logic?.logicApi?.url)?.options ||
              [];
            break;
          case 'global':
            ALL_OPTIONS =
              globalResponseData?.find((opt: any) => opt?.id === logic?.logicApi?.url)?.options ||
              [];
            break;
          default:
            break;
        }

        const getLogicAndResponseSet = generateLogicConditionTriggerDataSet(
          logic?.logics,
          dataSetSeperator.logicQuestion,
        );

        if (parentQuestion?.id || parentLogic) {
          if (currentQuestion[`${key}`]) {
            const commonKeyName = `${keyFields
              ?.map((field: any) => currentQuestion?.[`${field}`])
              ?.join('__')}`;
            datas[`${commonKeyName}`] = {
              when: `${parentQuestion.label}`,
              self: 'isParent',
              linkQuestions: getLogicAndResponseSet.logicAndConditionTriggerDataSet.linkQuestions,
            };
            let parentKeyName = `${keyFields
              ?.map((field: any) => parentQuestion?.[`${field}`])
              ?.join('__')}`;

            schemaObject[
              `${currentQuestion?.[`${keyFields?.[0]}`]}__${currentQuestion?.[`${keyFields?.[1]}`]}`
            ] = Yup.object().when(
              `${initialValues?.[parentKeyName]?.keyName}.value`,
              (value, schema) => {
                const val = ParentPresentValidationLogic({
                  dataSetSeperator,
                  parentLogic,
                  value,
                  currentQuestion,
                  // allOptions: logic?.logicOptions,
                  allOptions: ALL_OPTIONS,
                });

                return Yup.object().shape({
                  value: val ? subFieldSchema : YupTypeMap[currentQuestion?.type || 'text'],
                  action: Yup.string().when('value', (value, schema) => {
                    let checkValue = IndividualValidationLogic({
                      value,
                      getLogicAndResponseSet,
                      fieldName: {
                        name: 'Require_Action',
                        value: 'Require Action',
                      },
                      // allOptions: logic?.logicOptions || [],
                      allOptions: ALL_OPTIONS,
                    });
                    return checkValue ? actionValidationSchema({}) : Yup.array();
                  }),
                  media: Yup.array().when('value', {
                    is: (value: any) => {
                      let checkValue = IndividualValidationLogic({
                        value,
                        getLogicAndResponseSet,
                        fieldName: {
                          name: 'Require_Evidence',
                          value: 'media',
                        },
                        // allOptions: logic?.logicOptions || [],
                        allOptions: ALL_OPTIONS,
                      });
                      return checkValue;
                    },
                    then: mediaValidationSchema({}),
                    // otherwise: Yup.string(),
                  }),
                  notes: Yup.string().when('value', (value, schema) => {
                    let checkValue = IndividualValidationLogic({
                      value,
                      getLogicAndResponseSet,
                      fieldName: {
                        name: 'Require Evidence',
                        value: 'notes',
                      },
                      // allOptions: logic?.logicOptions || [],
                      allOptions: ALL_OPTIONS,
                    });
                    return checkValue
                      ? Yup.string().required('Notes is a required field')
                      : Yup.string();
                  }),
                });
              },
            );
            if (datas[`${commonKeyName}`]?.linkQuestions) {
              datas[`${commonKeyName}`]?.linkQuestions?.map((question: any) => {
                // links question is in array
                // link question has the same parent but different condition
                // 1st step => convert the link question id into proper object
                // 2nd step => again loop through these data sets and find logic
                if (question?.length) {
                  question?.map((qn: any) => {
                    const qnLogic = dataSetSeperator?.logicDataSet?.find(
                      (logic: any) => qn?.logicId == logic.id,
                    );
                    if (!qnLogic) {
                      return;
                    }
                    generateDynamicValidation({
                      parentQuestion: currentQuestion,
                      currentQuestion: qn,
                      logic: qnLogic,
                      key,
                      schemaObject,
                      parentLogic: logic,
                      initialValues,
                      apiDatas,
                    });
                  });
                }
              });
            }
          }
        } else {
          if (currentQuestion[`${key}`]) {
            const commonKeyName = `${keyFields
              ?.map((field: any) => currentQuestion?.[`${field}`])
              ?.join('__')}`;

            datas[`${commonKeyName}`] = {
              when: `${parentQuestion?.[`${key}`]}`,
              self: 'called',
              linkQuestions: getLogicAndResponseSet.logicAndConditionTriggerDataSet.linkQuestions,
            };

            schemaObject[
              `${currentQuestion?.[`${keyFields?.[0]}`]}__${currentQuestion?.[`${keyFields?.[1]}`]}`
            ] = Yup.object().shape({
              value: fieldSchema,
              action: Yup.string().when('value', (value, schema) => {
                let checkValue = IndividualValidationLogic({
                  value,
                  getLogicAndResponseSet,
                  fieldName: {
                    name: 'Require_Action',
                    value: 'Require Action',
                  },
                  // allOptions: logic?.logicOptions || [],
                  allOptions: ALL_OPTIONS,
                });

                return checkValue ? actionValidationSchema({}) : Yup.array();
              }),
              media: Yup.array().when('value', {
                is: (value: any) => {
                  let checkValue = IndividualValidationLogic({
                    value,
                    getLogicAndResponseSet,
                    fieldName: {
                      name: 'Require_Evidence',
                      value: 'media',
                    },
                    // allOptions: logic?.logicOptions || [],
                    allOptions: ALL_OPTIONS,
                  });
                  return checkValue;
                },
                then: mediaValidationSchema({}),
                // otherwise: Yup.string(),
              }),
              notes: Yup.string().when('value', (value, schema) => {
                let checkValue = IndividualValidationLogic({
                  value,
                  getLogicAndResponseSet,
                  fieldName: {
                    name: 'Require_Evidence',
                    value: 'notes',
                  },
                  // allOptions: logic?.logicOptions || [],
                  allOptions: ALL_OPTIONS,
                });
                return checkValue
                  ? Yup.string().required('Notes is a required field')
                  : Yup.string();
              }),
            });

            if (datas[`${commonKeyName}`]?.linkQuestions) {
              datas[`${commonKeyName}`].linkQuestions?.map((question: any) => {
                // links question is in array
                // link question has the same parent but different condition
                // 1st step => convert the link question id into proper object
                // 2nd step => again loop through these data sets and find logic
                if (question?.length) {
                  question.map((qn: any) => {
                    const qnLogic = dataSetSeperator?.logicDataSet?.find(
                      (logic: any) => qn?.logicId == logic.id,
                    );
                    if (!qnLogic) {
                      return;
                    }

                    generateDynamicValidation({
                      parentQuestion: currentQuestion,
                      currentQuestion: qn,
                      logic: qnLogic,
                      key,
                      schemaObject,
                      parentLogic: logic,
                      initialValues,
                      apiDatas: apiDatas,
                    });
                  });
                }
              });
            }
          }
        }
      })({
        currentQuestion: question,
        logic: findLogic,
        key,
        schemaObject,
        parentQuestion: null,
        initialValues,
        apiDatas: apiDatas,
      });
    } else {
      if (findLogic?.required || question?.required) {
        fieldSchema = fieldSchema.required('This field is required');
      }

      if (!parentQuestions) {
        schemaObject[`${keyFields?.map((field: any) => question?.[`${field}`])?.join('__')}`] =
          Yup.object().shape({
            value: fieldSchema,
          });
      } else {
        schemaObject[`${keyFields?.map((field: any) => question?.[`${field}`])?.join('__')}`] =
          Yup.object().shape({
            value: fieldSchema,
          });
      }
    }
  }
};

export const DynamicSchemaGenerator = ({
  questions,
  key = 'question',
  dataSetSeperator,
  keyFields,
  initialValues,
}: any) => {
  const {
    multipleResponseData,
    fetchMultipleResponseData,
    fetchGlobalResponseData,
    fetchInternalResponseData,
    internalResponseData: options,
    globalResponseData,
  }: any = useApiOptionsStore();

  let schemaObject: any = {};
  let subValidationObj: any = {};
  let dataObj: any = {};
  questions.forEach((question: any) => {
    UpdateValidation({
      question,
      dataSetSeperator,
      dataObj,
      schemaObject,
      subValidationObj,
      key,
      keyFields,
      initialValues,
      apiDatas: {
        multipleResponseData,
        options,
        globalResponseData,
      },
    });
  });
  return Yup.object().shape(schemaObject);
};

//  requirement
//  parent question => logic => action, evidence, question
// action, evidence => required => parent, children question
// logic => parent question => required => chindren question => validation do not run
// question => null => children
//  is => apple => linkQuestion
// is not => apple =>
