export const AuthApis = {
  AUTH_LOGIN: '/user/auth/login',
  FORGOT_PASSWORD: '/user/auth/forget-password',
  SETNEW_PASSWORD: '/user/auth/update-password',
  TENANT_SIGNUP: '/tenant/set-password',
  ORGANIZATION_SIGNUP: '/organization/set-password',
  ORGANIZATION_USER_SIGNUP: '/organization-user/set-password',
  CUSTOMER_SIGNUP: '/customers/set-password',
  USER_SIGNUP: '/users/set-password',
  DEACTIVATE_TENANT: '/tenant/update-status',
  DEACTIVATE_ORGANIZATION: '/organization/update-status',
  GET_TWO_FACTOR_AUTHORIZATION_STATUS: 'user/auth/get-2fc-authentication-status',
  TOGGLE_TWO_FACTOR_AUTHORIZATION: 'user/auth/change-2fc-authentication',
};
