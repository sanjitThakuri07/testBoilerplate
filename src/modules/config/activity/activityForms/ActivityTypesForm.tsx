import ConfirmationModal from "src/components/ConfirmationModal/ConfirmationModal";
import {
  Button,
  FormGroup,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  TextareaAutosize,
} from "@mui/material";
import { Formik, FormikProps } from "formik";
import { commonTypeProps } from "src/interfaces/configs";
import React, { FC, useEffect, useState } from "react";
import { ActivityTypeValidation } from "validationSchemas/config";
import { getAPI, postAPI, putAPI } from "src/lib/axios";
import { useSnackbar } from "notistack";
import { activityTypeStore } from "src/store/zustand/globalStates/config";
import { useNavigate, useParams } from "react-router-dom";
import { fetchApI, fetchIndividualApi } from "src/modules/apiRequest/apiRequest";
import DynamicSelectField from "containers/setting/profile/DynamicSelectField";
import ModalLayout from "src/components/ModalLayout";
import DepartmentForm from "src/modules/config/users/userDepartment/DepartmentForm";
import FullPageLoader from "src/components/FullPageLoader";

const ActivityTypesForm: FC<{
  service: commonTypeProps;
  setIndividualData?: Function;
  updateCard?: Function;
  routeToHomePage?: boolean;
  disabled?: boolean;
}> = ({ service, setIndividualData, updateCard, routeToHomePage = false, disabled }) => {
  const initialValues: commonTypeProps = service;
  const [openModal, setOpenModal] = useState(false);
  const [open, setOpen] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [addAnother, setAddAnother] = useState(false);
  const [loading, setIsLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [serviceStatus, setServiceStatus] = useState(false);
  const { addActivityType, updateActivityType, activityType } = activityTypeStore();
  const navigate = useNavigate();
  const [userDepartment, setUserDepartment] = useState([]);

  const param = useParams<{ activityTypeId: string }>();

  const fetchRegionStatus = async () => {
    const { status, data } = await getAPI("service/check-autofill");

    if (status === 200) {
      setServiceStatus(data.status);
    }
  };

  const GetDatasAPi = async ({ activityTypeId }: any) => {
    let promises = [
      fetchApI({
        setterFunction: setUserDepartment,
        url: "user-department/",
        enqueueSnackbar,
        queryParam: `size=99`,
        requireLabel: true,
      }),
    ];

    await Promise.all(promises);
  };

  // fetching data for both with and without ids
  const fetchData = async ({ activityTypeId }: any) => {
    setIsFormLoading(true);
    await GetDatasAPi({ activityTypeId });
    setIsFormLoading(false);
  };

  useEffect(() => {
    fetchData({ activityTypeId: param?.activityTypeId });

    if (param?.activityTypeId) {
      fetchIndividualApi({
        id: +param?.activityTypeId,
        url: "activity-type",
        enqueueSnackbar,
        setterFunction: (data: any) => {
          setIndividualData?.(data);
        },
      });
    }
  }, [param?.activityTypeId]);

  return (
    <div className="region-form-holder">
      <ConfirmationModal
        openModal={openModal}
        setOpenModal={() => setOpenModal(!openModal)}
        handelConfirmation={() => {
          setOpenModal(false);
          navigate(-1);
        }}
        confirmationHeading={`Activity Type ${
          param?.activityTypeId === undefined ? "created" : "updated"
        } successfully!`}
        confirmationDesc={`The activity type table content has been successfully ${
          param?.activityTypeId === undefined ? "created" : "updated"
        }  according to the way you customized.`}
        status="success"
        confirmationIcon="/assets/icons/icon-success.svg"
        isSuccess
        IsSingleBtn
        btnText="Go to activity type"
      />
      <ModalLayout
        children={
          <>
            <div className="config_modal_form_css user__department-field">
              <div className="config_modal_heading">
                <div className="config_modal_title">Add User Department</div>
                <div className="config_modal_text">
                  <div>Fill in the details for adding the new user department.</div>
                </div>
              </div>
              <DepartmentForm updateCard={setUserDepartment}></DepartmentForm>
            </div>
          </>
        }
        openModal={open}
        setOpenModal={() => {
          setOpen(!open);
        }}
      />
      {/*  */}
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={ActivityTypeValidation}
        onSubmit={async (values, formikHelpers) => {
          if (disabled) return;
          try {
            setIsFormLoading(true);
            if (values?.id) {
              const { data } = await putAPI(`activity-type/${values.id}`, {
                ...values,
                user_department: values?.user_department ? values?.user_department : null,
              });
              // update in the store and the variable used place
              if (data?.data) {
                // store (juststand)
                // change in globalcard container
                const updatedData = {
                  name: data?.data?.name,
                  id: data?.data?.id,
                  status: data?.data?.status,
                  notes: data?.data?.notes,
                  user_department: data?.data?.user_department,
                };
                updateActivityType(updatedData);
                // our useState variable
                setIndividualData?.(updatedData);
                updateCard?.((prev: any) => {
                  let filterDatas = prev?.filter(
                    (data: { id?: number }) => data?.id !== Number(values?.id),
                  );
                  return [updatedData, ...filterDatas];
                });

                if (addAnother) {
                  setIndividualData?.({
                    name: "",
                    status: "Active",
                    notes: "",
                    user_department: "",
                  });
                  setOpenModal(false);
                }
                if (addAnother) {
                  setIndividualData?.({
                    name: "",
                    status: "Active",
                    notes: "",
                    user_department: "",
                  });
                  setOpenModal(false);
                } else if (!routeToHomePage && !addAnother) {
                  navigate("/config/activity/types");
                }
              }
            } else {
              const { data } = await postAPI("/activity-type/", [
                {
                  ...values,
                  user_department: values?.user_department ? values?.user_department : null,
                },
              ]);
              const updatedData = {
                name: data?.data[0]?.name,
                id: data?.data[0]?.id,
                status: data?.data[0]?.status,
                notes: data?.data[0]?.notes,
                user_department: data?.data[0]?.user_department,
              };
              addActivityType(updatedData);
              updateCard?.((prev: any) => [updatedData, ...prev]);
            }
            setOpenModal(true);
            setIsFormLoading(false);
            if (addAnother) {
              setIndividualData?.({
                name: "",
                status: "Active",
                notes: "",
                user_department: "",
              });
              setOpenModal(false);
            } else if (!routeToHomePage && !addAnother) {
              navigate("/config/activity/types");
            }
          } catch (error: any) {
            const {
              response: {
                data: { detail },
              },
            } = error;

            enqueueSnackbar(
              (detail?.detail?.message ? detail?.detail?.message : error?.message) ||
                "Something went wrong!",
              {
                variant: "error",
              },
            );
            setIsFormLoading(false);
          }
        }}
      >
        {(props: FormikProps<commonTypeProps>) => {
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
                          Activity Type Name <sup>*</sup>
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
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.name}
                          error={Boolean(touched.name && errors.name)}
                        />
                        {Boolean(touched.name && errors.name) && (
                          <FormHelperText error>{errors.name}</FormHelperText>
                        )}
                      </FormGroup>
                    </Grid>
                  </Grid>

                  {/* services */}
                  <Grid container spacing={4} className="formGroupItem">
                    <Grid item xs={4}>
                      <InputLabel htmlFor="user_department">
                        <div className="label-heading  align__label">User Department</div>
                      </InputLabel>
                    </Grid>

                    <Grid item xs={7}>
                      <DynamicSelectField
                        isViewOnly={false}
                        handleChange={handleChange}
                        handleBlur={handleBlur}
                        handleSelectTouch={() => setFieldTouched("user_department", true)}
                        id="user_department"
                        menuOptions={userDepartment || []}
                        value={values?.user_department}
                        error={errors?.user_department}
                        touched={touched?.user_department}
                        addChildren={true}
                        children={"+ Add New User Department"}
                        openModal={() => setOpen(true)}
                        setData={"id"}
                      />
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
                          minRows={3}
                          placeholder="Type any message that has to be passed on."
                          className={`text-area-service ${disabled ? "disabled" : ""}`}
                          disabled={disabled}
                          id="notes"
                          name="notes"
                          onChange={(ev) => {
                            setFieldValue("notes", ev.target.value);
                            setFieldTouched("notes");
                          }}
                          onBlur={handleBlur}
                          value={values.notes}
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
                              setAddAnother(true);
                            }}
                          >
                            Add Another Activity Type
                          </Button>
                        </Grid>
                      </div>
                      <Grid item>
                        <Button
                          variant="contained"
                          type="submit"
                          disabled={!isValid || !dirty || isSubmitting}
                          onClick={(e) => {
                            setAddAnother(false);
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

export default ActivityTypesForm;
