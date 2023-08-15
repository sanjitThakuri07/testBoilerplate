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
  TextareaAutosize,
  TextField,
} from "@mui/material";
import { Formik, FormikProps } from "formik";
import { RegionProps } from "src/interfaces/configs";
import { useEffect, useState } from "react";
import { getAPI, postAPI, putAPI } from "src/lib/axios";
import { useSnackbar } from "notistack";
import { useConfigStore } from "src/store/zustand/globalStates/config";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import MultiEmail from "src/components/MultiEmail/MultiEmail";
import { INSPECTION_STATUS_DEFAULT } from "src/modules/config/generalSettings/constantsForm";
import { postApiData, putApiData } from "src/modules/apiRequest/apiRequest";

interface InspectionProps {
  name: string;
  status: "Active";
  notes: string;
}

const AddInspectionStatus = ({ generalCardContainer, disabled, updateCard }: any) => {
  const [initialValues, setInitialValues] = useState<InspectionProps>({
    name: "",
    status: "Active",
    notes: "",
  });
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [regionStatus, setRegionStatus] = useState(false);
  const [addMultipleFields, setAddMultipleFields] = useState(true);
  const [regionCodeLength, setRegionCodeLength] = useState(0);
  const { addRegions, updateRegions } = useConfigStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [addAnother, setAddAnother] = useState(false);

  const param = useParams<{ inspectionStatusId: string }>();

  // const fetchRegionStatus = async () => {
  //   const { status, data } = await getAPI('inspection-name/check-autofill');

  //   if (status === 200) {
  //     setRegionStatus(data.status);
  //     setRegionCodeLength(data.code_length);
  //   }
  // };

  const settingInitialValues = () => {
    const inspectionValues = generalCardContainer?.find(
      (val: any) => val?.id == param?.inspectionStatusId,
    );
    setInitialValues({
      name: inspectionValues?.name,
      status: inspectionValues?.status,
      notes: inspectionValues?.notes,
    });
  };

  useEffect(() => {
    if (param?.inspectionStatusId && generalCardContainer?.length) {
      !addAnother && settingInitialValues();
      console.log("getting");
    }
  }, [param?.inspectionStatusId, location?.pathname, generalCardContainer]);
  function ADD_ANOTHER_HANDLER() {
    if (addAnother) {
      setInitialValues(INSPECTION_STATUS_DEFAULT);
      setOpenModal(false);
    } else if (!addAnother) {
      navigate("/config/inspection-types/inspection-status");
    }
  }

  const check =
    ["Completed", "In Progress", "Open"]?.includes(initialValues?.name) &&
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
        confirmationHeading={`Inspection Status ${
          param.inspectionStatusId === undefined ? "created" : "updated"
        } successfully!`}
        confirmationDesc={`The Inspection table content has been successfully ${
          param.inspectionStatusId === undefined ? "created" : "updated"
        }  according to the way you customized.`}
        status="success"
        confirmationIcon="src/assets/icons/icon-success.svg"
        isSuccess
        IsSingleBtn
        btnText="Go to inspection types"
      />
      <Formik
        initialValues={initialValues}
        enableReinitialize
        // validationSchema={!regionStatus ? ConfigRegionsSchema : ConfigRegionsSchemaOptional}
        onSubmit={async (values, formikHelpers) => {
          if (disabled) return;
          let apiResponse: any = false;

          try {
            setLoading(true);
            if (param?.inspectionStatusId) {
              apiResponse = await putApiData({
                values: {
                  ...values,
                  notification_email: values.notification_email,
                },
                id: +param?.inspectionStatusId,
                url: "inspection-status",
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
              updateRegions(values);
              setLoading(false);
            } else {
              apiResponse = await postApiData({
                setterFunction: (data: any) => {
                  // console.log({ data });
                  if (!data.data) return;
                  updateCard?.((prev: any) => [data?.data[0], ...prev]);
                },
                values: [
                  {
                    ...values,
                    auto_generate: regionStatus ? true : false,
                    code_length: regionCodeLength,
                    notification_email: values.notification_email,
                  },
                ],
                url: `/inspection-status/`,
                enqueueSnackbar: enqueueSnackbar,
              });

              addRegions(values);
            }
            if (apiResponse) {
              formikHelpers.resetForm({ values: INSPECTION_STATUS_DEFAULT });
              ADD_ANOTHER_HANDLER();
            }
            setLoading(false);
          } catch (error: any) {
            enqueueSnackbar(error?.response?.data?.detail?.message || "Something went wrong!", {
              variant: "error",
            });
            setLoading(false);
          }
        }}
      >
        {(props: FormikProps<RegionProps>) => {
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
            <form className="region-form" onSubmit={handleSubmit}>
              {loading && <CircularProgress className="page-loader" />}
              <div className="region-fieldset">
                <Grid container spacing={4} className="formGroupItem">
                  <Grid item xs={4}>
                    <InputLabel htmlFor="name">
                      <div className="label-heading">
                        Inspection Status <sup>*</sup>
                      </div>
                    </InputLabel>
                  </Grid>
                  <Grid item xs={7}>
                    <FormGroup className="input-holder">
                      <OutlinedInput
                        id="name"
                        type="text"
                        placeholder="Select here"
                        size="small"
                        fullWidth
                        name="name"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.name}
                        error={Boolean(touched.name && errors.name)}
                        className={check ? "disabled" : disabled ? "disabled" : ""}
                        disabled={check ? true : disabled}
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
              </div>
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
                          Add Another Inspection Status
                        </Button>
                      </Grid>
                    </div>
                    <Grid item>
                      <Button
                        variant="contained"
                        type="submit"
                        onClick={() => {
                          setAddAnother(false);
                          handleSubmit();
                        }}
                        disabled={!isValid || !dirty || isSubmitting}
                      >
                        Save & Proceed
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

export default AddInspectionStatus;
