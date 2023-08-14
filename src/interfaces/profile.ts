export interface MenuOptions {
  [key: string]: string | number;
  value: string | number;
  label: string;
}

export interface Phone {
  id?: number;
  code: string;
  phone: string;
}
export interface Profile {
  billing_plan?: string;
  email: string | number;
  fullName: string | number;
  company?: string | number;
  designation?: string | number;
  country: string | number;
  location?: string | number;
  phone: Phone[];
  profilePicture?: string;
  language?: string | number;
  dateFormat: string | number;
  timeFormat: string | number;
  timeZone: string | number;
  brandColor: string;
}

export interface TenantProfile extends Profile {
  billing_plan: string;
}

export interface MenuOptionsList {
  [key: string]: MenuOptions[];
}
