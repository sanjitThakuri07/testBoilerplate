// in case of multiple apps with their own sidebar
const appRoots = {
  desk: "/desk",
};

const app = {
  root: "/",
  welcome: `/welcome`,
  auth: {
    me: "/auth/me",
    changepassword: "/auth/change-password",
    register: "/auth/register",
    login: "/auth/login",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
    otp: "/auth/otp",
    passwordResetConfirmation: "/auth/password-reset-confirmation",
    passwordResetLink: "/auth/password-reset-link",
  },
  data: {
    root: "/data",
    fileUpload: "/data/file-upload",
    database: "/data/database",
    streaming: "/data/streaming",
    imageAnnotation: "/data/image-annotation",
  },
  feature: {
    root: "/feature",
    create: "/feature/create",
    update: (id: string) => `/feature/${id}/update`,
  },
  model: {
    root: "/model",
    create: "/model/create",
    update: (id: string) => `/model/${id}/update`,
  },
  environment: {
    root: "/environment",
    create: "/environment/create",
    update: (id: string) => `/environment/${id}/update`,
  },
  train: {
    root: "/train",
  },
  finetune: {
    root: "/finetune",
  },
  fileExplorer: "/file-explorer",
  predict: {
    root: "/predict",
    image: "/image-prediction",
  },
  configuration: {
    libraries: "/configuration/libraries",
    controllers: "/configuration/controllers",
    placement: "/configuration/placement",
    exclusion: "/configuration/exclusions",
  },

  source: {
    folder: "/source/folder",
    fileUpload: "/source/file-upload",
    streaming: "/source/streaming",
    dbPull: "/source/db-pull",
  },

  featureEngieering: {
    feature1: "/feature-engineering/feature-py-1",
    feature2: "/feature-engineering/feature-py-2",
    feature3: "/feature-engineering/feature-py-3",
  },

  aiModel: {
    history: "/ai-model/active-model-and-history",
    modelPy: "/ai-model/model-py",
  },

  settings: {
    users: "/settings/users",
    roles: "/settings/roles",
    access: "/settings/access",
    logs: "/settings/logs",
  },

  user: {
    root: "/user",
    create: `/user/create`,
    update: (id = "") => `/user/${id}/update`,
    view: (id = "") => `/user/${id}/view`,
  },

  permission: {
    root: "/permission",
    create: `/permission/create`,
    update: (id = "") => `/permission/${id}/update`,
    view: (id = "") => `/permission/${id}/view`,
  },

  role: {
    root: "/role",
    create: `/role/create`,
    update: (id = "") => `/role/${id}/update`,
    view: (id = "") => `/role/${id}/view`,
  },

  liveClients: `/live-clients`,
};

export default app;
