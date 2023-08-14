import { Reducer } from "redux";

import {
  SET_DOWNLOADING_INFO,
  SET_IS_LOADING,
  SET_IS_SUBMITTING,
  SET_ME,
  SET_NOTIFICATION_DATA,
  SET_SIDEBAR,
  SET_UPLOADING_INFO,
  UPDATE_ME,
} from "./constants";

import { Notify } from "src/components/Notification/Notification";
import { ApplicationActionTypes, ApplicationState } from "./types";

export const initialState: ApplicationState = {
  token: "",
  isLoading: false,
  isSubmitting: false,
  isPermissionLoading: false,
  me: undefined,
  sidebar: [],
  appName: "default",
  notification: [],
  upload: { count: 0, progress: 0, loaded: 0, total: 0, startTime: 0, remainingTime: undefined },
  download: { count: 0, progress: 0, loaded: 0, total: 0, startTime: 0, remainingTime: undefined },
  validPermissions: undefined,

  collapsed: false,
};

const reducer: Reducer<ApplicationState> = (
  state: ApplicationState = initialState,
  action: ApplicationActionTypes,
): ApplicationState => {
  switch (action.type) {
    case SET_IS_LOADING: {
      return {
        ...state,
        isLoading: action.payload,
      };
    }
    case SET_IS_SUBMITTING: {
      return {
        ...state,
        isSubmitting: action.payload,
      };
    }

    case SET_ME: {
      return { ...state, me: action.payload };
    }
    case UPDATE_ME: {
      return { ...state, me: { ...state.me, ...action.payload } };
    }

    case SET_SIDEBAR: {
      return { ...state, sidebar: action.payload };
    }

    case SET_UPLOADING_INFO: {
      return {
        ...state,
        upload: { ...state.upload, ...action.payload },
      };
    }

    case SET_DOWNLOADING_INFO: {
      return {
        ...state,
        download: { ...state.download, ...action.payload },
      };
    }

    case SET_NOTIFICATION_DATA: {
      const { message = "", position = "bottom-right", type = "success" } = action.payload;
      Notify(message, {
        position,
        type,
      });
      return { ...state };
    }

    default:
      return state;
  }
};

export default reducer;
