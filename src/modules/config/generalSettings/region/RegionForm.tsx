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
import { RegionProps } from "src/interfaces/configs";
import React, { FC, useEffect, useState } from "react";
import { ConfigRegionsSchema, ConfigRegionsSchemaOptional } from "src/validationSchemas/config";
import { getAPI, postAPI, putAPI } from "src/lib/axios";
import { useSnackbar } from "notistack";
import { useConfigStore } from "src/store/zustand/globalStates/config";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import MultiEmail from "src/components/MultiEmail/MultiEmail";
import MultiEmailCustom from "src/components/MultiEmail/MultiEmail2";
import EditView from "src/components/ViewEdit";
import { permissionList } from "src/constants/permission";
import { postApiData, putApiData, fetchIndividualApi } from "src/modules/apiRequest/apiRequest";
import { REGION_DEFAULT_DATA, NAVIGATE_ROUTES } from "../constantsForm";
import useRegionStore from "src/store/zustand/generalSettings/region";
import useAppStore from "src/store/zustand/app";

const RegionForm: FC<{
  region: RegionProps;
  disabled?: boolean;
  updateCard?: Function;
  subSelectField?: boolean;
}> = ({ region, disabled, updateCard, subSelectField }) => {
  const { systemParameters }: any = useAppStore();
  const [initialValues, setInitialValues]: any = useState(region);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [regionStatus, setRegionStatus] = useState(false);
  const [addMultipleFields, setAddMultipleFields] = useState(true);
  const [regionCodeLength, setRegionCodeLength] = useState(0);
  const { addRegions, updateRegions } = useConfigStore();
  const [addAnother, setAddAnother] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const {
    fetchRegions,
    postRegion,
    updateRegionStore,
    fetchIndividualRegion,
    individualRegion,
  }: any = useRegionStore();

  const param = useParams<{ regionId: string }>();

  // const fetchRegionStatus = async () => {
  //   const { status, data } = await getAPI('region/check-autofill');

  //   if (status === 200) {
  //     setRegionStatus(data.status);
  //     setRegionCodeLength(data.code_length);
  //   }
  // };

  const fetchInitialValues = async () => {
    if (param.regionId) {
      const { status, data } = await getAPI(`region/${param.regionId}`);
      // await fetchIndividualRegion({ id: param?.regionId });
      if (status === 200) {
        setInitialValues((prev: any) => ({
          ...data,
        }));
      }
    }
  };

  useEffect(() => {
    // fetchRegionStatus();
    fetchInitialValues();
  }, [param?.regionId, location?.pathname]);

  function ADD_ANOTHER_HANDLER() {
    if (addAnother) {
      setInitialValues(REGION_DEFAULT_DATA);
      setOpenModal(false);
      // setAddAnother(false);
      navigate(`${NAVIGATE_ROUTES?.region}/add`);
    } else if (!addAnother && !subSelectField) {
      navigate(NAVIGATE_ROUTES?.region);
    }
  }

  const checkRegionStatus: any =
    location.pathname.includes("edit") ||
    (location.pathname.includes("add") && !systemParameters?.region);

  return (
    <>
      <div className="region-form-holder ">
        <ConfirmationModal
          openModal={openModal}
          setOpenModal={() => setOpenModal(!openModal)}
          handelConfirmation={() => {
            setOpenModal(false);
            navigate(-1);
          }}
          confirmationHeading={`Region ${
            param.regionId === undefined ? "created" : "updated"
          } successfully!`}
          confirmationDesc={`The region table content has been successfully ${
            param.regionId === undefined ? "created" : "updated"
          }  according to the way you customized.`}
          status="success"
          confirmationIcon="src/assets/icons/icon-success.svg"
          isSuccess
          IsSingleBtn
          btnText="Go to regions"
        />
        <Formik
          initialValues={initialValues}
          enableReinitialize={true}
          validationSchema={checkRegionStatus ? ConfigRegionsSchema : ConfigRegionsSchemaOptional}
          onSubmit={async (values, formikHelpers) => {
            if (disabled) return;
            setLoading(true);
            let apiResponse: any = false;
            if (values.id) {
              apiResponse = await updateRegionStore({
                values: { ...values, notification_email: values.notification_email },
                id: values?.id,
                enqueueSnackbar,
                updateState: (data: any) => {
                  updateCard?.((prev: any) => {
                    let filterDatas = prev?.filter(
                      (data: { id?: number }) => data?.id !== Number(values?.id),
                    );
                    return [data?.data, ...filterDatas];
                  });
                },
              });
              // apiResponse = await putApiData({
              //   values: { ...values, notification_email: values.notification_email },
              //   id: values?.id,
              //   url: 'region',
              //   enqueueSnackbar: enqueueSnackbar,
              //   setterFunction: (data: any) => {
              //     updateCard?.((prev: any) => {
              //       let filterDatas = prev?.filter(
              //         (data: { id?: number }) => data?.id !== Number(values?.id),
              //       );
              //       return [data?.data, ...filterDatas];
              //     });
              //   },
              // });
              updateRegions(values);
              // setOpenModal(true);

              setLoading(false);
            } else {
              apiResponse = await postRegion({
                enqueueSnackbar,
                values: [
                  {
                    ...values,
                    auto_generate: systemParameters?.region || false,
                    code_length: systemParameters?.region_code_length
                      ? systemParameters?.region_code_length
                      : null,
                    notification_email: values.notification_email,
                  },
                ],
                updateState: (data: any) => {
                  updateCard?.((prev: any) => [data?.data[0], ...prev]);
                },
              });
              // apiResponse = await postApiData({
              //   setterFunction: (data: any) => {
              //     // console.log({ data });
              //     if (!data.data) return;
              //     updateCard?.((prev: any) => [data?.data[0], ...prev]);
              //   },
              //   values: [
              //     {
              //       ...values,
              //       auto_generate: regionStatus ? true : false,
              //       code_length: regionCodeLength,
              //       notification_email: values.notification_email,
              //     },
              //   ],
              //   url: `/region/`,
              //   enqueueSnackbar: enqueueSnackbar,
              // });
              addRegions(values);
              if (apiResponse) {
                formikHelpers.resetForm();
              }
              setLoading(false);
            }
            if (apiResponse) {
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
                          Region Name <sup>*</sup>
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
                          className={disabled ? "disabled" : ""}
                          disabled={disabled}
                        />
                        {Boolean(touched.name && errors.name) && (
                          <FormHelperText error>{errors.name}</FormHelperText>
                        )}
                      </FormGroup>
                    </Grid>
                  </Grid>

                  {location.pathname.includes("edit") ||
                  (location.pathname.includes("add") && !systemParameters?.region) ? (
                    <Grid container spacing={4} className="formGroupItem">
                      <Grid item xs={4}>
                        <InputLabel htmlFor="code">
                          <div className="label-heading">
                            Region Code <sup>*</sup>
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
                            className={disabled ? "disabled" : ""}
                            disabled={disabled}
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
                          className={disabled ? "disabled" : ""}
                          disabled={disabled}
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
                  <Grid
                    container
                    spacing={4}
                    className="formGroupItem"
                    id="multiple_email_address_id"
                  >
                    <Grid item xs={4}>
                      <InputLabel htmlFor="notification_email">
                        <div className="label-heading">Notification Email ID</div>
                        <p>Multiple Email ID can be added.</p>
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
                      <label>{/* <p>{values.notification_email.join(', ') || ''}</p> */}</label>
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
                              // navigate(`/config/general-settings/region/add`);
                            }}
                            disabled={!isValid || !dirty || isSubmitting}
                          >
                            Add Another Region
                          </Button>
                        </Grid>
                      </div>
                      <Grid item>
                        <Button
                          variant="contained"
                          type="submit"
                          disabled={!isValid || !dirty || isSubmitting}
                          onClick={() => {
                            setAddAnother(false);
                            handleSubmit();
                          }}
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
    </>
  );
};

export default RegionForm;
