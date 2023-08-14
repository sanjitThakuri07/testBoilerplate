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
  TextField,
  TextareaAutosize,
} from "@mui/material";
import { Formik, FormikProps } from "formik";
import { serviceProps } from "src/interfaces/configs";
import React, { FC, useEffect, useState } from "react";
import {
  ConfigRegionsSchema,
  ConfigRegionsSchemaOptional,
  ServiceSchema,
} from "validationSchemas/config";
import { getAPI, postAPI, putAPI } from "src/lib/axios";
import { useSnackbar } from "notistack";
import { useContractorServicesStore } from "src/store/zustand/globalStates/config";
import { useNavigate, useParams } from "react-router-dom";

const ServiceForm: FC<{
  service: serviceProps;
  setIndividualServices?: Function;
  updateCard?: Function;
  routeToHomePage?: boolean;
}> = ({ service, setIndividualServices, updateCard, routeToHomePage = false }) => {
  const initialValues: serviceProps = service;
  const [openModal, setOpenModal] = useState(false);
  const [addAnother, setAddAnother] = useState(false);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [serviceStatus, setServiceStatus] = useState(false);
  const { addServices, updateServices, services } = useContractorServicesStore();
  const navigate = useNavigate();

  const param = useParams<{ serviceId: string }>();

  const fetchRegionStatus = async () => {
    const { status, data } = await getAPI("service/check-autofill");

    if (status === 200) {
      setServiceStatus(data.status);
    }
  };

  const fetchInitialValues = async () => {
    if (param.serviceId) {
      const { status, data } = await getAPI(`organization-service/${param.serviceId}`);
      if (status === 200) {
        setIndividualServices?.(() => ({
          name: data?.name,
          id: data?.id,
          status: data?.status,
          notes: data?.notes,
        }));
      }
    }
  };

  useEffect(() => {
    // fetchRegionStatus();
    fetchInitialValues();
  }, [param]);

  return (
    <div className="region-form-holder">
      <ConfirmationModal
        openModal={openModal}
        setOpenModal={() => setOpenModal(!openModal)}
        handelConfirmation={() => {
          setOpenModal(false);
          navigate(-1);
        }}
        confirmationHeading={`Service ${
          param.serviceId === undefined ? "created" : "updated"
        } successfully!`}
        confirmationDesc={`The service table content has been successfully ${
          param.serviceId === undefined ? "created" : "updated"
        }  according to the way you customized.`}
        status="success"
        confirmationIcon="/assets/icons/icon-success.svg"
        isSuccess
        IsSingleBtn
        btnText="Go to services"
      />
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={ServiceSchema({ blockName: "Service" })}
        onSubmit={async (values, formikHelpers) => {
          try {
            setLoading(true);
            if (values?.id) {
              const { data } = await putAPI(`organization-service/${values.id}`, {
                ...values,
              });
              // update in the store and the variable used place
              if (data?.data) {
                // store (juststand)
                const updatedData = {
                  name: data?.data?.name,
                  id: data?.data?.id,
                  status: data?.data?.status,
                  notes: data?.data?.notes,
                };
                updateServices(updatedData);
                // our useState variable
                setIndividualServices?.(updatedData);
                // change in globalcard container
                updateCard?.((prev: any) => {
                  let filterDatas = prev?.filter(
                    (data: { id?: number }) => data?.id !== Number(values?.id),
                  );
                  return [updatedData, ...filterDatas];
                });
              }
              if (addAnother) {
                setIndividualServices?.({ name: "", status: "Active", notes: "" });
                setOpenModal(false);
              } else if (!routeToHomePage && !addAnother) {
                navigate("/config/contractors/services");
              }
            } else {
              const { data } = await postAPI("/organization-service/", [
                {
                  ...values,
                  auto_generate: serviceStatus ? true : false,
                },
              ]);
              const updatedData = {
                name: data?.data[0]?.name,
                id: data?.data[0]?.id,
                status: data?.data[0]?.status,
                notes: data?.data[0]?.notes,
                label: data?.data[0]?.name,
                value: data?.data[0]?.name,
              };
              addServices(updatedData);
              updateCard?.((prev: any) => [updatedData, ...prev]);
            }
            setOpenModal(true);
            setLoading(false);
            if (addAnother) {
              setIndividualServices?.({ name: "", status: "Active", notes: "" });
              setOpenModal(false);
            } else if (!!routeToHomePage && !addAnother) {
              navigate("/config/contractors/services");
            }
          } catch (error: any) {
            enqueueSnackbar(error?.response?.data?.message || "Something went wrong!", {
              variant: "error",
            });
            setLoading(false);
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
            <form className="region-form" onSubmit={handleSubmit}>
              {loading && <CircularProgress className="page-loader" />}
              <div className="region-fieldset">
                <Grid container spacing={4} className="formGroupItem">
                  <Grid item xs={4}>
                    <InputLabel htmlFor="name">
                      <div className="label-heading">
                        Service <sup>*</sup>
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
                        className="text-area-service"
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
                        Add Another Service
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
            </form>
          );
        }}
      </Formik>
    </div>
  );
};

export default ServiceForm;
