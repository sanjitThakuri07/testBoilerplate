import ConfirmationModal from "src/components/ConfirmationModal/ConfirmationModal";
import {
  Box,
  Button,
  CircularProgress,
  FormGroup,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { Field, Formik, FormikProps } from "formik";
import { AssignActivityProps } from "src/interfaces/configs";
import { useEffect, useState } from "react";
import { getAPI, postAPI, putAPI } from "src/lib/axios";
import { useSnackbar } from "notistack";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import { Theme, useTheme } from "@mui/material/styles";
import BackButton from "src/components/buttons/back";
import { Typography } from "@mui/material";
import AssignActivityForm from "./Form/AssignActivityForm";
import SendChat from "./Chat/SendChat";
import { fetchApI } from "src/modules/apiRequest/apiRequest";

interface RoleProps {
  title: string;
  description: string;
  // type: any;
  // user_department_id: any;
  user_department: any;
  users: any;
  territory: any;
  priority: string;
  due_date: any;
  status?: string | boolean | number;
  message?: string;
  document: any;
  is_issue?: boolean;
}

const AddAssignActivity = ({
  assignData,
  isEdit = false,
  assignActivityID,
  getAssignValue,
  className,
  handleClose,
  disabled = false,
}: any) => {
  const [userDepartmentData, setUserDepartmentData] = useState<any>([]);
  const [assigneesData, setAssigneesData] = useState<any>([]);
  const [activityStatus, setActivityStatus] = useState<any>([]);
  const [clearData, setClearData] = useState<boolean>(false);
  const initialValues = isEdit
    ? // ? assignData
      {
        title: assignData?.title,
        description: assignData?.description,
        // type: '',
        // user_department_id: '',
        user_department: assignData?.user_department,
        is_issue: assignData?.is_issue,
        inspection_id: assignData?.inspection_id,
        users: assignData?.users,
        territory: [],
        priority: assignData?.priority,
        due_date: assignData?.due_date,
        status: assignData?.status?.id,
        message: assignData?.message,
        document: assignData?.document,
        id: assignData?.id,
      }
    : {
        title: "",
        description: "",
        // type: '',
        // user_department_id: '',
        user_department: [],
        is_issue: false,
        users: [],
        territory: [],
        priority: "",
        due_date: "",
        status: 1,
        message: "",
        document: [],
      };
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [isBlurTitle, setIsBlurTitle] = useState(false);
  const [isBlurDescription, setIsBlurDescription] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const [personName, setPersonName] = useState<string[]>([]);

  const param = useParams<{ inspectionNameId: string }>();
  const [userDept, setUserDept] = useState<any>(assignData?.user_department || []);

  // const settingInitialValues = () => {
  //   const inspectionValues = generalCardContainer?.find(
  //     (val: any) => val?.id == param?.inspectionNameId
  //   );
  //   setInitialValues({
  //     name: inspectionValues?.name,
  //     status: inspectionValues?.status,
  //     permissions: inspectionValues?.permissions,
  //   });
  // };
  const validation = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    user_department: Yup.array()
      .of(Yup.number().required("User department is required"))
      .min(1, "Select at least one user department"),
    users: Yup.array()
      .of(Yup.number().required("At least one user is required"))
      .min(1, "Select at least one user"),
    priority: Yup.string().required("Priority is required"),
    due_date: Yup.date().nullable().required("Due date is required"),
    status: Yup.number().required("Status is required"),
  });

  function getStyles(name: string, personName: string[], theme: Theme) {
    return {
      fontWeight:
        personName.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }

  const getUserDepartment = async () => {
    const url = "user-department/";
    await fetchApI({
      url: url,
      setterLoading: setLoading,
      setterFunction: (data: any) => {
        setUserDepartmentData(data);
      },
      queryParam: "q=&archived=&page=1&size=100",
    });
  };
  const getAssignees = async ({ ids }: any) => {
    const generateQuery = () => {
      let query = "";
      if (ids?.length > 0) {
        query = ids?.map((d: number) => `departments=${d}&`)?.join("");
      }
      return query;
    };
    const url = "activity/users-department";
    const uri = ids?.length ? `${url}?${generateQuery()}` : `${url}`;

    // await fetchApI({
    //   url: uri,
    //   setterLoading:setLoading,
    //   setterFunction: (data: any) => {
    //     setAssigneesData(data);
    //   },
    // });
    try {
      setLoading(true);
      generateQuery();
      const { status, data } = await getAPI(uri);

      setLoading(false);
      setAssigneesData(data);
    } catch (error: any) {
      setLoading(false);
      enqueueSnackbar(error.response.data.message || "Something went wrong!", {
        variant: "error",
      });
    }
  };

  const getStatus = async () => {
    const url = "activity-status/";
    await fetchApI({
      url: url,
      setterLoading: setLoading,
      setterFunction: (data: any) => {
        setActivityStatus(data);
      },
    });
  };

  useEffect(() => {
    getUserDepartment();
    getStatus();
  }, []);

  useEffect(() => {
    if (userDept?.length) {
      getAssignees({ ids: userDept });
    }
  }, [userDept]);

  const onAdd = async (
    values: any,
    getAssignValue?: Function,
    formikHelpers?: any,
    handleClose?: Function,
  ) => {
    try {
      setLoading(true);

      const { data } = await postAPI("/activity/", [
        {
          ...values,
        },
      ]);
      getAssignValue?.(data?.data);
      // addUserRoles(values);

      setLoading(false);
      formikHelpers.resetForm();
      setClearData(true);
      handleClose?.();
      enqueueSnackbar("Assigned Activity successfully!", {
        variant: "success",
      });

      !getAssignValue && navigate(-1);
    } catch (error: any) {
      enqueueSnackbar(error?.response?.data?.detail?.message || "Something went wrong!", {
        variant: "error",
      });
      setLoading(false);
    }
  };
  const onEdit = async (
    values: any,
    getAssignValue?: Function,
    formikHelpers?: any,
    handleClose?: Function,
  ) => {
    try {
      setLoading(true);

      const { data } = await putAPI(`activity/${assignActivityID}`, {
        ...values,
      });
      getAssignValue?.(data?.data);
      // addUserRoles(values);

      setLoading(false);
      formikHelpers.resetForm();
      handleClose?.();

      setClearData(true);
      enqueueSnackbar("Saved  Activity successfully!", {
        variant: "success",
      });
      !getAssignValue && navigate("/assign-activities");
    } catch (error: any) {
      enqueueSnackbar(error?.response?.data?.detail?.message || "Something went wrong!", {
        variant: "error",
      });
      setLoading(false);
    }
  };
  // if (loading) {
  //   return (
  //     <>
  //       <FullPageLoader />
  //     </>
  //   );
  // }
  return (
    <div className={`region-form-holder ${className ? className : ""}`}>
      {/* <ConfirmationModal
        openModal={openModal}
        setOpenModal={() => setOpenModal(!openModal)}
        handelConfirmation={() => {
          setOpenModal(false);
          navigate(-1);
        }}
        confirmationHeading={`Inspection Name ${
          param.inspectionNameId === undefined ? "created" : "updated"
        } successfully!`}
        confirmationDesc={`The Inspection table content has been successfully ${
          param.inspectionNameId === undefined ? "created" : "updated"
        }  according to the way you customized.`}
        status="success"
        confirmationIcon="/assets/icons/icon-success.svg"
        isSuccess
        IsSingleBtn
        btnText="Go to inspection types"
      /> */}
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={validation}
        onSubmit={async (values, formikHelpers) => {
          isEdit
            ? onEdit(values, getAssignValue, formikHelpers, handleClose)
            : onAdd(values, getAssignValue, formikHelpers, handleClose);
        }}
      >
        {(props: FormikProps<AssignActivityProps>) => {
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
          // if(values?.user_department?.length && values.user_department.includes(...userDept) ){
          // }else{
          //   values.users=[]
          // }
          setUserDept(values.user_department);

          return (
            <form
              className="assign-activity-form"
              onSubmit={handleSubmit}
              style={{ margin: !isEdit ? ".8rem 15px" : ".8rem 0" }}
            >
              {/* {loading && <CircularProgress className="page-loader" />} */}
              {!isEdit && (
                <>
                  <BackButton />
                  <Typography variant="h6" className="form-title" marginLeft="25px">
                    Add Activity
                  </Typography>
                </>
              )}
              <div>
                <AssignActivityForm
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  formikValues={props}
                  values={values}
                  touched={touched}
                  errors={errors}
                  userDepartmentData={userDepartmentData}
                  assigneesData={assigneesData}
                  prevData={assignData}
                  activityStatus={activityStatus}
                  setFieldValue={setFieldValue}
                  clearData={clearData}
                  setClearData={setClearData}
                  isEdit={isEdit}
                  disabled={disabled}
                  loading={loading}
                />
              </div>
              {isEdit && (
                <div>
                  <SendChat
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    values={values}
                    errors={errors}
                    touched={touched}
                    setFieldValue={setFieldValue}
                    assignActivityID={assignActivityID}
                    assignData={assignData}
                    disabled={disabled}
                  />
                </div>
              )}

              {!disabled && (
                <div className="">
                  <Grid container spacing={2} justifyContent="flex-end" padding={"10px 20px"}>
                    <Grid item>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          if (handleClose) {
                            return handleClose?.();
                          }
                          navigate(-1);
                        }}
                      >
                        Cancel
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        variant="contained"
                        onClick={() => {
                          handleSubmit();
                        }}
                        type="button"
                        disabled={!isValid || !dirty || isSubmitting || loading}
                      >
                        {isEdit ? "Save" : "Add"} Activity
                      </Button>
                    </Grid>
                  </Grid>
                </div>
              )}
            </form>
          );
        }}
      </Formik>
    </div>
  );
};

export default AddAssignActivity;
