export interface TenantUserProps {
  id: number | string;
  full_name: string;
  login_id: string;
  user_id?: number;
  photo: string;
  tenant_code?: string;
  contact?: any;
  country: string;
  organization: string[];
  organization_count: string | number;
  getAllStatusUser: Function;
  user_status: number;
  isActivated: boolean;
  isOrganizationCard: boolean;
  label: string;
  location?: string;
  setUserData?: Function;
}
