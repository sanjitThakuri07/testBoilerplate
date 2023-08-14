export const REGION_DEFAULT_DATA: any = {
  code: '',
  name: '',
  status: 'Active',
  notes: '',
  notification_email: [],
};

export const COUNTRY_DEFAULT_DATA: any = {
  region: '',
  country: '',
  code: '',
  notes: '',
  status: 'Active',
  notification_email: '',
};

export const TERRITORY_DEFAULT_DATA: any = {
  country: '',
  name: '',
  code: '',
  status: 'Active',
  notes: '',
  notification_email: '',
};

export const LOCATION_DEFAULT_DATA: any = {
  territory: '',
  location: '',
  suburb: '',
  city: '',
  state: '',
  post_code: '',
  status: 'Active',
  notes: '',
  notification_email: '',
};

export const USER_DEPARTMENT: any = {
  name: '',
  notification_email: [],
  status: 'Active',
  notes: '',
};

export const INSPECTION_NAMES_DEFAULT: any = {
  code: '',
  name: '',
  anticipated_time: 0,
  time_format: 'Hours',
  status: 'Active',
  notes: '',
};
export const INSPECTION_STATUS_DEFAULT: any = {
  name: '',
  status: 'Active',
  notes: '',
};

export const TARIFF_RATE_TYPE: any = {
  name: '',
  status: 'Active',
  notes: '',
  id: null,
};

export const BOOKING_STATUS_DEFAULT: any = {
  name: '',
  status: 'Active',
  notes: '',
  id: null,
};

export const NAVIGATE_ROUTES = {
  region: '/config/general-settings/region',
  country: '/config/general-settings/country',
  territory: '/config/general-settings/territory',
  location: '/config/general-settings/location',
  userDepartment: '/config/users/user-department',
  user: 'config/users/user',
  inspectionName: '/config/inspection-types/inspection-name',
  inspectionStatus: '/config/inspection-types/inspection-status',
  bookingStatus: '/config/booking-status',
  activityStatus: '/config/activity/status',
  addTariffRateType: '/config/finance/tariff-rate-types',
};
