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
import { getAPI, postAPI, putAPI } from "src/lib/axios";
import { useSnackbar } from "notistack";
// import { activityTypeStore } from 'src/store/zustand/globalStates/config';
import { useNavigate, useParams } from "react-router-dom";
import { fetchApI, fetchIndividualApi } from "src/modules/apiRequest/apiRequest";
import DynamicSelectField from "src/modules/setting/profile/DynamicSelectField";
import ModalLayout from "src/components/ModalLayout";
import DepartmentForm from "src/modules/config/users/userDepartment/DepartmentForm";
import FullPageLoader from "src/components/FullPageLoader";
import { BOOKING_STATUS_DEFAULT } from "src/modules/config/generalSettings/constantsForm";
import { useLocation } from "react-router-dom";

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
  const [open, setOpen] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(false);
  // const [addAnother, setAddAnother?.] = useState(false);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [serviceStatus, setServiceStatus] = useState(false);
  // const { addActivityType, updateActivityType, activityType } = activityTypeStore();
  const navigate = useNavigate();
  const [userDepartment, setUserDepartment] = useState([]);

  const param = useParams<{ bookingStatusId: string }>();

  const fetchRegionStatus = async () => {
    const { status, data } = await getAPI("service/check-autofill");

    if (status === 200) {
      setServiceStatus(data.status);
    }
  };

  const apiCollection = async ({ id }: any) => {
    let promises = [
      fetchIndividualApi({
        id: +id,
        url: "booking-status",
        // enqueueSnackbar,
        setterFunction: (data: any) => {
          setIndividualData?.(data);
        },
      }),
    ];

    await Promise.all(promises);
  };

  const fetchData = async ({ id }: any) => {
    setIsFormLoading(true);
    await apiCollection({ id });
    setIsFormLoading(false);
  };

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
          try {
            setIsFormLoading(true);
            if (values?.id) {
              const { data } = await putAPI(`booking-status/${values.id}`, {
                ...values,
              });
              // update in the store and the variable used place
              if (data?.data) {
                const updatedData = {
                  name: data?.data?.name,
                  id: data?.data?.id,
                  status: data?.data?.status,
                  notes: data?.data?.notes,
                };
                // our useState variable
                setIndividualData?.(updatedData);
                // change in globalcard container
                updateCard?.((prev: any) => {
                  let filterDatas = prev?.filter(
                    (data: { id?: number }) => data?.id !== Number(values?.id),
                  );
                  return [updatedData, ...filterDatas];
                });
                if (addAnother) {
                  setIndividualData?.(BOOKING_STATUS_DEFAULT);
                  setOpenModal(false);
                  formikHelpers.resetForm({ values: BOOKING_STATUS_DEFAULT });
                } else if (!routeToHomePage && !addAnother) {
                  navigate("/config/booking-status");
                }
              }
            } else {
              const { data } = await postAPI("/booking-status/", [
                {
                  ...values,
                },
              ]);
              if (data?.data?.length) {
                updateCard?.((prev: any) => [
                  {
                    name: data?.data[0]?.name,
                    id: data?.data[0]?.id,
                    status: data?.data[0]?.status,
                    notes: data?.data[0]?.notes,
                  },
                  ...prev,
                ]);
                if (addAnother) {
                  setIndividualData?.(BOOKING_STATUS_DEFAULT);
                  setOpenModal(false);
                  formikHelpers.resetForm({ values: BOOKING_STATUS_DEFAULT });
                } else if (!routeToHomePage && !addAnother) {
                  navigate("/config/booking-status");
                }
              }
            }
            // setOpenModal(true);
            setIsFormLoading(false);
          } catch (error: any) {
            const {
              response: {
                data: { detail },
              },
            } = error;

            enqueueSnackbar(
              (detail?.message ? detail?.message : error?.message) || "Something went wrong!",
              {
                variant: "error",
              },
            );
            setIsFormLoading(false);
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
                          Booking Status Name <sup>*</sup>
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
                            Add Another Booking Status
                          </Button>
                        </Grid>
                      </div>
                      <Grid item>
                        <Button
                          variant="contained"
                          type="submit"
                          disabled={!isValid || !dirty || isSubmitting}
                          onClick={(e) => {
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
