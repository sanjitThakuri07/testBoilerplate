import { permissionList } from "src/constants/permission";

type Route = {
  url: string;
  id: number;
  frontendUrl?: string;
  backendUrl?: any;
  path?: string;
  search_path?: string;
  label?: string;
};

type RoutesNameUrl = {
  [key: string]: Route;
};

export const RoutesNameUrl: RoutesNameUrl = {
  profile: { url: "profile", id: 0 },
  account: { url: "account", id: 1 },
  audit: { url: "audit", id: 2 },
  notification: { url: "notification", id: 3 },
};

export const contractorsUrl: RoutesNameUrl = {
  allContractors: { url: "contractors/all-contractors", id: 0, backendUrl: "contractors" },
  services: {
    url: "contractors/services",
    id: 1,
    backendUrl: "organization-service",
  },
};

export const globalResponseSetUrl = [
  {
    type: "multipleResponseSet",
    url: "global-response-set/status",
    id: 0,
    backendUrl: "multiple-response",
    label: "Status Attributes",
    permission: [permissionList.StatusAtrributes.view],
    role: [],
  },
  {
    type: "customResponseSet",
    url: "global-response-set/custom",
    id: 0,
    backendUrl: "custom-response-set",
    label: "Custom Attributes",
    permission: [permissionList.CustomAttributes.view],
    role: [],
  },

  {
    type: "internalResponseSet",
    url: "global-response-set/internal",
    id: 0,
    backendUrl: "internal-response-set",
    label: "Internal Attributes",
    permission: [permissionList.InternalAttributes.view],
    role: [],
  },
  {
    type: "externalResponseSet",
    url: "global-response-set/external",
    id: 0,
    backendUrl: "external-response-set",
    label: "External Attributes",
    permission: [permissionList.ExternalAttributes.view],
    role: [],
  },
];

export const allRoutes: RoutesNameUrl = {
  activityType: {
    url: "activity/types",
    id: 0,
    backendUrl: "activity-type/",
    path: "Activity Type",
  },
  activityStatus: {
    url: "activity/status",
    id: 1,
    backendUrl: "activity-status/",
    path: "Activity Status",
  },
  FARPCategory: { url: "", id: 33, backendUrl: "main-category", path: "Category" },
  FARCategory: {
    url: "",
    id: 2,
    backendUrl: "finding-category",
    path: "Sub Category",
  },
  FARFindings: {
    url: "",
    id: 4,
    backendUrl: "finding-category/single-finding",
    path: "Findings",
  },
  FARRecommendations: {
    url: "",
    id: 3,
    backendUrl: "finding-category/single-recommendation",
    path: "Recommendations",
  },
  Customers: {
    url: "",
    id: 7,
    backendUrl: "customers",
    path: "Customer",
  },
  SidebarFinanceTariffs: {
    url: "/finance/tariffs",
    id: 5,
    backendUrl: "finance-tariff",
    path: "Tariff",
  },
  SidebarFinanceTariffsRecord: {
    url: "finance-tariff?tariff=",
    id: 5,
    backendUrl: (tariffId: number) => `finance-tariff/${tariffId}/record`,
    path: "Record",
  },
  SidebarFinanaceInvoice: {
    url: "/finance/invoice",
    id: 6,
    backendUrl: "",
    path: "Invoice",
  },
  SidebarFinanceToBeInvoiced: {
    url: "/finance/invoice/to-be-invoiced",
    id: 6,
    backendUrl: "invoice",
    path: "Invoice",
    search_path: "invoice no. and customer name",
  },
  SidebarFinanaceAllInvoices: {
    url: "/finance/invoice/invoices",
    id: 6,
    backendUrl: "invoice",
    path: "Invoice",
  },
};

export const commonUrl = {};
