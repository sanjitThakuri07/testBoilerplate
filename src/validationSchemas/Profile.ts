import * as yup from "yup";
import { phoneNumberValidationSchema } from "src/validationSchemas/ContractorValidation";

const PHONE_NO_REGEX = /^[0-9\- ]{8,14}$/;

const ProfileSchema = yup.object().shape({
  email: yup.string().email("Please enter the valid email address.").required("Email is required."),
  fullName: yup
    .string()
    .required("Full name is required.")
    .min(3, "Name cannot be less than 3 character")
    .max(50, "Name cannot be more than 50 character"),
  company: yup.string().nullable().notRequired(),
  designation: yup.string().nullable().notRequired(),
  country: yup.string().required("Country is required."),
  location: yup.string().nullable().notRequired(),
  phone: phoneNumberValidationSchema?.fields?.phoneNumber,
  // .required('Phone number with code is required.'),
  // profilePicture: yup.string().required('Profile picture is required.').nullable(),
  profilePicture: yup.string().notRequired().nullable(),
  // language: yup.string().required('Language is required.').nullable(),
  dateFormat: yup.string().required("Date format is required").nullable(),
  timeFormat: yup.string().required("Timeformat is required.").nullable(),
  timeZone: yup.string().required("Timezone is required.").nullable(),
  brandColor: yup.string().notRequired().nullable(),
});

export default ProfileSchema;
