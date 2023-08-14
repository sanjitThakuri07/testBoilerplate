import ProfilePicture from "containers/setting/profile/ProfilePicture";
import {
  Box,
  FormGroup,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
  Typography,
} from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import DynamicSelectField from "containers/setting/profile/DynamicSelectField";
import PhoneNumberInput from "containers/setting/profile/PhoneNumberInput";
import SettingFooter from "src/components/footer/SettingFooter";
import { FormikFormHelpers } from "interfaces/utils";
import { useFormik } from "formik";
import { OrganizationSettingDetailsSchema } from "validationSchemas/OrganizationSetting";
import { IOrganizationSettingDetails } from "interfaces/organizationSetting";
import { getAPI, postAPI } from "src/lib/axios";
import { MenuOptions } from "interfaces/profile";
import { useSnackbar } from "notistack";
import { loggedUserDataStore } from "globalStates/loggedUserData";

const initialValues: IOrganizationSettingDetails = {
  country: "",
  email: "",
  industry: "",
  location: "",
  orgName: "",
  phone: "",
  profilePicture: "",
};

const OrganizationDetails = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [isViewOnly, setIsViewOnly] = useState<boolean>(true);
  const [countryOptions, setCountryOptions] = useState<MenuOptions[]>([]);
  const [industryOptions, setIndustryOptions] = useState<MenuOptions[]>([]);
  const [initialFormInitialValues, setInitialFormInitialValues] =
    useState<IOrganizationSettingDetails>(initialValues);
  const { setOrgData } = loggedUserDataStore();
  const handleFormSubmit = async (values: IOrganizationSettingDetails) => {
    try {
      setLoading(true);
      const { data, ...res } = await postAPI("/organization-global-settings/details", {
        ...values,
      });
      if (data) {
        setOrgData({
          logo: data.data,
        });
      }
      setInitialFormInitialValues(values);
      setIsViewOnly(true);
      setLoading(false);
      enqueueSnackbar(res?.message || "Organization details updated successfully", {
        variant: "success",
      });
      // if (res.status === 200) {

      // }
    } catch (error: any) {
      setLoading(false);
      initialValues && setValues(initialValues);
      enqueueSnackbar(error?.detail || "Error on updatating organization details", {
        variant: "error",
      });
    }
  };

  const formikBags = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: OrganizationSettingDetailsSchema,
    onSubmit: handleFormSubmit,
  });

  const {
    handleSubmit,
    setValues,
    handleChange,
    handleBlur,
    setFieldValue,
    setFieldTouched,
    isValid,
    dirty,
    touched,
    resetForm,
    values,
    errors,
  } = formikBags;

  const handleUploadImage = (image: File): Promise<void> => {
    return new Promise((res) => {
      const reader = new FileReader();
      reader.readAsDataURL(image);

      reader.onload = (theFile) => {
        const image = theFile.target?.result;
        setFieldValue("profilePicture", image);
        setFieldTouched("profilePicture");
        res();
      };
    });
  };

  const handleSelectTouch = (key: string): void => {
    setFieldTouched(key);
  };

  const handleInputChange = (ev: ChangeEvent<HTMLInputElement>): void => {
    const key = ev.target.name;
    handleChange(ev);
    setFieldTouched(key);
  };

  const handleViewOnly = () => {
    setIsViewOnly(!isViewOnly);
    // resetForm();
  };

  const formikHelpers: FormikFormHelpers = {
    isValid,
    dirty,
    touched: Object.values(touched).length > 0,
  };

  const fetchOrganizationDetails = async () => {
    const { status, data } = await getAPI("organization-global-settings/details");
    if (status === 200) {
      const { country, owner_email, industry, location, organization_name, phone, profilePicture } =
        data;
      const initialData: IOrganizationSettingDetails = {
        country,
        email: owner_email,
        industry,
        location,
        orgName: organization_name,
        phone,
        profilePicture,
        ...data,
      };
      setInitialFormInitialValues(initialData);
      setValues(initialData);
    }
  };

  const fetchCountry = async () => {
    const { status, data } = await getAPI("config/country");
    if (status === 200) {
      const options = data;
      const menuOptions: MenuOptions[] = options.map((opt: MenuOptions) => {
        return {
          value: opt.id,
          label: opt.name,
          phone_code: opt.phone_code,
        };
      });
      setCountryOptions(menuOptions);
    }
  };
  const fetchIndustry = async () => {
    const { status, data } = await getAPI("industry");
    if (status === 200) {
      const options = data;
      const menuOptions: MenuOptions[] = options.map((opt: MenuOptions) => {
        return {
          value: opt.id,
          label: opt.name,
        };
      });
      setIndustryOptions(menuOptions);
    }
  };

  useEffect(() => {
    if (countryOptions?.length === 0) fetchCountry();
    if (industryOptions?.length === 0) fetchIndustry();
    fetchOrganizationDetails();
  }, []);
  console.log({ errors }, { values });

  return (
    <div className="organization-holder">
      <div className="header-holder org_update">
        <div>
          <Typography variant="h3" color="primary">
            Organisation Details
          </Typography>
          <Typography variant="body1" component="p">
            Update your organization photo and details here.
          </Typography>
        </div>
        <div style={{ width: "30%" }}>
          <SettingFooter
            handleSubmit={handleSubmit}
            isViewOnly={isViewOnly}
            loading={loading}
            handleViewOnly={handleViewOnly}
            formikHelpers={formikHelpers}
          />
        </div>
      </div>
      <form className="setting-form-group" onSubmit={handleSubmit}>
        <ProfilePicture
          profilePicture={values.profilePicture}
          isViewOnly={isViewOnly}
          profilePhotoHeading="Organisation Logo"
          profilePhotoSubHeading="This logo will be appeared on the platform"
          handleUploadImage={handleUploadImage}
          loading={loading}
        />
        <Grid container spacing={4} className="formGroupItem">
          <Grid item xs={4}>
            <InputLabel htmlFor="orgName">
              <div className="label-heading">
                Organisation Name <sup>*</sup>
              </div>
            </InputLabel>
          </Grid>
          <Grid item xs={6}>
            <FormGroup className="input-holder">
              <OutlinedInput
                id="orgName"
                type="text"
                placeholder="Olivia Joseph"
                size="small"
                fullWidth
                name="orgName"
                onChange={handleInputChange}
                onBlur={handleBlur}
                value={values.orgName}
                error={Boolean(touched.orgName && errors.orgName)}
                disabled={isViewOnly}
              />
              {Boolean(touched.orgName && errors.orgName) && (
                <FormHelperText error>{errors.orgName}</FormHelperText>
              )}
            </FormGroup>
          </Grid>
        </Grid>
        <Grid container spacing={4} className="formGroupItem">
          <Grid item xs={4}>
            <InputLabel htmlFor="industry">
              <div className="label-heading">
                Industry <sup>*</sup>
              </div>
            </InputLabel>
          </Grid>
          <Grid item xs={6}>
            <DynamicSelectField
              isViewOnly={isViewOnly}
              handleChange={handleChange}
              handleBlur={handleBlur}
              handleSelectTouch={handleSelectTouch}
              id="industry"
              menuOptions={industryOptions}
              value={values.industry}
              error={errors.industry}
              touched={false}
            />
          </Grid>
        </Grid>
        <Grid container spacing={4} className="formGroupItem">
          <Grid item xs={4}>
            <InputLabel htmlFor="country">
              <div className="label-heading">
                Country <sup>*</sup>
              </div>
            </InputLabel>
          </Grid>
          <Grid item xs={6}>
            <DynamicSelectField
              isViewOnly={isViewOnly}
              handleChange={handleChange}
              handleBlur={handleBlur}
              handleSelectTouch={handleSelectTouch}
              id="country"
              menuOptions={countryOptions}
              value={values.country}
              error={errors.country}
              touched={false}
            />
          </Grid>
        </Grid>
        <Grid container spacing={4} className="formGroupItem">
          <Grid item xs={4}>
            <InputLabel htmlFor="location">
              <div className="label-heading">Location</div>
            </InputLabel>
          </Grid>
          <Grid item xs={6}>
            <FormGroup className="input-holder">
              <OutlinedInput
                id="location"
                type="text"
                placeholder="Brisbane"
                size="small"
                fullWidth
                name="location"
                onChange={handleInputChange}
                onBlur={handleBlur}
                value={values.location}
                error={Boolean(touched.location && errors.location)}
                disabled={isViewOnly}
              />
              {Boolean(touched.location && errors.location) && (
                <FormHelperText error>{errors.location}</FormHelperText>
              )}
            </FormGroup>
          </Grid>
        </Grid>
        <Grid container spacing={4} className="formGroupItem">
          <Grid item xs={4}>
            <InputLabel htmlFor="email">
              <div className="label-heading">
                Organisation Admin Email ID <sup>*</sup>{" "}
              </div>
            </InputLabel>
          </Grid>
          <Grid item xs={6}>
            <FormGroup className="input-holder">
              <OutlinedInput
                id="email"
                type="email"
                placeholder={values.email || "olivia.jos123@braintip.ai"}
                size="small"
                fullWidth
                name="email"
                onChange={handleInputChange}
                onBlur={handleBlur}
                value={values.email}
                error={Boolean(touched.email && errors.email)}
                disabled={true}
              />
              {Boolean(touched.email && errors.email) && (
                <FormHelperText error>{errors.email}</FormHelperText>
              )}
            </FormGroup>
          </Grid>
        </Grid>
        <Grid container spacing={4} className="formGroupItem">
          <Grid item xs={4}>
            <InputLabel htmlFor="phone">
              <div className="label-heading">Phone</div>
            </InputLabel>
          </Grid>
          <Grid item xs={6}>
            <PhoneNumberInput
              // formikBag={{} as any}
              formikBag={formikBags as any}
              isViewOnly={isViewOnly}
              countryOptions={countryOptions}
              disableAdd
            />
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default OrganizationDetails;
