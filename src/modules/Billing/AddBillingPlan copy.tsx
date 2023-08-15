// import {
//   Button,
//   CircularProgress,
//   Divider,
//   Grid,
//   IconButton,
//   InputLabel,
//   TextField,
// } from '@mui/material';
// import ModalLayout from 'src/components/ModalLayout';
// import { Field, FieldArray, Formik, FormikProps } from 'formik';
// import React, { ChangeEvent } from 'react';
// import { BillingValidation } from 'src/validationSchemas/BillingSchema';
// import ClearIcon from '@mui/icons-material/Clear';
// import AddIcon from '@mui/icons-material/Add';
// import { Box } from '@mui/system';
// import { LoadingButton } from '@mui/lab';
// import { getAPI, postAPI, putAPI } from 'src/lib/axios/axiosClient';
// import { useSnackbar } from 'notistack';
// import { AddBillingPlanProps } from 'interfaces/billingPlan';
// // import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';

// interface AddModalProps {
//   openModal: boolean;
//   setOpenModal: () => void;
//   planId: number | null;
//   fetchBillingPlans: () => void;
//   initialValues?: any;
//   setInitialValues?: any;
// }

// const AddBillingPlan = ({
//   openModal,
//   setOpenModal,
//   planId,
//   fetchBillingPlans,
//   initialValues,
//   setInitialValues,
// }: AddModalProps) => {
//   const { enqueueSnackbar } = useSnackbar();

//   const handleSubmit = async (values: AddBillingPlanProps, actions: any) => {
//     let payload = {
//       pricing_type: values.planName,
//       title: values.planName,
//       description: values.planDescription,
//       price: values.price,
//       features: values.featureList.map((item: any) => item.featureTitle),
//     };

//     if (planId && planId > 0) {
//       await putAPI(`billings/${planId}`, payload)
//         .then((res) => {
//           enqueueSnackbar(res.data.message, { variant: 'success' });
//           actions.setSubmitting(false);
//           setOpenModal();
//           fetchBillingPlans();
//         })
//         .catch((err) => {
//           enqueueSnackbar('Something went wrong', { variant: 'error' });
//           actions.setSubmitting(false);
//         });
//     } else {
//       await postAPI('/billings/', [payload])
//         .then((res) => {
//           enqueueSnackbar('Billing plan created successfully', { variant: 'success' });
//           actions.setSubmitting(false);
//           actions.resetForm();
//           setOpenModal();
//           fetchBillingPlans();
//         })
//         .catch((err) => {
//           enqueueSnackbar('Something went wrong', { variant: 'error' });
//           actions.setSubmitting(false);
//         });
//     }
//   };

//   React.useEffect(() => {
//     if (planId && planId > 0) {
//       const getPlanDetails = async () => {
//         await getAPI(`billings/${planId}`)
//           .then((res) => {
//             console.log(res.data, 'res.data');
//             setInitialValues({
//               id: res.data.id,
//               plan: res.data.pricing_type,
//               planName: res.data.title,
//               planDescription: res.data.description,
//               price: res.data.price,
//               featureList: res.data.features.map((item: any) => {
//                 return {
//                   featureTitle: item.feature,
//                 };
//               }),
//             });
//           })
//           .catch((err) => {
//             enqueueSnackbar('Something went wrong', { variant: 'error' });
//           });
//       };
//       getPlanDetails();
//     }
//   }, [planId]);

//   return (
//     <div id="AddBillingPlan">
//       <div className="AddBillingPl_container">
//         <ModalLayout
//           id="MCRModal"
//           large={true}
//           children={
//             <>
//               <div
//                 className="config_modal_form_css user__department-field"
//                 style={{
//                   maxHeight: 'calc(100vh - 100px)',
//                   overflowY: 'auto',
//                 }}>
//                 <div className="config_modal_heading">
//                   <div className="config_modal_title">
//                     {' '}
//                     {planId ? 'Update' : 'Add'} Billing Plans
//                   </div>
//                   <div className="config_modal_text">
//                     <div>Here you can {planId ? 'Update' : 'create new'} billing plans.</div>
//                     <Divider />
//                   </div>
//                 </div>
//                 <div
//                   className="event_form_coantainer"
//                   style={{
//                     padding: '20px',
//                   }}>
//                   <Formik
//                     key={'add event'}
//                     enableReinitialize={true}
//                     initialValues={initialValues}
//                     onSubmit={(values: any, actions) => {
//                       // console.log(actions, 'actions');
//                       handleSubmit(values, actions);
//                     }}
//                     validationSchema={BillingValidation}>
//                     {(props: FormikProps<AddBillingPlanProps>) => {
//                       const {
//                         values,
//                         touched,
//                         errors,
//                         handleBlur,
//                         handleSubmit,
//                         handleChange,
//                         setFieldValue,
//                         setFieldTouched,
//                         isSubmitting,
//                         initialTouched,
//                       } = props;

//                       console.log(errors, 'dfefe')

//                       return (
//                         <>
//                           <form className="Add-billing-plan-form" onSubmit={handleSubmit}>
//                             <Grid container spacing={2}>

//                               <Grid item xs={12}>
//                                 <InputLabel htmlFor="planName">
//                                   <div className="label-heading  align__label">
//                                     Package Name <sup>*</sup>
//                                   </div>
//                                 </InputLabel>
//                                 <Field
//                                   as={TextField}
//                                   name="planName"
//                                   id="planName"
//                                   type="text"
//                                   placeholder="Enter here"
//                                   size="small"
//                                   data-testid="planName"
//                                   fullWidth
//                                   autoComplete="off"
//                                   value={values?.planName || ''}
//                                   error={errors?.planName && touched?.planName ? true : false}
//                                   onChange={handleChange}
//                                   onBlur={handleBlur}
//                                 />

//                                 {errors?.planName && touched?.planName && (
//                                   <div className="input-feedback" style={{ color: 'red' }}>
//                                     {errors?.planName}
//                                   </div>
//                                 )}
//                               </Grid>

//                               <Grid item xs={12}>
//                                 <InputLabel htmlFor="price">
//                                   <div className="label-heading  align__label">
//                                     Price <sup>*</sup>
//                                   </div>
//                                 </InputLabel>
//                                 <Field
//                                   as={TextField}
//                                   name="price"
//                                   id="price"
//                                   type="number"
//                                   placeholder="Enter here"
//                                   size="small"
//                                   data-testid="price"
//                                   fullWidth
//                                   autoComplete="off"
//                                   value={values?.price || ''}
//                                   error={errors?.price && touched?.price ? true : false}
//                                   onChange={handleChange}
//                                   onBlur={handleBlur}
//                                 />

//                                 {errors?.price && touched?.price && (
//                                   <div className="input-feedback" style={{ color: 'red' }}>
//                                     {errors?.price}
//                                   </div>
//                                 )}
//                               </Grid>
//                               <Grid item xs={12}>
//                                 <InputLabel htmlFor="planDescription">
//                                   <div className="label-heading  align__label">
//                                     Description <sup>*</sup>
//                                   </div>
//                                 </InputLabel>
//                                 <Field
//                                   as={TextField}
//                                   name="planDescription"
//                                   id="planDescription"
//                                   type="text"
//                                   placeholder="Enter here"
//                                   size="small"
//                                   data-testid="planDescription"
//                                   fullWidth
//                                   autoComplete="off"
//                                   value={values?.planDescription || ''}
//                                   error={
//                                     errors?.planDescription && touched?.planDescription
//                                       ? true
//                                       : false
//                                   }
//                                   onChange={handleChange}
//                                   onBlur={handleBlur}
//                                 />

//                                 {errors?.planDescription && touched?.planDescription && (
//                                   <div className="input-feedback" style={{ color: 'red' }}>
//                                     {errors?.planDescription}
//                                   </div>
//                                 )}
//                               </Grid>

//                               <Grid item xs={12}>
//                                 <Divider
//                                   variant="middle"
//                                   style={{
//                                     margin: '20px 0',
//                                   }}
//                                 />
//                               </Grid>

//                               <FieldArray name="featureList">
//                                 {({ push, remove }: any) => (
//                                   <>
//                                     {values?.featureList?.map((_: any, index: number) => (
//                                       <>
//                                         <Grid item xs={2} key={index}>
//                                           {index === 0 && (
//                                             <InputLabel htmlFor="featureList">
//                                               <div className="label-heading  align__label">
//                                                 Features
//                                                 {/* <FormatListBulletedIcon
//                                                   style={{
//                                                     marginLeft: '10px',
//                                                     fontSize: '18px',
//                                                     marginTop: '3px',
//                                                   }}
//                                                 /> */}
//                                               </div>
//                                             </InputLabel>
//                                           )}
//                                         </Grid>
//                                         <Grid item xs={10} key={index}>
//                                           <div
//                                             className="flexing_the_list"
//                                             style={{
//                                               display: 'flex',
//                                               alignItems: 'center',
//                                             }}>
//                                             <Field
//                                               as={TextField}
//                                               name={`featureList.${index}.featureTitle`}
//                                               id={`featureList.${index}.featureTitle`}
//                                               type="text"
//                                               placeholder="Enter here"
//                                               size="small"
//                                               data-testid="featureTitle"
//                                               fullWidth
//                                               autoComplete="off"
//                                               onChange={handleChange}
//                                               onBlur={handleBlur}
//                                             />

//                                             <IconButton
//                                               disabled={values?.featureList?.length === 1}
//                                               aria-label="Remove"
//                                               onClick={() => remove(index)}>
//                                               <ClearIcon
//                                                 style={{
//                                                   border: '1px solid #ccc',
//                                                   borderRadius: '50%',
//                                                   padding: '2px',
//                                                   fontSize: '16px',
//                                                   color: '#d40b0b',
//                                                 }}
//                                               />
//                                             </IconButton>

//                                             <IconButton aria-label="Add" onClick={() => push('')}>
//                                               <AddIcon
//                                                 style={{
//                                                   border: '1px solid #ccc',
//                                                   borderRadius: '50%',
//                                                   padding: '2px',
//                                                   fontSize: '16px',
//                                                   color: '#33426a',
//                                                 }}
//                                               />
//                                             </IconButton>
//                                           </div>
//                                         </Grid>
//                                       </>
//                                     ))}

//                                     {errors?.featureList && touched?.featureList && (
//                                       <div
//                                         className="input-feedback"
//                                         style={{ color: 'red', marginLeft: '16px' }}>
//                                         {errors?.featureList.toString()}
//                                       </div>
//                                     )}
//                                   </>
//                                 )}
//                               </FieldArray>
//                             </Grid>

//                             <Divider variant="middle" style={{ margin: '20px 0' }} />
//                             <div
//                               className="modal_footer"
//                               style={{
//                                 float: 'right',
//                                 margin: '10px 0',
//                               }}>
//                               <Button
//                                 variant="outlined"
//                                 type="button"
//                                 onClick={setOpenModal}
//                                 sx={{ mr: 1 }}>
//                                 Cancel
//                               </Button>

//                               <LoadingButton
//                                 color="primary"
//                                 type="submit"
//                                 variant="contained"
//                                 sx={{ mr: 1 }}
//                                 disabled={isSubmitting}
//                                 loadingPosition="end">
//                                 {planId ? 'Update' : 'Create'}
//                               </LoadingButton>
//                             </div>
//                           </form>
//                         </>
//                       );
//                     }}
//                   </Formik>
//                 </div>
//               </div>
//             </>
//           }
//           openModal={openModal}
//           setOpenModal={setOpenModal}
//         />
//       </div>
//     </div>
//   );
// };

// export default AddBillingPlan;
