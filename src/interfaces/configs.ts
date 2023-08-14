// ============= NEW TABLE PROPS BAS ============
// generic props for BAS_TABLE_ITEMS items datas
export interface ConfigurationProps {
  code?: string | number;
  created_at?: string;
  currency?: string;
  id: number;
  name: string;
  country: string;
  notes: string;
  notification_email?: string[];
  status: "Active | Inactive";
  tax_percentage: number;
  tax_type: string;
  updated_at: string;
  updated_by: string;
  created_by: string;
}

export interface NewBASConfigProps {
  headers: string[];
  items: ConfigurationProps[];
  page: number;
  pages: number;
  size: number;
  total: number;
}

export interface DynamicAccessorKey {
  [keyName: string]: string | number;
}

export interface RegionProps {
  name: string;
  code?: string;
  status: "Active" | "Inactive";
  notification_email?: string[];
  notes?: string;
  organization?: number;
  id?: number;
  full_name?: string;
  anticipated_time?: number | null;
  time_format?: string | undefined;
}

export interface TerritoryProps {
  country: string;
  name: string;
  code: string;
  status: "Active" | "Inactive";
  notification_email: string;
  notes?: string;
  id?: number;
}

export interface CountryProps {
  id?: number;
  region: string;
  country: string;
  code: string;
  currency?: string;
  status: "Active" | "Inactive";
  tax_type?: string;
  notification_email: [];
  tax_percentage?: number | null;
  notes?: string;
}

export interface LocationProps {
  id?: number;
  territory: string;
  location: string;
  suburb: string;
  city: string;
  state: string;
  post_code?: string;
  latitude?: number;
  longitude?: number;
  status: "Active" | "Inactive";
  notification_email: string;
  notes?: string;
}

export interface UserDepartmentProps {
  name: string;
  status: "Active" | "Inactive";
  notification_email: string[];
  notes?: string;
  id?: number;
  full_name?: string;
}
export interface BillingAgreementProps {
  name: string;
  status: "Active" | "Inactive";
  inspections?: string[];
  id?: number | null;
}

export interface TariffRateTypeProps {
  name: string;
  status: "Active" | "Inactive";
  notes: string;
  id?: number | null;
}

export interface BASConfigTableProps {
  headers: string[];
  items: RegionProps[];
  page: number;
  pages: number;
  size: number;
  total: number;
  archivedCount?: number;
  exclude?: string[];
}

export interface BASConfigTerritoryTableProps {
  headers: string[];
  items: TerritoryProps[];
  page: number;
  pages: number;
  size: number;
  total: number;
}
export interface BASConfigCountryTableProps {
  headers: string[];
  items: CountryProps[];
  page: number;
  pages: number;
  size: number;
  total: number;
}

export interface BASConfigLocationTableProps {
  headers: string[];
  items: LocationProps[];
  page: number;
  pages: number;
  size: number;
  total: number;
}

export interface BASConfigFinanceBillingAgreementTableProps {
  headers: string[];
  items: BillingAgreementProps[];
  page: number;
  pages: number;
  size: number;
  total: number;
}

export interface serviceProps {
  id?: number;
  name: string;
  status: "Active" | "Inactive";
  notes?: string;
}

export interface commonTypeProps {
  id?: number;
  name?: string;
  user_department?: string;
  status: "Active" | "Inactive";
  notes?: string;
}

export interface activityTypeProps {
  id?: number;
  name?: string;
  user_department?: string;
  status: "Active" | "Inactive";
  notes?: string;
}

export interface document {
  id?: number | null;
  contractor?: number | null;
  title?: string;
  documents?: string[];
}

export interface contractorProps {
  id?: number | string;
  profile_photo?: string | undefined;
  contractor_type?: String;
  name?: string;
  email_id?: string[];
  industry_name?: string;
  location?: string;
  invoice_emails?: string[];
  operations_email?: string[];
  phone_numbers?: String[];
  website?: string;
  industry?: number | null;
  language?: number | null;
  country?: number | null;
  status?: string;
  notes?: string;
  documents?: document[];
  services?: any;
  contractor_address?: any;
  phone?: [{ code?: string | null; phone?: string | null }];
}

export interface contractorAddressProps {
  id?: number;
  contractor?: number;
  address_type?: string;
  address_line?: string;
  city?: string;
  state?: string;
  territory?: number;
  location?: string;
  country?: number;
  zip_code?: string;
}

export interface AllContractorItemsProps {
  id?: number;
  name: string;
  // territory: string;
  email_id?: string[];
  status: "Active" | "Inactive";
}

export interface contractorTableProps {
  headers: string[];
  items: contractorProps[];
  page: number;
  pages: number;
  size: number;
  total: number;
}

export interface activityTypeTableProps {
  headers: string[];
  items: activityTypeProps[];
  page: number;
  pages: number;
  size: number;
  total: number;
  archivedCount?: number;
}
export interface userRolesTypeTableProps {
  headers: string[];
  items: UserRolesProps[];
  page: number;
  pages: number;
  size: number;
  total: number;
  archivedCount?: number;
}
export interface activityStatusTableProps {
  headers: string[];
  items: serviceProps[];
  page: number;
  pages: number;
  size: number;
  total: number;
  archivedCount?: number;
}

export interface customerProps {
  customer_type?: string | undefined;
  organization_name?: string;
  organizations_email?: string[];
  credit_limit?: [
    {
      currency?: string;
      amount?: number;
    },
  ];
  balance_amount?: [
    {
      currency?: string;
      amount?: number;
    },
  ];
  operations_email?: string[];
  invoice_email?: string[];
  phone_numbers?: string[];
  website?: string;
  business_since?: Date | null;

  country?: number | null;
  currency?: number | null;
  tax_percentage?: number | null;
  tax_type?: string;
  documents?: document[];
  notes?: string;
  customer_address?: any;
  login_email?: string;
  can_set_pw?: boolean;
  local_set_pw?: boolean;
  password?: string;
  confirm_password?: string;
  customers?: any;
  full_name?: string;
  phone?: [{ code?: string | null; phone?: string | null }];
}

export interface customerAddrressProps {
  id?: number;
  customer_id?: number;
  address_type?: string;
  address_line?: string;
  city?: string;
  state?: string;
  territory?: number;
  country?: number;
  zip_code?: string;
}

export interface ResponseSetProps {
  booking_id?: string;
  id?: number;
  customer_name?: string;
  inspection_type?: string;
  inspection_date?: string;
  location?: string;
  status?: string;
}

export interface ResponseProps {
  headers: string[];
  items: ResponseSetProps[];
  page: number;
  pages: number;
  size: number;
  total: number;
  archivedCount: number;
}

export interface TableValue {
  status: number | null;
  name: string | null;
  field: string;
  module_id?: number | null;
}

export interface ResponseSetPropsS {
  id?: number | string | null;
  module?: string | number | null | undefined;
  status?: string | null;
  display_name?: string | null;
  variable_name?: string | null;
  tableValues: TableValue[] | null;
  checked?: boolean | null;
  module_id?: number | null;
}

export interface ExternalConnectionProps {
  api?: string | undefined;
  api_id?: number | undefined;
  token?: string | null;
  display_name?: string | null;
  status?: string | null;
  authenticated?: boolean | null;
  tableValues?: TableValue[] | null;
  api_header?: string | null;
}
export interface UserRolesProps {
  id?: number;
  name?: string;
  permissions: any;
  status: "Active" | "Inactive";
}
export interface AssignActivityProps {
  title: string;
  description: string;
  // type: any;
  user_department: any;
  users: any;
  territory: any;
  priority: string;
  due_date: any;
  document: any;
}
