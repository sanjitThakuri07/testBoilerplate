import { AuthRoute, MessageRoute, PrivateRoute, PublicRoute } from "src/constants/variables";
import Login from "src/modules/auth/login";

import TenantRegister from "src/modules/auth/TenantDashboard/TenantRegister/TenantRegister";
import ForgotPassword from "src/modules/auth/forgotPassword";
import PasswordResetLink from "src/modules/auth/passwordResetLink";
import PasswordResetSuccess from "src/modules/auth/passwordResetSuccess";
import SetNewPassword from "src/modules/auth/setNewPassword";
import Dashboard from "src/modules/dashboard";
import PrivacyPolicy from "src/modules/privacyPolicy/PrivacyPolicy";
import Setting from "src/modules/setting";
import AddTenant from "src/modules/tenant/addTenant";
import TermsAndConditions from "src/modules/terms";

// import BookingsRoutes from 'containers/Bookings/routes';
// import QuotationsRoutes from 'containers/Quotation/routes';
// import CalendarRoutes from 'containers/calendar/routes';
// import ConfigurationRoutes from 'src/modules/config/routes';
// import CustomersRoutes from 'containers/customers/routes';
// import FinanceRoutes from 'containers/finance/routes';
// import InspectionRoutes from 'containers/inspections/routes';
// import { routes as ScheduleRoutes } from 'containers/schedule/route';
// import TemplateRoutes from 'containers/template/routes';
// import _401 from 'pages/message/_401';

// import ActivityRoutes from 'containers/AssignActivities/routes';
// import AddInspectionStatusConfig from 'src/modules/config/generalSettings/inspection/AddInspectionStatusConfig';
// import OrganizationRoutes from 'containers/organization/routes';

// import EmailIdContent from 'src/modules/config/notifications/EmailIdContent';

// import IndexHOC from 'HOC/indexHOC';
// import AddBillingPlan from 'containers/Billing/AddBillingPlan';
// import BillingPlans from 'containers/Billing/BillingPlans';
// import AddRegionsConfig from 'src/modules/config/generalSettings/region/AddRegionsConfig';
// import PublicPDFPreview from 'containers/inspections/Report/PDFPreview/PublicPDFPreview';
// import NotificationList from 'containers/notificationList';
// import AddOrganization from 'containers/tenant/addOrganization';
// import TwoFactor_QR from 'containers/twofactor';
import PublicInvoicePage from "src/modules/pages/publicPages/invoicePage/invoicePage";
// import { permissionList } from 'src/constants/permission';
// import { rolesList } from 'constants/roles';
// import PaymentPage from 'containers/Payment/PaymentPage';

export const authRoutes = [
  {
    title: "Login",
    path: AuthRoute.LOGIN,
    component: <Login />,
  },
  {
    title: "Tenant Login",
    path: AuthRoute.TENANT_LOGIN,
    component: <Login />,
  },
  {
    title: "Organization Login",
    path: AuthRoute.ORGANIZATION_LOGIN,
    component: <Login />,
  },
  {
    title: "Tenant Register",
    path: AuthRoute.TENANT_REGISTER,
    component: <TenantRegister />,
  },
  {
    title: "Organization register",
    path: AuthRoute.ORGANIZATION_REGISTER,
    component: <TenantRegister />,
  },
  {
    title: "Customer register",
    path: AuthRoute.CUSTOMER_REGISTER,
    component: <TenantRegister />,
  },
  {
    title: "User register",
    path: AuthRoute.USER_REGISTER,
    component: <TenantRegister />,
  },
  {
    title: "Forgot Password",
    path: AuthRoute.FORGOT_PASSWORD,
    component: <ForgotPassword />,
  },
  {
    title: "Password Reset Link",
    path: AuthRoute.PASSWORD_RESET_LINK,
    component: <PasswordResetLink />,
  },
  {
    title: "Set New Password",
    path: AuthRoute.SET_NEW_PASSWORD,
    component: <SetNewPassword />,
  },
  {
    title: "Password Reset Success",
    path: AuthRoute.PASSWORD_RESET_SUCCESS,
    component: <PasswordResetSuccess />,
  },
];

export const publicRoutes = [
  {
    title: "Terms and Conditions",
    path: PublicRoute.TWO_FACTOR_TERMS,
    publicPage: true,
    component: <TermsAndConditions />,
  },
  {
    title: "Privacy Policy",
    component: <PrivacyPolicy />,
    publicPage: true,
    path: PublicRoute.PRIVACY_POLICY,
  },
  // {
  //   title: "Invoice",
  //   component: <PublicInvoicePage />,
  //   publicPage: true,
  //   path: PublicRoute.PUBLIC_INVOICE,
  // },
  // {
  //   title: "Inspection Report Download",
  //   component: <PublicPDFPreview />,
  //   publicPage: true,
  //   path: PublicRoute.INSPECTION_REPORT_DOWNLOAD,
  //   showTopbar: false,
  //   className: "remove__bg",
  // },
];

export const privateRoutes: any = [
  {
    title: "Login",
    path: AuthRoute.LOGIN,
    component: <Login />,
  },
  // {
  //   title: 'Dashboard',
  //   path: PrivateRoute.DASHBOARD,
  //   component: IndexHOC({
  //     component: Dashboard,
  //     permission: [''],
  //     role: [rolesList.tenant, rolesList.platformOwner],
  //   }),
  //   newPage: false,
  // },
  // {
  //   title: 'Analytics',
  //   path: PrivateRoute.ANALYTICS,
  //   component: <Dashboard />,
  //   newPage: false,
  // },
  // {
  //   title: 'Billing',
  //   path: PrivateRoute.BILLING,
  //   // component: <BillingPlans />,
  //   component: IndexHOC({
  //     component: BillingPlans,
  //     permission: [''],
  //     role: [rolesList.platformOwner],
  //   }),
  //   newPage: false,
  // },
  // {
  //   title: 'Add Billing Plan',
  //   path: PrivateRoute.ADD_BILLING,
  //   component: <AddBillingPlan />,
  //   newPage: false,
  // },
  // {
  //   title: 'Edit Billing Plan',
  //   path: PrivateRoute.EDIT_BILLING,
  //   component: <AddBillingPlan />,
  //   newPage: false,
  // },
  // {
  //   title: 'View Billing Plan',
  //   path: PrivateRoute.VIEW_BILLING,
  //   component: <AddBillingPlan />,
  //   newPage: false,
  // },
  // {
  //   title: 'Payment Methods',
  //   path: PrivateRoute.PAYMENT_METHOD,
  //   component: <PaymentPage />,
  //   newPage: false,
  // },
  // {
  //   title: 'Setting',
  //   path: PrivateRoute.SETTING,
  //   component: <Setting />,
  //   newPage: true,
  // },
  // {
  //   title: 'Add Tenant',
  //   path: PrivateRoute.ADD_TENANT,
  //   component: <AddTenant />,
  //   newPage: true,
  // },
  // {
  //   title: 'View Tenant',
  //   path: PrivateRoute.VIEW_TENANT,
  //   component: <AddTenant />,
  //   newPage: true,
  // },
  // {
  //   title: '401',
  //   path: MessageRoute._401,
  //   component: <_401 />,
  //   newPage: false,
  // },
  // {
  //   title: 'EMAIL ID CONTENT',
  //   path: PrivateRoute.ORGCONFIG.NOTIFICATIONS.CHILD_LINKS.EMAILIDCONTENT.HOME,
  //   component: EmailIdContent,
  //   newPage: false,
  // },
  // {
  //   title: 'INSPECTION',
  //   path: PrivateRoute.CONFIG.INSPECTION.ADD,
  //   component: AddInspectionStatusConfig,
  //   newPage: false,
  // },
  // {
  //   title: 'EDIT INSPECTION',
  //   path: `${PrivateRoute.CONFIG.INSPECTION.EDIT}/:inspectionStatusId`,
  //   component: AddInspectionStatusConfig,
  //   newPage: false,
  // },
  // {
  //   title: 'Add Organization',
  //   path: PrivateRoute.ADD_ORGANIZATION,
  //   component: IndexHOC({ component: AddOrganization, permission: [] }),
  //   newPage: true,
  // },
  // {
  //   title: 'View Organization',
  //   path: PrivateRoute.VIEW_ORGANIZATION,
  //   component: IndexHOC({ component: AddOrganization, permission: [] }),
  //   newPage: true,
  // },
  // {
  //   title: 'Add Tariff Rate',
  //   path: `${PrivateRoute.CONFIG.FINANCE.ADD_TAFIFF_RATE}/:tariffRateId`,
  //   component: AddRegionsConfig,
  //   newPage: true,
  // },
  // {
  //   title: 'Two factor QR',
  //   path: PrivateRoute.TWO_FACTOR,
  //   component: <TwoFactor_QR />,
  //   newPage: true,
  // },
  // {
  //   title: 'Notification List',
  //   path: '/notification-list',
  //   component: <NotificationList />,
  //   newPage: false,
  // },
  // ...CalendarRoutes,
  // ...CustomersRoutes,
  // ...QuotationsRoutes,
  // ...BookingsRoutes,
  // ...FinanceRoutes,
  // ...ActivityRoutes,
  // ...TemplateRoutes,
  // ...ConfigurationRoutes,
  // ...OrganizationRoutes,
  // ...InspectionRoutes,
  // ...ScheduleRoutes,
];
