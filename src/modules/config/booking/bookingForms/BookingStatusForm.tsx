import ConfirmationModal from "src/components/ConfirmationModal/ConfirmationModal";
import {
  Button,
  CircularProgress,
  FormGroup,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextareaAutosize,
  TextField,
} from "@mui/material";
import { Formik, FormikProps } from "formik";
import { serviceProps } from "src/interfaces/configs";
import React, { FC, useEffect, useState } from "react";
import { ServiceSchema } from "src/validationSchemas/config";
import { useSnackbar } from "notistack";
// import { activityTypeStore } from 'src/store/zustand/globalStates/config';
import { useNavigate, useParams } from "react-router-dom";
import { fetchApI, fetchIndividualApi } from "src/modules/apiRequest/apiRequest";
import FullPageLoader from "src/components/FullPageLoader";
import { BOOKING_STATUS_DEFAULT } from "src/modules/config/generalSettings/constantsForm";
import { useLocation } from "react-router-dom";
import useGeneralStatusStore from "src/store/zustand/generalSettings/InsepctionStatus";
import useModuleStore from "src/store/zustand/module";

const BookingStatusForm: FC<{
  service: serviceProps;
  setIndividualData?: Function;
  updateCard?: Function;
  routeToHomePage?: boolean;
  disabled?: boolean;
  addAnother?: boolean;
  setAddAnother?: Function;
}> = ({
  service,
  setIndividualData,
  updateCard,
  routeToHomePage = false,
  disabled,
  addAnother,
  setAddAnother,
}) => {
  const initialValues: serviceProps = service;
  const [openModal, setOpenModal] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(false);
  // const [addAnother, setAddAnother?.] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  // const { addActivityType, updateActivityType, activityType } = activityTypeStore();
  const navigate = useNavigate();

  const param = useParams<{ bookingStatusId: string }>();

  const apiCollection = async ({ id }: any) => {
    // let promises = [
    //   fetchIndividualApi({
    //     id: +id,
    //     url: "general-status",
    //     // enqueueSnackbar,
    //     setterFunction: (data: any) => {
    //       setIndividualData?.(data);
    //     },
    //   }),
    // ];
    // await Promise.all(promises);
    await fetchIndividualGeneralStatus({ id });
  };

  const {
    fetchGeneralStatuss,
    postGeneralStatus,
    updateGeneralStatus,
    fetchIndividualGeneralStatus,
    individualGeneralStatus,
    generalStatuss,
  }: any = useGeneralStatusStore();

  const { fetchModules, modules }: any = useModuleStore();

  const fetchData = async ({ id }: any) => {
    setIsFormLoading(true);
    await apiCollection({ id });
    setIsFormLoading(false);
  };

  useEffect(() => {
    fetchModules({});
  }, []);

  useEffect(() => {
    if (param?.bookingStatusId && !addAnother) {
      fetchData({ id: param?.bookingStatusId });
    }
  }, [param?.bookingStatusId, addAnother]);
  const location = useLocation();

  const check =
    ["Completed", "In Progress", "Cancelled", "Invoiced"]?.includes(initialValues?.name) &&
    location.pathname.includes("edit");

  return (
    <div className="region-form-holder">
      <ConfirmationModal
        openModal={openModal}
        setOpenModal={() => setOpenModal(!openModal)}
        handelConfirmation={() => {
          setOpenModal(false);
          navigate(-1);
        }}
        confirmationHeading={`Activity Status ${
          param?.bookingStatusId === undefined ? "created" : "updated"
        } successfully!`}
        confirmationDesc={`The activity type table content has been successfully ${
          param?.bookingStatusId === undefined ? "created" : "updated"
        }  according to the way you customized.`}
        status="success"
        confirmationIcon="src/assets/icons/icon-success.svg"
        isSuccess
        IsSingleBtn
        btnText="Go to activity type"
      />
      {/*  */}
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={ServiceSchema({ blockName: "Booking Status" })}
        onSubmit={async (values, formikHelpers) => {
          if (disabled) return;
          // try {
          //   setIsFormLoading(true);
          //   if (values?.id) {
          //     const { data } = await putAPI(`booking-status/${values.id}`, {
          //       ...values,
          //     });
          //     // update in the store and the variable used place
          //     if (data?.data) {
          //       const updatedData = {
          //         name: data?.data?.name,
          //         id: data?.data?.id,
          //         status: data?.data?.status,
          //         notes: data?.data?.notes,
          //       };
          //       // our useState variable
          //       setIndividualData?.(updatedData);
          //       // change in globalcard container
          //       updateCard?.((prev: any) => {
          //         let filterDatas = prev?.filter(
          //           (data: { id?: number }) => data?.id !== Number(values?.id),
          //         );
          //         return [updatedData, ...filterDatas];
          //       });
          //       if (addAnother) {
          //         setIndividualData?.(BOOKING_STATUS_DEFAULT);
          //         setOpenModal(false);
          //         formikHelpers.resetForm({ values: BOOKING_STATUS_DEFAULT });
          //       } else if (!routeToHomePage && !addAnother) {
          //         navigate("/config/general-status");
          //       }
          //     }
          //   } else {
          //     const { data } = await postAPI("/booking-status/", [
          //       {
          //         ...values,
          //       },
          //     ]);
          //     if (data?.data?.length) {
          //       updateCard?.((prev: any) => [
          //         {
          //           name: data?.data[0]?.name,
          //           id: data?.data[0]?.id,
          //           status: data?.data[0]?.status,
          //           notes: data?.data[0]?.notes,
          //         },
          //         ...prev,
          //       ]);
          //       if (addAnother) {
          //         setIndividualData?.(BOOKING_STATUS_DEFAULT);
          //         setOpenModal(false);
          //         formikHelpers.resetForm({ values: BOOKING_STATUS_DEFAULT });
          //       } else if (!routeToHomePage && !addAnother) {
          //         navigate("/config/general-status");
          //       }
          //     }
          //   }
          //   // setOpenModal(true);
          //   setIsFormLoading(false);
          // } catch (error: any) {
          //   const {
          //     response: {
          //       data: { detail },
          //     },
          //   } = error;

          //   enqueueSnackbar(
          //     (detail?.message ? detail?.message : error?.message) || "Something went wrong!",
          //     {
          //       variant: "error",
          //     },
          //   );
          //   setIsFormLoading(false);
          // }
          let apiResponse: any = false;

          if (values.id) {
            apiResponse = await updateGeneralStatus({
              values: {
                ...values,
                // name: countryOptions?.find((it: any) => it?.value === values.country)?.label,
              },
              id: values?.id,
              updateState: (data: any) => {
                updateCard?.((prev: any) => {
                  let filterDatas = prev?.filter(
                    (data: { id?: number }) => data?.id !== Number(values?.id),
                  );
                  return [
                    {
                      ...data?.data,
                      // name: countryOptions?.find((it: any) => it?.value === data?.data?.country)
                      //   ?.label,
                    },
                    ...filterDatas,
                  ];
                });
              },
              enqueueSnackbar: enqueueSnackbar,
            });
            // updateCountries(values);
          } else {
            apiResponse = await postGeneralStatus({
              values: [
                {
                  ...values,
                  // name: countryOptions?.find((it: any) => {
                  //   return it?.value === values?.country;
                  // })?.label,
                },
              ],
              enqueueSnackbar: enqueueSnackbar,
              updateState: (data: any) => {
                if (!data.data) return;
                updateCard?.((prev: any) => [
                  {
                    ...data?.data[0],
                    // name: countryOptions?.find(
                    //   (it: any) => it?.value === data?.data[0]?.country_id,
                    // )?.label,
                  },
                  ...prev,
                ]);
              },
            });
          }

          if (!apiResponse) {
            return;
          }
          if (addAnother) {
            setIndividualData?.(BOOKING_STATUS_DEFAULT);
            setOpenModal(false);
            formikHelpers.resetForm({ values: BOOKING_STATUS_DEFAULT });
          } else if (!routeToHomePage && !addAnother) {
            navigate("/config/general-status");
          }
        }}
      >
        {(props: FormikProps<serviceProps>) => {
          const {
            values,
            touched,
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
            isValid,
            dirty,
            isSubmitting,
            setFieldValue,
            setFieldTouched,
          } = props;

          return (
            <>
              {isFormLoading && <FullPageLoader />}
              <form className="region-form" onSubmit={handleSubmit}>
                <div className="region-fieldset">
                  <Grid container spacing={4} className="formGroupItem">
                    <Grid item xs={4}>
                      <InputLabel htmlFor="name">
                        <div className="label-heading">
                          General Status Name <sup>*</sup>
                        </div>
                      </InputLabel>
                    </Grid>
                    <Grid item xs={7}>
                      <FormGroup className="input-holder">
                        <OutlinedInput
                          id="name"
                          type="text"
                          placeholder="Type here"
                          size="small"
                          fullWidth
                          name="name"
                          onChange={(e: any) => {
                            // ['Completed', 'In Progress', 'open']?.includes(e.target.value) && setFieldValue('')
                            setFieldValue("name", e.target.value);
                          }}
                          onBlur={handleBlur}
                          value={values.name}
                          error={Boolean(touched.name && errors.name)}
                          disabled={check ? true : disabled}
                          className={check ? "disabled" : disabled ? "disabled" : ""}
                        />
                        {Boolean(touched.name && errors.name) && (
                          <FormHelperText error>{errors.name}</FormHelperText>
                        )}
                      </FormGroup>
                    </Grid>
                  </Grid>

                  <Grid container spacing={4} className="formGroupItem">
                    <Grid item xs={4}>
                      <InputLabel htmlFor="module_id">
                        <div className="label-heading">
                          Module <sup>*</sup>
                        </div>
                      </InputLabel>
                    </Grid>
                    <Grid item xs={7}>
                      <FormGroup className="input-holder">
                        <Select
                          MenuProps={{ PaperProps: { style: { maxHeight: 200 } } }}
                          id="module_id"
                          size="small"
                          fullWidth
                          placeholder="Module"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          name="module_id"
                          value={values?.module_id || ""}
                          // className={check ? "disabled" : disabled ? "disabled" : ""}
                          error={Boolean(touched.module_id && errors.module_id)}
                        >
                          {modules?.length &&
                            modules?.map((module: any) => {
                              return (
                                <MenuItem value={module?.id} key={module?.id}>
                                  {module?.name}
                                </MenuItem>
                              );
                            })}
                        </Select>
                        {Boolean(touched.module_id && errors.module_id) && (
                          <FormHelperText error>{errors.status}</FormHelperText>
                        )}
                      </FormGroup>
                    </Grid>
                  </Grid>

                  <Grid container spacing={4} className="formGroupItem">
                    <Grid item xs={4}>
                      <InputLabel htmlFor="status">
                        <div className="label-heading">
                          Status <sup>*</sup>
                        </div>
                      </InputLabel>
                    </Grid>
                    <Grid item xs={7}>
                      <FormGroup className="input-holder">
                        <Select
                          MenuProps={{ PaperProps: { style: { maxHeight: 200 } } }}
                          id="status"
                          size="small"
                          fullWidth
                          placeholder="Active"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          name="status"
                          value={values.status}
                          disabled={check ? true : disabled}
                          className={check ? "disabled" : disabled ? "disabled" : ""}
                          error={Boolean(touched.status && errors.status)}
                        >
                          <MenuItem value="Active">Active</MenuItem>
                          <MenuItem value="Inactive">Inactive</MenuItem>
                        </Select>
                        {Boolean(touched.status && errors.status) && (
                          <FormHelperText error>{errors.status}</FormHelperText>
                        )}
                      </FormGroup>
                    </Grid>
                  </Grid>
                  <Grid container spacing={4} className="formGroupItem text-area">
                    <Grid item xs={4}>
                      <InputLabel htmlFor="notes">
                        <div className="label-heading">Add Notes</div>
                        <p>A message from you that has to communicated to.</p>
                      </InputLabel>
                    </Grid>
                    <Grid item xs={7}>
                      <FormGroup className="input-holder">
                        <TextareaAutosize
                          placeholder="Type any message that has to be passed on."
                          minRows={3}
                          id="notes"
                          onChange={(ev: any) => {
                            setFieldValue("notes", ev.target.value);
                            setFieldTouched("notes");
                          }}
                          className={`text__area-style ${disabled ? "disabled" : ""}`}
                          disabled={disabled}
                          name="notes"
                          value={values.notes}
                          onBlur={handleBlur}
                          maxLength={300}
                        />
                        <FormHelperText>
                          {300 - Number(values.notes?.length)} characters left
                        </FormHelperText>
                      </FormGroup>
                    </Grid>
                  </Grid>
                </div>
                {!disabled && (
                  <div className="action-button-holder">
                    <Grid container spacing={2} justifyContent="flex-end">
                      <div className="add_another_btn">
                        <Grid item>
                          <Button
                            variant="outlined"
                            type="submit"
                            disabled={!isValid || !dirty || isSubmitting}
                            onClick={(e) => {
                              setAddAnother?.(true);
                            }}
                          >
                            Add Another General Status
                          </Button>
                        </Grid>
                      </div>
                      <Grid item>
                        <Button
                          variant="contained"
                          type="submit"
                          disabled={!isValid || !dirty || isSubmitting}
                          onClick={(e: any) => {
                            setAddAnother?.(false);
                          }}
                        >
                          Save & Proceed
                        </Button>
                      </Grid>
                    </Grid>
                  </div>
                )}
              </form>
            </>
          );
        }}
      </Formik>
    </div>
  );
};

export default BookingStatusForm;
