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
import { LocationProps, TerritoryProps } from "src/src/interfaces/configs";
import { FC, useEffect, useState } from "react";
import { getAPI, postAPI, putAPI } from "src/lib/axios";
import { useSnackbar } from "notistack";
import { useConfigStore } from "src/store/zustand/globalStates/config";
import DynamicSelectField from "src/modules/setting/profile/DynamicSelectField";
import { MenuOptions } from "src/interfaces/profile";
import { ConfigLocationsSchema } from "src/validationSchemas/config";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ModalLayout from "src/components/ModalLayout";
import TerritoryForm from "../territory/TerritotyForm";
import { fetchApI } from "src/modules/apiRequest/apiRequest";
import { LOCATION_DEFAULT_DATA, NAVIGATE_ROUTES } from "../constantsForm";
import { postApiData, putApiData } from "src/modules/apiRequest/apiRequest";
import FullPageLoader from "src/components/FullPageLoader";
import useTerriotryStore from "src/store/zustand/generalSettings/territory";
import useLocationStore from "src/store/zustand/generalSettings/location";

const LocationForm: FC<{
  location: LocationProps;
  disabled?: boolean;
  updateCard?: Function;
  subSelectField?: boolean;
}> = ({ location, disabled, updateCard, subSelectField }) => {
  let [initialValues, setInitialValues]: any = useState(location);

  const [regionOptions, setRegionOptions] = useState<MenuOptions[]>([]);

  const [openModal, setOpenModal] = useState(false);
  const [openFormModal, setOpenFormModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addAnother, setAddAnother] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { addLocations, updateLocations } = useConfigStore();
  const [initialData, setInitialData] = useState<LocationProps>();
  const [currentTerritory, setCurrentTerritory] = useState<TerritoryProps>({
    country: "",
    name: "",
    code: "",
    status: "Active",
    notification_email: "",
  });
  const param = useParams<{ locationId: string }>();
  const navigate = useNavigate();
  const locationVal = useLocation();

  const {
    fetchTerriotrys,
    postTerriotry,
    updateTerriotryStore,
    fetchIndividualTerriotry,
    individualTerriotry,
    terriotrys,
  }: any = useTerriotryStore();

  const {
    fetchLocations,
    postLocation,
    updateLocationStore,
    fetchIndividualLocation,
    individualLocation,
    locations,
  }: any = useLocationStore();

  const fetchInitialValues = async () => {
    if (param.locationId) {
      setLoading(true);
      await fetchApI({
        setterFunction: (data: any) => {
          setInitialValues((prev: any) => ({ ...data }));
        },
        url: `location/${param.locationId}`,
        queryParam: "size=99",
        getAll: true,
        enqueueSnackbar,
      });
      setLoading(false);
    }
  };

  const fetchRegion = async () => {
    // const { status, data } = await getAPI('territory/');

    // if (status === 200) {
    //   const options = data;
    //   const menuOptions: MenuOptions[] = options.items.map((opt: MenuOptions) => {
    //     return {
    //       value: opt.id,
    //       label: opt.name,
    //       phone_code: opt.phone_code,
    //     };
    //   });
    //   setRegionOptions(menuOptions);
    // }
    await fetchTerriotrys({});
  };

  useEffect(() => {
    fetchRegion();
    fetchInitialValues();
  }, [param.locationId, param, locationVal.pathname]);

  function ADD_ANOTHER_HANDLER() {
    if (addAnother) {
      setInitialValues(LOCATION_DEFAULT_DATA);
      setOpenModal(false);
    } else if (!addAnother && !subSelectField) {
      navigate(NAVIGATE_ROUTES?.location);
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
        confirmationHeading={`Location ${
          param.locationId === undefined ? "created" : "updated"
        } successfully!`}
        confirmationDesc={`The location table content has been successfully ${
          param.locationId === undefined ? "created" : "updated"
        }  according to the way you customized.`}
        status="success"
        confirmationIcon="src/assets/icons/icon-success.svg"
        isSuccess
        IsSingleBtn
        btnText="Go to Locations"
      />

      <ModalLayout
        children={
          <>
            <div className="config_modal_form_css">
              <div className="config_modal_heading">
                <div className="config_modal_title">Add Territory</div>
                <div className="config_modal_text">
                  <div>Fill in the details for adding the new territory.</div>
                </div>
              </div>

              <TerritoryForm territory={currentTerritory} subSelectField={true} />
            </div>
          </>
        }
        openModal={openFormModal}
        setOpenModal={() => {
          setOpenFormModal(!openFormModal);
        }}
      />
      {loading ? (
        <FullPageLoader />
      ) : (
        <Formik
          initialValues={initialValues}
          enableReinitialize
          validationSchema={ConfigLocationsSchema}
          onSubmit={async (values, formikHelpers) => {
            if (disabled) return;
            setLoading(true);
            let apiResponse: any = false;
            if (values.id) {
              apiResponse = await updateLocationStore({
                values: { ...values, notification_email: values.notification_email },
                enqueueSnackbar,
                id: values?.id,
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
              //   url: 'location',
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
              updateLocations(values);
            } else {
              apiResponse = await postLocation({
                values: [
                  {
                    ...values,
                  },
                ],
                enqueueSnackbar,
                updateState: (data: any) => {
                  if (!data.data) return;
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
              //     },
              //   ],
              //   url: `/location/`,
              //   enqueueSnackbar: enqueueSnackbar,
              // });
              addLocations(values);
            }
            if (!apiResponse) {
              setLoading(false);
              return;
            }
            ADD_ANOTHER_HANDLER();
            // setOpenModal(true);
            formikHelpers.resetForm({ values: LOCATION_DEFAULT_DATA });
            setLoading(false);
          }}
        >
          {(props: FormikProps<LocationProps>) => {
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
                {/* {loading && <CircularProgress className="page-loader" />} */}
                <div className="region-fieldset">
                  <Grid container spacing={4} className="formGroupItem">
                    <Grid item xs={4}>
                      <InputLabel htmlFor="territory">
                        <div className="label-heading">
                          Territory <sup>*</sup>
                        </div>
                      </InputLabel>
                    </Grid>
                    <Grid item xs={7}>
                      <FormGroup className="input-holder">
                        <DynamicSelectField
                          isViewOnly={false}
                          handleChange={handleChange}
                          handleBlur={handleBlur}
                          handleSelectTouch={() => setFieldTouched("territory", true)}
                          id="territory"
                          menuOptions={terriotrys?.map((opt: any) => ({
                            value: opt?.id,
                            label: opt?.name,
                            phone_code: opt?.phone_code,
                          }))}
                          value={values.territory}
                          error={errors.territory}
                          touched={touched.territory}
                          addChildren={true}
                          children={"+ Add New Territory"}
                          openModal={() => setOpenFormModal(true)}
                          disabled={disabled}
                        />
                      </FormGroup>
                    </Grid>
                  </Grid>
                  <Grid container spacing={4} className="formGroupItem">
                    <Grid item xs={4}>
                      <InputLabel htmlFor="location">
                        <div className="label-heading">
                          Location <sup>*</sup>
                        </div>
                      </InputLabel>
                    </Grid>
                    <Grid item xs={7}>
                      <FormGroup className="input-holder">
                        <OutlinedInput
                          id="location"
                          type="text"
                          placeholder="Enter here"
                          size="small"
                          fullWidth
                          name="location"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.location}
                          error={Boolean(touched.location && errors.location)}
                          className={disabled ? "disabled" : ""}
                          disabled={disabled}
                        />
                        {Boolean(touched.location && errors.location) && (
                          <FormHelperText error>{errors.location}</FormHelperText>
                        )}
                      </FormGroup>
                    </Grid>
                  </Grid>
                  <Grid container spacing={4} className="formGroupItem">
                    <Grid item xs={4}>
                      <InputLabel htmlFor="suburb">
                        <div className="label-heading">Suburb</div>
                      </InputLabel>
                    </Grid>
                    <Grid item xs={7}>
                      <FormGroup className="input-holder">
                        <OutlinedInput
                          id="suburb"
                          type="text"
                          placeholder="Enter here"
                          size="small"
                          fullWidth
                          name="suburb"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.suburb}
                          error={Boolean(touched.suburb && errors.suburb)}
                          className={disabled ? "disabled" : ""}
                          disabled={disabled}
                        />
                        {Boolean(touched.suburb && errors.suburb) && (
                          <FormHelperText error>{errors.suburb}</FormHelperText>
                        )}
                      </FormGroup>
                    </Grid>
                  </Grid>

                  <Grid container spacing={4} className="formGroupItem">
                    <Grid item xs={4}>
                      <InputLabel htmlFor="city">
                        <div className="label-heading">City</div>
                      </InputLabel>
                    </Grid>
                    <Grid item xs={7}>
                      <FormGroup className="input-holder">
                        <OutlinedInput
                          id="city"
                          type="text"
                          placeholder="Enter here"
                          size="small"
                          fullWidth
                          name="city"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.city}
                          error={Boolean(touched.city && errors.city)}
                          className={disabled ? "disabled" : ""}
                          disabled={disabled}
                        />
                        {Boolean(touched.city && errors.city) && (
                          <FormHelperText error>{errors.city}</FormHelperText>
                        )}
                      </FormGroup>
                    </Grid>
                  </Grid>

                  <Grid container spacing={4} className="formGroupItem">
                    <Grid item xs={4}>
                      <InputLabel htmlFor="state">
                        <div className="label-heading">State </div>
                      </InputLabel>
                    </Grid>
                    <Grid item xs={7}>
                      <FormGroup className="input-holder">
                        <OutlinedInput
                          id="state"
                          type="text"
                          placeholder="Enter here"
                          size="small"
                          fullWidth
                          name="state"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.state}
                          error={Boolean(touched.state && errors.state)}
                          className={disabled ? "disabled" : ""}
                          disabled={disabled}
                        />
                        {Boolean(touched.state && errors.state) && (
                          <FormHelperText error>{errors.state}</FormHelperText>
                        )}
                      </FormGroup>
                    </Grid>
                  </Grid>

                  <Grid container spacing={4} className="formGroupItem">
                    <Grid item xs={4}>
                      <InputLabel htmlFor="post_code">
                        <div className="label-heading">Post Code </div>
                      </InputLabel>
                    </Grid>
                    <Grid item xs={7}>
                      <FormGroup className="input-holder">
                        <OutlinedInput
                          id="post_code"
                          type="text"
                          placeholder="Enter here"
                          size="small"
                          fullWidth
                          name="post_code"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.post_code}
                          error={Boolean(touched.post_code && errors.post_code)}
                          className={disabled ? "disabled" : ""}
                          disabled={disabled}
                        />
                        {Boolean(touched.post_code && errors.post_code) && (
                          <FormHelperText error>{errors.post_code}</FormHelperText>
                        )}
                      </FormGroup>
                    </Grid>
                  </Grid>

                  <Grid container spacing={4} className="formGroupItem">
                    <Grid item xs={4}>
                      <InputLabel htmlFor="latitude">
                        <div className="label-heading">Latitude</div>
                      </InputLabel>
                    </Grid>
                    <Grid item xs={7}>
                      <FormGroup className="input-holder">
                        <OutlinedInput
                          id="latitude"
                          type="text"
                          placeholder="Enter here"
                          size="small"
                          fullWidth
                          name="latitude"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.latitude}
                          error={Boolean(touched.latitude && errors.latitude)}
                          className={disabled ? "disabled" : ""}
                          disabled={disabled}
                        />
                        {Boolean(touched.latitude && errors.latitude) && (
                          <FormHelperText error>{errors.latitude}</FormHelperText>
                        )}
                      </FormGroup>
                    </Grid>
                  </Grid>

                  <Grid container spacing={4} className="formGroupItem">
                    <Grid item xs={4}>
                      <InputLabel htmlFor="longitude">
                        <div className="label-heading">Longitude</div>
                      </InputLabel>
                    </Grid>
                    <Grid item xs={7}>
                      <FormGroup className="input-holder">
                        <OutlinedInput
                          id="longitude"
                          type="text"
                          placeholder="Enter here"
                          size="small"
                          fullWidth
                          name="longitude"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.longitude}
                          error={Boolean(touched.longitude && errors.longitude)}
                          className={disabled ? "disabled" : ""}
                          disabled={disabled}
                        />
                        {Boolean(touched.longitude && errors.longitude) && (
                          <FormHelperText error>{errors.longitude}</FormHelperText>
                        )}
                      </FormGroup>
                    </Grid>
                  </Grid>

                  <Grid container spacing={4} className="formGroupItem">
                    <Grid item xs={4}>
                      <InputLabel htmlFor="status">
                        <div className="label-heading">Status</div>
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
                          className={disabled ? "disabled" : ""}
                          disabled={disabled}
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
                  <Grid container spacing={4} className="formGroupItem">
                    <Grid item xs={4}>
                      <InputLabel htmlFor="notification_email">
                        <div className="label-heading">Notification Email ID</div>
                        <p>Notifications will be send to this Email ID</p>
                      </InputLabel>
                    </Grid>
                    <Grid item xs={7}>
                      <FormGroup className="input-holder">
                        <OutlinedInput
                          id="notification_email"
                          type="text"
                          placeholder="Enter here"
                          size="small"
                          fullWidth
                          name="notification_email"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.notification_email}
                          className={disabled ? "disabled" : ""}
                          disabled={disabled}
                        />
                        {Boolean(touched.notification_email && errors.notification_email) && (
                          <FormHelperText error>{errors.notification_email}</FormHelperText>
                        )}
                      </FormGroup>
                    </Grid>
                  </Grid>

                  <Grid container spacing={4} className="formGroupItem text-area ">
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
                            setFieldValue("notes", ev?.target?.value);
                            setFieldTouched("notes");
                          }}
                          onBlur={handleBlur}
                          value={values.notes}
                          name="notes"
                          className={`text__area-style text__area-style-color ${
                            disabled ? "disabled" : ""
                          }`}
                          disabled={disabled}
                          maxLength={300}
                        />
                        <FormHelperText>
                          {300 - Number(values?.notes?.length || 0)} characters left
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
                            type="button"
                            onClick={() => {
                              setAddAnother(true);
                              handleSubmit();
                            }}
                          >
                            Add Another Location
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
      )}
    </div>
  );
};

export default LocationForm;
