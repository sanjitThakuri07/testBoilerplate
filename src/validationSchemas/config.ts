import * as yup from 'yup';

export const ConfigRegionsSchema = yup.object().shape({
  name: yup.string().required('Region name is required.'),
  code: yup.string().required('Region code is required.'),
  status: yup.string().nullable(),
  notification_email: yup.array().of(yup.string().email()).nullable(),
  notes: yup.string().trim().nullable().max(300, 'Notes can not be more than 300 words.'),
});

export const ConfigRegionsSchemaOptional = yup.object().shape({
  name: yup.string().required('Region name is required.'),
  // code: yup.string().required('Region code is required.'),
  status: yup.string().nullable(),
  notification_email: yup.array().of(yup.string().email()).nullable(),
  notes: yup.string().trim().nullable().max(300, 'Notes can not be more than 300 words.'),
});

export const ConfigDepartmentSchema = yup
  .array()
  .of(
    yup.object().shape({
      name: yup.string().required('Department name is required.'),
      status: yup.string().nullable(),
      notification_email: yup.array().of(yup.string()).nullable(),
      notes: yup.string().trim().nullable().max(300, 'Notes can not be more than 300 words.'),
    }),
  )
  .required('Department is required')
  .ensure();

export const ConfigCountriesSchema = yup.object().shape({
  region: yup.string().required('Region is required.'),
  country: yup.string().required('Country name is required.'),
  currency: yup.string().required('Currency is required.'),
  code: yup.string().required('Country code is required.'),
  status: yup.string().nullable(),
  notification_email: yup.array().of(yup.string().email()).nullable(),
  tax_type: yup.string().required('Tax type is required.'),
  tax_percentage: yup.number().nullable().required('Tax percentage is required.'),
  notes: yup.string().trim().nullable().max(300, 'Notes can not be more than 300 words.'),
});

export const ConfigLocationsSchema = yup.object().shape({
  territory: yup.string().required('Territory is required.'),
  location: yup.string().required('Location name is required.'),
  suburb: yup.string(),
  city: yup.string(),
  state: yup.string(),
  post_code: yup.string(),
  notification_email: yup.string().email('Notifcation email is not a valid email'),
});

export const ConfigTerritoriesSchema = yup.object().shape({
  country: yup.string().required('Country is required.'),
  name: yup.string().required('Territory name is required.'),
  code: yup.string().required('Territory code is required.'),
  status: yup.string().required('Status is required.'),
});
export const ConfigTerritoriesSchemaOptional = yup.object().shape({
  country: yup.string().required('Country is required.'),
  name: yup.string().required('Territory name is required.'),
  status: yup.string().required('Status is required.'),
});

export const BillingAgreementSchema = yup.object().shape({
  name: yup.string().required('Name is required.'),
  status: yup.string().required('Status is required.'),
});

// constructor and service validation
export const ServiceSchema = ({ blockName }: any) => {
  return yup.object().shape({
    name: yup.string().required(`${blockName ? blockName : ''} name is required.`),
    status: yup.string().nullable(),
    notes: yup.string().trim().nullable().max(300, 'Notes can not be more than 300 words.'),
  });
};

export const ActivityTypeValidation = yup.object().shape({
  name: yup.string().required('Activity type name is required.'),
  status: yup.string().nullable(),
  notes: yup.string().trim().nullable().max(300, 'Notes can not be more than 300 words.'),
  // user_department: yup.string().required('User Department is required.'),
});
// export default ConfigRegionsSchema;
