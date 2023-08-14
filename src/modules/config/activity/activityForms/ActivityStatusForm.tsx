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
import { commonTypeProps } from "src/interfaces/configs";
import React, { FC, useEffect, useState } from "react";
import { ServiceSchema } from "validationSchemas/config";
import { getAPI, postAPI, putAPI } from "src/lib/axios";
import { useSnackbar } from "notistack";
import { activityTypeStore } from "src/store/zustand/globalStates/config";
import { useNavigate, useParams } from "react-router-dom";
import { fetchApI, fetchIndividualApi } from "src/modules/apiRequest/apiRequest";
import DynamicSelectField from "containers/setting/profile/DynamicSelectField";
import ModalLayout from "src/components/ModalLayout";
import DepartmentForm from "src/modules/config/users/userDepartment/DepartmentForm";
import FullPageLoader from "src/components/FullPageLoader";
import { postApiData, putApiData } from "src/modules/apiRequest/apiRequest";
import { useLocation } from "react-router-dom";
import { ActivityStatus } from "src/utils/url";

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

  const param = useParams<{ activityStatusId: string }>();

  const fetchRegionStatus = async () => {
    const { status, data } = await getAPI("service/check-autofill");

    if (status === 200) {
      setServiceStatus(data.status);
    }
  };

  const GetDatasAPi = async ({ activityStatusId }: any) => {
    let promises = [
      fetchApI({
        setterFunction: setUserDepartment,
        url: "user-department/",
        // enqueueSnackbar,
        queryParam: `size=99`,
        requireLabel: true,
      }),
    ];

    await Promise.all(promises);
  };

  // fetching data for both with and without ids
  const fetchData = async ({ activityStatusId }: any) => {
    setIsFormLoading(true);
    await GetDatasAPi({ activityStatusId });
    setIsFormLoading(false);
  };

  useEffect(() => {
    fetchData({ activityStatusId: param?.activityStatusId });

    if (param?.activityStatusId) {
      fetchIndividualApi({
        id: +param?.activityStatusId,
        url: "activity-status",
        // enqueueSnackbar,
        setterFunction: (data: any) => {
          setIndividualData?.(data);
        },
      });
    }
  }, [param?.activityStatusId]);

  const location = useLocation();

  const check =
    ActivityStatus?.includes(initialValues?.name || "") && location.pathname.includes("edit");

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
          param?.activityStatusId === undefined ? "created" : "updated"
        } successfully!`}
        confirmationDesc={`The activity type table content has been successfully ${
          param?.activityStatusId === undefined ? "created" : "updated"
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
            <div className="config_modal_form_css">
              <div className="config_modal_heading">
                <div className="config_modal_title">Add User Department</div>
                <div className="config_modal_text">
                  <div>Fill in the details for adding the new user department.</div>
                </div>
              </div>
              <DepartmentForm></DepartmentForm>
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
        validationSchema={ServiceSchema({ blockName: "Activity Status" })}
        onSubmit={async (values, formikHelpers) => {
          setIsFormLoading(true);
          if (values?.id) {
            await putApiData({
              setterFunction: (data: any) => {
                if (data?.data) {
                  // store (juststand)
                  const updatedData = {
                    name: data?.data?.name,
                    id: data?.data?.id,
                    status: data?.data?.status,
                    notes: data?.data?.notes,
                  };
                  updateActivityType(updatedData);
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
                    // formikHelpers?.resetForm();
                    formikHelpers.resetForm();
                    setOpenModal(false);
                    navigate("/config/activity/status/add", { replace: true });
                  } else {
                    navigate("/config/activity/status", { replace: true });
                  }
                }
              },
              url: `activity-status`,
              id: values?.id,
              enqueueSnackbar,
              values: values,
            });
          } else {
            await postApiData({
              setterFunction: (data: any) => {
                if (!data.data.length) return;
                addActivityType({
                  name: data?.data[0]?.name,
                  id: data?.data[0]?.id,
                  status: data?.data[0]?.status,
                  notes: data?.data[0]?.notes,
                });
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
                  setIndividualData?.({
                    name: "",
                    status: "Active",
                    notes: "",
                  });
                  setOpenModal(false);
                } else if (!routeToHomePage && !addAnother) {
                  navigate("/config/activity/status");
                }
              },
              url: "/activity-status/",
              values: [
                {
                  ...values,
                  auto_generate: serviceStatus ? true : false,
                },
              ],
              enqueueSnackbar: enqueueSnackbar,
            });
          }
          setIsFormLoading(false);
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
          }: any = props;

          return (
            <>
              {isFormLoading && <FullPageLoader />}
              <form className="region-form" onSubmit={handleSubmit}>
                <div className="region-fieldset">
                  <Grid container spacing={4} className="formGroupItem">
                    <Grid item xs={4}>
                      <InputLabel htmlFor="name">
                        <div className="label-heading">
                          Activity Status Name <sup>*</sup>
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
                          className={check ? "disabled" : disabled ? "disabled" : ""}
                          disabled={check ? true : disabled}
                          error={Boolean(touched.name && errors.name)}
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
                          className={check ? "disabled" : disabled ? "disabled" : ""}
                          disabled={check ? true : disabled}
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
                              setAddAnother(true);
                            }}
                          >
                            Add Another Activity Status
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
