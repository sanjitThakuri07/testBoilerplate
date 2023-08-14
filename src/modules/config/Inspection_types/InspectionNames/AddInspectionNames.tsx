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
import { fetchIndividualApi, postApiData, putApiData } from "src/modules/apiRequest/apiRequest";
import {
  INSPECTION_NAMES_DEFAULT,
  NAVIGATE_ROUTES,
} from "src/modules/config/generalSettings/constantsForm";
import FullPageLoader from "src/components/FullPageLoader";
import useAppStore from "src/store/zustand/app";

interface InspectionProps {
  code: string;
  name: string;
  anticipated_time: number | null;
  time_format?: string | undefined;
  status: "Active";
  notes: string;
}

export default function AddInspectionNames({ generalCardContainer, disabled, updateCard }: any) {
  const { systemParameters }: any = useAppStore();

  const [initialValues, setInitialValues] = useState<InspectionProps>({
    code: "",
    name: "",
    anticipated_time: 0,
    time_format: "Hours",
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

  const param = useParams<{ inspectionNameId: string }>();

  const fetchRegionStatus = async () => {
    const { status, data } = await getAPI("inspection-name/check-autofill");

    if (status === 200) {
      setRegionStatus(data.status);
      setRegionCodeLength(data.code_length);
    }
  };

  const fetchInitialValues = async () => {
    if (param.inspectionNameId && !addAnother) {
      await fetchIndividualApi({
        id: +param?.inspectionNameId,
        url: "inspection-name",
        // enqueueSnackbar,
        setterFunction: (data: any) => {
          if (!data) return;
          setInitialValues((prev: any) => ({
            ...data,
          }));
        },
      });
      // const { status, data } = await getAPI(`inspection-name/${param.inspectionNameId}`);
      // if (status === 200) {
      //   setInitialValues((prev: any) => ({
      //     ...data,
      //   }));
      //   // initialValues.name = data.name;
      //   // initialValues.code = data.code;
      //   // initialValues.status = data.status;
      //   // initialValues.notes = data.notes;
      //   // initialValues.notification_email = data.notification_email;

      //   // initialValues.id = data.id;
      // }
    }
  };

  const settingInitialValues = () => {
    const inspectionValues = generalCardContainer?.find(
      (val: any) => val?.id == param?.inspectionNameId,
    );
    setInitialValues({
      code: inspectionValues?.code,
      name: inspectionValues?.name,
      anticipated_time: inspectionValues?.anticipated_time,
      status: inspectionValues?.status,
      notes: inspectionValues?.notes,
      time_format: inspectionValues?.time_format,
    });
  };

  useEffect(() => {
    // fetchRegionStatus();
    if (param?.inspectionNameId && generalCardContainer?.length) {
      (async function () {
        await fetchInitialValues();
      })();
    }
  }, [param?.inspectionNameId, location?.pathname, generalCardContainer]);

  function ADD_ANOTHER_HANDLER() {
    if (addAnother) {
      setInitialValues(INSPECTION_NAMES_DEFAULT);
      navigate(`${NAVIGATE_ROUTES?.inspectionName}/add`);
      setOpenModal(false);
    } else if (!addAnother) {
      navigate(NAVIGATE_ROUTES?.inspectionName);
    }
  }

  return (
    <div className="region-form-holder">
      <ConfirmationModal
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
      />
      {loading && <FullPageLoader />}
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        // validationSchema={!regionStatus ? ConfigRegionsSchema : ConfigRegionsSchemaOptional}
        onSubmit={async (values, formikHelpers) => {
          let apiResponse: any = false;
          setLoading(true);
          if (param?.inspectionNameId) {
            apiResponse = await putApiData({
              values: {
                ...values,
                notification_email: values.notification_email,
              },
              id: +param?.inspectionNameId,
              url: "inspection-name",
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
            // setOpenModal(true);

            setLoading(false);
          } else {
            apiResponse = await postApiData({
              setterFunction: (data: any) => {
                if (!data.data) return;
                updateCard?.((prev: any) => [data?.data[0], ...prev]);
              },
              values: [
                {
                  ...values,
                  auto_generate: systemParameters?.inspection_type || false,
                  code_length: systemParameters?.inspection_type
                    ? systemParameters?.inspection_type_code_length
                    : null,
                  notification_email: values.notification_email,
                },
              ],
              url: `/inspection-name/`,
              enqueueSnackbar: enqueueSnackbar,
            });
            addRegions(values);
          }
          if (apiResponse) {
            formikHelpers.resetForm({ values: INSPECTION_NAMES_DEFAULT });
            ADD_ANOTHER_HANDLER();
          }
          setLoading(false);
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
                        Inspection Name <sup>*</sup>
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
                        disabled={disabled}
                        className={disabled ? "disabled" : ""}
                      />
                      {Boolean(touched.name && errors.name) && (
                        <FormHelperText error>{errors.name}</FormHelperText>
                      )}
                    </FormGroup>
                  </Grid>
                </Grid>
                {location.pathname.includes("edit") ||
                (location.pathname.includes("add") && !systemParameters?.inspection_type) ? (
                  <Grid container spacing={4} className="formGroupItem">
                    <Grid item xs={4}>
                      <InputLabel htmlFor="code">
                        <div className="label-heading">
                          Inspection Code <sup>*</sup>
                        </div>
                      </InputLabel>
                    </Grid>
                    <Grid item xs={7}>
                      <FormGroup className="input-holder">
                        <OutlinedInput
                          id="code"
                          type="text"
                          placeholder="Enter here"
                          size="small"
                          fullWidth
                          name="code"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values?.code?.toUpperCase()}
                          error={Boolean(touched.code && errors.code)}
                          disabled={disabled}
                          className={disabled ? "disabled" : ""}
                        />
                        {Boolean(touched.code && errors.code) && (
                          <FormHelperText error>{errors.code}</FormHelperText>
                        )}
                      </FormGroup>
                    </Grid>
                  </Grid>
                ) : (
                  <></>
                )}
                <Grid container spacing={4} className="formGroupItem">
                  <Grid item xs={4}>
                    <InputLabel htmlFor="status">
                      <div className="label-heading">Anticipated Time</div>
                    </InputLabel>
                  </Grid>
                  <Grid item xs={7}>
                    <FormGroup className="input-holder">
                      <div className="anticipated_time_container">
                        <Select
                          MenuProps={{
                            PaperProps: { style: { maxHeight: 200 } },
                          }}
                          sx={{
                            border: "none",
                            position: "absolute",
                            zIndex: 999,
                            right: "5px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            width: "100px",
                            height: "90%",
                          }}
                          variant="standard"
                          disableUnderline
                          className={`anticipated_select ${disabled ? "disabled" : ""}`}
                          data-testid="anticipated_select"
                          value={values?.time_format}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled={disabled}
                          name="time_format"
                        >
                          <MenuItem value={"Minutes"}>Minutes</MenuItem>
                          <MenuItem value={"Hours"}>Hours</MenuItem>
                        </Select>
                        <OutlinedInput
                          id="anticipated_time"
                          type="number"
                          placeholder="Select here"
                          size="small"
                          fullWidth
                          name="anticipated_time"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.anticipated_time}
                          error={Boolean(touched.anticipated_time && errors.anticipated_time)}
                          disabled={disabled}
                          className={disabled ? "disabled" : ""}
                        />
                      </div>
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
                        MenuProps={{
                          PaperProps: { style: { maxHeight: 200 } },
                        }}
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
                          Add Another Inspection Name
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
}
