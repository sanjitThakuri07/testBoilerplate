export interface IOrganizationSettingDetails {
  profilePicture: string;
  orgName: string;
  industry: string;
  country: string;
  location: string;
  email: string;
  phone: string;
}

export interface IOrganizationSettingFormats {
  language: string;
  dateFormat: string;
  timeFormat: string;
  brandColor: string;
}

export interface IOrganizationSettingAddress {
  addressType: string;
  addressLine: string;
  city: string;
  stateOrProvince: string;
  territory: string;
  country: string;
  zipOrPostalCode: string;
}
