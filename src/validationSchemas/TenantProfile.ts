import * as yup from 'yup';
import ProfileSchema from './Profile';

const TenantProfileSchema = ProfileSchema.concat(
  yup.object().shape({
    // billing_plan: yup.string().required('Plan is required'),
    // fullName: yup
    //   .string()
    //   .max(50, 'Full name can not be more than 50 words.')
    //   .required('Full name is required'),
    // company: yup.string().required('Company is required'),
  }),
);

export default TenantProfileSchema;
