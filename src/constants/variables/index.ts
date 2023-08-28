export const AuthRoute = {
  LOGIN: "/",
  TENANT_LOGIN: "/tenant/login",
  TENANT_REGISTER: "/tenant-register",
  ORGANIZATION_LOGIN: "/organization/login",
  ORGANIZATION_REGISTER: "/organization-register",
  CUSTOMER_REGISTER: "/customer-register",
  USER_REGISTER: "/organization-user-register",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  PASSWORD_RESET_LINK: "/password-reset-link",
  SET_NEW_PASSWORD: "/set-new-password",
  PASSWORD_RESET_SUCCESS: "/password-reset-success",
};

export const MessageRoute = {
  _401: "/401",
};

const rootLink = {
  config: {
    root: "/config",
    general_settings: "/general-settings",
    users: "/users",
    inspection_type: "/inspection-types",
  },
};

export const userProfileRoot = {
  user_profile_root: `${rootLink.config.root}${rootLink.config.users}/user/profile/:profileId`,
};

export const PrivateRoute = {
  DASHBOARD: "/dashboard",
  ANALYTICS: "/analytics",
  BILLING: "/billing",
  ADD_BILLING: "/billing/add",
  EDIT_BILLING: "/billing/edit/:billingId",
  VIEW_BILLING: "/billing/view/:billingId",
  PAYMENT_METHOD: "/payment-method",
  SETTING: "/settings",
  ADD_TENANT: "/add-tenant",
  TWO_FACTOR: "/two-factor",
  OTP: "/otp",
  ADD_ORGANIZATION: "/add-organization",
  VIEW_ORGANIZATION: "organization/:id",
  ALL_TENANTS_USERS: "tenant/",
  ALL_ORGANIZATIONS_USERS: "organization/",
  VIEW_TENANT: "tenant/user/:id",
  DEACTIVATE_TENANT: "/tenant/update-status",
  COMMON_SIDEBAR_LAYOUT: "/page/:sidebarId",

  CALENDAR: {
    root: "/calendar",
  },

  // =================== ORGANIZATION LINKS STARTS HERE =================
  ORGANIZATION: {
    noData: "/organization/no-data",
    HOME: "/organization",
    CUSTOMERS: {
      LINK: "/customer",
      ADD: "/customer/add",
      VIEW_CUSTOMER: "customer/view/:customerId",

      VIEW: "customer/user/:customerId/view/:customerUserId",
      EDIT: "customer/edit/:customerId",
      VIEW_CUSTOMER_USER: "customer/users/view/:customerId",
      EDIT_CUSTOMER_USER: "customer/user/:customerId/edit/:customerUserId",
    },
    FINANCE: {
      LINK: "/finance",
      CHILD_LINKS: {
        INVOICE: {
          LINK: "/invoice",
          HOME: "/finance/invoice",
          ADD: "/finance/invoices/add",
          EDIT: "/finance/invoices/edit/:invoiceId",
          VIEW: "/finance/invoices/view/:invoiceId",
          CHILD_LINKS: {
            TOBEINVOICED: {
              HOME: "/finance/invoice/to-be-invoiced",
            },

            INVOICES: {
              HOME: "/finance/invoice/invoices",
            },
            GENERATE_INVOICE: {
              HOME: "/finance/invoice/generate-invoice/:invoiceId",
              LINK: "/finance/generate-invoice",
            },
            SEND_INVOICE: {
              HOME: "/finance/invoice/generate-invoice/:invoiceId/send",
              LINK: "/finance/generate-invoice/:invoiceId/send",
            },
          },
        },

        TARIFFS: {
          HOME: "/finance/tariffs",
          ADD: "/finance/tariffs/add",
          EDIT: "/finance/tariffs/edit/:tariffId",
          VIEW: "/finance/tariffs/view/:tariffId",
        },
      },
    },
  },
  // =================== ORGANIZATION LINKS ENDS HERE =================

  // =================== ASSIGN ACTIVITIES LINKS STARTS HERE =================
  ASSIGN_ACTIVITIES: {
    HOME: "/assign-activities",
    ADD: "/assign-activities/add",
    EDIT: "/assign-activities/edit/:assignActivityId",
    VIEW: "/assign-activities/view/:assignActivityId",
  },
  // =================== ASSIGN ACTIVITIES LINKS ENDS HERE =================

  PAGE_NOT_FOUND: "/page-not-found",

  // =================== NEW CONFIGURATION LINKS STARTS HERE =================
  configuration: {
    general_settings: {
      REGION: {
        HOME: `${rootLink.config.root}${rootLink.config.general_settings}/region`,
        ADD: `${rootLink.config.root}${rootLink.config.general_settings}/region/add`,
        EDIT: `${rootLink.config.root}${rootLink.config.general_settings}/region/edit/:regionId`,
        VIEW: `${rootLink.config.root}${rootLink.config.general_settings}/region/view/:regionId`,
      },
      COUNTRY: {
        HOME: `${rootLink.config.root}${rootLink.config.general_settings}/country`,
        ADD: `${rootLink.config.root}${rootLink.config.general_settings}/country/add`,
        EDIT: `${rootLink.config.root}${rootLink.config.general_settings}/country/edit/:countryId`,
        VIEW: `${rootLink.config.root}${rootLink.config.general_settings}/country/view/:countryId`,
      },
      TERRITORY: {
        HOME: `${rootLink.config.root}${rootLink.config.general_settings}/territory`,
        ADD: `${rootLink.config.root}${rootLink.config.general_settings}/territory/add`,
        EDIT: `${rootLink.config.root}${rootLink.config.general_settings}/territory/edit/:territoryId`,
        VIEW: `${rootLink.config.root}${rootLink.config.general_settings}/territory/view/:territoryId`,
      },
      LOCATION: {
        HOME: `${rootLink.config.root}${rootLink.config.general_settings}/location`,
        ADD: `${rootLink.config.root}${rootLink.config.general_settings}/location/add`,
        EDIT: `${rootLink.config.root}${rootLink.config.general_settings}/location/edit/:locationId`,
        VIEW: `${rootLink.config.root}${rootLink.config.general_settings}/location/view/:locationId`,
      },
      TIMEZONE: {
        HOME: `${rootLink.config.root}${rootLink.config.general_settings}/time-zone`,
        ADD: `${rootLink.config.root}${rootLink.config.general_settings}/time-zone/add`,
        EDIT: `${rootLink.config.root}${rootLink.config.general_settings}/time-zone/edit/:timeZoneId`,
        VIEW: `${rootLink.config.root}${rootLink.config.general_settings}/time-zone/view/:timeZoneId`,
      },
      WEATHER: {
        HOME: `${rootLink.config.root}${rootLink.config.general_settings}/weather`,
        ADD: `${rootLink.config.root}${rootLink.config.general_settings}/weather/add`,
        EDIT: `${rootLink.config.root}${rootLink.config.general_settings}/weather/edit/:weatherId`,
        VIEW: `${rootLink.config.root}${rootLink.config.general_settings}/weather/view/:weatherId`,
      },
      CURRENCY: {
        HOME: `${rootLink.config.root}${rootLink.config.general_settings}/currency`,
        ADD: `${rootLink.config.root}${rootLink.config.general_settings}/currency/add`,
        EDIT: `${rootLink.config.root}${rootLink.config.general_settings}/currency/edit/:currencyId`,
        VIEW: `${rootLink.config.root}${rootLink.config.general_settings}/currency/view/:currencyId`,
      },
      SYSTEM_PARAMETERS: {
        HOME: `${rootLink.config.root}${rootLink.config.general_settings}/system-parameters`,
        ADD: `${rootLink.config.root}${rootLink.config.general_settings}/system-parameters/add`,
        EDIT: `${rootLink.config.root}${rootLink.config.general_settings}/system-parameters/edit/:systemParametersId`,
        VIEW: `${rootLink.config.root}${rootLink.config.general_settings}/system-parameters/view/:systemParametersId`,
      },
    },
    users: {
      ROLES_AND_PERMISSION: {
        HOME: `${rootLink.config.root}${rootLink.config.users}/roles-and-permission`,
        ADD: `${rootLink.config.root}${rootLink.config.users}/roles-and-permission/add`,
        EDIT: `${rootLink.config.root}${rootLink.config.users}/roles-and-permission/edit/:roleID`,
        VIEW: `${rootLink.config.root}${rootLink.config.users}/roles-and-permission/view/:roleID`,
      },
      USER_DEPARTMENT: {
        HOME: `${rootLink.config.root}${rootLink.config.users}/user-department`,
        ADD: `${rootLink.config.root}${rootLink.config.users}/user-department/add`,
        EDIT: `${rootLink.config.root}${rootLink.config.users}/user-department/edit/:userDepartmentId`,
        VIEW: `${rootLink.config.root}${rootLink.config.users}/user-department/view/:userDepartmentId`,
      },
      USER: {
        HOME: `${rootLink.config.root}${rootLink.config.users}/user`,
        ADD: `${rootLink.config.root}${rootLink.config.users}/user/add`,
        EDIT: `${rootLink.config.root}${rootLink.config.users}/user/edit/:profileId`,
        VIEW: `${rootLink.config.root}${rootLink.config.users}/user/view/:profileId`,
        // PROFILE:`${rootLink.config.root}${rootLink.config.users}/user/profile/:profileId`,
        // USER_PROFILE: {
        //   HOME: `${rootLink.config.root}${rootLink.config.users}/user/profile/:profileId`,
        //   USER_PROFILE_SETTINGS: {
        //     HOME: `${rootLink.config.root}${rootLink.config.users}/settings`,
        //   },
        //   USER_PROFILE_NOTIFICATIONS: {
        //     HOME: `${rootLink.config.root}${rootLink.config.users}/notifications`,
        //   },
        //   USER_PROFILE_PERMISSIONS: {
        //     HOME: `${rootLink.config.root}${rootLink.config.users}/permissions`,
        //   },
        //   USER_PROFILE_PERFORMANCE: {
        //     HOME: `${rootLink.config.root}${rootLink.config.users}/performance`,
        //   },
        //   USER_PROFILE_TEMPLATE_ACCESSED: {
        //     HOME: `${rootLink.config.root}${rootLink.config.users}/template-accessed`,
        //   },
        // },
      },
      USER_SECURITY: {
        HOME: `${rootLink.config.root}${rootLink.config.users}/user-security`,
        ADD: `${rootLink.config.root}${rootLink.config.users}/user-security/add`,
        EDIT: `${rootLink.config.root}${rootLink.config.users}/user-security/edit/:userSecurityId`,
        VIEW: `${rootLink.config.root}${rootLink.config.users}/user-security/view/:userSecurityId`,
      },
    },
    inspection_type: {
      inspection_name: {
        HOME: `${rootLink.config.root}${rootLink.config.inspection_type}/inspection-name`,
        ADD: `${rootLink.config.root}${rootLink.config.inspection_type}/inspection-name/add`,
        EDIT: `${rootLink.config.root}${rootLink.config.inspection_type}/inspection-name/edit/:userSecurityId`,
        VIEW: `${rootLink.config.root}${rootLink.config.inspection_type}/inspection-name/view/:userSecurityId`,
      },
      inspection_status: {
        HOME: `${rootLink.config.root}${rootLink.config.inspection_type}/inspection-status`,
        ADD: `${rootLink.config.root}${rootLink.config.inspection_type}/inspection-status/add`,
        EDIT: `${rootLink.config.root}${rootLink.config.inspection_type}/inspection-status/edit/:userSecurityId`,
        VIEW: `${rootLink.config.root}${rootLink.config.inspection_type}/inspection-status/view/:userSecurityId`,
      },
    },
  },

  userProfile: {
    USER_PROFILE_SETTINGS: `${rootLink.config.root}${rootLink.config.users}/user/profile/:profileId/settings`,

    USER_PROFILE_NOTIFICATIONS: `${rootLink.config.root}${rootLink.config.users}/user/profile/:profileId/notifications`,

    USER_PROFILE_PERMISSIONS: `${rootLink.config.root}${rootLink.config.users}/user/profile/:profileId/permissions`,

    USER_PROFILE_PERFORMANCE: `${rootLink.config.root}${rootLink.config.users}/user/profile/:profileId/performance`,

    USER_PROFILE_TEMPLATE_ACCESSED: `${rootLink.config.root}${rootLink.config.users}/user/profile/:profileId/template-accessed`,
  },

  finance: {
    general_settings: {
      REGION: {
        HOME: `${rootLink.config.root}${rootLink.config.general_settings}/region`,
        ADD: `${rootLink.config.root}${rootLink.config.general_settings}/region/add`,
        EDIT: `${rootLink.config.root}${rootLink.config.general_settings}/region/edit/:regionId`,
        VIEW: `${rootLink.config.root}${rootLink.config.general_settings}/region/view/:regionId`,
      },
    },
  },

  SCHEDULE: {
    LINK: "schedule",
    CHILD_LINKS: {
      HOME: "schedule/:templateId",
      ADD: "schedule/add",
      EDIT: "schedule/edit/:templateId/:scheduleId",
      VIEW: "schedule/view/:templateId/:scheduleId",
    },
  },

  ORGCONFIG: {
    GENERAL_SETTINGS: {
      LINK: "general-settings",
      CHILD_LINKS: {
        REGION: {
          HOME: "region",
          ADD: "region/add",
          EDIT: "region/edit/:regionId",
          VIEW: "region/edit/:regionId",
        },
        COUNTRY: {
          HOME: "country",
          ADD: "country/add",
          EDIT: "country/edit/:countryId",
          VIEW: "country/view/:countryId",
        },
        TERRITORY: {
          HOME: "territory",
          ADD: "territory/add",
          EDIT: "territory/edit/:territoryId",
          VIEW: "territory/view/:territoryId",
        },
        LOCATION: {
          HOME: "location",
          ADD: "location/add",
          EDIT: "location/edit/:locationId",
          VIEW: "location/view/:locationId",
        },
        TIMEZONE: {
          HOME: "time-zone",
          ADD: "time-zone/add",
          EDIT: "time-zone/edit/:timeZoneId",
          VIEW: "time-zone/view/:timeZoneId",
        },
        WEATHER: {
          HOME: "weather",
          ADD: "weather/add",
          EDIT: "weather/edit/:weatherId",
          VIEW: "weather/view/:weatherId",
        },
        CURRENCY: {
          HOME: "currency",
          ADD: "currency/add",
          EDIT: "currency/edit/:currencyId",
          VIEW: "currency/view/:currencyId",
        },
      },
    },
    USERS: {
      LINK: "users",
      CHILD_LINKS: {
        ROLES_AND_PERMISSION: {
          HOME: "roles-and-permission",
          ADD: "roles-and-permission/add",
          EDIT: "roles-and-permission/edit/:roleID",
          VIEW: "roles-and-permission/view/:roleID",
        },
        USER_DEPARTMENT: {
          HOME: "user-department",
          ADD: "user-department/add",
          EDIT: "user-department/edit/:userDepartmentId",
          VIEW: "user-department/view/:userDepartmentId",
        },
        USER: {
          HOME: "user",
          ADD: "user/add",
          USER_PROFILE: {
            HOME: "user/profile/:profileId",
            USER_PROFILE_SETTINGS: {
              HOME: "settings",
            },
            USER_PROFILE_NOTIFICATIONS: {
              HOME: "notifications",
            },
            USER_PROFILE_PERMISSIONS: {
              HOME: "permissions",
            },
            USER_PROFILE_PERFORMANCE: {
              HOME: "performance",
            },
            USER_PROFILE_TEMPLATE_ACCESSED: {
              HOME: "template-accessed",
            },
          },
        },
        USER_SECURITY: {
          HOME: "user-security",
          ADD: "user-security/add",
          EDIT: "user-security/edit/:userSecurityId",
          VIEW: "user-security/view/:userSecurityId",
        },
        SYSTEM_PARAMETERS: {
          HOME: "system-parameters",
          ADD: "system-parameters/add",
          EDIT: "system-parameters/edit/:systemParametersId",
          VIEW: "system-parameters/view/:systemParametersId",
        },
      },
    },
    NOTIFICATIONS: {
      LINK: "notifications",
      CHILD_LINKS: {
        EMAILIDCONTENT: {
          HOME: "/config/notifications/email-id-content",
        },
      },

      // CHILD_LINKS: {
      //   INSPECTION_NAMES: {
      //     HOME: 'inspection-name',
      //     ADD: 'inspection-name/add',
      //     EDIT: 'inspection-name/edit/:billingId',
      //     VIEW: 'inspection-name/edit/:billingId',
      //   },
      //   INSPECTION_STATUS: {
      //     HOME: 'inspection-status',
      //     ADD: 'inspection-status/add',
      //     EDIT: 'inspection-status/edit/:inspectionId',
      //     VIEW: 'inspection-status/edit/:inspectionId',
      //   },
      // },
    },
    INSPECTION_TYPES: {
      LINK: "inspection-types",
      CHILD_LINKS: {
        INSPECTION_NAMES: {
          HOME: "inspection-name",
          ADD: "inspection-name/add",
          EDIT: "inspection-name/edit/:inspectionNameId",
          VIEW: "inspection-name/view/:inspectionNameId",
        },
        INSPECTION_STATUS: {
          HOME: "inspection-status",
          ADD: "inspection-status/add",
          EDIT: "inspection-status/edit/:inspectionStatusId",
          VIEW: "inspection-status/view/:inspectionStatusId",
        },
      },
    },
    BOOKING: {
      LINK: "general-status",
      ADD: "general-status/add",
      EDIT: "general-status/edit/:bookingStatusId",
      VIEW: "general-status/view/:bookingStatusId",
      CHILD_LINKS: {
        BOOKING_STATUS: {
          HOME: "general-status",
          ADD: "/config/general-status/add",
          EDIT: "/config/general-status/edit/:bookingStatusId",
          VIEW: "/config/general-status/view/:bookingStatusId",
        },
      },
    },

    FINANCE: {
      LINK: "finance",
      CHILD_LINKS: {
        BILLING_AGREEMENT_NAMES: {
          HOME: "billing-agreement-names",
          ADD: "billing-agreement-names/add",
          EDIT: "billing-agreement-names/edit/:billingId",
          VIEW: "billing-agreement-names/view/:billingId",
        },
        TARIFF_RATE_TYPES: {
          HOME: "tariff-rate-types",
          ADD: "tariff-rate-types/add",
          EDIT: "tariff-rate-types/edit/:tariffId",
          VIEW: "tariff-rate-types/view/:tariffId",
        },
      },
    },
    CALENDAR: {
      LINK: "calendar",
      CHILD_LINKS: {
        ALL_SCLEDULES: {
          HOME: "calendar",
        },
        MY_SCHEDULES: {
          HOME: "calendar/my-schedules",
        },
      },
    },
    CONTRACTORS: {
      LINK: "contractors",
      CHILD_LINKS: {
        ALL_CONTRACTORS: {
          HOME: "all-contractors",
          ADD: "all-contractors/add",
          EDIT: "all-contractors/edit/:contractorId",
          VIEW: "all-contractors/view/:contractorId",
        },
        SERVICES: {
          HOME: "services",
          ADD: "services/add",
          EDIT: "services/edit/:serviceId",
          VIEW: "services/view/:serviceId",
        },
      },
    },
    GLOBALRESPONSESET: {
      LINK: "global-response-set",
      CHILD_LINKS: {
        STATUSATTRIBUTES: {
          HOME: "global-response-set/status",
          ADD: "global-response-set/status/add",
          EDIT: "global-response-set/status-attributes/edit/:statusAttributesId",
          VIEW: "global-response-set/status-attributes/view/:statusAttributesId",
        },
        CUSTOMRESPONSESET: {
          HOME: "global-response-set/custom",
          ADD: "global-response-set/custom/add",
          EDIT: "global-response-set/custom/edit/:customResponseId",
          VIEW: "global-response-set/custom/view/:customResponseId",
        },
        INTERNALRESPONSESET: {
          HOME: "global-response-set/internal",
          ADD: "global-response-set/internal/add",
          EDIT: "global-response-set/internal/edit/:internalResponseId",
          VIEW: "global-response-set/internal/view/:internalResponseId",
        },
        RELATIONALRESPONSESET: {
          HOME: "global-response-set/relation",
          ADD: "global-response-set/relation/add",
          EDIT: "global-response-set/relation/edit/:internalResponseId",
          VIEW: "global-response-set/relation/view/:internalResponseId",
        },
        EXTERNALRESPONSESET: {
          HOME: "global-response-set/external",
          ADD: "global-response-set/external/add",
          EDIT: "global-response-set/external/edit/:externalResponseId",
          VIEW: "global-response-set/external/view/:externalResponseId",
        },
      },
    },
    ACTIVITY: {
      LINK: "activity",
      CHILD_LINKS: {
        ACTIVITY_TYPES: {
          HOME: "types",
          ADD: "types/add",
          EDIT: "types/edit/:activityTypeId",
          VIEW: "types/view/:activityTypeId",
        },
        ACTIVITY_STATUS: {
          HOME: "status",
          ADD: "status/add",
          EDIT: "status/edit/:activityStatusId",
          VIEW: "status/view/:activityStatusId",
        },
      },
    },
    FINDINGS_RECOMMENDATIONS: {
      LINK: "findings-recommendations",
      ADD: "/config/findings-recommendations/add",
      EDIT: "/config/findings-recommendations/edit/:findingsAndRecommendationsId",
      VIEW: "/config/findings-recommendations/view/:findingsAndRecommendationsId",
      // CHILD_LINKS: {
      //   FINDINGS: {
      //     HOME: 'findings-recommendations',
      //     ADD: '/config/findings-recommendation/add',
      //     EDIT: '/config/findings-recommendation/edit/:findingsAndRecommendationsId',
      //     VIEW: '/config/findings-recommendation/edit/:findingsAndRecommendationsId',
      //   },
      // },
    },
  },
  // =================== NEW CONFIGURATION LINKS ENDS HERE ====================

  // ======== OLD CONFIGURATION LINKS NOT SURE IF IT IS USED OR NOT!! =========
  CONFIG: {
    REGION: {
      HOME: "/config/regions",
      ADD: "/config/regions/add",
      EDIT: "/config/general-settings/region/edit",
      VIEW: "/config/general-settings/region/view",
    },

    FINANCE: {
      HOME: "/config/finance",
      BILLING_AGGREMENT: "/config/billing-agreement/",
      ADD_BILLING_AGREEMENT: "/config/billing-agreement/add",
      EDIT_BILLING_AGREEMENT: "/config/billing-agreement/edit",
      ADD_TAFIFF_RATE: "/config/tariff-rate/add",
      EDIT_TAFIFF_RATE: "/config/tariff-rate/view",
    },

    department: {
      home: "/config/department",
      add: "/config/department/add",
    },

    COUNTRY: {
      HOME: "/config/countries",
      ADD: "/config/countries/add",
      EDIT: "/config/general-settings/country/edit",
      VIEW: "/config/general-settings/country/view",
    },

    TERRITORY: {
      HOME: "/config/territories",
      ADD: "/config/territories/add",
      EDIT: "/config/territories/edit",
      VIEW: "/config/territories/view",
    },

    LOCATION: {
      HOME: "/config/locations",
      ADD: "/config/locations/add",
      EDIT: "/config/locations/edit",
      VIEW: "/config/locations/view",
    },

    INSPECTION: {
      HOME: "/config/inspections",
      ADD: "/config/inspections/add",
      EDIT: "/config/inspections/edit",
      VIEW: "/config/inspections/view",
    },

    USERS: {
      SYSTEM_PARAMATERS: "/config/users/system-parameters",
    },
  },

  TEMPLATE: {
    TEMPLATE_CREATION: {
      LINK: "/template",
      CHILD_LINKS: {
        CREATE: "/template/create",
        EDIT: "/template/edit/:templateId",
        VIEW: "/template/edit/:templateId",
        INSPECTION: "/template/inspection/:templateId",
        INSPECTIONExternal: "/template/inspection/:templateId/:booking_id/:sub_solution_id",
      },
    },
    ACCESS_CONTROL: {
      ROOT: "/template/access-control/:templateId",
      CREATE: "/template/create",
      EDIT: "/template/edit/:templateId",
      VIEW: "/template/view/:templateId",
    },
    TEMPLATE_LAYOUT: {
      LINK: "/template",
      CHILD_LINKS: {
        CREATE_LAYOUT: "/template/layout/:templateId",
      },
    },
    SCHEDULE_INSPECTION: {
      LINK: "/template",
      CHILD_LINKS: {
        CREATE: "/template/schedule-inspection",
        EDIT: "/template/schedule-inspection",
        VIEW: "/template/schedule-inspection",
        INSPECTION: "/template/schedule-inspection/:templateId",
      },
    },
  },

  // Bookings
  BOOKINGS: {
    LINK: "/booking",
    CHILD_LINKS: {
      ALL_BOOKING: {
        ALL_BOOKING: {
          LINK: "/bookings/all-bookings",
          ACCESS: "/bookings/all-booking-templates/access-control/:templateId",
        },
        ADD_BOOKING: {
          LINK: "/bookings/all-bookings/add",
        },
      },
      BOOKINGS_TEMPLATE: {
        ALL_BOOKING_TEMPLATE: {
          LINK: "/bookings/all-booking-templates",
        },
        ADD_NEW_TEMPLATE: {
          LINK: "/bookings/all-booking-templates/add",
          // multiple dynamic routes will be rendered here
        },
      },
    },
  },

  // QUOTATIONS
  QUOTATIONS: {
    ALL_QUOTATION: {
      ROOT: "/quotations/all-quotations",
    },

    ALL_QUOTATION_TEMPLATE: {
      ROOT: "/quotations/all-quotation-templates",
      ADD: "/quotations/all-quotation-templates/add",
      EDIT: "/quotations/all-quotation-templates/edit/:quotationTemplateId",
      VIEW: "/quotations/all-quotation-templates/view/:quotationTemplateId",
      ACCESS: "/quotations/all-quotation-templates/access-control/:templateId",
    },
    CHILD_LINKS: {
      ALL_QUOTATION: {
        ALL_QUOTATION: {
          LINK: "/quotations/all-quotations",
        },
        ADD_BOOKING: {
          LINK: "/quotations/all-quotations/add",
        },
      },
      QUOTATION_TEMPLATE: {
        ALL_QUOTATION_TEMPLATE: {
          LINK: "/quotations/all-quotation-templates",
          ACCESS: "/quotations/all-quotation-templates/access-control/:templateId",
        },
        ADD_NEW_TEMPLATE: {
          LINK: "/quotations/all-quotation-templates/add",
          // multiple dynamic routes will be rendered here
        },
      },
    },

    CONVERTED_QUOTES: {
      ROOT: "/quotations/all-converted-quotes",
      CREATE: "/quotations/all-converted-quotes/add",
      EDIT: "/quotations/all-converted-quotes/edit/:quotationTemplateId",
      VIEW: "/quotations/all-converted-quotes/view",
    },
  },

  INSPECTION: {
    ROOT: "/inspections",
    VIEW: "/inspections/view/:inspectionId",
    EDIT: "/inspections/edit/:inspectionId",
    REPORT: "/inspections/report/:inspectionId",
  },
};

export const PublicRoute = {
  TWO_FACTOR_TERMS: "/two-fa-terms-and-conditions",
  PRIVACY_POLICY: "/privacy-policy",
  PUBLIC_INVOICE: "/public-invoice/:token",
  INSPECTION_REPORT_DOWNLOAD: "/public-report/:publicInspectionId",
};
