// import { tabContainerBookings } from "containers/Bookings/Layouts/BookingTableLayouts";
import { permissionList } from "src/constants/permission";
import { PrivateRoute } from "src/constants/variables";
// import { tabContainerQuotation } from "containers/Quotation/Layouts/QuotationTableLayouts";
import { tabContainerFinance } from "src/modules/finance/FinanceConfig";
import { tabContainerConfiguration } from "src/modules/config/generalSettings/OrganizationConfiguration";
import { rolesList } from "src/constants/roles";

export const menuData = {
  PLATFORM_OWNER: [
    { label: "Overview", path: PrivateRoute.DASHBOARD, icon: "overview" },
    { label: "Billing", path: PrivateRoute.BILLING, icon: "finance" },
    // { label: 'Analytics', path: PrivateRoute.ANALYTICS, icon: 'activity' },
    { label: "Payment method", path: PrivateRoute.PAYMENT_METHOD, icon: "payment" },
    // { label: 'Setting', path: PrivateRoute.SETTING, icon: 'overview' }
  ],
  TENANT: [
    { label: "Overview", path: PrivateRoute.DASHBOARD, icon: "overview" },
    // { label: 'Analytics', path: PrivateRoute.ANALYTICS, icon: 'activity' },
  ],
  ORGANIZATION: [
    {
      label: "Overview",
      path: PrivateRoute.ORGANIZATION.noData,
      icon: "overview",
      role: [],
      permission: [],
      tabsContainer: [],
      depth: 1,
    },
    {
      label: "Calendar",
      path: "/calendar",
      icon: "calendar",
      role: [],
      permission: [permissionList.Event.view],
      tabsContainer: [],
      depth: 1,
    },
    {
      label: "Customers",
      path: PrivateRoute.ORGANIZATION.CUSTOMERS?.LINK,
      icon: "customer",
      role: [],
      permission: [permissionList.Customer.view],
      tabsContainer: [],
      depth: 1,
    },
    // {
    //   label: "Quotations",
    //   path: tabContainerQuotation[0].link,
    //   icon: "quotation",
    //   role: [],
    //   permission: [permissionList.Quotations.view, permissionList.QuotationTemplates.view],
    //   tabsContainer: tabContainerQuotation,
    //   depth: 1,
    // },
    // {
    //   label: "Bookings",
    //   path: PrivateRoute.BOOKINGS.CHILD_LINKS.ALL_BOOKING.ALL_BOOKING.LINK,
    //   icon: "booking",
    //   role: [],
    //   permission: [permissionList.BookingTemplates.view, permissionList.Bookings.view],
    //   tabsContainer: tabContainerBookings,
    //   depth: 1,
    // },
    {
      label: "Form Builder",
      path: "/template",
      icon: "template",
      role: [],
      permission: [permissionList.Form.view],
      tabsContainer: [],
      depth: 1,
    },

    {
      label: "Inspections",
      path: PrivateRoute.INSPECTION.ROOT,
      icon: "inspection",
      role: [],
      permission: [permissionList.Inspection.view],
      tabsContainer: [],
      depth: 1,
    },
    {
      label: "Finance",
      path: "/finance/invoice/to-be-invoiced",
      icon: "finance",
      role: [],
      permission: [permissionList.Invoice.view, permissionList.Tariffs.view],
      tabsContainer: tabContainerFinance,
      depth: 1,
    },

    {
      label: "Activities",
      path: PrivateRoute.ASSIGN_ACTIVITIES.HOME,
      icon: "activity",
      role: [],
      permission: [permissionList.Activity.view],
      tabsContainer: [],
      depth: 1,
    },
    // {
    //   label: "Analytics",
    //   path: PrivateRoute.ORGANIZATION.noData,
    //   icon: "analytic",
    //   role: [],
    //   permission: [],
    //   tabsContainer: [],
    //   depth: 1,
    // },
    {
      label: "Configuration",
      path: "/config/general-settings/region",
      icon: "configuration",
      position: "end",
      role: [rolesList.organization],
      permission: [
        permissionList.Region.view,
        permissionList.Country.view,
        permissionList.Territory.view,
        permissionList.Location.view,
        permissionList.SystemParameters.view,
        permissionList.UserPermission.view,
        permissionList.UserRole.view,
        permissionList.UserDepartment.view,
        permissionList.UserSecurity.view,
        permissionList.OrganizationUser.view,
        permissionList.InspectionName.view,
        permissionList.InspectionStatus.view,
        permissionList.Alert.view,
        permissionList.Contractor.view,
        permissionList.Service.view,
        permissionList.BookingStatus.view,
        permissionList.InternalAttributes.view,
        permissionList.CustomAttributes.view,
        permissionList.ExternalAttributes.view,
        permissionList.TariffRateType.view,
        permissionList.ActivityStatus.view,
        permissionList.FindingsCategory.view,
      ],
      tabsContainer: tabContainerConfiguration,
      depth: 2,
    },
    {
      label: "Organization",
      icon: "organization",
      path: "/organization",
      permission: [permissionList.Logs.view],
      role: [],
      tabsContainer: [],
      depth: 1,
    },
    // { label: 'Help', path: PrivateRoute.ANALYTICS, icon: 'help' },
  ],
};