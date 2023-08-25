// import Login from 'src/modules/auth/login';
// import { AuthRoute, MessageRoute, PrivateRoute, PublicRoute } from 'src/constants/variables';
// import React from 'react';
// import { Routes, Route } from 'react-router-dom';
// import PrivateRouter from './private/privateRoute';
// import Setting from 'containers/setting';
// import TermsAndConditions from 'containers/terms';
// import AddTenant from 'containers/tenant/addTenant';
// import AddOrganization from 'containers/tenant/addOrganization';
// import ForgotPassword from ''src/modules/auth/forgotPassword';
// import PasswordResetLink from ''src/modules/auth/passwordResetLink';
// import SetNewPassword from ''src/modules/auth/setNewPassword';
// import PasswordResetSuccess from ''src/modules/auth/passwordResetSuccess';
// import Dashboard from 'containers/dashboard';
// import FullPageOutlet from './private/fullPageOutlet';
// import TenantRegister from 'src/modules/auth/TenantDashboard/TenantRegister/TenantRegister';
// import PrivacyPolicy from 'containers/privacyPolicy/PrivacyPolicy';
// import NoDataOrganizations from 'containers/organization/NoData';
// // import CountryConfig from "src/modules/config/generalSettings/CountryConfig";
// import Organization from 'containers/organization';
// import TwoFactor_QR from 'containers/twofactor';
// import OTP from 'containers/twofactor/otp';
// import AddRegionsConfig from 'src/modules/config/generalSettings/region/AddRegionsConfig';
// import AddUserDepartment from 'src/modules/config/users/userDepartment/AddUserDepartment';
// import GeneralSettingLayout from 'src/modules/config/generalSettings/GeneralSettingLayout';
// import UsersSettingLayout from 'src/modules/config/users/UserSettingLayout';
// import OrganizationConfiguration from 'src/modules/config/generalSettings/OrganizationConfiguration';
// import FinanceSettingLayout from 'src/modules/config/finance/FinanceSettingLayout';
// import GeneralSetting from 'src/modules/config/generalSettings/GeneralSetting';
// import UserSetting from 'src/modules/config/users/UserSetting';
// import UserSecurity from 'src/modules/config/users/UserSecurity/UserSecurity';
// import SystemParamaters from 'src/modules/config/users/systemParamaters';
// import FinanceConfiguration from 'src/modules/config/finance';
// import AddInspectionStatusConfig from 'src/modules/config/generalSettings/inspection/AddInspectionStatusConfig';
// import AddOrgUsers from 'src/modules/config/users/OrganizationUsers/AddOrgUsers';

// import InspectionTypesLayout from 'src/modules/config/Inspection_types/InspectionTypesLayout';
// import InspectionTypes from 'src/modules/config/Inspection_types';

// import ContractorLayout from 'src/modules/config/contractors/ContractorLayout';
// import ContractorSetting from 'src/modules/config/contractors/Contractor';
// import AddServiceConfig from 'src/modules/config/contractors/services/AddService';
// import UserProfileLayout from 'src/modules/config/users/UserProfile/UserProfileLayout';
// import UserProfileNotifications from 'src/modules/config/users/UserProfile/UserProfileNotifications';
// import UserProfilePermissions from 'src/modules/config/users/UserProfile/UserProfilePermissions';
// import UserProfilePerformance from 'src/modules/config/users/UserProfile/UserProfilePerformance';
// import UserProfileTemplateAccessed from 'src/modules/config/users/UserProfile/UserProfileTemplateAccessed';
// import UserProfileSettings from 'src/modules/config/users/UserProfile/UserProfileSettings';
// import AddContractor from 'src/modules/config/contractors/contractor/index';
// import NotificationsLayot from 'src/modules/config/notifications/NotificationsLayot';
// import EmailIdContent from 'src/modules/config/notifications/EmailIdContent';
// // activity
// import ActivityLayout from 'src/modules/config/activity/ActivityLayout';
// import ActivitySetting from 'src/modules/config/activity/Activity';
// import AddActivity from 'src/modules/config/activity/activityForms/AddActivity';
// import BookignSettingLayout from 'src/modules/config/booking/BookingSettingLayout';
// import AddBooking from 'src/modules/config/booking/bookingForms/AddBooking';
// import FindingsAndRecommendationsLayout from 'src/modules/config/findingAndRecommendations/FindingsAndRecommendationLayout';
// import AddFindingRecommendation from 'src/modules/config/findingAndRecommendations/findingsAndRecommendationsForm/AddCategory';
// // for finance
// import FinanceLayout from 'containers/finance/FinanceLayout';
// import FinanceSettings from 'containers/finance/Finance';
// import FinanceForm from 'containers/finance/tariffs/index';
// import InvoiceForm from 'containers/finance/invoices/indexstack';
// import InvoicesForm from 'containers/finance/invoices/index';
// import GlobalResponseSetLayout from 'src/modules/config/globalResponseSet/GlobalResponseSetLayout';
// import GlobalResponseSetSetting from 'src/modules/config/globalResponseSet/GlobalResponse';
// import AddResponseSet from 'src/modules/config/globalResponseSet/internalResponseSet/index';
// import AddExternalResponseSet from 'src/modules/config/globalResponseSet/externalResponseSet/index';

// import AssignActivities from 'containers/AssignActivities/AssignActivities';

// //for user roles and permissions
// import RolesAndPermission from 'src/modules/config/users/RolesAndPermission/RolesAndPermission';
// import AddAssignActivity from 'containers/AssignActivities/AddAssignActivity';
// import EditAssignActivity from 'containers/AssignActivities/EditAssignActivity';

// // ========== Booking template modules starts here ==============
// import BookingTableLayouts from 'containers/Bookings/Layouts/BookingTableLayouts';
// import BookingCreateLayout from 'containers/Bookings/Layouts/BookingCreateLayout';
// import GetAllBookingModules from 'containers/Bookings/GetAllBookingModules/GetAllBookingModules';

// import BookingTemplatePreview from 'containers/Bookings/BookingTemplatePreview/BookingTemplatePreview';
// import GetAllBookingTemplateModules from 'containers/Bookings/BookingTemplateModules/GetAllBookingTemplateModules';
// import { InvoiceGenerate } from 'containers/finance';
// import { SendInvoice } from 'containers/finance/invoices/invoiceGenerate/SendInvoice';
// import GetAllQuotationTemplateModules from 'containers/Quotation/QuotationTemplateModules/GetAllQuotationTemplateModules';
// import QuotationTableLayouts from 'containers/Quotation/Layouts/QuotationTableLayouts';
// import QuotationCreateLayout from 'containers/Quotation/Layouts/QuotationCreateLayout';
// import QuotationTemplatePreview from 'containers/Quotation/QuotationTemplatePreview/QuotationTemplatePreview';
// import GetAllQuotationModules from 'containers/Quotation/GetAllQuotationModules/GetAllQuotationModules';
// import { IndexHOC } from 'HOC/indexHOC';
// import PageNotFound from 'pages/message/PageNotFound';
// import _401 from 'pages/message/_401';
// import TemplateRoutes from 'containers/template/routes';
// import ConfigurationRoutes from 'src/modules/config/routes';
// import CalendarRoutes from 'containers/calendar/routes';
// import CustomersRoutes from 'containers/customers/routes';
// import QuotationsRoutes from 'containers/Quotation/routes';
// import BookingsRoutes from 'containers/Bookings/routes';
// import FinanceRoutes from 'containers/finance/routes';
// import ActivityRoutes from 'containers/AssignActivities/routes';
// import BillingPlans from 'containers/Billing/BillingPlans';
// import PublicInvoicePage from 'src/modules/pages/publicPages/invoicePage/invoicePage';

// export const authRoutes = [
//   {
//     title: 'Login',
//     path: AuthRoute.LOGIN,
//     component: <Login />,
//   },
//   {
//     title: 'Tenant Login',
//     path: AuthRoute.TENANT_LOGIN,
//     component: <Login />,
//   },
//   {
//     title: 'Organization Login',
//     path: AuthRoute.ORGANIZATION_LOGIN,
//     component: <Login />,
//   },
//   {
//     title: 'Tenant Register',
//     path: AuthRoute.TENANT_REGISTER,
//     component: <TenantRegister />,
//   },
//   {
//     title: 'Organization register',
//     path: AuthRoute.ORGANIZATION_REGISTER,
//     component: <TenantRegister />,
//   },
//   {
//     title: 'Forgot Password',
//     path: AuthRoute.FORGOT_PASSWORD,
//     component: <ForgotPassword />,
//   },
//   {
//     title: 'Password Reset Link',
//     path: AuthRoute.PASSWORD_RESET_LINK,
//     component: <PasswordResetLink />,
//   },
//   {
//     title: 'Set New Password',
//     path: AuthRoute.PASSWORD_RESET_LINK,
//     component: <SetNewPassword />,
//   },
//   {
//     title: 'Password Reset Success',
//     path: AuthRoute.PASSWORD_RESET_SUCCESS,
//     component: <PasswordResetSuccess />,
//   },
// ];

// export const publicRoutes = [
//   {
//     title: 'Terms and Conditions',
//     path: PublicRoute.TWO_FACTOR_TERMS,
//     publicPage: true,
//     component: <TermsAndConditions />,
//   },
//   {
//     title: 'Privacy Policy',
//     component: <PrivacyPolicy />,
//     publicPage: true,
//     path: PublicRoute.PRIVACY_POLICY,
//   },
//   {
//     title: 'Invoice',
//     component: <PublicInvoicePage />,
//     publicPage: true,
//     path: PublicRoute.PUBLIC_INVOICE,
//   },
// ];

// export const privateRoutes = [
//   {
//     title: 'Dashboard',
//     path: PrivateRoute.DASHBOARD,
//     component: <Dashboard />,
//   },
//   {
//     title: 'Analytics',
//     path: PrivateRoute.ANALYTICS,
//     component: <Dashboard />,
//   },
//   {
//     title: 'Billing',
//     path: PrivateRoute.BILLING,
//     component: <BillingPlans />,
//   },
//   {
//     title: 'Setting',
//     path: PrivateRoute.SETTING,
//     component: <Setting />,
//     newPage: true,
//   },
//   {
//     title: 'Add Tenant',
//     path: PrivateRoute.ADD_TENANT,
//     component: <AddTenant />,
//     newPage: true,
//   },
//   {
//     title: 'View Tenant',
//     path: PrivateRoute.VIEW_TENANT,
//     component: <AddTenant />,
//     newPage: true,
//   },
//   {
//     title: 'Organization',
//     path: PrivateRoute.ORGANIZATION.HOME,
//     component: <Organization />,
//     newPage: false,
//   },
//   {
//     title: 'No Data Organization',
//     path: PrivateRoute.ORGANIZATION.noData,
//     component: IndexHOC({ component: NoDataOrganizations, permission: [] }),
//     newPage: false,
//   },
//   {
//     title: '401',
//     path: MessageRoute._401,
//     component: <_401 />,
//   },
//   ...CalendarRoutes,
//   ...CustomersRoutes,
//   ...QuotationsRoutes,
//   ...BookingsRoutes,
//   ...FinanceRoutes,
//   ...ActivityRoutes,
//   ...TemplateRoutes,
//   ...ConfigurationRoutes,
// ];

// const AppRouter: React.FC = () => {
//   return (
//     <React.Fragment>
//       <Routes>
//         {/* Assign_Activities */}
//         <Route
//           path={PrivateRoute.ASSIGN_ACTIVITIES?.HOME}
//           element={
//             <PrivateRouter>
//               <AssignActivities />
//             </PrivateRouter>
//           }
//         />
//         <Route
//           path={PrivateRoute.ASSIGN_ACTIVITIES?.ADD}
//           element={
//             <PrivateRouter>
//               <AddAssignActivity />
//             </PrivateRouter>
//           }
//         />
//         <Route
//           path={PrivateRoute.ASSIGN_ACTIVITIES?.EDIT}
//           element={
//             <PrivateRouter>
//               <EditAssignActivity />
//             </PrivateRouter>
//           }
//         />

//         {/* finance */}
//         <Route
//           path={PrivateRoute.ORGANIZATION.FINANCE.LINK}
//           element={
//             <PrivateRouter>
//               <FinanceLayout />
//             </PrivateRouter>
//           }>
//           {/* nested child within contractors */}
//           <Route
//             path={PrivateRoute.ORGANIZATION.FINANCE.CHILD_LINKS.TARIFFS.HOME}
//             element={<FinanceSettings />}
//           />
//           {/* Add Contractor */}
//           <Route
//             path={PrivateRoute.ORGANIZATION.FINANCE.CHILD_LINKS.TARIFFS.ADD}
//             element={<FinanceForm />}
//           />

//           {/* Edit TARIFF */}
//           <Route
//             path={PrivateRoute.ORGANIZATION.FINANCE.CHILD_LINKS.TARIFFS.EDIT}
//             element={<FinanceForm />}
//           />

//           <Route
//             path={PrivateRoute.ORGANIZATION.FINANCE.CHILD_LINKS.INVOICE.HOME}
//             element={<InvoiceForm />}
//           />

//           <Route
//             path={PrivateRoute.ORGANIZATION.FINANCE.CHILD_LINKS.INVOICE.CHILD_LINKS.INVOICES.HOME}
//             element={<InvoicesForm />}
//           />
//           <Route
//             path={
//               PrivateRoute.ORGANIZATION.FINANCE.CHILD_LINKS.INVOICE.CHILD_LINKS.TOBEINVOICED.HOME
//             }
//             element={<InvoicesForm />}
//           />
//           <Route
//             path={PrivateRoute.ORGANIZATION.FINANCE.CHILD_LINKS.INVOICE.CHILD_LINKS.INVOICES.HOME}
//             element={<InvoiceForm />}
//           />

//           <Route
//             path={
//               PrivateRoute.ORGANIZATION.FINANCE.CHILD_LINKS.INVOICE.CHILD_LINKS.TOBEINVOICED.HOME
//             }
//             element={<InvoiceForm />}
//           />
//           <Route
//             path={
//               PrivateRoute.ORGANIZATION.FINANCE.CHILD_LINKS.INVOICE.CHILD_LINKS.GENERATE_INVOICE
//                 .HOME
//             }
//             element={<InvoiceGenerate />}
//           />

//           <Route
//             path={
//               PrivateRoute.ORGANIZATION.FINANCE.CHILD_LINKS.INVOICE.CHILD_LINKS.SEND_INVOICE.HOME
//             }
//             element={<SendInvoice />}
//           />
//           {/* Add Services */}
//           <Route
//             path={PrivateRoute.ORGCONFIG.CONTRACTORS.CHILD_LINKS.SERVICES.ADD}
//             element={<AddServiceConfig />}
//           />

//           {/* Edit Services */}
//           <Route
//             path={PrivateRoute.ORGCONFIG.CONTRACTORS.CHILD_LINKS.SERVICES.EDIT}
//             element={<AddServiceConfig />}
//           />
//         </Route>

//         {/*  Create notification email id content */}
//         <Route
//           path={PrivateRoute.ORGCONFIG.NOTIFICATIONS.CHILD_LINKS.EMAILIDCONTENT.HOME}
//           element={
//             <PrivateRouter>
//               <EmailIdContent />
//             </PrivateRouter>
//           }
//         />

//         {/* <Route
//           element={
//             <PrivateRouter>
//               <Config />
//             </PrivateRouter>
//           }
//           path={PrivateRoute.CONFIG.home}
//         /> */}
//         {/* <Route
//           element={
//             <PrivateRouter>
//               <Config />
//             </PrivateRouter>
//           }
//           path={PrivateRoute.CONFIG.home}
//         /> */}

//         {/* <Route element={<PrivateRoute></PrivateRoute>} path='/'/> */}
//         {/*
//         <Route path='/configuration' element={<PrivateRoute><Privage} >
//           <Route path='/general-settings' element={<GeneralSettings />}  />
//         </Route> */}

//         {/* =========== BOOKINGS ROUTES STARTS HERE ============== */}
//         <Route
//           element={
//             <PrivateRouter newPage={false}>
//               <BookingTableLayouts>
//                 <GetAllBookingModules />
//               </BookingTableLayouts>
//             </PrivateRouter>
//           }
//           path="/bookings/all-bookings"
//         />

//         <Route
//           element={
//             <PrivateRouter newPage={false}>
//               <BookingTableLayouts>
//                 <GetAllBookingTemplateModules />
//               </BookingTableLayouts>
//             </PrivateRouter>
//           }
//           path="/bookings/all-booking-templates"
//         />

//         {/* full page layout for creating booking and templates */}
//         <Route
//           element={
//             <PrivateRouter newPage={true}>
//               <BookingCreateLayout />
//             </PrivateRouter>
//           }
//           path="/bookings/all-booking-templates/add"
//         />
//         {/* edit booking template */}
//         <Route
//           element={
//             <PrivateRouter newPage={true}>
//               <BookingCreateLayout />
//             </PrivateRouter>
//           }
//           path="/bookings/all-booking-templates/edit/:bookingTemplateId"
//         />
//         {/* preview booking template */}
//         <Route
//           element={
//             <PrivateRouter newPage={true}>
//               <BookingTemplatePreview />
//             </PrivateRouter>
//           }
//           path="/bookings/all-booking-templates/preview"
//         />

//         <Route
//           element={
//             <PrivateRouter newPage={true}>
//               <BookingTemplatePreview />
//             </PrivateRouter>
//           }
//           path="/bookings/add-bookings/:previewId"
//         />

//         {/* edit bookings */}
//         <Route
//           element={
//             <PrivateRouter newPage={true}>
//               <BookingTemplatePreview />
//             </PrivateRouter>
//           }
//           path="/bookings/all-bookings/edit/:bookingId"
//         />

//         {/* =========== BOOKINGS ROUTES ENDS HERE ============== */}

//         {/* =========== QUOTATION ROUTES STARTS HERE ============== */}
//         <Route
//           element={
//             <PrivateRouter newPage={false}>
//               <QuotationTableLayouts>
//                 <GetAllQuotationModules />
//               </QuotationTableLayouts>
//             </PrivateRouter>
//           }
//           path="/quotations/all-quotations"
//         />

//         <Route
//           element={
//             <PrivateRouter newPage={false}>
//               <QuotationTableLayouts>
//                 <GetAllQuotationTemplateModules />
//               </QuotationTableLayouts>
//             </PrivateRouter>
//           }
//           path="/quotations/all-quotation-templates"
//         />

//         {/* full page layout for creating quotation and templates */}
//         <Route
//           element={
//             <PrivateRouter newPage={true}>
//               <QuotationCreateLayout />
//             </PrivateRouter>
//           }
//           path="/quotations/all-quotation-templates/add"
//         />
//         {/* edit quotation template */}
//         <Route
//           element={
//             <PrivateRouter newPage={true}>
//               <QuotationCreateLayout />
//             </PrivateRouter>
//           }
//           path="/quotations/all-quotation-templates/edit/:quotationTemplateId"
//         />
//         {/* preview quotation template */}
//         <Route
//           element={
//             <PrivateRouter newPage={true}>
//               <QuotationTemplatePreview />
//             </PrivateRouter>
//           }
//           path="/quotations/all-quotation-templates/preview"
//         />

//         <Route
//           element={
//             <PrivateRouter newPage={true}>
//               <QuotationTemplatePreview />
//             </PrivateRouter>
//           }
//           path="/quotations/add-quotations/:previewId"
//         />

//         {/* edit quotations */}
//         <Route
//           element={
//             <PrivateRouter newPage={true}>
//               <QuotationTemplatePreview />
//             </PrivateRouter>
//           }
//           path="/quotations/all-quotations/edit/:quotationId"
//         />

//         {/* =========== QUOTATION ROUTES ENDS HERE ============== */}

//         <Route
//           element={
//             <PrivateRouter>
//               <OrganizationConfiguration />
//             </PrivateRouter>
//           }
//           // path={PrivateRoute.NEWCONFIG.GENERAL_SETTINGS.LINK}
//           path="/config">
//           {/* nested routes within general settings */}
//           <Route
//             path={PrivateRoute.ORGCONFIG.GENERAL_SETTINGS.LINK}
//             element={<GeneralSettingLayout />}>
//             {/* nested child within general settings */}
//             <Route
//               path={PrivateRoute.ORGCONFIG.GENERAL_SETTINGS.CHILD_LINKS.REGION.HOME}
//               element={<GeneralSetting />}
//             />
//             {/* Add region */}
//             <Route
//               path={PrivateRoute.ORGCONFIG.GENERAL_SETTINGS.CHILD_LINKS.REGION.ADD}
//               element={<AddRegionsConfig />}
//             />
//             {/* Edit region */}
//             <Route
//               path={PrivateRoute.ORGCONFIG.GENERAL_SETTINGS.CHILD_LINKS.REGION.EDIT}
//               element={<AddRegionsConfig />}
//             />
//             <Route
//               path={PrivateRoute.ORGCONFIG.GENERAL_SETTINGS.CHILD_LINKS.COUNTRY.HOME}
//               element={<GeneralSetting />}
//             />
//             {/* Add country */}
//             <Route
//               path={PrivateRoute.ORGCONFIG.GENERAL_SETTINGS.CHILD_LINKS.COUNTRY.ADD}
//               element={<AddRegionsConfig />}
//             />
//             {/* Edit country */}
//             <Route
//               path={PrivateRoute.ORGCONFIG.GENERAL_SETTINGS.CHILD_LINKS.COUNTRY.EDIT}
//               element={<AddRegionsConfig />}
//             />
//             <Route
//               path={PrivateRoute.ORGCONFIG.GENERAL_SETTINGS.CHILD_LINKS.TERRITORY.HOME}
//               element={<GeneralSetting />}
//             />
//             {/* Add territory */}
//             <Route
//               path={PrivateRoute.ORGCONFIG.GENERAL_SETTINGS.CHILD_LINKS.TERRITORY.ADD}
//               element={<AddRegionsConfig />}
//             />
//             {/* Edit territory */}
//             <Route
//               path={PrivateRoute.ORGCONFIG.GENERAL_SETTINGS.CHILD_LINKS.TERRITORY.EDIT}
//               element={<AddRegionsConfig />}
//             />
//             <Route
//               path={PrivateRoute.ORGCONFIG.GENERAL_SETTINGS.CHILD_LINKS.LOCATION.HOME}
//               element={<GeneralSetting />}
//             />
//             {/* Add location */}
//             <Route
//               path={PrivateRoute.ORGCONFIG.GENERAL_SETTINGS.CHILD_LINKS.LOCATION.ADD}
//               element={<AddRegionsConfig />}
//             />
//             {/* Edit location */}
//             <Route
//               path={PrivateRoute.ORGCONFIG.GENERAL_SETTINGS.CHILD_LINKS.LOCATION.EDIT}
//               element={<AddRegionsConfig />}
//             />
//             <Route
//               path={PrivateRoute.ORGCONFIG.GENERAL_SETTINGS.CHILD_LINKS.TIMEZONE.HOME}
//               element={<GeneralSetting />}
//             />
//             <Route
//               path={PrivateRoute.ORGCONFIG.GENERAL_SETTINGS.CHILD_LINKS.WEATHER.HOME}
//               element={<GeneralSetting />}
//             />
//             <Route
//               path={PrivateRoute.ORGCONFIG.GENERAL_SETTINGS.CHILD_LINKS.CURRENCY.HOME}
//               element={<GeneralSetting />}
//             />
//           </Route>

//           {/* nested routes within users */}
//           <Route path={PrivateRoute.ORGCONFIG.USERS.LINK} element={<UsersSettingLayout />}>
//             {/* nested child within user department */}
//             <Route
//               path={PrivateRoute.ORGCONFIG.USERS.CHILD_LINKS.ROLES_AND_PERMISSION.HOME}
//               element={<UserSetting />}
//             />
//             <Route
//               path={PrivateRoute.ORGCONFIG.USERS.CHILD_LINKS.USER_DEPARTMENT.HOME}
//               element={<UserSetting />}
//             />
//             {/* Add user department */}
//             <Route
//               path={PrivateRoute.ORGCONFIG.USERS.CHILD_LINKS.USER_DEPARTMENT.ADD}
//               element={<AddUserDepartment />}
//             />
//             {/* Edit User department */}
//             <Route
//               path={PrivateRoute.ORGCONFIG.USERS.CHILD_LINKS.USER_DEPARTMENT.EDIT}
//               element={<AddUserDepartment />}
//             />
//             <Route
//               path={PrivateRoute.ORGCONFIG.USERS.CHILD_LINKS.USER.HOME}
//               element={<UserSetting />}
//             />
//             {/* Add organization Users */}
//             <Route
//               path={PrivateRoute.ORGCONFIG.USERS.CHILD_LINKS.USER.ADD}
//               element={<AddOrgUsers />}
//             />

//             {/* ================= USER PROFILE SETTINGS ============ */}
//             <Route
//               path={PrivateRoute.ORGCONFIG.USERS.CHILD_LINKS.USER.USER_PROFILE.HOME}
//               element={<UserProfileLayout />}>
//               <Route
//                 path={
//                   PrivateRoute.ORGCONFIG.USERS.CHILD_LINKS.USER.USER_PROFILE.USER_PROFILE_SETTINGS
//                     .HOME
//                 }
//                 element={<UserProfileSettings />}
//               />
//               <Route
//                 path={
//                   PrivateRoute.ORGCONFIG.USERS.CHILD_LINKS.USER.USER_PROFILE
//                     .USER_PROFILE_NOTIFICATIONS.HOME
//                 }
//                 element={<UserProfileNotifications />}
//               />
//               <Route
//                 path={
//                   PrivateRoute.ORGCONFIG.USERS.CHILD_LINKS.USER.USER_PROFILE
//                     .USER_PROFILE_PERMISSIONS.HOME
//                 }
//                 element={<UserProfilePermissions />}
//               />
//               <Route
//                 path={
//                   PrivateRoute.ORGCONFIG.USERS.CHILD_LINKS.USER.USER_PROFILE
//                     .USER_PROFILE_PERFORMANCE.HOME
//                 }
//                 element={<UserProfilePerformance />}
//               />
//               <Route
//                 path={
//                   PrivateRoute.ORGCONFIG.USERS.CHILD_LINKS.USER.USER_PROFILE
//                     .USER_PROFILE_TEMPLATE_ACCESSED.HOME
//                 }
//                 element={<UserProfileTemplateAccessed />}
//               />
//             </Route>
//             {/* ================= USER PROFILE SETTINGS ENDS HERE ============ */}

//             {/* ================= USER ROLES AND PERMISSIONS START HERE ============ */}

//             <Route
//               path={PrivateRoute.ORGCONFIG.USERS.CHILD_LINKS.ROLES_AND_PERMISSION.EDIT}
//               element={<RolesAndPermission />}
//             />

//             {/* ================= USER ROLES AND PERMISSIONS ENDS HERE ============ */}

//             <Route
//               path={PrivateRoute.ORGCONFIG.USERS.CHILD_LINKS.USER_SECURITY.HOME}
//               element={<UserSecurity />}
//             />
//             <Route
//               path={PrivateRoute.ORGCONFIG.USERS.CHILD_LINKS.SYSTEM_PARAMETERS.HOME}
//               element={<SystemParamaters />}
//             />
//           </Route>

//           {/* nested routes within notifications */}
//           <Route
//             path={PrivateRoute.ORGCONFIG.NOTIFICATIONS.LINK}
//             element={<NotificationsLayot />}
//           />

//           {/* <Route
//               path={PrivateRoute.ORGCONFIG.INSPECTION_TYPES.CHILD_LINKS.INSPECTION_NAMES.HOME}
//               element={<InspectionTypes />}
//             /> */}

//           {/* nested routes within inspection types */}
//           <Route
//             path={PrivateRoute.ORGCONFIG.INSPECTION_TYPES.LINK}
//             element={<InspectionTypesLayout />}>
//             {/* nested routes within inspection types */}
//             <Route
//               path={PrivateRoute.ORGCONFIG.INSPECTION_TYPES.CHILD_LINKS.INSPECTION_NAMES.HOME}
//               element={<InspectionTypes />}
//             />
//             {/* Add inspection names */}
//             <Route
//               path={PrivateRoute.ORGCONFIG.INSPECTION_TYPES.CHILD_LINKS.INSPECTION_NAMES.ADD}
//               element={<AddRegionsConfig />}
//             />
//             {/* edit inspection names */}
//             <Route
//               path={PrivateRoute.ORGCONFIG.INSPECTION_TYPES.CHILD_LINKS.INSPECTION_NAMES.EDIT}
//               element={<AddRegionsConfig />}
//             />

//             <Route
//               path={PrivateRoute.ORGCONFIG.INSPECTION_TYPES.CHILD_LINKS.INSPECTION_STATUS.HOME}
//               element={<InspectionTypes />}
//             />
//             {/* Add inspection status */}
//             <Route
//               path={PrivateRoute.ORGCONFIG.INSPECTION_TYPES.CHILD_LINKS.INSPECTION_STATUS.ADD}
//               element={<AddRegionsConfig />}
//             />
//             {/* edit inspection status */}
//             <Route
//               path={PrivateRoute.ORGCONFIG.INSPECTION_TYPES.CHILD_LINKS.INSPECTION_STATUS.EDIT}
//               element={<AddRegionsConfig />}
//             />
//           </Route>

//           {/* nested routes within booking status */}
//           <Route
//             path={PrivateRoute?.ORGCONFIG.BOOKING.LINK}
//             element={<BookignSettingLayout />}></Route>

//           {/* Add booking status */}
//           <Route path={PrivateRoute?.ORGCONFIG.BOOKING.ADD} element={<AddBooking></AddBooking>} />

//           {/* Edit booking status */}
//           <Route path={PrivateRoute?.ORGCONFIG.BOOKING.EDIT} element={<AddBooking />} />

//           {/* nested routes within contractors */}
//           <Route path={PrivateRoute.ORGCONFIG.CONTRACTORS.LINK} element={<ContractorLayout />}>
//             {/* nested child within contractors */}
//             <Route
//               path={PrivateRoute.ORGCONFIG.CONTRACTORS.CHILD_LINKS.ALL_CONTRACTORS.HOME}
//               element={<ContractorSetting />}
//             />
//             {/* Add Contractor */}
//             <Route
//               path={PrivateRoute.ORGCONFIG.CONTRACTORS.CHILD_LINKS.ALL_CONTRACTORS.ADD}
//               element={<AddContractor />}
//             />

//             {/* Edit Contractor */}
//             <Route
//               path={PrivateRoute.ORGCONFIG.CONTRACTORS.CHILD_LINKS.ALL_CONTRACTORS.EDIT}
//               element={<AddContractor />}
//             />

//             <Route
//               path={PrivateRoute.ORGCONFIG.CONTRACTORS.CHILD_LINKS.SERVICES.HOME}
//               element={<ContractorSetting />}
//             />

//             {/* Add Services */}
//             <Route
//               path={PrivateRoute.ORGCONFIG.CONTRACTORS.CHILD_LINKS.SERVICES.ADD}
//               element={<AddServiceConfig />}
//             />

//             {/* Edit Services */}
//             <Route
//               path={PrivateRoute.ORGCONFIG.CONTRACTORS.CHILD_LINKS.SERVICES.EDIT}
//               element={<AddServiceConfig />}
//             />
//           </Route>

//           {/* Routes within Activity */}
//           <Route path={PrivateRoute.ORGCONFIG.ACTIVITY.LINK} element={<ActivityLayout />}>
//             {/* nested child within Activity */}
//             <Route
//               path={PrivateRoute.ORGCONFIG.ACTIVITY.CHILD_LINKS.ACTIVITY_TYPES.HOME}
//               element={<ActivitySetting />}
//             />
//             {/* Add Activity */}
//             <Route
//               path={PrivateRoute.ORGCONFIG.ACTIVITY.CHILD_LINKS.ACTIVITY_TYPES.ADD}
//               element={<AddActivity />}
//             />

//             {/* Edit Activity */}
//             <Route
//               path={PrivateRoute.ORGCONFIG.ACTIVITY.CHILD_LINKS.ACTIVITY_TYPES.EDIT}
//               element={<AddActivity />}
//             />

//             <Route
//               path={PrivateRoute.ORGCONFIG.ACTIVITY.CHILD_LINKS.ACTIVITY_STATUS.HOME}
//               element={<ActivitySetting />}
//             />

//             {/* Add Services */}
//             <Route
//               path={PrivateRoute.ORGCONFIG.ACTIVITY.CHILD_LINKS.ACTIVITY_STATUS.ADD}
//               element={<AddActivity />}
//             />

//             {/* Edit Services */}
//             <Route
//               path={PrivateRoute.ORGCONFIG.ACTIVITY.CHILD_LINKS.ACTIVITY_STATUS.EDIT}
//               element={<AddActivity />}
//             />
//           </Route>

//           {/* nested routes within finance */}
//           <Route path={PrivateRoute.ORGCONFIG.FINANCE.LINK} element={<FinanceSettingLayout />}>
//             {/* nested child within finance */}
//             <Route
//               path={PrivateRoute.ORGCONFIG.FINANCE.CHILD_LINKS.BILLING_AGREEMENT_NAMES.HOME}
//               element={<FinanceConfiguration />}
//             />
//             {/* Add billing agreement name */}
//             <Route
//               path={PrivateRoute.ORGCONFIG.FINANCE.CHILD_LINKS.BILLING_AGREEMENT_NAMES.ADD}
//               element={<AddRegionsConfig />}
//             />
//             {/* Edit billing agreement name */}
//             <Route
//               path={PrivateRoute.ORGCONFIG.FINANCE.CHILD_LINKS.BILLING_AGREEMENT_NAMES.EDIT}
//               element={<AddRegionsConfig />}
//             />
//             <Route
//               path={PrivateRoute.ORGCONFIG.FINANCE.CHILD_LINKS.TARIFF_RATE_TYPES.HOME}
//               element={<FinanceConfiguration />}
//             />
//             {/* Add tariff rate types */}
//             <Route
//               path={PrivateRoute.ORGCONFIG.FINANCE.CHILD_LINKS.TARIFF_RATE_TYPES.ADD}
//               element={<AddRegionsConfig />}
//             />
//             {/* Edit tariff rate types */}
//             <Route
//               path={PrivateRoute.ORGCONFIG.FINANCE.CHILD_LINKS.TARIFF_RATE_TYPES.EDIT}
//               element={<AddRegionsConfig />}
//             />
//           </Route>

//           {/* findings and recommendations */}
//           <Route
//             path={PrivateRoute?.ORGCONFIG.FINDINGS_RECOMMENDATIONS.LINK}
//             element={<FindingsAndRecommendationsLayout />}></Route>

//           {/* Add Finding And Recommendations */}
//           <Route
//             path={PrivateRoute?.ORGCONFIG.FINDINGS_RECOMMENDATIONS.ADD}
//             element={<AddFindingRecommendation></AddFindingRecommendation>}
//           />
//           {/* global response set */}
//           <Route
//             path={PrivateRoute.ORGCONFIG.GLOBALRESPONSESET.LINK}
//             element={<GlobalResponseSetLayout />}>
//             <Route
//               path={PrivateRoute.ORGCONFIG.GLOBALRESPONSESET.CHILD_LINKS.CUSTOMRESPONSESET.HOME}
//               element={<GlobalResponseSetSetting />}
//             />
//             {/* Add custom response set */}
//             <Route
//               path={PrivateRoute.ORGCONFIG.GLOBALRESPONSESET.CHILD_LINKS.CUSTOMRESPONSESET.ADD}
//               element={<AddResponseSet />}
//             />

//             {/* Edit custom response set */}
//             <Route
//               path={PrivateRoute.ORGCONFIG.GLOBALRESPONSESET.CHILD_LINKS.CUSTOMRESPONSESET.EDIT}
//               element={<AddResponseSet />}
//             />

//             {/* home external response set */}
//             <Route
//               path={PrivateRoute.ORGCONFIG.GLOBALRESPONSESET.CHILD_LINKS.EXTERNALRESPONSESET.HOME}
//               element={<GlobalResponseSetSetting />}
//             />

//             {/* Add external response */}
//             <Route
//               path={PrivateRoute.ORGCONFIG.GLOBALRESPONSESET.CHILD_LINKS.EXTERNALRESPONSESET.ADD}
//               element={<AddExternalResponseSet />}
//             />

//             {/* Edit external response */}
//             <Route
//               path={PrivateRoute.ORGCONFIG.GLOBALRESPONSESET.CHILD_LINKS.EXTERNALRESPONSESET.EDIT}
//               element={<AddExternalResponseSet />}
//             />
//             {/* home internal response set */}
//             <Route
//               path={PrivateRoute.ORGCONFIG.GLOBALRESPONSESET.CHILD_LINKS.INTERNALRESPONSESET.HOME}
//               element={<GlobalResponseSetSetting />}
//             />

//             {/* Add internal response */}
//             <Route
//               path={PrivateRoute.ORGCONFIG.GLOBALRESPONSESET.CHILD_LINKS.INTERNALRESPONSESET.ADD}
//               element={<AddResponseSet />}
//             />

//             {/* Edit internal response */}
//             <Route
//               path={PrivateRoute.ORGCONFIG.GLOBALRESPONSESET.CHILD_LINKS.INTERNALRESPONSESET.EDIT}
//               element={<AddResponseSet />}
//             />
//           </Route>
//           {/* Edit booking status */}
//           <Route
//             path={PrivateRoute?.ORGCONFIG.FINDINGS_RECOMMENDATIONS.EDIT}
//             element={<AddFindingRecommendation />}
//           />
//         </Route>

//         {/* <Route
//           element={
//             <PrivateRouter>
//               <CountryConfig />
//             </PrivateRouter>
//           }
//           path={PrivateRoute.CONFIG.department.home}
//         /> */}

//         {/* ------CONFIG===> REGION------- */}
//         {/* <Route
//           element={
//             <PrivateRouter>
//               <CountryConfig />
//             </PrivateRouter>
//           }
//           path={PrivateRoute.CONFIG.REGION.HOME}
//         /> */}
//         <Route
//           element={
//             <PrivateRouter>
//               <AddRegionsConfig />
//             </PrivateRouter>
//           }
//           path={PrivateRoute.CONFIG.REGION.ADD}
//         />
//         <Route
//           element={
//             <PrivateRouter>
//               <AddRegionsConfig />
//             </PrivateRouter>
//           }
//           path={`${PrivateRoute.CONFIG.REGION.EDIT}/:regionId`}
//         />
//         {/* ---------REGION---------- */}

//         {/* ------CONFIG===> COUNTRY------- */}
//         {/* <Route
//           element={
//             <PrivateRouter>
//               <CountryConfig />
//             </PrivateRouter>
//           }
//           path={PrivateRoute.CONFIG.COUNTRY.HOME}
//         /> */}

//         <Route
//           element={
//             <PrivateRouter>
//               <AddRegionsConfig />
//             </PrivateRouter>
//           }
//           path={PrivateRoute.CONFIG.COUNTRY.ADD}
//         />
//         <Route
//           element={
//             <PrivateRouter>
//               <AddRegionsConfig />
//             </PrivateRouter>
//           }
//           path={`${PrivateRoute.CONFIG.COUNTRY.EDIT}/:countryId`}
//         />
//         {/* ---------COUNTRY---------- */}

//         {/* ------CONFIG===> TERRITORY------- */}
//         {/* <Route
//           element={
//             <PrivateRouter>
//               <CountryConfig />
//             </PrivateRouter>
//           }
//           path={PrivateRoute.CONFIG.TERRITORY.HOME}
//         /> */}
//         <Route
//           element={
//             <PrivateRouter>
//               <AddRegionsConfig />
//             </PrivateRouter>
//           }
//           path={PrivateRoute.CONFIG.TERRITORY.ADD}
//         />
//         <Route
//           element={
//             <PrivateRouter>
//               <AddRegionsConfig />
//             </PrivateRouter>
//           }
//           path={`${PrivateRoute.CONFIG.TERRITORY.EDIT}/:territoryId`}
//         />
//         {/* ---------TERRITORY---------- */}

//         {/* ------CONFIG===> LOCATION------- */}
//         {/* <Route
//           element={
//             <PrivateRouter>
//               <CountryConfig />
//             </PrivateRouter>
//           }
//           path={PrivateRoute.CONFIG.LOCATION.HOME}
//         /> */}
//         <Route
//           element={
//             <PrivateRouter>
//               <AddRegionsConfig />
//             </PrivateRouter>
//           }
//           path={PrivateRoute.CONFIG.LOCATION.ADD}
//         />
//         <Route
//           element={
//             <PrivateRouter>
//               <AddRegionsConfig />
//             </PrivateRouter>
//           }
//           path={`${PrivateRoute.CONFIG.LOCATION.EDIT}/:locationId`}
//         />

//         {/* ---------LOCATION---------- */}

//         {/* ------CONFIG===> FINANCE------- */}
//         {/* <Route
//           element={
//             <PrivateRouter newPage={true}>
//               <FinanceConfig />
//             </PrivateRouter>
//           }
//           path={PrivateRoute.CONFIG.FINANCE.HOME}
//         /> */}

//         <Route
//           element={
//             <PrivateRouter newPage={true}>
//               <AddRegionsConfig />
//             </PrivateRouter>
//           }
//           path={PrivateRoute.CONFIG.FINANCE.ADD_BILLING_AGREEMENT}
//         />
//         <Route
//           element={
//             <PrivateRouter newPage={true}>
//               <AddRegionsConfig />
//             </PrivateRouter>
//           }
//           path={`${PrivateRoute.CONFIG.FINANCE.EDIT_BILLING_AGREEMENT}/:billingAgreementId`}
//         />
//         <Route
//           element={
//             <PrivateRouter newPage={true}>
//               <AddRegionsConfig />
//             </PrivateRouter>
//           }
//           path={PrivateRoute.CONFIG.FINANCE.ADD_TAFIFF_RATE}
//         />

//         {/* ---------FINANCE---------- */}

//         <Route
//           element={
//             <PrivateRouter>
//               <UserSetting />
//             </PrivateRouter>
//           }
//           path={PrivateRoute.CONFIG.department.home}
//         />
//         <Route
//           element={
//             <PrivateRouter>
//               <AddUserDepartment />
//             </PrivateRouter>
//           }
//           path={PrivateRoute.CONFIG.department.add}
//         />
//         <Route
//           element={
//             <PrivateRouter>
//               <AddUserDepartment />
//             </PrivateRouter>
//           }
//           path={`${PrivateRoute.CONFIG.department.add}/:departmentId`}
//         />
//         <Route
//           element={
//             <PrivateRouter>
//               <AddInspectionStatusConfig />
//             </PrivateRouter>
//           }
//           path={PrivateRoute.CONFIG.INSPECTION.ADD}
//         />
//         <Route
//           element={
//             <PrivateRouter>
//               <AddInspectionStatusConfig />
//             </PrivateRouter>
//           }
//           path={`${PrivateRoute.CONFIG.INSPECTION.EDIT}/:inspectionStatusId`}
//         />

//         {/* USER ===>   system paramater */}

//         {/* <Route
//           element={
//             <PrivateRouter>
//               <CountryConfig />
//             </PrivateRouter>
//           }
//           path={PrivateRoute.CONFIG.USERS.SYSTEM_PARAMATERS}
//         /> */}

//         <Route
//           element={
//             <PrivateRouter newPage={true}>
//               <AddOrganization />
//             </PrivateRouter>
//           }
//           path={PrivateRoute.ADD_ORGANIZATION}
//         />
//         <Route
//           element={
//             <PrivateRouter newPage={true}>
//               <AddOrganization />
//             </PrivateRouter>
//           }
//           path={PrivateRoute.VIEW_ORGANIZATION}
//         />

//         <Route
//           element={
//             <PrivateRouter newPage={true}>
//               <AddRegionsConfig />
//             </PrivateRouter>
//           }
//           path={`${PrivateRoute.CONFIG.FINANCE.ADD_TAFIFF_RATE}/:tariffRateId`}
//         />

//         <Route
//           element={
//             <PrivateRouter newPage={true}>
//               <TwoFactor_QR />
//             </PrivateRouter>
//           }
//           path={PrivateRoute.TWO_FACTOR}
//         />
//         <Route
//           element={
//             <FullPageOutlet publicPage hideeBackButton>
//               <OTP />
//             </FullPageOutlet>
//           }
//           path={PrivateRoute.OTP}
//         />

//         <Route path="*" element={<PageNotFound />} />
//       </Routes>
//     </React.Fragment>
//   );
// };

const AppRouter = () => {
  return <></>;
};

export default AppRouter;
