export const commonField = {
  status: {
    type: "Select",
    backendName: "status",
    api: "",
    options: [
      { id: "Active", label: "Active", value: "Active" },
      { label: "Inactive", value: "Inactive", id: "Inactive" },
    ],
    fieldName: "label",
    value: {},
    label: "Choose status",
    initialValue: "status",
    multiple: false,
    fieldKey: { value: "id", label: "label" },
  },
};

export const NOTIFICATION_FILTER_INITIAL_VALUE: any = {
  preference: {
    type: "Select",
    backendName: "perference",
    api: "module/",
    options: [],
    fieldName: "name",
    value: [],
    label: "Choose Perference",
    initialValue: "perference",
    multiple: true,
  },
  trigger: {
    type: "Select",
    backendName: "trigger",
    api: "",
    options: [
      { id: "is_added", label: "is added", value: "is_added" },
      { label: "is updated", value: "is_updated", id: "is_updated" },
      { label: "is deleted", value: "is_deleted", id: "is_deleted" },
    ],
    fieldName: "label",
    value: [],
    label: "Choose Trigger Type",
    initialValue: "trigger",
    multiple: true,
  },
  ...commonField,
  // last_name: {
  //   type: 'text',
  //   backendName: 'name',
  //   api: '',
  //   fieldName: 'name',
  //   value: '',
  //   label: 'Choose last Name',
  //   initialValue: 'last_name',
  // },
};

export const CONTRACTOR_FILTER_INITIAL_VALUE: any = {
  service: {
    type: "Select",
    backendName: "service",
    api: "organization-service/",
    options: [],
    fieldName: "label",
    value: [],
    label: "Choose Services",
    initialValue: "service",
    multiple: true,
    fieldKey: {
      label: "label",
      value: "id",
    },
  },
  language: {
    type: "Select",
    backendName: "language",
    api: "config/language",
    options: [],
    fieldName: "name",
    value: [],
    label: "Choose Language",
    initialValue: "language",
    multiple: true,
    fieldKey: {
      label: "name",
      value: "id",
    },
  },
  country: {
    type: "Select",
    backendName: "country",
    api: "config/country",
    options: [],
    fieldName: "name",
    value: [],
    label: "Choose Country",
    initialValue: "country",
    multiple: true,
    fieldKey: {
      label: "name",
      value: "id",
    },
  },
  industry: {
    type: "Select",
    backendName: "country",
    api: "industry",
    options: [],
    fieldName: "name",
    value: [],
    label: "Choose Industry",
    initialValue: "industry",
    multiple: true,
    fieldKey: {
      label: "name",
      value: "id",
    },
  },
  ...commonField,
};

export const SERVICES_FILTER_INITIAL_VALUE: any = {
  // first_name: {
  //   type: 'text',
  //   backendName: 'name',
  //   api: '',
  //   fieldName: 'name',
  //   value: '',
  //   label: 'Choose First Name',
  //   initialValue: 'first_name',
  // },
  ...commonField,
};

export const ACTIVITY_FILTER_INITIAL_VALUE: any = {
  // first_name: {
  //   type: 'text',
  //   backendName: 'name',
  //   api: '',
  //   fieldName: 'name',
  //   value: '',
  //   label: 'Choose TEST Name',
  //   initialValue: 'first_name',
  // },
  // last_name: {
  //   type: 'text',
  //   backendName: 'name',
  //   api: '',
  //   fieldName: 'name',
  //   value: '',
  //   label: 'Choose last Name',
  //   initialValue: 'last_name',
  // },
  ...commonField,
};

export const FINDING_AND_RECOMMENDATION_FILTER_INITIAL_VALUE: any = {
  // first_name: {
  //   type: 'text',
  //   backendName: 'name',
  //   api: '',
  //   fieldName: 'name',
  //   value: '',
  //   label: 'Choose First Name',
  //   initialValue: 'first_name',
  // },
  ...commonField,
};

export const USER_ROLE_AND_PERMISSION_FILTER_INITIAL_VALUE: any = {
  ...commonField,
};
export const BOOKING_STATUS_FILTER_INITIAL_VALUE: any = {
  ...commonField,
};
export const FINANCE_FILTER_INITIAL_VALUE: any = {
  ...commonField,
};
export const EXTERNAL_ATTRIBUTES_INITIAL_VALUE: any = {
  ...commonField,
};
export const INSPECTION_TYPES_INITIAL_VALUE: any = {
  ...commonField,
};

export const REGION_INITIAL_VALUE: any = {
  ...commonField,
};

export const CUSTOMER_INITIAL_VALUE: any = {
  status: {
    type: "Select",
    backendName: "type",
    api: "",
    options: [
      { id: "Organization", label: "Organization", value: "Organization" },
      { label: "Individual", value: "Individual", id: "Individual" },
    ],
    fieldName: "label",
    value: {},
    label: "Customer type",
    initialValue: "type",
    multiple: false,
    fieldKey: { value: "id", label: "label" },
  },
  country: {
    type: "Select",
    backendName: "country",
    api: "country/",
    options: [],
    fieldName: "name",
    value: [],
    label: "Choose Country",
    initialValue: "country",
    multiple: true,
  },
};

export const CUSTOMER_USER_INITIAL_VALUE: any = {
  ...commonField,
};

export const COUNTRY_INITIAL_VALUE: any = {
  region: {
    type: "Select",
    backendName: "region",
    api: "region/",
    options: [],
    fieldName: "name",
    value: [],
    label: "Choose Region",
    initialValue: "region",
    multiple: true,
  },
  ...commonField,
};
export const ASSIGN_ACTIVITY_INITIAL_VALUE: any = {
  assignees: {
    type: "Select",
    backendName: "assignees",
    api: "organization-user/",
    options: [],
    fieldName: "label",
    value: [],
    label: "Choose Assignees",
    initialValue: "assignees",
    multiple: true,
    fieldKey: {
      label: "full_name",
      value: "id",
    },
  },
  user_dept: {
    type: "Select",
    backendName: "user_dept",
    api: "user-department/",
    options: [],
    fieldName: "label",
    value: [],
    label: "Choose User Department",
    initialValue: "user_dept",
    multiple: true,
    fieldKey: {
      label: "name",
      value: "id",
    },
  },
  status: {
    type: "Select",
    backendName: "status",
    api: "activity-status/",
    options: [],
    fieldName: "label",
    value: [],
    label: "Choose Activity Status",
    initialValue: "status",
    multiple: true,
    fieldKey: {
      label: "name",
      value: "id",
    },
  },
  inspection: {
    type: "Select",
    backendName: "inspection",
    api: "organization-user/",
    options: [],
    fieldName: "label",
    value: [],
    label: "Choose Inspector",
    initialValue: "inspection",
    multiple: true,
    fieldKey: {
      label: "full_name",
      value: "id",
    },
  },
  created_by: {
    type: "Select",
    backendName: "created_by",
    api: "organization-user/",
    options: [],
    fieldName: "label",
    value: [],
    label: "Choose Created By",
    initialValue: "created_by",
    multiple: true,
    fieldKey: {
      label: "full_name",
      value: "id",
    },
  },
  modified_by: {
    type: "Select",
    backendName: "modified_by",
    api: "organization-user/",
    options: [],
    fieldName: "label",
    value: [],
    label: "Choose Modified By",
    initialValue: "modified_by",
    multiple: true,
    fieldKey: {
      label: "full_name",
      value: "id",
    },
  },
  due_date: {
    type: "Date",
    backendName: "due_date",
    api: "",
    options: [],
    fieldName: "due_date",
    value: [],
    label: "Due Date",
    initialValue: "due_date",
    multiple: true,
  },

  // ...commonField,
};
export const TERRITORY_INITIAL_VALUE: any = {
  region: {
    type: "Select",
    backendName: "country",
    api: "country/",
    options: [],
    fieldName: "name",
    value: [],
    label: "Choose Country",
    initialValue: "country",
    multiple: true,
  },
  ...commonField,
};
export const INSPECTION_INITIAL_VALUE: any = {
  region: {
    type: "Select",
    backendName: "templates",
    api: "templates/",
    options: [],
    fieldName: "name",
    value: [],
    label: "Choose Form",
    initialValue: "form",
    multiple: true,
  },
};
export const FORM_INITIAL_VALUE: any = {
  region: {
    type: "Select",
    backendName: "inspection_id",
    api: "inspection-name/",
    options: [],
    fieldName: "name",
    value: [],
    label: "Choose Inspection",
    initialValue: "Inspection",
    multiple: true,
  },
  start_date: {
    type: "Date",
    backendName: "start_date",
    api: "",
    options: [],
    fieldName: "start_date",
    value: [],
    label: "Start Date",
    initialValue: "date",
    multiple: true,
  },
  end_date: {
    type: "Date",
    backendName: "end_date",
    api: "",
    options: [],
    fieldName: "end_date",
    value: [],
    label: "End Date",
    initialValue: "end_date",
    multiple: true,
  },
};

export const LOCATION_INITIAL_VALUE: any = {
  region: {
    type: "Select",
    backendName: "territory",
    api: "territory/",
    options: [],
    fieldName: "name",
    value: [],
    label: "Choose Territory",
    initialValue: "territory",
    multiple: true,
  },
  ...commonField,
};
export const FINANCE_INITIAL_VALUE: any = {
  region: {
    type: "Select",
    backendName: "customer",
    api: "customers/",
    options: [],
    fieldName: "organization_name",
    value: [],
    label: "Choose Customer",
    initialValue: "Customer",
    multiple: true,
  },
  start_date: {
    type: "Date",
    backendName: "start_date",
    api: "",
    options: [],
    fieldName: "start_date",
    value: [],
    label: "Start Date",
    initialValue: "date",
    multiple: true,
  },
  end_date: {
    type: "Date",
    backendName: "end_date",
    api: "",
    options: [],
    fieldName: "end_date",
    value: [],
    label: "End Date",
    initialValue: "end_date",
    multiple: true,
  },
};

export const TARIFF_INITIAL_VALUE: any = {
  ...commonField,
  start_date: {
    type: "Date",
    backendName: "start_date",
    api: "",
    options: [],
    fieldName: "start_date",
    value: [],
    label: "Start Date",
    initialValue: "date",
    multiple: true,
  },
  end_date: {
    type: "Date",
    backendName: "end_date",
    api: "",
    options: [],
    fieldName: "end_date",
    value: [],
    label: "End Date",
    initialValue: "end_date",
    multiple: true,
  },
};
export const BOOKING_FILTER_INITIAL_VALUE: any = {
  customer: {
    type: "Select",
    backendName: "customer",
    api: "customers/",
    options: [],
    fieldName: "organization_name",
    value: [],
    label: "Choose Customer",
    initialValue: "Customer",
    multiple: true,
  },
  inspection: {
    type: "Select",
    backendName: "inspection",
    api: "inspection-name/",
    options: [],
    fieldName: "name",
    value: [],
    label: "Choose Inspection",
    initialValue: "Inspection",
    multiple: true,
  },
  // start_date: {
  //   type: 'Date',
  //   backendName: 'start_date',
  //   api: '',
  //   options: [],
  //   fieldName: 'start_date',
  //   value: [],
  //   label: 'Start Date',
  //   initialValue: 'date',
  //   multiple: true,
  // },
  // end_date: {
  //   type: 'Date',
  //   backendName: 'end_date',
  //   api: '',
  //   options: [],
  //   fieldName: 'end_date',
  //   value: [],
  //   label: 'End Date',
  //   initialValue: 'end_date',
  //   multiple: true,
  // },
};
export const QUOTATION_FILTER_INITIAL_VALUE: any = {
  customer: {
    type: "Select",
    backendName: "customer",
    api: "customers/",
    options: [],
    fieldName: "organization_name",
    value: [],
    label: "Choose Customer",
    initialValue: "Customer",
    multiple: true,
  },
  inspection: {
    type: "Select",
    backendName: "inspection",
    api: "inspection-name/",
    options: [],
    fieldName: "name",
    value: [],
    label: "Choose Inspection",
    initialValue: "Inspection",
    multiple: true,
  },

  // ...commonField,
};
