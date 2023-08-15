import * as yup from 'yup';

export const BillingValidation = yup.object().shape({
  title: yup.string().required('Title is required'),
  description: yup.string().required('Description is required'),
  // pricing_type: yup.string().required('Pricing type is required'),
  account_type: yup.string().required('Account type is required'),
  pricing_type: yup.string().when('account_type', {
    is: (value: string) => value !== 'free',
    then: yup.string().required('Account type is required'),
    otherwise: yup.string(),
  }),
  monthly_price: yup.number().required('Monthly price is required'),
  yearly_price: yup.number().required('Yearly price is required'),
  quarterly_price: yup.number().required('Quarterly price is required'),
  semiyearly_price: yup.number().required('Semiyearly price is required'),
  setup_price: yup.number().required('Setup price is required'),
  // ordering: yup.number().required('Ordering is required'),
  no_of_organizations: yup.number().required('No of organizations is required'),
  no_of_users: yup.number().required('No of users is required'),
});

export const WeekDays = [
  { value: 1, label: 'Sun' },
  { value: 2, label: 'Mon' },
  { value: 3, label: 'Tue' },
  { value: 4, label: 'Wed' },
  { value: 5, label: 'Thu' },
  { value: 6, label: 'Fri' },
  { value: 7, label: 'Sat' },
];
export const RepeatOptions = [
  { value: 'daily', label: 'Days' },
  { value: 'weekly', label: 'Weeks' },
  { value: 'monthly', label: 'Months' },
  { value: 'yearly', label: 'Years' },
];
