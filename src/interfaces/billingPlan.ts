export interface AddBillingStepOnePlanProps {
  planName: string;
  planDescription: string;
}

export interface AddBillingPlanProps {
  id: number;
  title: string;
  description: string;
  pricing_type: string;
  account_type: string;
  monthly_price: number;
  yearly_price: number;
  quarterly_price: number;
  semiyearly_price: number;
  setup_price: number;
  ordering: string[];
  no_of_organizations: number;
  no_of_users: number;
  quotation: boolean;
  booking: boolean;
  form: boolean;
  calendar: boolean;
  finance: boolean;
  analytics: boolean;
}

export const BillingInitialValues: AddBillingPlanProps = {
  id: 0,
  title: '',
  description: '',
  pricing_type: '',
  account_type: '',
  monthly_price: 0,
  yearly_price: 0,
  quarterly_price: 0,
  semiyearly_price: 0,
  setup_price: 0,
  ordering: [],
  no_of_organizations: 0,
  no_of_users: 0,
  quotation: true,
  booking: true,
  form: true,
  calendar: true,
  finance: true,
  analytics: true,
};
