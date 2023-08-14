export const uniqueArray = (array: any[]) =>
  array.filter((value, index, self) => {
    return self.indexOf(value) === index;
  });

export const sliceIntoChunks = (arr: any[], chunkSize: number) => {
  const temp = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    temp.push(arr.slice(i, i + chunkSize));
  }
  return temp;
};

export const stringArrayToObject = (arr: string[]) =>
  arr.map((item) => ({
    label: item,
    value: item,
  }));

export const shallowEqual = ({ object1, object2 }: any) => {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);
  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (object1[key] !== object2[key]) {
      return false;
    }
  }
  return true;
};

export const includesSome = (arr = [], target = []) => target.some((v) => arr.includes(v));
export const includesEvery = ({ arr = [], target = [] }) => target.every((v) => arr.includes(v));

export const getQuery = (filter: object) => {
  let query = "";

  Object.entries(filter).forEach((item) => {
    if (item[1] && item[1] !== null && item[1] !== undefined && item[1] !== "null") {
      query += `${item[0]}=${item[1]}&`;
    }
  });

  return query;
};

export const ascendingSortFunction = (a: any, b: any) => {
  return Number(a.position) - Number(b.position);
};
