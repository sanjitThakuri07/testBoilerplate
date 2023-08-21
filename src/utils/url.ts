import { AuthApis } from "src/modules/auth/constants";

export const url: any = {
  ...AuthApis,
  org_profile: (id: any) => `organization-user/profile/${id}`,
  customer_profile: (id: any) => `customers/profile/${id}`,
  bookingStatus: `booking-status`,
  region: "region",
  location: "location",
  terriotry: "territory",
  country: "country",
  systemParameters: "system-parameters",
  setPassword: "set-password",
  getFieldList: "alert/field-list",
  auditLogs: "logs",
  manageInspection: "booking_templates-data/manage_inspection",
  inspectionStatus: "inspection-status",
  setAsCompleted: "booking_templates-data/change-status",
  bookingTemplate: "booking_templates",
  udpateBookingTemplate: "booking_templates",
  quotationTemplate: "/quotation_templates/",
  updateQuotationTemplate: "quotation_templates",
  logout: "user/auth/logout",
  refreshTokenUrl: (token: string) => `user/auth/refresh_token/${token}`,
  profile: "user/profile",
  userSecurity: "security",
  FindingRecommendationSubCategory: "finding-category/",
  FindingsMainCategoryFindings: "main-category/finding/",
  FindingsMainCategoryFindingsRecommendations: "finding-category/recommendation/",
  FindingsSubCategoryFindings: "finding-category/finding/",
  FindingsSubCategoryFindingsRecommendations: "finding-category/recommendation/",
  billingPlan: "billings",
  activityChat: "/activity-chat",
  record: (tariffId?: string) => `finance-tariff/${tariffId}/record`,
  changeInvoiceStatus: "invoice/change-status",
  cancelBooking: "booking_templates-data/change-status",
  invoiceAnalytics: "invoice/analytics",
  restore: "restore/",
  duplicate: "duplicate",
  template: "templates",
  page: "templates-data",
  role: "user-role",
  department: "user-department",
  userOrg: "organization-user",
};

export const moduleIdsFnR = [
  "Findings",
  "FindingRecommendations",
  "FindingRecommendationSubCategory",
];

export const possibleFnR = ["main-category", "finding-category", "findings", "recommendations"];
export const possibleFnRWithoutMainCategory = ["finding-category", "findings", "recommendations"];

export const backUrl: any = {};

export const lockFields = [
  "Completed",
  "Open",
  "Finding",
  "Main Category",
  "Recommendation",
  "Sub Category",
  "Cancelled",
  "Invoiced",
  "In Progress",
  "Admin",
  "Customer",
  "Users",
];

export const invoiceStatusOptions = [{ id: "22", label: "paid", name: "Paid" }];

export const BookingFields = ["Completed", "In Progress", "Cancelled", "Invoiced"];

export const ActivityStatus = ["Completed", "In Progress", "Open"];
