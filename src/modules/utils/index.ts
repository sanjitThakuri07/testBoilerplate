export const searchParamObject = (searchParams: any, location?: any) => {
  const searchParamscu = new URLSearchParams(location?.search);
  return location?.pathname
    ? Object.fromEntries(searchParamscu.entries())
    : Object.fromEntries(searchParams.entries());
};

export const formatedDate = (date: Date) => {
  const convertToDate = new Date(date);
  return convertToDate.toDateString();
};

export const TextSeperator = (text: string) => {
  const convertedStr = text?.toString()?.replace(/([a-z])([A-Z])/g, '$1 $2');
  return convertedStr;
};

export function isObjectOrArray(value: any): boolean {
  return !Array.isArray(value) && typeof value === 'object' && value !== null;
}

export const FlattenObject = function flattenObject(obj: Object) {
  const result: any[] = [];

  function traverse(obj: { [key: string]: any }) {
    for (const key in obj) {
      result.push(key);
      const value = obj?.[key];
      if (isObjectOrArray(value) && value !== null) {
        traverse(value);
      } else if (Array.isArray(value)) {
        result.push(...value);
      }
    }
  }

  traverse(obj);
  return result;
};
