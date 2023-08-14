type PermissionsType = {
  kyc: {
    [key: string]: string | object;
    view: string;
    add: string;
    change: string;
    delete: string;
    verify: string;
    approve: string;
    superuser: string;
    kycAdmin: string;
    supervisor: string;
    onlineresponse: { [key: string]: string };
    liveresponse: { [key: string]: string };
    checklist: { [key: string]: string };
    methodmanagement: { [key: string]: string };
    accounttype: { [key: string]: string };
    deviceinfo: { [key: string]: string };
    guideline: { [key: string]: string };
  };
};

export const permissions: PermissionsType = {
  kyc: {
    view: "kyc.view_kyc",
    add: "kyc.add_kyc",
    change: "kyc.change_kyc",
    delete: "kyc.delete_kyc",
    verify: "kyc.verify_kyc",
    approve: "kyc.approve_kyc",
    supervisor: "kyc.supervisor",
    superuser: "kyc.superuser",
    kycAdmin: "kyc.admin",

    onlineresponse: {
      add: "kyc.add_onlineresponse",
      view: "kyc.view_onlineresponse",
      change: "kyc.change_onlineresponse",
      delete: "kyc.delete_onlineresponse",
    },

    liveresponse: {
      add: "kyc.add_liveresponse",
      view: "kyc.view_liveresponse",
      change: "kyc.change_liveresponse",
      delete: "kyc.delete_liveresponse",
    },

    checklist: {
      add: "kyc.add_checklist",
      delete: "kyc.delete_checklist",
      view: "kyc.view_checklist",
      change: "kyc.change_checklist",
      manage: "kyc.manage_checklist",
    },

    guideline: {
      manage: "kyc.manage_guidelines",
    },

    deviceinfo: {
      add: "kyc.add_deviceinfo",
      view: "kyc.view_deviceinfo",
      change: "kyc.change_deviceinfo",
      delete: "kyc.delete_deviceinfo",
    },

    methodmanagement: {
      add: "kyc.add_methodmanagement",
      view: "kyc.view_methodmanagement",
      change: "kyc.change_methodmanagement",
      delete: "kyc.delete_methodmanagement",
    },

    accounttype: {
      add: "kyc.add_accounttype",
      view: "kyc.view_accounttype",
      change: "kyc.change_accounttype",
      delete: "kyc.delete_accounttype",
      manage: "kyc.manage_account_types",
    },
  },
};

export const permissionMethods = ["add", "change", "delete", "view"];

export const kycCrudPermissions = permissionMethods.map((method) => permissions.kyc[method]);

export const kycAllPermissions = [
  ...permissionMethods,
  "verify",
  "approve",
  "superuser",
  "kycAdmin",
].map((method) => permissions.kyc[method]);

export const onlineresponsePermissions = permissionMethods.map(
  (method) => permissions.kyc.onlineresponse[method],
);

export const liveresponsePermissions = permissionMethods.map(
  (method) => permissions.kyc.liveresponse[method],
);

export const methodmanagementPermissions = permissionMethods.map(
  (method) => permissions.kyc.methodmanagement[method],
);

export const deviceinfoPermissions = permissionMethods.map(
  (method) => permissions.kyc.deviceinfo[method],
);

export const checklistPermissions = permissionMethods.map(
  (method) => permissions.kyc.checklist[method],
);

export const rolePermissions = {
  kyc: {
    user: [],
    admin: kycCrudPermissions,
    superuser: kycAllPermissions,
  },
};
