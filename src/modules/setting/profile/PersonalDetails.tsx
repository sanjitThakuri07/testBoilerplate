import {
  Grid,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
  Box,
  FormHelperText,
  FormGroup,
} from "@mui/material";
import { MenuOptions, Profile } from "src/interfaces/profile";
import { FormikProps } from "formik";
import { ChangeEvent, FC } from "react";
import { getAPI } from "src/lib/axios";
import { useState } from "react";
import { useEffect } from "react";
import DynamicSelectField from "./DynamicSelectField";
import ProfilePicture from "./ProfilePicture";
import PhoneNumberInput from "./PhoneNumberInput";

interface IProps {
  formikBag: FormikProps<Profile>;
  isViewOnly: boolean;
  handleUploadImage: (image: File) => Promise<void>;
  loading: boolean;
}

const PersonalDetails: FC<IProps> = ({ formikBag, isViewOnly, handleUploadImage, loading }) => {
  const [countryOptions, setCountryOptions] = useState<MenuOptions[]>([]);
  const [designationOptions, setDesignationOptions] = useState<MenuOptions[]>([]);
  const { errors, values, touched, setFieldTouched, handleChange, handleBlur } = formikBag;

  const handleInputChange = (ev: ChangeEvent<HTMLInputElement>): void => {
    const key = ev.target.name;
    handleChange(ev);
    setFieldTouched(key);
  };

  const handleSelectTouch = (key: string): void => {
    setFieldTouched(key);
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

  const fetchDesignations = async () => {
    const { status, data } = await getAPI("config/designation/");
    if (status === 200) {
      const options = data.items;
      const menuOptions: MenuOptions[] = options.map((opt: MenuOptions) => {
        return {
          value: opt.id,
          label: opt.title,
        };
      });
      setDesignationOptions(menuOptions);
    }
  };

  useEffect(() => {
    if (countryOptions?.length === 0) fetchCountry();
    if (designationOptions?.length === 0) fetchDesignations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box className="setting-form-group">
      <ProfilePicture
        profilePicture={values.profilePicture}
        isViewOnly={isViewOnly}
        profilePhotoHeading={"Profile Photo"}
        profilePhotoSubHeading={"Update your profile picture"}
        handleUploadImage={handleUploadImage}
        loading={loading}
      />
      <Grid container spacing={4} className="formGroupItem">
        <Grid item xs={4}>
          <InputLabel htmlFor="fullName">
            <div className="label-heading">
              Full Name <sup>*</sup>
            </div>
          </InputLabel>
        </Grid>
        <Grid item xs={7}>
          <FormGroup className="input-holder">
            <OutlinedInput
              id="fullName"
              type="text"
              placeholder="Kristy Craker"
              size="small"
              fullWidth
              name="fullName"
              onChange={handleInputChange}
              onBlur={handleBlur}
              value={values.fullName}
              error={Boolean(touched.fullName && errors.fullName)}
              disabled={isViewOnly}
            />
            {Boolean(touched.fullName && errors.fullName) && (
              <FormHelperText error>{errors.fullName}</FormHelperText>
            )}
          </FormGroup>
        </Grid>
      </Grid>
      {/* <Grid container spacing={4} className="formGroupItem">
        <Grid item xs={4}>
          <InputLabel htmlFor="companyName">
            <div className="label-heading">Company Name</div>
          </InputLabel>
        </Grid>
        <Grid item xs={7}>
          <FormGroup className="input-holder">
            <OutlinedInput
              id="companyName"
              type="text"
              placeholder="Propel Marine"
              size="small"
              fullWidth
              name="company"
              onChange={handleInputChange}
              onBlur={handleBlur}
              value={values.company}
              error={Boolean(touched.company && errors.company)}
              disabled={isViewOnly}
            />
            {Boolean(touched.company && errors.company) && (
              <FormHelperText error>{errors.company}</FormHelperText>
            )}
          </FormGroup>
        </Grid>
      </Grid> */}
      <Grid container spacing={4} className="formGroupItem">
        <Grid item xs={4}>
          <InputLabel htmlFor="designation">
            <div className="label-heading">Designation</div>
          </InputLabel>
        </Grid>
        <Grid item xs={7}>
          <DynamicSelectField
            isViewOnly={isViewOnly}
            handleChange={handleChange}
            handleBlur={handleBlur}
            handleSelectTouch={handleSelectTouch}
            id="designation"
            menuOptions={designationOptions}
            value={values.designation}
            error={errors.designation}
            touched={touched.designation}
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
        <Grid item xs={7}>
          <DynamicSelectField
            isViewOnly={isViewOnly}
            handleChange={handleChange}
            handleBlur={handleBlur}
            handleSelectTouch={handleSelectTouch}
            id="country"
            menuOptions={countryOptions}
            value={values.country}
            error={errors.country}
            touched={touched.country}
          />
        </Grid>
      </Grid>
      <Grid container spacing={4} className="formGroupItem">
        <Grid item xs={4}>
          <InputLabel htmlFor="location">
            <div className="label-heading">Location</div>
          </InputLabel>
        </Grid>
        <Grid item xs={7}>
          <FormGroup className="input-holder">
            <OutlinedInput
              name="location"
              id="location"
              type="text"
              placeholder="eg: Brisbane"
              size="small"
              fullWidth
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
          <InputLabel htmlFor="emailId">
            <div className="label-heading">Email ID</div>
            <Typography variant="body1" component="p">
              Notifications will be sent to this Email ID
            </Typography>
          </InputLabel>
        </Grid>
        <Grid item xs={7}>
          <FormGroup className="input-holder">
            <OutlinedInput
              name="email"
              id="emailId"
              type="text"
              placeholder="kristycraker@propelmarine.com"
              size="small"
              fullWidth
              onChange={handleInputChange}
              onBlur={handleBlur}
              value={values.email}
              error={Boolean(touched.email && errors.email)}
              disabled
              endAdornment={
                <InputAdornment position="end">
                  <img src="/src/assets/icons/lock.svg" width={24} height={24} alt="" />
                </InputAdornment>
              }
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
            <div className="label-heading">
              Phone <sup>*</sup>
            </div>
          </InputLabel>
        </Grid>
        <Grid item xs={7}>
          {/* <FormGroup className="input-holder">
            <OutlinedInput
              id="phone"
              type="text"
              placeholder="000 00 0000"
              size="small"
              fullWidth
              onChange={handleInputChange}
              onBlur={handleBlur}
              name="phone"
              value={values.phone}
              error={Boolean(touched.phone && errors.phone)}
              disabled={isViewOnly}
            />
            {Boolean(touched.phone && errors.phone) && (
              <FormHelperText error>{errors.phone}</FormHelperText>
            )}
          </FormGroup> */}
          <PhoneNumberInput
            formikBag={formikBag}
            isViewOnly={isViewOnly}
            countryOptions={countryOptions}
            addButtonClassName="add__more-group"
            className="group__fields"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default PersonalDetails;
