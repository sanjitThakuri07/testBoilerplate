// import {
//   Button,
//   Checkbox,
//   CircularProgress,
//   Grid,
//   InputLabel,
//   MenuItem,
//   Select,
//   SelectChangeEvent,
//   Typography,
// } from '@mui/material';
// import Box from '@mui/material/Box';
// import FullPageLoader from 'components/FullPageLoader';
// import { Formik, FormikProps } from 'formik';
// import { BASConfigTableProps, ResponseSetPropsS, TableValue } from 'interfaces/configs';
// import { useSnackbar } from 'notistack';
// import React, { useEffect, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// // import "./form.style.scss";
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import { putApiData } from 'src/modules/containers/apiRequest/apiRequest';
// import { useLocation } from 'react-router-dom';
// import { fetchApI, postApiData } from './apiRequest';

// import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
// import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
// import { TextField } from '@mui/material';
// import TableRow from '@mui/material/TableRow';
// import { getAPI } from 'src/lib/axios/axiosClient';
// import { usePermissionStore } from 'store/permission';
// import SampleTable from './SampleTable';

// const TableCellCustom = ({
//   index,
//   selectedRow,
//   setSelectedRow,
//   data,
//   moduleValues,
//   setModuleValues,
//   formikValues,
//   internalResponseId,
// }: any) => {
//   const {
//     values,
//     touched,
//     errors,
//     handleBlur,
//     handleSubmit,
//     handleChange,
//     validateOnChange,
//     setFieldValue,
//     setFieldTouched,
//     isSubmitting,
//     initialTouched,
//   } = formikValues;
//   const [options, setOptions] = useState(['Active', 'Inactive']);
//   return (
//     <TableRow key={index}>
//       <TableCell width="10%">
//         {!internalResponseId && (
//           <Checkbox
//             color="primary"
//             id={index}
//             checked={selectedRow.includes(data?.module)}
//             checkedIcon={<img src="/assets/icons/icon-check.svg" alt="check" />}
//             icon={<img src="/assets/icons/icon-uncheck.svg" alt="uncheck" />}
//             indeterminateIcon={
//               <img src="/assets/icons/icon-check-remove.svg" alt="indeterminate" />
//             }
//             onChange={(event) => {
//               setFieldValue(`tableValues.${index}.checked`, event.target.checked);
//               if (event.target.checked) {
//                 setSelectedRow([...selectedRow, data?.module]);
//               } else {
//                 setSelectedRow(selectedRow.filter((row: any) => row !== data?.module));
//               }
//             }}
//             inputProps={{
//               'aria-label': 'select all ',
//             }}
//           />
//         )}
//       </TableCell>
//       <TableCell>{internalResponseId ? data?.variable_name : data?.module}</TableCell>
//       <TableCell>
//         <TextField
//           fullWidth
//           placeholder="Display Name"
//           className="text-area-region"
//           size="small"
//           name={`tableValues.${index}.name`}
//           value={internalResponseId ? data?.name : values.tableValues?.[`${index}`]?.name}
//           onChange={(event: any) => {
//             setFieldValue(`tableValues.${index}.name`, event.target.value);
//             setFieldValue(`tableValues.${index}.field`, data?.module);
//             if (internalResponseId) {
//               data.name = event.target.value;
//             }
//           }}
//           disabled={selectedRow.indexOf(data?.module) === -1 && !internalResponseId}
//           variant="outlined"
//         />
//       </TableCell>

//       <TableCell>
//         <Grid item xs={7} overflow={'hidden'}>
//           <Select
//             MenuProps={{ PaperProps: { style: { maxHeight: 200 } } }}
//             id={`tableValues.${index}.status`}
//             size="small"
//             fullWidth
//             placeholder="Active"
//             onChange={(event: any) => {
//               setFieldValue(`tableValues.${index}.status`, event.target.value);
//               setFieldValue(`tableValues.${index}.field`, data?.module);
//               if (internalResponseId) {
//                 data.status = event.target.value;
//               }
//             }}
//             onBlur={handleBlur}
//             name={`tableValues.${index}.status`}
//             value={internalResponseId ? data?.status : values.tableValues?.[`${index}`]?.status}
//             disabled={selectedRow.indexOf(data?.module) === -1 && !internalResponseId}
//             error={Boolean(touched?.status && errors?.status)}>
//             {options?.map((status: any) => (
//               <MenuItem key={status} value={`${status}`}>
//                 {status}
//               </MenuItem>
//             ))}
//           </Select>
//         </Grid>
//       </TableCell>
//     </TableRow>
//   );
// };

// const sample: any = {
//   items: [],
//   headers: [],
//   page: 1,
//   pages: 1,
//   size: 1,
//   total: 0,
//   archivedCount: 0,
// };

// const InternalResponseSetForm: React.FC<{
//   proceedToNextPage?: Function;
//   initial_data?: ResponseSetPropsS;
//   moduleData2?: Array<ResponseSetPropsS>;
//   isFormLoading?: boolean;
//   setIsFormLoading?: Function;
//   internalResponseId?: string | null;
// }> = ({
//   proceedToNextPage,
//   initial_data,
//   isFormLoading,
//   setIsFormLoading,
//   moduleData2,
//   internalResponseId,
// }) => {
//   // form initial values
//   const [moduleData, setModuleData] = useState([]);

//   const initialModulerValues: {
//     module?: null | string | undefined;
//     tableValues: TableValue[] | null;
//   } = {
//     module: null,
//     tableValues: [
//       {
//         status: 1,
//         name: null,
//         field: '',
//       },
//     ],
//     // onChange : ()=>{},
//   };
//   const intialModuleData: Array<ResponseSetPropsS> = [];
//   const [initialValues, setInitialValues] = useState<ResponseSetPropsS>(initialModulerValues);
//   const [moduleValues, setModuleValues] = useState(moduleData2);
//   const [tableData, setTableData] = useState<any>([]);
//   const [selectedRow, setSelectedRow] = useState<any[] | undefined>([]);
//   const [openModal, setOpenModal] = useState<boolean>(false);

//   const [moduleName, setModuleName] = useState<string>('');
//   const [moduleTag, setModuleTag] = useState<any>('');
//   const [moduleLink, setModuleLink] = useState<string>('');

//   const { enqueueSnackbar } = useSnackbar();
//   // const handleOpen = () => setOpen(true);
//   const [disableEntireField, setDisableEntireField] = useState(false);
//   const [sampleDataLoading, setSampleDataLoading] = useState(false);
//   const [sampleData, setSampleData] = useState<BASConfigTableProps>({
//     items: [],
//     headers: [],
//     page: 1,
//     pages: 1,
//     size: 1,
//     total: 0,
//     archivedCount: 0,
//   });

//   const navigate = useNavigate();
//   const param = useParams();
//   const handleReset = () => {};
//   // Get the current location object
//   const location = useLocation();

//   // Get the value of the nextPage parameter
//   const nextPage = new URLSearchParams(location.search).get('nextPage');

//   const GetDatasAPi = async ({ contractorId }: any) => {
//     let promises = [
//       fetchApI({
//         setterFunction: setTableData,
//         url: 'module/internal-response/',
//         enqueueSnackbar,
//       }),
//     ];
//     await Promise.all(promises);
//   };

//   const GetModuleAPi = async (module_tag: any) => {
//     console.log('tag', module_tag);
//     setSelectedRow([]);
//     setIsFormLoading?.(true);
//     let promises = [
//       fetchApI({
//         setterFunction: setModuleValues,
//         url: 'internal-response/field-list',
//         enqueueSnackbar,
//         queryParam: module_tag,
//       }),
//     ];
//     await Promise.all(promises);
//     setIsFormLoading?.(false);
//   };

//   // fetching data for both with and without ids
//   const fetchData = async ({ contractorId }: any) => {
//     setIsFormLoading?.(true);
//     await GetDatasAPi({ contractorId });
//     setIsFormLoading?.(false);
//   };

//   useEffect(() => {
//     fetchData({ internalResponseId: internalResponseId });
//   }, [internalResponseId]);

//   useEffect(() => {
//     // setTimeout(() => {
//     if (initial_data) {
//       setInitialValues(initial_data);
//     }
//     // }, 1000);

//     if (moduleData2) {
//       setModuleValues(moduleData2);
//     }
//   }, [initial_data]);

//   const submitHandler = async (values: any, actions: any, selectedRow: any) => {
//     let final_data;
//     if (internalResponseId) {
//       let tableDataId: any = tableData.find((it: any) => {
//         return it?.name === (values?.tableValues?.module || values?.tableValues?.[0]?.module);
//       });
//       final_data = values.tableValues?.[0]
//         ? {
//             field: values?.tableValues?.variable_name,
//             module_id: tableDataId?.id,
//             status: values?.tableValues?.[0]?.status ?? values?.tableValues?.status,
//             name: values?.tableValues?.[0]?.name ?? values?.tableValues?.variable_name,
//           }
//         : {
//             name: values?.tableValues?.name,
//             module_id: tableDataId?.id,
//             field: values?.tableValues?.variable_name,
//             status: values?.tableValues?.status,
//           };
//       await putApiData({
//         values: final_data,
//         id: +internalResponseId,
//         url: 'internal-response',
//         enqueueSnackbar: enqueueSnackbar,
//         navigateTo: (id?: number) =>
//           navigate(`/config/global-response-set/internal/edit/${internalResponseId}`),
//         domain: '',
//         setterLoading: setIsFormLoading,
//       });
//     } else {
//       let table_data = values?.tableValues?.filter(
//         (element: any) => element !== undefined && selectedRow.includes(element?.field),
//       );
//       final_data = table_data?.map(
//         ({
//           status,
//           name,
//           field,
//         }: {
//           status: number;
//           name: string | null;
//           field: string | null;
//         }) => ({
//           name: name ? name : '',
//           module_id: values?.module?.id,
//           field: field,
//           status: status ? status : 'Active',
//         }),
//       );
//       await postApiData({
//         // setterFunction: setSomeState,
//         values: final_data,
//         url: '/internal-response/',
//         enqueueSnackbar: enqueueSnackbar,
//         navigateTo: (id: number) => navigate(`/config/global-response-set/internal`),
//         domain: '',
//         setterLoading: setIsFormLoading,
//       });
//     }
//   };

//   const handleModelSelect = async (e: SelectChangeEvent<number | string>, data: any) => {
//     let target: any = e.target.value;
//     setModuleName(target?.name);
//     setModuleTag(target as string);
//     await GetModuleAPi(`tag=` + target?.tag);
//   };

//   const { permissions } = usePermissionStore();

//   const getSampleData = async () => {
//     if (moduleLink) {
//       setSampleDataLoading(true);
//       await getAPI(`${moduleLink.replace('/api/v1/', '')}?q=&page=1&size=5&`).then(
//         (res: { data: any; status: any }) => {
//           if (res.status === 200) {
//             setSampleData(res?.data);
//             setSampleDataLoading(false);
//           }
//         },
//       );
//     }
//   };

//   useEffect(() => {
//     getSampleData();
//   }, [moduleLink]);

//   useEffect(() => {
//     if (moduleTag) {
//       getAPI(`internal-response/sample-data/?module=${moduleTag?.tag}`).then((res: any) => {
//         if (res.status === 200) {
//           setModuleLink(res?.data?.path);
//           if (res?.data?.path === null) {
//             setOpenModal(false);
//             enqueueSnackbar('Unable to fetch data', { variant: 'error' });
//           }
//         }
//       });
//     }
//   }, [moduleTag]);

//   // console.log({mv: moduleValues})

//   return (
//     <div>
//       <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//         <Formik
//           enableReinitialize
//           initialValues={initialValues}
//           onSubmit={(values: ResponseSetPropsS, actions) => {
//             let finalValue: any = {};
//             let { name, id, field, ...attr }: any = values;
//             finalValue = { ...attr };
//             submitHandler(finalValue, actions, selectedRow);
//           }}
//           // validationSchema={InternalResponseSetValidationSchema}
//         >
//           {(props: FormikProps<ResponseSetPropsS>) => {
//             const {
//               values,
//               touched,
//               errors,
//               handleBlur,
//               handleSubmit,
//               handleChange,
//               validateOnChange,
//               setFieldValue,
//               setFieldTouched,
//               isSubmitting,
//               initialTouched,
//             } = props;
//             return (
//               <>
//                 {isFormLoading && <FullPageLoader />}
//                 <>
//                   <div
//                     className="tenant-page-container"
//                     style={{
//                       width: '100%',
//                       backgroundColor: '#ffffff',
//                       borderRadius: '8px',
//                       padding: '10px',
//                     }}>
//                     <Box
//                       borderTop={'none'}
//                       className="setting-form-group"
//                       sx={{
//                         width: '90%',
//                       }}>
//                       {param?.id ? (
//                         <Button
//                           type="submit"
//                           variant="contained"
//                           onClick={() => {
//                             // handleEditBtn();
//                           }}
//                           sx={{ mr: 1, float: 'right' }}>
//                           Edit
//                         </Button>
//                       ) : (
//                         ''
//                       )}

//                       <Grid container spacing={4} className="formGroupItem">
//                         <Grid item xs={3}>
//                           <InputLabel htmlFor="Select a Table">
//                             <div className="label-subheading  align__label">
//                               Select a Table <sup>*</sup>
//                             </div>
//                           </InputLabel>
//                         </Grid>
//                         <Grid item xs={7}>
//                           <Select
//                             MenuProps={{
//                               PaperProps: { style: { maxHeight: 200 } },
//                             }}
//                             name="module"
//                             id="module"
//                             size="small"
//                             fullWidth
//                             data-testid="module"
//                             placeholder="Select Module here"
//                             autoComplete="off"
//                             disabled={disableEntireField}
//                             // value={values?.module || ''}
//                             error={errors?.module && touched?.module ? true : false}
//                             onChange={(e, data) => {
//                               setSelectedRow([]);
//                               setModuleValues(intialModuleData);
//                               setInitialValues({
//                                 ...initialValues,
//                                 tableValues: [],
//                               });
//                               handleChange(e);

//                               handleModelSelect(e, data);
//                             }}
//                             renderValue={(val: any) => {
//                               tableData?.find((i: any) => console.log(i, 'iiii'));

//                               console.log(
//                                 tableData?.find((i: any) => i),
//                                 { val },
//                               );
//                               return tableData?.find((i: any) => i.id === val)?.[0]?.name;
//                             }}
//                             onBlur={handleBlur}>
//                             {tableData?.map((item: any, index: number) => (
//                               <MenuItem
//                                 key={index}
//                                 value={item}
//                                 disabled={internalResponseId ? true : false}>
//                                 {item.name}
//                               </MenuItem>
//                             ))}
//                           </Select>
//                           {errors?.module && touched?.module && (
//                             <div className="input-feedback" style={{ color: 'red' }}>
//                               {errors?.module}
//                             </div>
//                           )}
//                         </Grid>
//                         <Grid item xs={2}>
//                           {values?.module && !internalResponseId && (
//                             <Button
//                               variant="outlined"
//                               startIcon={
//                                 openModal ? (
//                                   <VisibilityOffOutlinedIcon />
//                                 ) : (
//                                   <VisibilityOutlinedIcon />
//                                 )
//                               }
//                               onClick={() => {
//                                 setOpenModal(!openModal);
//                               }}
//                               style={{
//                                 float: 'right',
//                                 whiteSpace: 'nowrap',
//                               }}>
//                               {openModal ? <> Sample Data </> : <> Sample Data</>}
//                             </Button>
//                           )}
//                         </Grid>
//                       </Grid>
//                     </Box>
//                   </div>

//                   {openModal && (
//                     <Box
//                       sx={{
//                         marginBottom: '30px',
//                         // transform: 'scale(0.9)',
//                         display: 'flex',
//                         justifyContent: 'center',
//                         maxWidth: '1000px',
//                       }}>
//                       {sampleDataLoading && <FullPageLoader />}
//                       {!!sampleData && <SampleTable format={sampleData} />}
//                     </Box>
//                   )}

//                   {values?.module && (
//                     <>
//                       <Typography variant="h3" style={{ padding: '10px' }}>
//                         Showing Results
//                       </Typography>

//                       <TableContainer>
//                         <Table stickyHeader aria-label="sticky table">
//                           <TableHead>
//                             <TableCell style={{ minWidth: 10 }}>
//                               {!internalResponseId && (
//                                 <Checkbox
//                                   color="primary"
//                                   checked={selectedRow?.length === moduleValues?.length}
//                                   checkedIcon={
//                                     <img src="/assets/icons/icon-check.svg" alt="check" />
//                                   }
//                                   icon={<img src="/assets/icons/icon-uncheck.svg" alt="uncheck" />}
//                                   indeterminateIcon={
//                                     <img
//                                       src="/assets/icons/icon-check-remove.svg"
//                                       alt="indeterminate"
//                                     />
//                                   }
//                                   // onChange={onSelectAllClick}
//                                   inputProps={{
//                                     'aria-label': 'select all desserts',
//                                   }}
//                                   onChange={(event) => {
//                                     if (event.target.checked) {
//                                       setSelectedRow(
//                                         moduleValues?.map((data: any, index: any) => data?.module),
//                                       );
//                                     } else {
//                                       setSelectedRow([]);
//                                     }
//                                   }}
//                                 />
//                               )}
//                             </TableCell>
//                             <TableCell style={{ minWidth: 10 }}>Variable Name</TableCell>
//                             <TableCell style={{ minWidth: 10 }}>
//                               <div className="label-heading  align__label">
//                                 Display Name <sup>*</sup>
//                               </div>
//                             </TableCell>
//                             <TableCell style={{ minWidth: 10 }}>Status</TableCell>
//                           </TableHead>
//                           <TableBody>
//                             {moduleValues?.map((data: any, index: any) => {
//                               return (
//                                 <TableCellCustom
//                                   key={data?.id}
//                                   index={index}
//                                   selectedRow={selectedRow}
//                                   setSelectedRow={setSelectedRow}
//                                   data={data}
//                                   moduleValues={moduleValues}
//                                   setModuleValues={setModuleValues}
//                                   formikValues={props}
//                                   internalResponseId={internalResponseId}
//                                 />
//                               );
//                             })}
//                           </TableBody>
//                         </Table>
//                       </TableContainer>
//                     </>
//                   )}
//                   <React.Fragment>
//                     <Box
//                       borderBottom={'none'}
//                       className="setting-form-group"
//                       sx={{
//                         width: '90%',
//                         display: 'flex',
//                         flexDirection: 'row',
//                         pt: 2,
//                       }}>
//                       <Box sx={{ flex: '1 1 auto' }} />
//                       <Button
//                         variant="outlined"
//                         type="button"
//                         onClick={() => {
//                           props.resetForm();
//                           props.setValues(props.initialValues);
//                           props.setTouched({});
//                           setInitialValues(initialModulerValues);
//                         }}
//                         sx={{ mr: 1 }}>
//                         Clear All
//                       </Button>
//                       <Button
//                         type="submit"
//                         variant="contained"
//                         // disabled={isSubmitting ? true : false}
//                         // isSubmitting={isSubmitting}
//                         onClick={() => {
//                           setInitialValues(values);
//                           handleSubmit();
//                         }}
//                         sx={{ mr: 1 }}>
//                         {internalResponseId ? 'Update' : 'Save'} & Proceed
//                         {isFormLoading && (
//                           <CircularProgress color="inherit" size={18} sx={{ marginLeft: '10px' }} />
//                         )}
//                       </Button>
//                     </Box>
//                   </React.Fragment>
//                 </>
//               </>
//             );
//           }}
//         </Formik>
//       </Box>
//     </div>
//   );
// };

// export default InternalResponseSetForm;

import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import {
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { Formik, FormikProps, Field } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { BASConfigTableProps, ResponseSetPropsS, TableValue } from "src/interfaces/configs";
import { useSnackbar, SnackbarKey, SnackbarMessage, OptionsObject } from "notistack";
import { InternalResponseSetValidationSchema } from "validationSchemas/InternalResponseSet";
import FullPageLoader from "src/components/FullPageLoader";
// import "./form.style.scss";
import { postApiData, fetchApI, fetchInitialValues } from "./apiRequest";
import { putApiData } from "src/modules/apiRequest/apiRequest";
import { useLocation } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import BASDataTableUpdate from "src/modules/table/BASDataTable";

import TableRow from "@mui/material/TableRow";
import { TextField } from "@mui/material";
import ModalLayout from "src/components/ModalLayout";
import { usePermissionStore } from "src/store/zustand/permission";
import { permissionList } from "src/constants/permission";
import { getAPI } from "src/lib/axios";
import SampleTable from "./SampleTable";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

const TableCellCustom = ({
  index,
  selectedRow,
  setSelectedRow,
  data,
  moduleValues,
  setModuleValues,
  formikValues,
  internalResponseId,
  sampleData,
}: any) => {
  const {
    values,
    touched,
    errors,
    handleBlur,
    handleSubmit,
    handleChange,
    validateOnChange,
    setFieldValue,
    setFieldTouched,
    isSubmitting,
    initialTouched,
  } = formikValues;
  const [options, setOptions] = useState(["Active", "Inactive"]);

  return (
    <TableRow key={index}>
      <TableCell width="10%">
        {!internalResponseId && (
          <Checkbox
            color="primary"
            id={index}
            checked={selectedRow.includes(data?.module)}
            checkedIcon={<img src="/assets/icons/icon-check.svg" alt="check" />}
            icon={<img src="/assets/icons/icon-uncheck.svg" alt="uncheck" />}
            indeterminateIcon={
              <img src="/assets/icons/icon-check-remove.svg" alt="indeterminate" />
            }
            onChange={(event) => {
              setFieldValue(`tableValues.${index}.checked`, event.target.checked);
              if (event.target.checked) {
                setSelectedRow([...selectedRow, data?.module]);
              } else {
                setSelectedRow(selectedRow.filter((row: any) => row !== data?.module));
              }
            }}
            inputProps={{
              "aria-label": "select all ",
            }}
          />
        )}
      </TableCell>
      <TableCell>
        {internalResponseId ? data?.variable_name : data?.module}
        {/* {sampleData.map((it: string, i: number) => it)} */}
      </TableCell>
      <TableCell>
        <TextField
          fullWidth
          placeholder="Display Name"
          className="text-area-region"
          size="small"
          name={`tableValues.${index}.name`}
          value={internalResponseId ? data?.name : values.tableValues?.[`${index}`]?.name}
          onChange={(event: any) => {
            setFieldValue(`tableValues.${index}.name`, event.target.value);
            setFieldValue(`tableValues.${index}.field`, data?.module);
            if (internalResponseId) {
              data.name = event.target.value;
            }
          }}
          disabled={selectedRow.indexOf(data?.module) === -1 && !internalResponseId}
          variant="outlined"
        />
      </TableCell>
      <TableCell>
        <Grid item xs={7} overflow={"hidden"}>
          <Select
            MenuProps={{ PaperProps: { style: { maxHeight: 200 } } }}
            id={internalResponseId ? `tableValues.status` : `tableValues.${index}.status`}
            size="small"
            fullWidth
            placeholder="Active"
            onChange={(event: any) => {
              if (internalResponseId) {
                data.status = event.target.value;
                setFieldValue(`tableValues.status`, event?.target?.value);
              } else {
                setFieldValue(`tableValues.${index}.field`, data?.module);
                setFieldValue(`tableValues.${index}.status`, event.target.value);
              }
            }}
            onBlur={handleBlur}
            name={internalResponseId ? `tableValues.status` : `tableValues.${index}.status`}
            value={
              internalResponseId
                ? `${values?.tableValues?.status}`
                : `${values?.tableValues?.[index]?.status || "Active"}`
            }
            disabled={selectedRow.indexOf(data?.module) === -1 && !internalResponseId}
            error={Boolean(touched?.status && errors?.status)}
          >
            {options?.map((status: any) => (
              <MenuItem key={status} value={`${status}`}>
                {status}
              </MenuItem>
            ))}
          </Select>
        </Grid>
      </TableCell>
    </TableRow>
  );
};

const InternalResponseSetForm: React.FC<{
  proceedToNextPage?: Function;
  initial_data?: ResponseSetPropsS;
  moduleData2?: Array<ResponseSetPropsS>;
  isFormLoading?: boolean;
  setIsFormLoading?: Function;
  internalResponseId?: string | null;
  viewMode?: any;
}> = ({
  proceedToNextPage,
  initial_data,
  isFormLoading,
  setIsFormLoading,
  moduleData2,
  internalResponseId,
  viewMode,
}) => {
  // form initial values
  const [moduleData, setModuleData] = useState([]);

  const initialModulerValues: {
    module?: null | string | undefined;
    tableValues: any;
  } = {
    module: null,
    tableValues: [
      {
        status: 1,
        name: null,
        field: "",
        module_id: null,
      },
    ],
    // onChange : ()=>{},
  };
  const intialModuleData: Array<ResponseSetPropsS> = [];
  const [initialValues, setInitialValues] = useState<ResponseSetPropsS>(initialModulerValues);
  const [moduleValues, setModuleValues] = useState(moduleData2);
  const [tableData, setTableData] = useState([]);
  const [selectedRow, setSelectedRow] = useState<any[] | undefined>([]);
  const [openModal, setOpenModal] = useState<boolean>(false);

  const [moduleName, setModuleName] = useState<string>("");
  const [moduleTag, setModuleTag] = useState<any>("");
  const [moduleLink, setModuleLink] = useState<string>("");
  const [buttonLoader, setButtonLoader] = React.useState<boolean>(false);

  const { enqueueSnackbar } = useSnackbar();
  // const handleOpen = () => setOpen(true);
  const [disableEntireField, setDisableEntireField] = useState(false);
  const [sampleDataLoading, setSampleDataLoading] = useState(false);
  const [sampleData, setSampleData] = useState<BASConfigTableProps>({
    items: [],
    headers: [],
    page: 1,
    pages: 1,
    size: 1,
    total: 0,
    archivedCount: 0,
  });

  const navigate = useNavigate();
  const param = useParams();
  const handleReset = () => {};
  // Get the current location object
  const location = useLocation();

  // Get the value of the nextPage parameter
  const nextPage = new URLSearchParams(location.search).get("nextPage");

  const GetDatasAPi = async ({ contractorId }: any) => {
    let promises = [
      fetchApI({
        setterFunction: setTableData,
        url: "module/internal-response/",
        enqueueSnackbar,
      }),
    ];
    await Promise.all(promises);
  };

  // const GetDatasAPi = async ({ contractorId }: any) => {
  //   try {
  //     const { data }: any = await fetchApI({
  //       setterFunction: setTableData,
  //       url: 'module/internal-response/',
  //       enqueueSnackbar,
  //     });

  //     if (data?.length) {
  //       const filteredData = data.filter(
  //         (item: any) =>
  //           ![
  //             'FindingRecommendations',
  //             'FindingRecommendationSubCategory',
  //             'FindingRecommendationMainCategory',
  //           ].includes(item.tag),
  //       );

  //       console.log('filteredData', filteredData);

  //       if (filteredData.length > 0) {
  //         setTableData(filteredData);
  //       }
  //     }
  //   } catch (error) {
  //     // Handle the error here
  //     const errorMessage = 'Something went wrong!';
  //     enqueueSnackbar(errorMessage, {
  //       variant: 'error',
  //     });
  //   }
  // };

  const sampleDataItems = sampleData?.items?.map((item: any) => item)[0];
  const sampleDataItemsKeys = Object.keys(sampleDataItems ?? {});

  const GetModuleAPi = async (module_tag: any) => {
    setSelectedRow([]);
    setIsFormLoading?.(true);

    let promises = [
      fetchApI({
        setterFunction: setModuleValues,
        url: "internal-response/field-list",
        enqueueSnackbar,
        queryParam: module_tag,
      }),
    ];
    await Promise.all(promises);

    setIsFormLoading?.(false);
  };

  // fetching data for both with and without ids
  const fetchData = async ({ contractorId }: any) => {
    setIsFormLoading?.(true);
    await GetDatasAPi({ contractorId });
    setIsFormLoading?.(false);
  };

  useEffect(() => {
    fetchData({ internalResponseId: internalResponseId });
  }, [internalResponseId]);

  useEffect(() => {
    // setTimeout(() => {
    if (initial_data) {
      setInitialValues(initial_data);
    }
    // }, 1000);

    if (moduleData2) {
      setModuleValues(moduleData2);
    }
  }, [initial_data]);

  const submitHandler = async (values: any, actions: any, selectedRow: any) => {
    let final_data;
    if (internalResponseId) {
      let tableDataId: any = tableData.find((it: any) => {
        return it?.name === (values?.tableValues?.module || values?.tableValues?.[0]?.module);
      });
      final_data = values.tableValues?.[0]
        ? {
            field: values?.tableValues?.variable_name,
            module_id: tableDataId?.id,
            status: values?.tableValues?.[0]?.status ?? values?.tableValues?.status,
            name: values?.tableValues?.[0]?.name ?? values?.tableValues?.variable_name,
          }
        : {
            name: values?.tableValues?.name,
            module_id: tableDataId?.id,
            field: values?.tableValues?.variable_name,
            status: values?.tableValues?.status,
          };
      await putApiData({
        values: final_data,
        id: +internalResponseId,
        url: "internal-response",
        enqueueSnackbar: enqueueSnackbar,
        navigateTo: (id?: number) => navigate(-1),
        domain: "",
        setterLoading: setButtonLoader,
      });
    } else {
      let table_data = values?.tableValues?.filter(
        (element: any) => element !== undefined && selectedRow.includes(element?.field),
      );
      final_data = table_data?.map(
        ({
          status,
          name,
          field,
        }: {
          status: number;
          name: string | null;
          field: string | null;
        }) => ({
          name: name ? name : "",
          module_id: values?.module?.id,
          field: field,
          status: status ? status : "Active",
        }),
      );
      await postApiData({
        // setterFunction: setSomeState,
        values: final_data,
        url: "/internal-response/",
        enqueueSnackbar: enqueueSnackbar,
        navigateTo: (id: number) => navigate(`/config/global-response-set/internal`),
        domain: "",
        setterLoading: setButtonLoader,
      });
    }
  };

  const handleModelSelect = async (e: SelectChangeEvent<number | string>, data: any) => {
    setModuleName(data?.props.children);
    // setModuleTag(data?.props.children);

    let target = e.target.value;
    setModuleTag(target as string);

    let dat = data?.props?.value.tag;
    dat = `tag=` + dat;
    // await GetModuleAPi(dat);
  };

  const { permissions } = usePermissionStore();

  const getSampleData = async () => {
    if (moduleLink) {
      setSampleDataLoading(true);
      await getAPI(`${moduleLink.replace("/api/v1/", "")}?q=&page=1&size=5&`).then(
        (res: { data: any; status: any }) => {
          if (res.status === 200) {
            setSampleData(res?.data);
            setSampleDataLoading(false);
          }
        },
      );
    }
  };

  useEffect(() => {
    getSampleData();
  }, [moduleLink]);

  useEffect(() => {
    if (moduleTag) {
      setIsFormLoading?.(true);
      getAPI(`internal-response/sample-data/?module=${moduleTag?.tag}`).then((res: any) => {
        if (res.status === 200) {
          setModuleLink(res?.data?.path);
          setIsFormLoading?.(false);
          if (res?.data?.path === null) {
            setOpenModal(false);
            enqueueSnackbar("Unable to fetch data", { variant: "error" });
            setIsFormLoading?.(false);
          }
        } else {
          setIsFormLoading?.(false);
        }
      });
    }
  }, [moduleTag]);

  // console.log('moduleData', moduleData);
  // console.log('sampleDataItems', sampleDataItems);

  // console.log('sampleDataItemsKeys', sampleDataItemsKeys);
  console.log("modeuleValues", moduleValues);

  function convertToKeysArray(keysArray: string[]) {
    return keysArray.map((key) => ({
      display_name: "", // Set the display_name as needed
      module: key,
      status: 1, // Set the status as needed
    }));
  }

  const dynamicSampleDataItemsKeys = convertToKeysArray(sampleDataItemsKeys);

  React.useEffect(() => {
    if (dynamicSampleDataItemsKeys.length > 0) {
      setModuleValues(dynamicSampleDataItemsKeys as unknown as any);
    }
  }, [sampleData]);

  console.log("dynamicSampleDataItemsKeys", dynamicSampleDataItemsKeys);

  return (
    <div>
      <Box sx={{ width: "100%" }}>
        <div className={viewMode ? "enable-booking-component" : ""}>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={(values: ResponseSetPropsS, actions) => {
              let finalValue: any = {};
              let { name, id, field, ...attr }: any = values;
              finalValue = { ...attr };
              submitHandler(finalValue, actions, selectedRow);
            }}
            // validationSchema={InternalResponseSetValidationSchema}
          >
            {(props: FormikProps<ResponseSetPropsS>) => {
              const {
                values,
                touched,
                errors,
                handleBlur,
                handleSubmit,
                handleChange,
                validateOnChange,
                setFieldValue,
                setFieldTouched,
                isSubmitting,
                initialTouched,
              } = props;

              let duplicateValue: any = values;
              let selectValue: number = duplicateValue.tableValues.module_id;

              return (
                <>
                  {isFormLoading && <FullPageLoader />}
                  <>
                    <div
                      className="tenant-page-container"
                      style={{
                        margin: "-30px 0 ",
                        backgroundColor: "#ffffff",
                        borderRadius: "8px",
                        padding: "10px",
                      }}
                    >
                      <Box
                        borderTop={"none"}
                        className="setting-form-group"
                        sx={{
                          width: "90%",
                        }}
                      >
                        {param?.id ? (
                          <Button
                            type="submit"
                            variant="contained"
                            onClick={() => {
                              // handleEditBtn();
                            }}
                            sx={{ mr: 1, float: "right" }}
                          >
                            Edit
                          </Button>
                        ) : (
                          ""
                        )}
                        {/* variables  */}
                        <Grid container spacing={4} className="formGroupItem">
                          <Grid item xs={3}>
                            <InputLabel htmlFor="Select a Table">
                              <div className="label-subheading  align__label">
                                Select a Table <sup>*</sup>
                              </div>
                            </InputLabel>
                          </Grid>
                          <Grid item xs={7}>
                            {param.internalResponseId ? (
                              <Select
                                MenuProps={{
                                  PaperProps: { style: { maxHeight: 200 } },
                                }}
                                name="module"
                                displayEmpty
                                id="module"
                                size="small"
                                fullWidth
                                data-testid="module"
                                placeholder="Select Module here"
                                autoComplete="off"
                                disabled={disableEntireField}
                                value={Number(selectValue)}
                                error={errors?.module && touched?.module ? true : false}
                                onChange={(e, data) => {
                                  setSelectedRow([]);
                                  setModuleValues(intialModuleData);
                                  setInitialValues({
                                    ...initialValues,
                                    tableValues: [],
                                  });
                                  handleChange(e);
                                  handleModelSelect(e, data);
                                }}
                                onBlur={handleBlur}
                              >
                                {tableData?.map((item: any, index: number) => (
                                  <MenuItem
                                    key={index}
                                    value={item.id}
                                    disabled={internalResponseId ? true : false}
                                  >
                                    {item.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            ) : (
                              <Select
                                MenuProps={{
                                  PaperProps: { style: { maxHeight: 200 } },
                                }}
                                name="module"
                                displayEmpty
                                id="module"
                                size="small"
                                fullWidth
                                data-testid="module"
                                placeholder="Select Module here"
                                autoComplete="off"
                                disabled={disableEntireField}
                                value={values?.module || ""}
                                error={errors?.module && touched?.module ? true : false}
                                onChange={(e, data) => {
                                  setSelectedRow([]);
                                  setModuleValues(intialModuleData);
                                  setInitialValues({
                                    ...initialValues,
                                    tableValues: [],
                                  });
                                  handleChange(e);
                                  handleModelSelect(e, data);
                                }}
                                onBlur={handleBlur}
                              >
                                {tableData?.map((item: any, index: number) => (
                                  <MenuItem
                                    key={index}
                                    value={item}
                                    disabled={internalResponseId ? true : false}
                                  >
                                    {item.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            )}

                            {/* <Select
                              MenuProps={{
                                PaperProps: { style: { maxHeight: 200 } },
                              }}
                              name="module"
                              displayEmpty
                              id="module"
                              size="small"
                              fullWidth
                              data-testid="module"
                              placeholder="Select Module here"
                              autoComplete="off"
                              disabled={disableEntireField}
                              // value={
                              //   param.internalResponseId
                              //     ? values.module_id || ''
                              //     : values?.module || ''
                              // }
                              value={values?.module || ''}
                              error={errors?.module && touched?.module ? true : false}
                              onChange={(e, data) => {
                                setSelectedRow([]);
                                setModuleValues(intialModuleData);
                                setInitialValues({
                                  ...initialValues,
                                  tableValues: [],
                                });
                                handleChange(e);
                                handleModelSelect(e, data);
                              }}
                              onBlur={handleBlur}>
                              {param.internalResponseId
                                ? tableData?.map((item: any, index: number) => (
                                    <MenuItem
                                      key={index}
                                      value={item.id}
                                      disabled={internalResponseId ? true : false}>
                                      {item.name}
                                    </MenuItem>
                                  ))
                                : tableData?.map((item: any, index: number) => (
                                    <MenuItem
                                      key={index}
                                      value={item}
                                      disabled={internalResponseId ? true : false}>
                                      {item.name}
                                    </MenuItem>
                                  ))}
                            </Select> */}

                            {errors?.module && touched?.module && (
                              <div className="input-feedback" style={{ color: "red" }}>
                                {errors?.module}
                              </div>
                            )}
                          </Grid>
                          <Grid item xs={2}>
                            {values?.module && !internalResponseId && (
                              <Button
                                variant="outlined"
                                startIcon={
                                  openModal ? (
                                    <VisibilityOffOutlinedIcon />
                                  ) : (
                                    <VisibilityOutlinedIcon />
                                  )
                                }
                                onClick={() => {
                                  setOpenModal(!openModal);
                                }}
                                style={{
                                  float: "right",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {openModal ? <> Sample Data </> : <> Sample Data</>}
                              </Button>
                            )}
                          </Grid>
                        </Grid>
                      </Box>
                    </div>

                    {openModal && (
                      <Box
                        sx={{
                          marginBottom: "30px",
                          transform: "scale(0.9)",
                        }}
                      >
                        {sampleDataLoading && <FullPageLoader />}
                        {sampleData?.items?.length > 0 ? <SampleTable format={sampleData} /> : ""}
                      </Box>
                    )}

                    {values?.module && (
                      <>
                        <Typography variant="h3" style={{ padding: "10px" }}>
                          Showing Results
                        </Typography>

                        <TableContainer>
                          <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                              <TableCell style={{ minWidth: 10 }}>
                                {!internalResponseId && (
                                  <Checkbox
                                    color="primary"
                                    checked={selectedRow?.length === moduleValues?.length}
                                    checkedIcon={
                                      <img src="/assets/icons/icon-check.svg" alt="check" />
                                    }
                                    icon={
                                      <img src="/assets/icons/icon-uncheck.svg" alt="uncheck" />
                                    }
                                    indeterminateIcon={
                                      <img
                                        src="/assets/icons/icon-check-remove.svg"
                                        alt="indeterminate"
                                      />
                                    }
                                    // onChange={onSelectAllClick}
                                    inputProps={{
                                      "aria-label": "select all desserts",
                                    }}
                                    onChange={(event) => {
                                      if (event.target.checked) {
                                        setSelectedRow(
                                          moduleValues?.map(
                                            (data: any, index: any) => data?.module,
                                          ),
                                        );
                                      } else {
                                        setSelectedRow([]);
                                      }
                                    }}
                                  />
                                )}
                              </TableCell>
                              <TableCell style={{ minWidth: 10 }}>Variable Name</TableCell>
                              <TableCell style={{ minWidth: 10 }}>
                                <div className="label-heading  align__label">
                                  Display Name <sup>*</sup>
                                </div>
                              </TableCell>
                              <TableCell style={{ minWidth: 10 }}>Status</TableCell>
                            </TableHead>
                            <TableBody>
                              {/* {dynamicSampleDataItemsKeys?.map((data: any, index: any) => {
                                return (
                                  <TableCellCustom
                                    key={data?.id}
                                    index={index}
                                    sampleData={sampleDataItemsKeys}
                                    selectedRow={selectedRow}
                                    setSelectedRow={setSelectedRow}
                                    data={data}
                                    moduleValues={dynamicSampleDataItemsKeys}
                                    setModuleValues={setModuleValues}
                                    formikValues={props}
                                    internalResponseId={internalResponseId}
                                  />
                                );
                              })} */}

                              {moduleValues?.map((data: any, index: any) => {
                                return (
                                  <TableCellCustom
                                    key={data?.id}
                                    index={index}
                                    sampleData={sampleDataItemsKeys}
                                    selectedRow={selectedRow}
                                    setSelectedRow={setSelectedRow}
                                    data={data}
                                    moduleValues={moduleValues}
                                    setModuleValues={setModuleValues}
                                    formikValues={props}
                                    internalResponseId={internalResponseId}
                                  />
                                );
                              })}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </>
                    )}
                    <React.Fragment>
                      {/* {(selectedRow?.length && selectedRow?.length >0)  || internalResponseId && ( */}
                      <Box
                        borderBottom={"none"}
                        className="setting-form-group"
                        sx={{
                          width: "90%",
                          display: "flex",
                          flexDirection: "row",
                          pt: 2,
                        }}
                      >
                        <Box sx={{ flex: "1 1 auto" }} />
                        {!internalResponseId && (
                          <Button
                            variant="outlined"
                            type="button"
                            onClick={() => {
                              props.resetForm();
                              props.setValues(props.initialValues);
                              props.setTouched({});
                              setInitialValues(initialModulerValues);
                            }}
                            sx={{ mr: 1 }}
                          >
                            Clear All
                          </Button>
                        )}
                        <Button
                          type="submit"
                          variant="contained"
                          // disabled={isSubmitting ? true : false}
                          // isSubmitting={isSubmitting}
                          onClick={() => {
                            setInitialValues(values);
                            handleSubmit();
                          }}
                          sx={{ mr: 1 }}
                        >
                          {internalResponseId ? "Update" : "Save"} & Proceed
                          {buttonLoader && (
                            <CircularProgress
                              color="inherit"
                              size={18}
                              sx={{ marginLeft: "10px" }}
                            />
                          )}
                        </Button>
                      </Box>
                      {/* )} */}
                    </React.Fragment>
                  </>
                </>
              );
            }}
          </Formik>

          {/* --- */}
        </div>
      </Box>
    </div>
  );
};

export default InternalResponseSetForm;
