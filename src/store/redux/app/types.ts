import {
  SET_NOTIFICATION_DATA,
  RESET_NOTIFICATION_DATA,
  SET_DOWNLOADING_INFO,
  SET_IS_LOADING,
  SET_IS_SUBMITTING,
  SET_ME,
  SET_SIDEBAR,
  SET_UPLOADING_INFO,
  UPDATE_ME,
} from "./constants";

import { ToastPosition, TypeOptions } from "react-toastify";

export type NotificationPayloadType = {
  message: string;
  position: ToastPosition;
  type: TypeOptions;
};

export interface ApplicationState {
  token: string;
  isLoading: boolean;
  isSubmitting: boolean;
  isPermissionLoading: boolean;
  notification: NotificationPayloadType[];
  me: any;
  sidebar: any[];
  appName: any;
  validPermissions: any;
  upload: {
    count: number;
    progress: number;
    loaded: number;
    total: number;
    startTime: number;
    remainingTime?: number;
  };
  download: {
    count: number;
    progress: number;
    loaded: number;
    total: number;
    startTime: number;
    remainingTime?: number;
  };
  collapsed: boolean;
}

export type SetMeType = {
  type: typeof SET_ME;
  payload: any;
};
export type UpdateMeType = {
  type: typeof UPDATE_ME;
  payload: any;
};

export type SetIsLoadingType = {
  type: typeof SET_IS_LOADING;
  payload: boolean;
};
export type SetIsSubmittingType = {
  type: typeof SET_IS_SUBMITTING;
  payload: boolean;
};

export type SetNotificationDataType = {
  type: typeof SET_NOTIFICATION_DATA;
  payload: NotificationPayloadType;
};

export type SetDownloadingInfoType = {
  type: typeof SET_DOWNLOADING_INFO;
  payload: any;
};

export type SetUploadingInfoType = {
  type: typeof SET_UPLOADING_INFO;
  payload: any;
};

export type SetSidebarType = {
  type: typeof SET_SIDEBAR;
  payload: any;
};

export type ApplicationActionTypes =
  | SetIsLoadingType
  | SetIsSubmittingType
  | SetMeType
  | UpdateMeType
  | SetUploadingInfoType
  | SetDownloadingInfoType
  | SetNotificationDataType
  | SetSidebarType;
