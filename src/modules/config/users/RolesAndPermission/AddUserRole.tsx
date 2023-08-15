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
import { Formik, FormikProps } from "formik";
import { UserRolesProps } from "src/interfaces/configs";
import { useEffect, useState } from "react";
import { getAPI, postAPI, putAPI } from "src/lib/axios";
import { useSnackbar } from "notistack";
import { useConfigStore, userRolesStore } from "src/store/zustand/globalStates/config";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";

interface RoleProps {
  name: string;
  status: "Active" | "Inactive";
  permissions: any;
}

const AddUserRole = ({ generalCardContainer, setOpenAddModal, setIsSuccess }: any) => {
  const { addUserRoles, updateUserRoles } = userRolesStore();

  const [initialValues, setInitialValues] = useState<RoleProps>({
    name: "",
    status: "Active",
    permissions: [],
  });
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();
  const location = useLocation();

  const param = useParams<{ inspectionNameId: string }>();

  const settingInitialValues = () => {
    const inspectionValues = generalCardContainer?.find(
      (val: any) => val?.id == param?.inspectionNameId,
    );
    setInitialValues({
      name: inspectionValues?.name,
      status: inspectionValues?.status,
      permissions: inspectionValues?.permissions,
    });
  };
  const validation = Yup.object({
    name: Yup.string().min(3, "Must be at least 3 characters").required().label("Name"),
  });

  return (
    <div className="region-form-holder">
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
        confirmationIcon="src/assets/icons/icon-success.svg"
        isSuccess
        IsSingleBtn
        btnText="Go to inspection types"
      /> */}
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={validation}
        onSubmit={async (values, formikHelpers) => {
          try {
            setLoading(true);
            const { data } = await postAPI("/user-role/", [
              {
                ...values,
              },
            ]);
            addUserRoles(values);

            setLoading(false);
            formikHelpers.resetForm();
            setIsSuccess(true);
            setOpenAddModal(false);
            enqueueSnackbar("Role added successfully!", {
              variant: "success",
            });
          } catch (error: any) {
            enqueueSnackbar(error?.response?.data?.detail?.message || "Something went wrong!", {
              variant: "error",
            });
            setLoading(false);
          }
        }}
      >
        {(props: FormikProps<UserRolesProps>) => {
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
            <form className="" onSubmit={handleSubmit} style={{ margin: ".8rem 0" }}>
              {loading && <CircularProgress className="page-loader" />}
              <div className="region-fieldset">
                <div style={{ marginBottom: "1rem" }}>
                  <InputLabel htmlFor="name">
                    <div className="label-heading">Name a New Role</div>
                  </InputLabel>
                  <FormGroup className="input-holder">
                    <OutlinedInput
                      id="name"
                      type="text"
                      placeholder=""
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
                </div>
              </div>

              <div className="">
                <Grid container spacing={2} justifyContent="flex-end">
                  <Grid item>
                    <Button variant="outlined" onClick={() => setOpenAddModal(false)}>
                      Cancel
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      type="submit"
                      disabled={!isValid || !dirty || isSubmitting}
                    >
                      Add
                    </Button>
                  </Grid>
                </Grid>
              </div>
            </form>
          );
        }}
      </Formik>
    </div>
  );
};
export default AddUserRole;
