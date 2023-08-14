// this filter component is dynamic
//  it has a specific data format

// we need to initilize the initial value, or the fields that will be present in this filter component
// for declaring initial value
// example
const INITIAL_VALUES: any = {
  country: {
    type: 'Select',
    backendName: 'country',
    api: 'country/',
    options: [],
    fieldName: 'name',
    value: [],
    label: 'Choose Country',
    initialValue: 'country',
  },
  region: {
    type: 'Select',
    backendName: 'region',
    api: 'region/',
    options: [],
    fieldName: 'name',
    value: [],
    label: 'Choose Region',
    initialValue: 'region',
  },
  name: {
    type: 'text',
    backendName: 'name',
    api: '',
    fieldName: 'name',
    value: '',
    label: 'Choose Name',
    initialValue: 'name',
  },
};

// here the object property name of INITIAL_VALUES determines the initial value of formik field
//  the type defines the type of component it should have
// backendname describes what it should put when making the query
// api for requesting backend data
// for the select field options it has the dynamic  format i.e (fieldName)
// for custom label => each key has been given the label property

// ========= ********* ================ ///
// currently only two inputs field has been placed
//  that is for choice fields and normal text fields

// base code formatting the datasets
// setFilterUrl((prev: any) => {
//     let query = Object.entries(values || {})?.reduce((acc: any, curr: any, index) => {
//       console.log({ curr });
//       let key = curr?.[0];
//       let value = curr?.[1];
//       if (!value) {
//         return acc;
//       } else if (Array?.isArray(value)) {
//         let subQuery = value.reduce((acc: any, curr: any) => {
//           return (acc = acc + `${key}=${curr}&`);
//         }, '');
//         console.log({ subQuery });
//         acc = acc + `${subQuery}`;
//       } else {
//         acc = acc + `${key}=${value}&`;
//       }
//       return acc;
//     }, '');
//     console.log({ query });
//     return { ...prev, filterQuery: query };
//   });

//   const getProperFormValues = Object.keys(values || {}).reduce(
//     (acc: any, curr: any) => {
//       const getValue = Array?.isArray(values?.[curr])
//         ? initialValues?.[curr]?.options?.filter((it: any) =>
//             values?.[curr]?.includes(it?.id),
//           ) || []
//         : values?.[curr] || '';
//       acc.formValues = {
//         ...(acc?.formValues || {}),
//         [curr]: {
//           ...(acc?.formValues?.[curr] || {}),
//           ...(initialValues?.[curr] || {}),
//           value: getValue,
//         },
//       };
//       return acc;
//     },
//     {
//       formValues: {},
//     },
//   );
