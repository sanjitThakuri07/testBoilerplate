import { defaultQuery } from "src/constants/query";

export const updateStateNew = ({ state, local, action, entity, key = "id" }: any) => {
  const oldData = local.items.find((item: any) => item[`${key}`] === action.payload[`${key}`]);
  const indexOfOldData = local.items.indexOf(oldData);
  const newData = {
    ...oldData,
    ...action.payload,
  };
  const excludedData = [...local.items.filter((item: any) => item !== oldData)];
  return {
    ...state,
    [`${entity}`]: {
      ...state[`${entity}`],
      items: [
        ...excludedData.slice(0, indexOfOldData),
        newData,
        ...excludedData.slice(indexOfOldData),
      ],
    },
  };
};

export const updateState = ({ state, local, action, entity, key = "id" }: any) => {
  const oldData = local.find((item: any) => item[`${key}`] === action.payload[`${key}`]);
  const indexOfOldData = local.indexOf(oldData);
  const newData = {
    ...oldData,
    ...action.payload,
  };
  const excludedData = [...local.filter((item: any) => item !== oldData)];
  return {
    ...state,
    [`${entity}`]: [
      ...excludedData.slice(0, indexOfOldData),
      newData,
      ...excludedData.slice(indexOfOldData),
    ],
  };
};

export const removeState = ({ state, local, action, entity, key = "id" }: any) => {
  return {
    ...state,
    [`${entity}`]: local.filter((item: any) => item[`${key}`] !== action.payload[`${key}`]),
  };
};

export const createState = ({ state, local, action, entity }: any) => {
  return { ...state, [`${entity}`]: [action.payload, ...local] };
};

export const setSearchState = ({ state, action, local, entity }: any) => ({
  ...state,
  [`${entity}`]: action.payload,
  temp: { [`${entity}`]: local, metadata: state.metadata },
});

export const resetSearchState = ({ state }: any) => {
  return { ...state, ...state.temp, temp: undefined };
};

export const formDataGenerator = ({ data }: any) => {
  const formData = new FormData();

  Object.entries(data).forEach((item: { [key: string]: any }) => {
    if (item[0]) formData.append(`${item[0]}`, item[1]);
  });

  return formData;
};

export const generateMeta = ({ data, query }: any) => {
  const totalItemsCount = data?.total || 0;
  const { page } = query;
  const { perPage } = query;
  const totalPagesCount = query.perPage ? Math.ceil(totalItemsCount / perPage) : 1;

  return {
    totalItemsCount,
    page,
    perPage,
    totalPagesCount,
  };
};

export const generateQuery = ({
  url,
  query = defaultQuery,
  length = true,
  useColumn = true,
  columns = [],
  searchable = [],
}: any) => {
  const columnGeneration = "";

  const { order, order_by, page, perPage, search, ...otherQueries }: any = query;

  let finalQuery: any = {
    order,
    order_by,
    search,
    page,
    ...otherQueries,
  };

  if (length) {
    finalQuery = { ...finalQuery, size: perPage || defaultQuery.perPage };
  }

  let link = `${url}?${useColumn ? columnGeneration : ""}`;

  if (finalQuery)
    Object.entries(finalQuery).forEach((item) => {
      link += item[1] || item[1] === false || item[1] === 0 ? `&${item[0]}=${item[1]}` : "";
    });

  return link;
};

// export const generateDataToUpload = (values: any) => {
//   const files = {};
//   let newUpload = 0;

//   if (values.files) {
//     Object.keys(values.files).map((file) => {
//       if (values.files[file]) {
//         if (values.files[file].length && Array.isArray(values.files[file])) {
//           // eslint-disable-next-line prefer-destructuring
//           files[file] = values.files[file][0];
//           newUpload += 1;
//         }
//       } else {
//         files[file] = "";
//       }
//     });
//   }

//   return { files, newUpload };
// };
