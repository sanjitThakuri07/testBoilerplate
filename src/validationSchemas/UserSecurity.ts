import * as yup from 'yup';

const UserSecuritySchema = yup.object().shape({
  login_attempt_counts: yup.number().required('Login attemps count is required'),
  block_time_increment: yup.number().required('Login Block Time Increment is required'),
  min_password_length: yup.number().required('Minimum Password Length is required'),
  password_rotation: yup.number().required('Password Rotation is required'),
  has_uppercase: yup.boolean().required('Login attemps count is required'),
  has_number: yup.boolean().required('Login attemps count is required'),
  has_character: yup.boolean().required('Login attemps count is required'),
});

export default UserSecuritySchema;
