import { Box } from "@mui/system";
import { Field, Form, Formik, FormikProps } from "formik";
import { UserDepartmentSchema } from "src/components/validationSchema";
import {
  Alert,
  Button,
  FormGroup,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextareaAutosize,
  TextField,
} from "@mui/material";
import MultiEmail from "src/components/MultiEmail/MultiEmail";
import { useEffect, useState } from "react";
import { getAPI, postAPI, putAPI } from "src/lib/axios";
import { useSnackbar } from "notistack";
import ButtonLoaderSpinner from "src/components/ButtonLoaderSpinner/ButtonLoaderSpinner";
import ConfirmationModal from "src/components/ConfirmationModal/ConfirmationModal";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { postApiData, putApiData } from "src/modules/apiRequest/apiRequest";
import FullPageLoader from "src/components/FullPageLoader";
import { NAVIGATE_ROUTES, USER_DEPARTMENT } from "src/modules/config/generalSettings/constantsForm";
import MultiEmailCustom from "src/components/MultiEmail/MultiEmail2";

interface DepartmentFormI {
  name: string;
  notification_email?: string[];
  status: string;
  notes: string;
}

interface DepartmentInterfaceFormProps {
  updateCard?: Function;
}

const DepartmentForm: React.FC<{
  updateCard?: Function;
  disabled?: boolean;
}> = ({ updateCard, disabled }) => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const param = useParams<{ userDepartmentId: string }>();
  const location = useLocation();
  const [addAnother, setAddAnother] = useState(false);
  const [loading, setLoading] = useState(false);

  const [initialValues, setInitialValues] = useState<DepartmentFormI>({
    name: "",
    notification_email: [],
    status: "Active",
    notes: "",
  });
  const [error, setError] = useState("");
  const [openModal, setOpenModal] = useState(false);

  function ADD_ANOTHER_HANDLER() {
    if (addAnother) {
      setInitialValues(USER_DEPARTMENT);
      setOpenModal(false);
    } else if (!addAnother) {
      navigate(NAVIGATE_ROUTES.userDepartment);
    }
  }

  const SaveProceedHandler = async (values: any, actions: any) => {
    setLoading(true);
    let apiResponse: any = false;
    // actions.setSubmitting(true);
    if (param.userDepartmentId) {
      apiResponse = await putApiData({
        values: { ...values, notification_email: values.notification_email },
        id: +param.userDepartmentId,
        url: "user-department",
        enqueueSnackbar: enqueueSnackbar,
        setterFunction: (data: any) => {
          updateCard?.((prev: any) => {
            let filterDatas = prev?.filter(
              (data: { id?: number }) => data?.id !== Number(values?.id),
            );
            return [data?.data, ...filterDatas];
          });
        },
      });
    } else {
      await postApiData({
        setterFunction: (data: any) => {
          // console.log({ data });
          if (!data.data) return;
          updateCard?.((prev: Object[]) => [data?.data[0], ...prev]);
          // actions.setSubmitting(false);
          actions.resetForm();
          // navigate('/password-reset-link');
          // setOpenModal(true);
        },
        values: [
          {
            ...values,
          },
        ],
        url: `/user-department/`,
        enqueueSnackbar: enqueueSnackbar,
      });
    }
    ADD_ANOTHER_HANDLER();
    if (!apiResponse) {
      setLoading(false);
      return;
    }
    // setOpenModal(true);
    actions.resetForm({ values: USER_DEPARTMENT });
    setLoading(false);
  };

  const getUserDepartmentInfo = async () => {
    await getAPI(`user-department/${param.userDepartmentId}`)
      .then((res: { data: any; status: any }) => {
        if (res.status === 200) {
          setInitialValues({ ...res.data });
        }
      })
      .catch((err: any) => {
        enqueueSnackbar(err?.response?.data?.detail?.message || "Something went wrong!", {
          variant: "error",
        });
        navigate("/config/users/user-department");
      });
  };

  // getting all the individual departments
  useEffect(() => {
    if (!param.userDepartmentId) {
      return;
    } else {
      getUserDepartmentInfo();
    }
  }, [location.pathname, param.userDepartmentId]);

  return (
    <>
      <div className="region-form-holder">
        <ConfirmationModal
          openModal={openModal}
          setOpenModal={() => setOpenModal(!openModal)}
          handelConfirmation={() => {
            setOpenModal(false);
            navigate(-1);
          }}
          confirmationHeading={`User Department ${
            param.userDepartmentId === undefined ? "created" : "updated"
          } successfully!`}
          confirmationDesc={`The region table content has been successfully ${
            param.userDepartmentId === undefined ? "created" : "updated"
          }  according to the way you customized.`}
          status="success"
          confirmationIcon="/assets/icons/icon-success.svg"
          isSuccess
          IsSingleBtn
          btnText="Go to users"
        />

        {/* catching the error message from db */}
        {error && <Alert severity="error">{error}</Alert>}
        {loading && <FullPageLoader />}
        <Formik
          initialValues={initialValues}
          enableReinitialize
          onSubmit={SaveProceedHandler}
          validationSchema={UserDepartmentSchema}
        >
          {(props: FormikProps<DepartmentFormI>) => {
            const {
              values,
              touched,
              errors,
              handleBlur,
              handleChange,
              isValid,
              dirty,
              isSubmitting,
              setFieldValue,
              setFieldTouched,
              handleSubmit,
            } = props;

            return (
              <Form className="region-form">
                <div className="region-fieldset">
                  {/* User Department Name */}
                  <Grid container spacing={4} className="formGroupItem">
                    <Grid item xs={4}>
                      <InputLabel htmlFor="name">
                        <div className="label-heading">
                          User Department Name <sup>*</sup>
                        </div>
                      </InputLabel>
                    </Grid>
                    <Grid item xs={7}>
                      <Stack direction="column" sx={{ width: "100%" }}>
                        <Box>
                          <Field
                            as={OutlinedInput}
                            size="small"
                            id="name"
                            type="text"
                            fullWidth
                            sx={{ marginTop: "5px" }}
                            placeholder="Enter here"
                            value={values.name}
                            error={errors.name && touched.name ? true : false}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            disabled={disabled}
                            className={`form_input ${disabled ? "disabled" : ""}`}
                          />
                        </Box>
                        <Box>
                          {errors?.name && touched?.name && (
                            <FormHelperText style={{ color: "red" }}>{errors?.name}</FormHelperText>
                          )}
                        </Box>
                      </Stack>
                    </Grid>
                  </Grid>

                  {/* notification email id */}
                  <Grid
                    container
                    spacing={4}
                    className="formGroupItem"
                    id="multiple_email_address_id"
                  >
                    <Grid item xs={4}>
                      <InputLabel htmlFor="notification_email">
                        <div className="label-heading">Notification Email ID</div>
                        <p>Notifications will be send to this Email ID</p>
                      </InputLabel>
                    </Grid>

                    <Grid item xs={7} className="multiple_email_address_id">
                      <MultiEmailCustom
                        placeholder="Notification emails"
                        value={values.notification_email || []}
                        onChange={(emails: string[]) => {
                          setFieldValue("notification_email", emails);
                          setFieldTouched("notification_email", true);
                        }}
                        disabled={disabled}
                      />
                      {/* <MultiEmail
                        id="notification_email"
                        value={values.notification_email || []}
                        onChange={(emails: any) => {
                          setFieldValue('notification_email', emails);
                          setFieldTouched('notification_email');
                        }}
                        placeholder="Enter here"
                        emails={values.notification_email || []}
                        disabled={disabled}
                      /> */}
                      <Box>
                        {errors?.notification_email && touched?.notification_email && (
                          <FormHelperText style={{ color: "red" }}>
                            {errors?.notification_email}
                          </FormHelperText>
                        )}
                      </Box>
                    </Grid>
                  </Grid>

                  {/* status */}
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
                          disabled={disabled}
                          className={disabled ? "disabled" : ""}
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

                  {/* add notes */}
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
                          onChange={(ev) => {
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

                  {/* submit button */}
                  {!disabled && (
                    <div className="action-button-holder">
                      <Grid container spacing={2} justifyContent="flex-end">
                        <div className="add_another_btn">
                          <Grid item>
                            <Button
                              variant="outlined"
                              type="submit"
                              onClick={() => {
                                setAddAnother(true);
                                handleSubmit();
                              }}
                              disabled={!isValid || !dirty || isSubmitting}
                            >
                              Add Another User Department
                            </Button>
                          </Grid>
                        </div>
                        <Grid item>
                          <Button
                            disabled={isSubmitting ? true : false}
                            variant="contained"
                            type="submit"
                            onClick={() => {
                              setAddAnother(false);
                              handleSubmit();
                            }}
                            sx={{ width: "140px" }}
                          >
                            {isSubmitting ? <ButtonLoaderSpinner /> : "Save & Proceed"}
                          </Button>
                        </Grid>
                      </Grid>
                    </div>
                  )}
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </>
  );
};

export default DepartmentForm;
