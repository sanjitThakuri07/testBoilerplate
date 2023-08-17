import moment from "moment";

export const validateFieldTypeNames = {
  FLOAT: "FLOAT",
  NUMBER: "NUMBER",
};

export const queryMaker = (query: Object) => {
  const querys = Object.entries(query || {}).reduce((acc: any, [key, value]: any) => {
    if (Array.isArray(value)) {
      let subQuery = value.reduce((acc: any, curr: any) => {
        return (acc = acc + `${key}=${curr}&`);
      }, "");
      acc += `${subQuery}`;
    } else {
      acc += key === "filterQuery" ? (!value?.length ? "" : `${value}`) : `${key}=${value}&`;
    }

    return acc;
  }, "");
  return querys;
};

export const checkDate = function isValidDate(dateString: string) {
  return !isNaN(Date.parse(dateString));
};

export const formatDate = ({ date }: any) => {
  return moment(new Date(date)).format("MMM Do YY");
};

export const getHighestLowestData = ({ objectCollection }: any) => {
  let lowestStart = Infinity;
  let highestEnd = -Infinity;
  for (const key in objectCollection) {
    if (objectCollection?.hasOwnProperty(key) && typeof objectCollection?.[key] === "object") {
      const { start, end } = objectCollection?.[key];
      lowestStart = Math.min(lowestStart, start);
      highestEnd = Math.max(highestEnd, end);
    }
  }
  return {
    lowestStart,
    highestEnd,
  };
};

export function getObjectsWithinRange({ obj, startRange, endRange }: any) {
  const result: any = {};
  let lowestRange = Infinity;
  let highestRange = -Infinity;
  for (const key in obj) {
    if (typeof obj?.[key] === "object") {
      const { start, end } = obj?.[key];
      if (start > startRange && end < endRange) {
        result[key] = { start, end };
        lowestRange = Math.min(lowestRange, start);
        highestRange = Math.max(highestRange, end);
      }
    }
  }
  result.lowestStart = lowestRange;
  result.highestRange = highestRange;

  return result;
}

export function validateField(validateFieldType: string, value: string) {
  const regexFloat = /^[0-9]*\.?[0-9]*$/i;
  const numberRegex = /^[0-9\b\x7F]+$/;
  let testPass = false;
  switch (validateFieldType) {
    case validateFieldTypeNames?.FLOAT:
      testPass = regexFloat.test(value);
      break;
    case validateFieldTypeNames?.NUMBER:
      testPass = numberRegex.test(value);
      break;
    default:
      testPass = true;
      break;
  }

  return testPass;
}

export const checkUpperCase = (value?: string) => {
  return value?.match(/[A-Z]/g);
};

export const checkCharSymbol = (value?: string) => {
  return value?.match(/[\S]/g);
};

export const checkNumber = (value?: string) => {
  return value?.match(/\d/);
};

export function sortObjectKeysToCustomArray({ obj, customOrder }: any) {
  const keys = Object.keys(obj);
  keys.sort((a, b) => customOrder.indexOf(a) - customOrder.indexOf(b));
  return keys;
}

export function getNestedDataObject({ fetchData, data, fetchKey }: any) {
  let value: any;
  let keyName: any;
  if (fetchData instanceof Object) {
    let dataObject = data?.[fetchData?.obj_name];
    if (Array?.isArray(dataObject)) {
      let finalData = dataObject?.reduce((acc: any, curr: any) => {
        if (Array.isArray(curr?.[fetchData?.field_name])) {
          let val = curr?.[fetchData?.field_name]?.map((it: any) => {
            return checkDate(it) ? formatDate({ date: it }) : it;
          });

          acc.push(...(val || []));
        } else {
          let val = checkDate(curr?.[fetchData?.field_name])
            ? formatDate({ date: curr?.[fetchData?.field_name] })
            : curr?.[fetchData?.field_name];

          acc.push(val);
        }
        return acc;
      }, []);
      value = finalData;
    } else if (dataObject instanceof Object) {
      value = dataObject?.[fetchData?.field_name] || "";
    }
    keyName = fetchData?.label;
  } else {
    value = data?.[fetchKey] || "";
    keyName = fetchData;
  }

  return { value, keyName };
}
