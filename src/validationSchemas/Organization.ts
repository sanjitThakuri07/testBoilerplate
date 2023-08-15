import * as yup from 'yup';

// const ensureNumber = (val: number) => (isFinite(val) ? val : undefined);
const PHONE_NO_REGEX = /^[0-9\- ]{8,14}$/;

const OrganizationSchema = yup.object().shape({
  organization_name: yup
    .string()
    // .ensure()
    .required('Organization name is required!')
    .min(2)
    .max(50),
  organization_country: yup
    .string()
    //   .ensure()
    .required('Please select country'),
  organization_date_format: yup
    .string()
    //   .ensure()
    .required('Please select date format'),
  organization_time_format: yup
    .string()
    //   .ensure()
    .required('Please select time format'),
  organization_language: yup
    .string()
    //   .ensure()
    .required('Please select language'),
  phone: yup
    .array()
    .of(
      yup.object().shape({
        id: yup.number().nullable(),
        code: yup.string().nullable(),
        phone: yup
          .string()
          .matches(PHONE_NO_REGEX, { message: 'not valid phone no', excludeEmptyString: true }),
      }),
    )
    .ensure(),
  organization_email: yup
    .string()
    // .transform(ensureNumber)
    .email()
    .required('Email is required!')
    .min(5, 'Email cannot be less than 5 character')
    .max(50, 'Email cannot be more than 50 character'),
});

export default OrganizationSchema;
