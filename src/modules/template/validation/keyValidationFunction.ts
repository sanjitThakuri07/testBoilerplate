import { validateInput } from './inputLogicCheck';
import * as Yup from 'yup';

export const findData = (dataset: any, value: any, key: string) => {
  return dataset?.find((data: any) => data?.[key] === value) || {};
};

export const generateLogicConditionTriggerDataSet = (logics: any, dataset: any) => {
  let getter = {};
  const logicAndConditionTriggerDataSet = logics?.reduce(
    (acc: any, curr: any) => {
      acc.logic?.push(curr?.value);
      acc.condition?.push(curr?.condition);
      acc.linkQuestions?.push(
        curr?.linkQuestions.map((question: any) => findData(dataset, question, 'id')),
      );

      if (curr?.trigger && curr?.id) {
        const triggers = curr?.trigger.reduce((acc: any, curr: any) => {
          if (curr?.name) {
            acc[`${curr?.name?.toString()?.split(' ').join('_')}`] = curr?.value;
          }
          return acc;
        }, {});
        acc?.trigger?.push(triggers);
      }
      return acc;
    },
    { logic: [], condition: [], trigger: [], linkQuestions: [] },
  );
  const responseSet = logicAndConditionTriggerDataSet?.condition.reduce(
    (acc: any, curr: any, index: number) => {
      let keyName = '';
      if (Array.isArray(logicAndConditionTriggerDataSet?.logic?.[index])) {
        if (logicAndConditionTriggerDataSet?.logic?.[index]?.[0] instanceof Object) {
          keyName = logicAndConditionTriggerDataSet?.logic?.[index]?.[0]?.id;
        } else {
          keyName = logicAndConditionTriggerDataSet?.logic?.[index]?.[0];
        }
      } else if (logicAndConditionTriggerDataSet?.logic?.[index] instanceof Object) {
        keyName = logicAndConditionTriggerDataSet?.logic?.[index]?.id;
      }
      acc[`${curr}__${keyName}`] = {
        ...acc?.[`${curr}__${logicAndConditionTriggerDataSet?.logic?.[index]}`],
        trigger: logicAndConditionTriggerDataSet?.trigger?.[index],
        condition: curr,
        logic: logicAndConditionTriggerDataSet?.logic?.[index],
      };

      return acc;
    },
    {},
  );

  return (getter = { logicAndConditionTriggerDataSet, responseSet });
};

export const ParentPresentValidationLogic = ({
  dataSetSeperator,
  parentLogic,
  value,
  currentQuestion,
  allOptions,
}: any) => {
  let userValueStatus: any = { linkQuestions: [] };
  if (parentLogic) {
    const getParentLogicResponseSet = generateLogicConditionTriggerDataSet(
      parentLogic?.logics,
      dataSetSeperator?.logicQuestion,
    );

    for (
      let i = 0;
      i < getParentLogicResponseSet?.logicAndConditionTriggerDataSet?.logic?.length;
      i++
    ) {
      const userValue = validateInput({
        operator: getParentLogicResponseSet?.logicAndConditionTriggerDataSet?.condition[i],
        userInput: value,
        authorizedValues: Array.isArray(
          getParentLogicResponseSet?.logicAndConditionTriggerDataSet?.logic?.[i],
        )
          ? getParentLogicResponseSet?.logicAndConditionTriggerDataSet?.logic?.[i]
          : [getParentLogicResponseSet?.logicAndConditionTriggerDataSet?.logic?.[i]],
        allOptions,
      });
      if (userValue) {
        const renderCondition =
          getParentLogicResponseSet?.responseSet[
            getParentLogicResponseSet?.logicAndConditionTriggerDataSet?.condition[i]
          ];
        userValueStatus.linkQuestions.push(
          ...getParentLogicResponseSet?.logicAndConditionTriggerDataSet?.linkQuestions?.[i],
        );
      } else {
        // userValueStatus = { linkQuestions: [] };
      }
    }
  }

  const checkValue = userValueStatus?.linkQuestions?.some((qn: any) => {
    return qn?.id == currentQuestion?.id;
  });

  return checkValue;
};

export const IndividualValidationLogic = ({
  getLogicAndResponseSet,
  fieldName,
  value,
  allOptions,
}: any) => {
  let userValueStatus: any = [];
  for (
    let i = 0;
    i <= getLogicAndResponseSet?.logicAndConditionTriggerDataSet?.logic?.length;
    i++
  ) {
    const userValue = validateInput({
      operator: getLogicAndResponseSet?.logicAndConditionTriggerDataSet?.condition[i],
      userInput: value,
      authorizedValues: Array.isArray(
        getLogicAndResponseSet?.logicAndConditionTriggerDataSet?.logic?.[i],
      )
        ? getLogicAndResponseSet?.logicAndConditionTriggerDataSet?.logic?.[i]
        : [getLogicAndResponseSet?.logicAndConditionTriggerDataSet?.logic?.[i]],
      allOptions,
    });
    if (userValue && fieldName?.name) {
      let keyName = '';
      if (Array.isArray(getLogicAndResponseSet?.logicAndConditionTriggerDataSet?.logic[i])) {
        if (
          getLogicAndResponseSet?.logicAndConditionTriggerDataSet?.logic[i]?.[0] instanceof Object
        ) {
          keyName = getLogicAndResponseSet?.logicAndConditionTriggerDataSet?.logic[i]?.[0]?.id;
        } else {
          keyName = getLogicAndResponseSet?.logicAndConditionTriggerDataSet?.logic[i]?.[0];
        }
      } else if (
        getLogicAndResponseSet?.logicAndConditionTriggerDataSet?.logic[i] instanceof Object
      ) {
        keyName = getLogicAndResponseSet?.logicAndConditionTriggerDataSet?.logic[i]?.id;
      }

      const renderCondition =
        getLogicAndResponseSet?.responseSet[
          `${getLogicAndResponseSet?.logicAndConditionTriggerDataSet?.condition[i]}__${keyName}`
        ];
      userValueStatus.push(...(renderCondition?.trigger?.[`${fieldName?.name}`] || []));
    } else {
    }
  }
  if (fieldName) {
    const checkValue = userValueStatus?.includes(fieldName?.value);
    return checkValue;
  } else {
    return false;
  }
};

interface MediaTypeProps {
  maxLength?: number;
}

// action array validation
export const actionValidationSchema = ({ maxLength }: any) => {
  return Yup.array().test({
    name: 'at-least-one',
    message: (value: any) => {
      return `You need to create atleast one activity`;
    },
    test: (value: any) => {
      return value && value.length > 0;
    },
  });
};

// property validation
export const mediaValidationSchema = ({ maxLength }: MediaTypeProps) => {
  return Yup.array()
    .of(
      Yup.object().shape({
        documents: Yup.array()
          .of(Yup.string())
          .test({
            name: 'at-least-one',
            message: ({ value }: any) => {
              if (maxLength) {
                return value?.length > Number(maxLength)
                  ? `You can not upload more than ${maxLength} media files`
                  : '';
              } else {
                return 'You need to upload atleast one media';
              }
            },
            test: (value: any) => {
              if (maxLength) {
                return value && value.length > 0 && value.length <= Number(maxLength);
              }
              return value && value.length > 0;
            },
          }),
        title: Yup.string(),
      }),
    )
    .test({
      name: 'at-least-one',
      message: 'You need to upload atleast one media',
      test: (value: any) => {
        return value && value.length > 0;
      },
    });
};

// action: Yup.string().when('value', (value, schema) => {
//   let checkValue = IndividualValidationLogic({
//     value,
//     getLogicAndResponseSet,
//     fieldName: {
//       name: 'Require_Action',
//       value: 'Require Action',
//     },
//     allOptions: logic?.logicOptions || [],
//   });
//   return checkValue
//     ? Yup.string().required('You need to create an action')
//     : Yup.string();
// }),
