import * as Yup from 'yup';

export const InternalResponseSetValidationSchema = Yup.object().shape({
    display_name: Yup.string().required('Display Name is a required field').max(50),
});
