interface validateInputProps {
  operator: String;
  userInput: any;
  authorizedValues: any;
  allOptions?: any;
}

export const errorValue = ['value', 'media', 'notes', 'action'];

function checkBetweenOrNot({ value, authorizedRange, checkFor }: any) {
  let [val1, val2] = authorizedRange;
  if (Number(val1) > Number(val2)) {
    [val1, val2] = [val2, val1];
  }

  if (checkFor === 'not__between') {
    // not between
    return Number(value) <= Number(val1) || Number(value) >= Number(val2);
  } else {
    // between
    return Number(value) > Number(val1) && Number(value) < Number(val2);
  }
}

export function validateInput({
  operator,
  userInput = '',
  authorizedValues = [''],
  allOptions,
}: validateInputProps) {
  switch (operator) {
    case 'is':
    case 'name is':
    case 'exist':
      if (Array.isArray(userInput)) {
        let value = userInput?.some((input: any) => {
          return authorizedValues.some((it: any) => it?.id === input?.id || it === input);
        });
        return value;
      } else {
        return authorizedValues.some((it: any) => {
          return it === userInput;
        });
      }
    case 'is not':
    case 'name is not':
    case 'does not exist':
      if (Array.isArray(userInput)) {
        let value = userInput?.some((input: any) => {
          return authorizedValues.some((it: any) => it?.id === input?.id || it === input);
        });
        return !value;
      } else {
        return userInput !== authorizedValues?.[0];
      }
    case 'is selected':
      if (Array.isArray(userInput)) {
        return userInput?.some((input: any) => {
          return allOptions?.some((it: any) => it?.id === input?.id || it === input);
        });
      } else {
        return allOptions?.includes(userInput);
      }
    case 'is not selected':
      if (Array.isArray(userInput)) {
        return !userInput?.some((input: any) => {
          return allOptions?.some((it: any) => it?.id === input?.id || it === input);
        });
      } else {
        return !allOptions?.includes(userInput);
      }
    case 'is one of':
      if (Array.isArray(userInput)) {
        let value = userInput?.some((input: any) => {
          return authorizedValues.some((it: any) => it?.id === input?.id || it === input);
        });
        return value;
      } else {
        return authorizedValues?.includes(userInput);
      }

    case 'is not one of':
      if (Array.isArray(userInput)) {
        if (!userInput?.length) return false;
        let userInputIds = userInput?.map((uservalue: any) => uservalue?.id || uservalue);
        const value = authorizedValues?.some((value: any) => {
          return userInputIds?.includes(value?.id);
        });
        return !value;
      } else {
        return false;
      }
    case 'is checked':
      return Boolean(userInput) === true;
    case 'is not checked':
      return !userInput;
    case 'is greater than':
      return Number(authorizedValues?.[0]) < Number(userInput);
    case 'greater than or equal to':
      return Number(authorizedValues?.[0]) <= Number(userInput);
    case 'less than':
      return Number(authorizedValues?.[0]) > Number(userInput);
    case 'less than or equal to':
      return Number(authorizedValues?.[0]) >= Number(userInput);
    case 'equal to':
      return Number(authorizedValues?.[0]) == Number(userInput);
    case 'not equal to':
      return Number(authorizedValues?.[0]) !== Number(userInput);
    case 'between':
      return checkBetweenOrNot({
        value: userInput,
        authorizedRange: authorizedValues,
        checkFor: 'between',
      });
    case 'not between':
      return checkBetweenOrNot({
        value: userInput,
        authorizedRange: authorizedValues,
        checkFor: 'not__between',
      });

    default:
      return false;
  }
}

export function DateTimeFormat({ value, question }: any) {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // Months start from 0
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const dateFormat = /^([0-2][0-9]|3[0-1])-(0[1-9]|1[0-2])-\d{4}$/;
  const timeFormat = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;

  if (question?.variables?.date && !question?.variables?.time) {
    if (
      !dateFormat.test(
        `${day.toString().padStart(2, '0')}-${month.toString().padStart(2, '0')}-${year}`,
      )
    )
      return false;
  } else if (question?.variables?.time && !question?.variables?.date) {
    const timeStr = value?.split(':');
    const hourStr = value?.[0];
    const minuteStr = value?.[1];
    if (!hourStr || !minuteStr) return false;
    if (
      !timeFormat.test(
        `${hourStr.toString().padStart(2, '0')}:${minuteStr.toString().padStart(2, '0')}`,
      )
    )
      return false;
  } else {
    if (
      !timeFormat.test(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`,
      ) ||
      !dateFormat.test(
        `${day.toString().padStart(2, '0')}-${month.toString().padStart(2, '0')}-${year}`,
      )
    )
      return false;
  }

  return true;
}

export function setSchema({ fieldSchema, question, logic }: any) {
  switch (question?.type) {
    case 'Array':
      fieldSchema = fieldSchema.test({
        name: 'at-least-one',
        message: (value: any) => {
          return `${
            logic?.multipleSelection
              ? 'Please select at least one option'
              : 'Please select one option from the dropdown menu'
          }`;
        },
        test: (value: any) => {
          return value && value.length > 0;
        },
      });
      break;
    case 'checkbox':
      fieldSchema = fieldSchema
        .required(`${question?.label} is required field`)
        .oneOf([true], 'You must accept the condition');
      break;
    case 'number':
      fieldSchema = fieldSchema.required(`${question?.label} is required field`);
      break;
    case 'text':
      fieldSchema = fieldSchema.required(`${question?.label} is required field`);
      break;
    case 'date':
      fieldSchema = fieldSchema.test({
        message: (value: any) => {
          if (question.variables.date && !question.variables.time) {
            return `Please enter a valid date format of DD/MM/YYYY`;
          } else if (question.variables.time && !question.variables.date) {
            return `Please enter a valid date-time  HH:MM.`;
          } else {
            return `Please enter a valid date-time format of DD-MM-YYYY HH:MM:SS.`;
          }
        },
        name: 'date-time-validation',
        test: (value: any) => {
          return DateTimeFormat({ value, question });
        },
      });
      break;
    default:
      break;
  }
  return fieldSchema;
}

// for string
export const showLogicalValue: any = {
  ['is']: '=',
  ['is not']: '≠',
  ['is selected']: '∈',
  ['is not selected']: '∉',
  ['is one of']: '∈',
  ['is not one of']: '∉',
  ['less than']: '<',
  ['less than of equal to']: '≤',
  ['equal to']: '=',
  ['not equal to']: '≠',
  ['greater than or equal to']: '≥',
  ['greater than']: '>',
  ['between']: '∈',
  ['not between']: '∉',
};
