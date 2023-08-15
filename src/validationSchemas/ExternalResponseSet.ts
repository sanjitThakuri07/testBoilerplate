import * as Yup from 'yup';

export const ExternalResponseSetValidationSchema = Yup.object().shape({
    api: Yup.string().required('Api is a required field').max(150),
    token: Yup.string().required('Api Token is a required field').max(150),
    display_name: Yup.string().required('Display Name is a required field').max(50),
    status: Yup.string().required('Status is a required field').max(50),
});
