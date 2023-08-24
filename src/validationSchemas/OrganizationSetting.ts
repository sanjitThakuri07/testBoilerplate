import * as yup from "yup";

const PHONE_NO_REGEX = /^[0-9\- ]{8,14}$/;

const OrganizationSettingDetailsSchema = yup.object().shape({
  profilePicture: yup.string().nullable(),
  orgName: yup
    .string()
    .required("Organization name is required.")
    .min(3, "Name cannot be less than 3 character")
    .max(50, "Name cannot be more than 50 character"),
  industry: yup.string().nullable().required("Industry is required."),
  country: yup.string().nullable().required("Country is required."),
  location: yup.string().nullable(),
  // email: yup
  //   .string()
  //   .email("Please Enter valid email address")
  //   .required("Email is required."),
  phone: yup
    .array()
    .of(
      yup.object().shape({
        id: yup.number().nullable(),
        code: yup.string().nullable(),
        phone: yup
          .string()
          .matches(PHONE_NO_REGEX, { message: "not valid phone no", excludeEmptyString: true }),
      }),
    )
    .ensure(),
});

const OrganizationSettingFormatSchema = yup.object().shape({
  // brandColor: yup.string().required('Brand color is required.').nullable(),
  // dateFormat: yup.string().nullable(),
  // language: yup.string().nullable(),
  // timeFormat: yup.string().nullable(),
});

const OrganizationSettingAddressSchema = yup.object().shape({
  addressLine: yup.string().nullable(),
  addressType: yup.string().nullable(),
  city: yup.string().nullable(),
  country: yup.string().nullable(),
  stateOrProvince: yup.string().nullable(),
  territory: yup.string().nullable(),
  zipOrPostalCode: yup.string().nullable(),
});

export {
  OrganizationSettingDetailsSchema,
  OrganizationSettingFormatSchema,
  OrganizationSettingAddressSchema,
};
