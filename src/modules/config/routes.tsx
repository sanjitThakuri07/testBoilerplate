import { PrivateRoute, userProfileRoot } from "src/constants/variables";
import { IndexHOC } from "src/hoc/indexHOC";
import _401 from "pages/message/_401";
import GeneralSetting from "src/modules/config/generalSettings/GeneralSetting";
import AddRegionsConfig from "src/modules/config/generalSettings/region/AddRegionsConfig";

import UserSetting from "src/modules/config/users/UserSetting";
import UserSecurity from "./users/UserSecurity/UserSecurity";
import SystemParamaters from "./users/systemParamaters";
import AddUserDepartment from "./users/userDepartment/AddUserDepartment";
import AddOrgUsers from "./users/OrganizationUsers/AddOrgUsers";
import UserProfileSettings from "./users/UserProfile/UserProfileSettings";
import UserProfileNotifications from "./users/UserProfile/UserProfileNotifications";
import UserProfilePermissions from "./users/UserProfile/UserProfilePermissions";
import UserProfilePerformance from "./users/UserProfile/UserProfilePerformance";
import UserProfileTemplateAccessed from "./users/UserProfile/UserProfileTemplateAccessed";
import RolesAndPermission from "./users/RolesAndPermission/RolesAndPermission";
import NotificationsLayot from "./notifications/NotificationsLayot";
import InspectionTypes from "./Inspection_types";
import AddBooking from "./booking/bookingForms/AddBooking";
import BookignSettingLayout from "src/modules/config/booking/BookingSettingLayout";

import AddContractor from "src/modules/config/contractors/contractor/index";
import ContractorSetting from "src/modules/config/contractors/Contractor";
import AddServiceConfig from "src/modules/config/contractors/services/AddService";

import GlobalResponseSetSetting from "src/modules/config/globalResponseSet/GlobalResponse";
import AddResponseSet from "src/modules/config/globalResponseSet/internalResponseSet/index";
import AddExternalResponseSet from "src/modules/config/globalResponseSet/externalResponseSet/index";

import ActivitySetting from "src/modules/config/activity/Activity";
import AddActivity from "src/modules/config/activity/activityForms/AddActivity";

import FinanceConfiguration from "src/modules/config/finance";

import FindingsAndRecommendationsLayout from "src/modules/config/findingAndRecommendations/FindingsAndRecommendationLayout";
import AddFindingRecommendation from "src/modules/config/findingAndRecommendations/findingsAndRecommendationsForm/AddCategory";
import { permissionList } from "src/constants/permission";

const generalSettings = [
  {
    title: "General Settings/ Region",
    path: PrivateRoute.configuration.general_settings.REGION.HOME,
    component: IndexHOC({
      component: GeneralSetting,
      permission: [permissionList.Region.view],
      role: [],
    }),
    newPage: false,
  },
  {
    title: "General Settings/ Add Region",
    path: PrivateRoute.configuration.general_settings.REGION.ADD,
    component: IndexHOC({
      component: AddRegionsConfig,
      permission: [permissionList.Region.add],
      role: [],
    }),
    newPage: false,
  },
  {
    title: "General Settings/ Edit Region",
    path: PrivateRoute.configuration.general_settings.REGION.EDIT,
    component: IndexHOC({
      component: AddRegionsConfig,
      permission: [permissionList.Region.edit],
      role: [],
    }),
    newPage: false,
  },
  {
    title: "General Settings/ View Region",
    path: PrivateRoute.configuration.general_settings.REGION.VIEW,
    component: IndexHOC({
      component: AddRegionsConfig,
      permission: [permissionList.Region.view],
      role: [],
    }),
    newPage: false,
  },
  {
    title: "General Settings/ Country",
    path: PrivateRoute.configuration.general_settings.COUNTRY.HOME,
    component: IndexHOC({
      component: GeneralSetting,
      permission: [permissionList.Country.view],
      role: [],
    }),
    newPage: false,
  },
  {
    title: "General Settings/ Add Country",
    path: PrivateRoute.configuration.general_settings.COUNTRY.ADD,
    component: IndexHOC({
      component: AddRegionsConfig,
      permission: [permissionList.Country.add],
      role: [],
    }),
    newPage: false,
  },
  {
    title: "General Settings/ Edit Country",
    path: PrivateRoute.configuration.general_settings.COUNTRY.EDIT,
    component: IndexHOC({
      component: AddRegionsConfig,
      permission: [permissionList.Country.edit],
      role: [],
    }),
    newPage: false,
  },
  {
    title: "General Settings/ View Country",
    path: PrivateRoute.configuration.general_settings.COUNTRY.VIEW,
    component: IndexHOC({
      component: AddRegionsConfig,
      permission: [permissionList.Country.view],
      role: [],
    }),
    newPage: false,
  },
  {
    title: "General Settings/ Territory",
    path: PrivateRoute.configuration.general_settings.TERRITORY.HOME,
    component: IndexHOC({
      component: GeneralSetting,
      permission: [permissionList.Territory.view],
      role: [],
    }),
    newPage: false,
  },
  {
    title: "General Settings/ Add Territory",
    path: PrivateRoute.configuration.general_settings.TERRITORY.ADD,
    component: IndexHOC({
      component: AddRegionsConfig,
      permission: [permissionList.Territory.add],
      role: [],
    }),
    newPage: false,
  },
  {
    title: "General Settings/ View Territory",
    path: PrivateRoute.configuration.general_settings.TERRITORY.VIEW,
    component: IndexHOC({
      component: AddRegionsConfig,
      permission: [permissionList.Territory.view],
      role: [],
    }),
    newPage: false,
  },
  {
    title: "General Settings/ Edit Territory",
    path: PrivateRoute.configuration.general_settings.TERRITORY.EDIT,
    component: IndexHOC({
      component: AddRegionsConfig,
      permission: [permissionList.Territory.edit],
      role: [],
    }),
    newPage: false,
  },
  {
    title: "General Settings/ Location",
    path: PrivateRoute.configuration.general_settings.LOCATION.HOME,
    component: IndexHOC({
      component: GeneralSetting,
      permission: [permissionList.Location.view],
      role: [],
    }),
    newPage: false,
  },
  {
    title: "General Settings/ Add Location",
    path: PrivateRoute.configuration.general_settings.LOCATION.ADD,
    component: IndexHOC({
      component: AddRegionsConfig,
      permission: [permissionList.Location.add],
      role: [],
    }),
    newPage: false,
  },
  {
    title: "General Settings/ Edit Location",
    path: PrivateRoute.configuration.general_settings.LOCATION.EDIT,
    component: IndexHOC({
      component: AddRegionsConfig,
      permission: [permissionList.Location.edit],
      role: [],
    }),
    newPage: false,
  },
  {
    title: "General Settings/ View Location",
    path: PrivateRoute.configuration.general_settings.LOCATION.VIEW,
    component: IndexHOC({
      component: AddRegionsConfig,
      permission: [permissionList.Location.view],
      role: [],
    }),
    newPage: false,
  },
  {
    title: "General Settings/ Time Zone",
    path: PrivateRoute.configuration.general_settings.TIMEZONE.HOME,
    component: IndexHOC({ component: GeneralSetting, permission: [], role: [] }),
    newPage: false,
  },
  {
    title: "General Settings/ Weather",
    path: PrivateRoute.configuration.general_settings.WEATHER.HOME,
    component: IndexHOC({ component: GeneralSetting, permission: [], role: [] }),
    newPage: false,
  },
  {
    title: "General Settings/ Currency",
    path: PrivateRoute.configuration.general_settings.CURRENCY.HOME,
    component: IndexHOC({ component: GeneralSetting, permission: [], role: [] }),
    newPage: false,
  },
  {
    title: "Users Settings/ System Parameter",
    path: PrivateRoute.configuration.general_settings.SYSTEM_PARAMETERS.HOME,
    component: IndexHOC({ component: SystemParamaters, permission: [], role: [] }),
    newPage: false,
  },
];

const usersSettings = [
  {
    title: "Users Settings/ Role and Permission",
    path: PrivateRoute.configuration.users.ROLES_AND_PERMISSION.HOME,
    component: IndexHOC({
      component: UserSetting,
      permission: [permissionList.UserPermission.view, permissionList.UserRole.view],
      role: [],
    }),
    newPage: false,
  },
  {
    title: "Users Settings/Edit Role and Permission",
    path: PrivateRoute.configuration.users.ROLES_AND_PERMISSION.EDIT,
    component: IndexHOC({
      component: RolesAndPermission,
      permission: [permissionList.UserRole.edit],
      role: [],
    }),
    newPage: false,
  },
  {
    title: "Users Settings/View Role and Permission",
    path: PrivateRoute.configuration.users.ROLES_AND_PERMISSION.VIEW,
    component: IndexHOC({
      component: RolesAndPermission,
      permission: [permissionList.UserRole.view],
      role: [],
    }),
    newPage: false,
  },
  {
    title: "Users Settings/ User Department",
    path: PrivateRoute.configuration.users.USER_DEPARTMENT.HOME,
    component: IndexHOC({
      component: UserSetting,
      permission: [permissionList.UserDepartment.view],
      role: [],
    }),
    newPage: false,
  },
  {
    title: "Users Settings/ Add User Department",
    path: PrivateRoute.configuration.users.USER_DEPARTMENT.ADD,
    component: IndexHOC({
      component: AddUserDepartment,
      permission: [permissionList.UserDepartment.add],
      role: [],
    }),
    newPage: false,
  },
  {
    title: "Users Settings/ Edit User Department",
    path: PrivateRoute.configuration.users.USER_DEPARTMENT.EDIT,
    component: IndexHOC({
      component: AddUserDepartment,
      permission: [permissionList.UserDepartment.edit],
      role: [],
    }),
    newPage: false,
  },
  {
    title: "Users Settings/ View User Department",
    path: PrivateRoute.configuration.users.USER_DEPARTMENT.VIEW,
    component: IndexHOC({
      component: AddUserDepartment,
      permission: [permissionList.UserDepartment.view],
      role: [],
    }),
    newPage: false,
  },
  {
    title: "Users Settings/ User",
    path: PrivateRoute.configuration.users.USER.HOME,
    component: IndexHOC({
      component: UserSetting,
      permission: [permissionList.OrganizationUser.view],
      role: [],
    }),
    newPage: false,
  },
  {
    title: "Users Settings/ Add User",
    path: PrivateRoute.configuration.users.USER.ADD,
    component: IndexHOC({
      component: AddOrgUsers,
      permission: [permissionList.OrganizationUser.add],
      role: [],
    }),
    newPage: false,
  },

  {
    title: "Users Settings/ Edit User",
    path: PrivateRoute.configuration.users.USER.EDIT,
    component: IndexHOC({
      component: UserProfileSettings,
      permission: [permissionList.OrganizationUser.edit],
      role: [],
    }),
    newPage: false,
  },
  {
    title: "Users Settings/ View User",
    path: PrivateRoute.configuration.users.USER.VIEW,
    component: IndexHOC({
      component: UserProfileSettings,
      permission: [permissionList.OrganizationUser.view],
      role: [],
    }),
    newPage: false,
  },
  {
    title: "Users Settings/ User Security",
    path: PrivateRoute.configuration.users.USER_SECURITY.HOME,
    component: IndexHOC({ component: UserSecurity, permission: [], role: [] }),
    newPage: false,
  },
];

const userProfiles = [
  {
    title: "Users Settings/ Edit User",
    path: PrivateRoute.userProfile.USER_PROFILE_SETTINGS,
    component: IndexHOC({
      component: UserProfileSettings,
      permission: [permissionList.OrganizationUser.edit],
      role: [],
    }),
    newPage: false,
  },

  {
    title: "Users Profile Settings/ User Profile Notificaition",
    path: PrivateRoute.userProfile.USER_PROFILE_NOTIFICATIONS,
    component: IndexHOC({ component: UserProfileNotifications, permission: [], role: [] }),
    newPage: false,
  },
  {
    title: "Users Profile Settings/ User Profile Permission",
    path: PrivateRoute.userProfile.USER_PROFILE_PERMISSIONS,
    component: IndexHOC({ component: UserProfilePermissions, permission: [], role: [] }),
    newPage: false,
  },
  {
    title: "Users Profile Settings/ User Profile Performance",
    path: PrivateRoute.userProfile.USER_PROFILE_PERFORMANCE,
    component: IndexHOC({ component: UserProfilePerformance, permission: [], role: [] }),
    newPage: false,
  },
  {
    title: "Users Profile Settings/ Profile Template Access",
    path: PrivateRoute.userProfile.USER_PROFILE_TEMPLATE_ACCESSED,
    component: IndexHOC({ component: UserProfileTemplateAccessed, permission: [], role: [] }),
    newPage: false,
  },
];

const notifications = [
  {
    title: "Notifications",
    path: `/config/${PrivateRoute.ORGCONFIG.NOTIFICATIONS.LINK}`,
    component: IndexHOC({
      component: NotificationsLayot,
      permission: [permissionList.Alert.view],
      role: [],
    }),
    newPage: false,
  },
];

const inspectionTypes = [
  {
    title: "Inspection Name",
    path: `/config/inspection-types/${PrivateRoute.ORGCONFIG.INSPECTION_TYPES.CHILD_LINKS.INSPECTION_NAMES.HOME}`,
    component: IndexHOC({
      component: InspectionTypes,
      permission: [permissionList.InspectionName.view],
      role: [],
    }),
    newPage: false,
  },
  {
    title: "Add Inspection Name",
    path: `/config/inspection-types/${PrivateRoute.ORGCONFIG.INSPECTION_TYPES.CHILD_LINKS.INSPECTION_NAMES.ADD}`,
    component: IndexHOC({
      component: AddRegionsConfig,
      permission: [permissionList.InspectionName.add],
      role: [],
    }),
    newPage: false,
  },
  {
    title: "Edit Inspection Name",
    path: `/config/inspection-types/${PrivateRoute.ORGCONFIG.INSPECTION_TYPES.CHILD_LINKS.INSPECTION_NAMES.EDIT}`,
    component: IndexHOC({
      component: AddRegionsConfig,
      permission: [permissionList.InspectionName.edit],
      role: [],
    }),
    newPage: false,
  },
  {
    title: "View Inspection Name",
    path: `/config/inspection-types/${PrivateRoute.ORGCONFIG.INSPECTION_TYPES.CHILD_LINKS.INSPECTION_NAMES.VIEW}`,
    component: IndexHOC({
      component: AddRegionsConfig,
      permission: [permissionList.InspectionName.view],
      role: [],
    }),
    newPage: false,
  },
  {
    title: "Inspection Status",
    path: `/config/inspection-types/${PrivateRoute.ORGCONFIG.INSPECTION_TYPES.CHILD_LINKS.INSPECTION_STATUS.HOME}`,
    component: IndexHOC({
      component: InspectionTypes,
      permission: [permissionList.InspectionStatus.view],
      role: [],
    }),
    newPage: false,
  },
  {
    title: "Add Inspection Status",
    path: `/config/inspection-types/${PrivateRoute.ORGCONFIG.INSPECTION_TYPES.CHILD_LINKS.INSPECTION_STATUS.ADD}`,
    component: IndexHOC({
      component: AddRegionsConfig,
      permission: [permissionList.InspectionStatus.add],
      role: [],
    }),
    newPage: false,
  },
  {
    title: "Edit Inspection Status",
    path: `/config/inspection-types/${PrivateRoute.ORGCONFIG.INSPECTION_TYPES.CHILD_LINKS.INSPECTION_STATUS.EDIT}`,
    component: IndexHOC({
      component: AddRegionsConfig,
      permission: [permissionList.InspectionStatus.edit],
      role: [],
    }),
    newPage: false,
  },
  {
    title: "Edit Inspection Status",
    path: `/config/inspection-types/${PrivateRoute.ORGCONFIG.INSPECTION_TYPES.CHILD_LINKS.INSPECTION_STATUS.VIEW}`,
    component: IndexHOC({
      component: AddRegionsConfig,
      permission: [permissionList.InspectionStatus.view],
      role: [],
    }),
    newPage: false,
  },
];

const bookingStatus = [
  {
    title: "General Status",
    path: `/config/${PrivateRoute?.ORGCONFIG.BOOKING.LINK}`,
    component: IndexHOC({
      component: BookignSettingLayout,
      permission: [permissionList.GeneralStatus.view],
      role: [],
    }),
    newPage: false,
  },
  {
    title: "Add General Status",
    path: `/config/${PrivateRoute?.ORGCONFIG.BOOKING.ADD}`,
    component: IndexHOC({
      component: AddBooking,
      permission: [permissionList.GeneralStatus.add],
      role: [],
    }),
    newPage: false,
  },
  {
    title: "Edit General Status",
    path: `/config/${PrivateRoute?.ORGCONFIG.BOOKING.EDIT}`,
    component: IndexHOC({
      component: AddBooking,
      permission: [permissionList.GeneralStatus.edit],
      role: [],
    }),
    newPage: false,
  },
  {
    title: "View General Status",
    path: `/config/${PrivateRoute?.ORGCONFIG.BOOKING.VIEW}`,
    component: IndexHOC({
      component: AddBooking,
      permission: [permissionList.GeneralStatus.view],
      role: [],
    }),
    newPage: false,
  },
];

const contractors = [
  {
    title: "Contractor",
    path: `/config/contractors/${PrivateRoute.ORGCONFIG.CONTRACTORS.CHILD_LINKS.ALL_CONTRACTORS.HOME}`,
    component: IndexHOC({
      component: ContractorSetting,
      permission: [permissionList.Contractor.view],
      role: [],
    }),
    newPage: false,
  },
  {
    title: "Add Contractor",
    path: `/config/contractors/${PrivateRoute.ORGCONFIG.CONTRACTORS.CHILD_LINKS.ALL_CONTRACTORS.ADD}`,
    component: IndexHOC({
      component: AddContractor,
      permission: [permissionList.Contractor.add],
      role: [],
    }),
    newPage: false,
  },
  {
    title: "Edit Contractor",
    path: `/config/contractors/${PrivateRoute.ORGCONFIG.CONTRACTORS.CHILD_LINKS.ALL_CONTRACTORS.EDIT}`,
    component: IndexHOC({
      component: AddContractor,
      permission: [permissionList.Contractor.edit],
      role: [],
    }),
    newPage: false,
  },
  {
    title: "View Contractor",
    path: `/config/contractors/${PrivateRoute.ORGCONFIG.CONTRACTORS.CHILD_LINKS.ALL_CONTRACTORS.VIEW}`,
    component: IndexHOC({
      component: AddContractor,
      permission: [permissionList.Contractor.view],
      role: [],
    }),
    newPage: false,
  },
  {
    title: "Service",
    path: `/config/contractors/${PrivateRoute.ORGCONFIG.CONTRACTORS.CHILD_LINKS.SERVICES.HOME}`,
    component: IndexHOC({
      component: ContractorSetting,
      permission: [permissionList.Service.view],
      role: [],
    }),
    newPage: false,
  },
  {
    title: "Add Service",
    path: `/config/contractors/${PrivateRoute.ORGCONFIG.CONTRACTORS.CHILD_LINKS.SERVICES.ADD}`,
    component: IndexHOC({
      component: AddServiceConfig,
      permission: [permissionList.Service.add],
      role: [],
    }),
    newPage: false,
  },
  {
    title: "Edit Service",
    path: `/config/contractors/${PrivateRoute.ORGCONFIG.CONTRACTORS.CHILD_LINKS.SERVICES.EDIT}`,
    component: IndexHOC({
      component: AddServiceConfig,
      permission: [permissionList.Service.edit],
      role: [],
    }),
    newPage: false,
  },
  {
    title: "View Service",
    path: `/config/contractors/${PrivateRoute.ORGCONFIG.CONTRACTORS.CHILD_LINKS.SERVICES.VIEW}`,
    component: IndexHOC({
      component: AddServiceConfig,
      permission: [permissionList.Service.view],
      role: [],
    }),
    newPage: false,
  },
];

const globalResponseSet = [
  {
    title: "Status Attributes",
    path: `/config/${PrivateRoute.ORGCONFIG.GLOBALRESPONSESET.CHILD_LINKS.STATUSATTRIBUTES.HOME}`,
    component: IndexHOC({
      component: GlobalResponseSetSetting,
      permission: [permissionList.StatusAtrributes.view],
      role: [],
    }),
    newPage: false,
  },
  {
    title: "Add Status Attributes",
    path: `/config/${PrivateRoute.ORGCONFIG.GLOBALRESPONSESET.CHILD_LINKS.STATUSATTRIBUTES.ADD}`,
    component: IndexHOC({
      component: AddResponseSet,
      permission: [permissionList.StatusAtrributes.add],
      role: [],
    }),
    newPage: false,
  },
  {
    title: "Edit Status Attributes",
    path: `/config/${PrivateRoute.ORGCONFIG.GLOBALRESPONSESET.CHILD_LINKS.STATUSATTRIBUTES.EDIT}`,
    component: IndexHOC({
      component: AddResponseSet,
      permission: [permissionList.StatusAtrributes.edit],
      role: [],
    }),
    newPage: false,
  },
  {
    title: "Custom Response Set",
    path: `/config/${PrivateRoute.ORGCONFIG.GLOBALRESPONSESET.CHILD_LINKS.CUSTOMRESPONSESET.HOME}`,
    component: IndexHOC({
      component: GlobalResponseSetSetting,
      permission: [permissionList.CustomAttributes.view],
      role: [],
    }),
    newPage: false,
  },
  {
    title: "Add Custom Response Set",
    path: `/config/${PrivateRoute.ORGCONFIG.GLOBALRESPONSESET.CHILD_LINKS.CUSTOMRESPONSESET.ADD}`,
    component: IndexHOC({
      component: AddResponseSet,
      permission: [permissionList.CustomAttributes.add],
      role: [],
    }),
    newPage: false,
  },
  {
    title: "Edit Custom Response Set",
    path: `/config/${PrivateRoute.ORGCONFIG.GLOBALRESPONSESET.CHILD_LINKS.CUSTOMRESPONSESET.EDIT}`,
    component: IndexHOC({
      component: AddResponseSet,
      permission: [permissionList.CustomAttributes.edit],
      role: [],
    }),
    newPage: false,
  },

  {
    title: "External Response Set",
    path: `/config/${PrivateRoute.ORGCONFIG.GLOBALRESPONSESET.CHILD_LINKS.EXTERNALRESPONSESET.HOME}`,
    component: IndexHOC({
      component: GlobalResponseSetSetting,
      permission: [permissionList.ExternalAttributes.view],
      role: [],
    }),
    newPage: false,
  },
  {
    title: "Add External Response Set",
    path: `/config/${PrivateRoute.ORGCONFIG.GLOBALRESPONSESET.CHILD_LINKS.EXTERNALRESPONSESET.ADD}`,
    component: IndexHOC({
      component: AddExternalResponseSet,
      permission: [permissionList.ExternalAttributes.add],
      role: [],
    }),
    newPage: false,
  },
  {
    title: "Edit External Response Set",
    path: `/config/${PrivateRoute.ORGCONFIG.GLOBALRESPONSESET.CHILD_LINKS.EXTERNALRESPONSESET.EDIT}`,
    component: IndexHOC({
      component: AddExternalResponseSet,
      permission: [permissionList.ExternalAttributes.edit],
      role: [],
    }),
    newPage: false,
  },
  {
    title: "View External Response Set",
    path: `/config/${PrivateRoute.ORGCONFIG.GLOBALRESPONSESET.CHILD_LINKS.EXTERNALRESPONSESET.VIEW}`,
    component: IndexHOC({
      component: AddExternalResponseSet,
      permission: [permissionList.ExternalAttributes.view],
      role: [],
    }),
    newPage: false,
  },
  {
    title: "Internal Response Set",
    path: `/config/${PrivateRoute.ORGCONFIG.GLOBALRESPONSESET.CHILD_LINKS.INTERNALRESPONSESET.HOME}`,
    component: IndexHOC({
      component: GlobalResponseSetSetting,
      permission: [permissionList.InternalAttributes.view],
      role: [],
    }),
    newPage: false,
  },
  {
    title: "Add Internal Response Set",
    path: `/config/${PrivateRoute.ORGCONFIG.GLOBALRESPONSESET.CHILD_LINKS.INTERNALRESPONSESET.ADD}`,
    component: IndexHOC({
      component: AddResponseSet,
      permission: [permissionList.InternalAttributes.add],
      role: [],
    }),
    newPage: false,
  },
  {
    title: "View Internal Response Set",
    path: `/config/${PrivateRoute.ORGCONFIG.GLOBALRESPONSESET.CHILD_LINKS.INTERNALRESPONSESET.VIEW}`,
    component: IndexHOC({
      component: AddResponseSet,
      permission: [permissionList.InternalAttributes.view],
      role: [],
    }),
    newPage: false,
  },
  {
    title: "Edit Internal Response Set",
    path: `/config/${PrivateRoute.ORGCONFIG.GLOBALRESPONSESET.CHILD_LINKS.INTERNALRESPONSESET.EDIT}`,
    component: IndexHOC({
      component: AddResponseSet,
      permission: [permissionList.InternalAttributes.edit],
      role: [],
    }),
    newPage: false,
  },

  // Relational Response Set
  {
    title: "Regional Response Set",
    path: `/config/${PrivateRoute.ORGCONFIG.GLOBALRESPONSESET.CHILD_LINKS.RELATIONALRESPONSESET.HOME}`,
    component: IndexHOC({
      component: GlobalResponseSetSetting,
      permission: [permissionList.InternalAttributes.view],
      role: [],
    }),
    newPage: false,
  },
  {
    title: "Add Relational Response Set",
    path: `/config/${PrivateRoute.ORGCONFIG.GLOBALRESPONSESET.CHILD_LINKS.RELATIONALRESPONSESET.ADD}`,
    component: IndexHOC({
      component: AddResponseSet,
      permission: [permissionList.InternalAttributes.add],
      role: [],
    }),
    newPage: false,
  },
  {
    title: "View Relational Response Set",
    path: `/config/${PrivateRoute.ORGCONFIG.GLOBALRESPONSESET.CHILD_LINKS.RELATIONALRESPONSESET.VIEW}`,
    component: IndexHOC({
      component: AddResponseSet,
      permission: [permissionList.InternalAttributes.view],
      role: [],
    }),
    newPage: false,
  },
  {
    title: "Edit Relational Response Set",
    path: `/config/${PrivateRoute.ORGCONFIG.GLOBALRESPONSESET.CHILD_LINKS.RELATIONALRESPONSESET.EDIT}`,
    component: IndexHOC({
      component: AddResponseSet,
      permission: [permissionList.InternalAttributes.edit],
      role: [],
    }),
    newPage: false,
  },
];

const activity = [
  {
    title: "Activity Type",
    path: `/config/activity/${PrivateRoute.ORGCONFIG.ACTIVITY.CHILD_LINKS.ACTIVITY_TYPES.HOME}`,
    component: IndexHOC({ component: ActivitySetting, permission: [], role: [] }),
    newPage: false,
  },
  {
    title: "Add Activity Type",
    path: `/config/activity/${PrivateRoute.ORGCONFIG.ACTIVITY.CHILD_LINKS.ACTIVITY_TYPES.ADD}`,
    component: IndexHOC({ component: AddActivity, permission: [], role: [] }),
    newPage: false,
  },
  {
    title: "Edit Activity Type",
    path: `/config/activity/${PrivateRoute.ORGCONFIG.ACTIVITY.CHILD_LINKS.ACTIVITY_TYPES.EDIT}`,
    component: IndexHOC({ component: AddActivity, permission: [], role: [] }),
    newPage: false,
  },
  {
    title: "Activity Status",
    path: `/config/activity/${PrivateRoute.ORGCONFIG.ACTIVITY.CHILD_LINKS.ACTIVITY_STATUS.HOME}`,
    component: IndexHOC({
      component: ActivitySetting,
      permission: [permissionList.ActivityStatus.view],
      role: [],
    }),
    newPage: false,
  },
  {
    title: "Add Activity Status",
    path: `/config/activity/${PrivateRoute.ORGCONFIG.ACTIVITY.CHILD_LINKS.ACTIVITY_STATUS.ADD}`,
    component: IndexHOC({
      component: AddActivity,
      permission: [permissionList.ActivityStatus.add],
      role: [],
    }),
    newPage: false,
  },
  {
    title: "Edit Activity Status",
    path: `/config/activity/${PrivateRoute.ORGCONFIG.ACTIVITY.CHILD_LINKS.ACTIVITY_STATUS.EDIT}`,
    component: IndexHOC({
      component: AddActivity,
      permission: [permissionList.ActivityStatus.edit],
      role: [],
    }),
    newPage: false,
  },
  {
    title: "View Activity Status",
    path: `/config/activity/${PrivateRoute.ORGCONFIG.ACTIVITY.CHILD_LINKS.ACTIVITY_STATUS.VIEW}`,
    component: IndexHOC({
      component: AddActivity,
      permission: [permissionList.ActivityStatus.view],
      role: [],
    }),
    newPage: false,
  },
];

const finance = [
  {
    title: "Billing Agreement Name",
    path: `/config/finance/${PrivateRoute.ORGCONFIG.FINANCE.CHILD_LINKS.BILLING_AGREEMENT_NAMES.HOME}`,
    component: IndexHOC({
      component: FinanceConfiguration,
      permission: [permissionList.TariffRateType.view],
      role: [],
    }),
    newPage: false,
  },
  {
    title: "Add Billing Agreement Name",
    path: `/config/finance/${PrivateRoute.ORGCONFIG.FINANCE.CHILD_LINKS.BILLING_AGREEMENT_NAMES.ADD}`,
    component: IndexHOC({
      component: AddRegionsConfig,
      permission: [permissionList.TariffRateType.add],
      role: [],
    }),
    newPage: false,
  },
  {
    title: "Edit Billing Agreement Name",
    path: `/config/finance/${PrivateRoute.ORGCONFIG.FINANCE.CHILD_LINKS.BILLING_AGREEMENT_NAMES.EDIT}`,
    component: IndexHOC({
      component: AddRegionsConfig,
      permission: [permissionList.TariffRateType.edit],
      role: [],
    }),
    newPage: false,
  },
  {
    title: "View Billing Agreement Name",
    path: `/config/finance/${PrivateRoute.ORGCONFIG.FINANCE.CHILD_LINKS.BILLING_AGREEMENT_NAMES.VIEW}`,
    component: IndexHOC({
      component: AddRegionsConfig,
      permission: [permissionList.TariffRateType.view],
      role: [],
    }),
    newPage: false,
  },
  {
    title: "Tariff Rate Type",
    path: `/config/finance/${PrivateRoute.ORGCONFIG.FINANCE.CHILD_LINKS.TARIFF_RATE_TYPES.HOME}`,
    component: IndexHOC({
      component: FinanceConfiguration,
      permission: [permissionList.TariffRateType.view],
      role: [],
    }),
    newPage: false,
  },
  {
    title: "Add Tariff Rate Type",
    path: `/config/finance/${PrivateRoute.ORGCONFIG.FINANCE.CHILD_LINKS.TARIFF_RATE_TYPES.ADD}`,
    component: IndexHOC({
      component: AddRegionsConfig,
      permission: [permissionList.TariffRateType.add],
      role: [],
    }),
    newPage: false,
  },
  {
    title: "Edit Tariff Rate Type",
    path: `/config/finance/${PrivateRoute.ORGCONFIG.FINANCE.CHILD_LINKS.TARIFF_RATE_TYPES.EDIT}`,
    component: IndexHOC({
      component: AddRegionsConfig,
      permission: [permissionList.TariffRateType.edit],
      role: [],
    }),
    newPage: false,
  },
  {
    title: "View Tariff Rate Type",
    path: `/config/finance/${PrivateRoute.ORGCONFIG.FINANCE.CHILD_LINKS.TARIFF_RATE_TYPES.VIEW}`,
    component: IndexHOC({
      component: AddRegionsConfig,
      permission: [permissionList.TariffRateType.view],
      role: [],
    }),
    newPage: false,
  },
];

const findingAndRecommendations = [
  {
    title: "Finding and Recommendations",
    path: `/config/${PrivateRoute?.ORGCONFIG.FINDINGS_RECOMMENDATIONS.LINK}`,
    component: IndexHOC({
      component: FindingsAndRecommendationsLayout,
      permission: [permissionList.FindingsCategory.view],
      role: [],
    }),
    newPage: false,
  },
  {
    title: "Add Finding and Recommendations",
    path: `${PrivateRoute?.ORGCONFIG.FINDINGS_RECOMMENDATIONS.ADD}`,
    component: IndexHOC({
      component: AddFindingRecommendation,
      permission: [permissionList.FindingsCategory.add],
      role: [],
    }),
    newPage: false,
  },
  {
    title: "Edit Finding and Recommendations",
    path: `${PrivateRoute?.ORGCONFIG.FINDINGS_RECOMMENDATIONS.EDIT}`,
    component: IndexHOC({
      component: AddFindingRecommendation,
      permission: [permissionList.FindingsCategory.edit],
      role: [],
    }),
    newPage: false,
  },
];

export default [
  ...generalSettings,
  ...usersSettings,
  ...userProfiles,
  ...notifications,
  ...inspectionTypes,
  ...bookingStatus,
  ...contractors,
  ...globalResponseSet,
  ...activity,
  ...finance,
  ...findingAndRecommendations,
];
