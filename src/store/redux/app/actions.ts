import { Action, ActionCreator, Dispatch } from "redux";
import { ThunkAction } from "redux-thunk";
import api from "src/constants/api";
import { network } from "src/utils/network";

import { ToastOptions, ToastPosition, TypeOptions } from "react-toastify";
import { Notify } from "src/components/Notification/Notification";
import app from "src/constants/app";
import { downloadFromBlob, getFileExtension } from "src/utils";
import logOutFromBrowser from "src/utils/logOutFromBrowser";
import throttle from "src/utils/throttle";
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
import {
  ApplicationState,
  SetDownloadingInfoType,
  SetIsLoadingType,
  SetIsSubmittingType,
  SetMeType,
  SetNotificationDataType,
  SetSidebarType,
  SetUploadingInfoType,
  UpdateMeType,
} from "./types";

export const setMe = (payload: any): SetMeType => ({
  type: SET_ME,
  payload,
});

export const updateMe = (payload: any): UpdateMeType => ({
  type: UPDATE_ME,
  payload,
});

export const setIsLoading = (payload: boolean): SetIsLoadingType => ({
  type: SET_IS_LOADING,
  payload,
});

export const setIsSubmitting = (payload: boolean): SetIsSubmittingType => ({
  type: SET_IS_SUBMITTING,
  payload,
});

export const setUploadingInfo = (payload: {
  count?: number;
  progress?: number;
  loaded?: number;
  total?: number;
  remainingTime?: number;
  startTime?: number;
}): SetUploadingInfoType => ({
  type: SET_UPLOADING_INFO,
  payload,
});

export const setDownloadingInfo = (payload: {
  count?: number;
  progress?: number;
  loaded?: number;
  total?: number;
  startTime?: number;
  remainingTime?: number;
}): SetDownloadingInfoType => ({
  type: SET_DOWNLOADING_INFO,
  payload,
});

export const setSidebar = (payload): SetSidebarType => ({
  type: SET_SIDEBAR,
  payload,
});

export const setErrorResponse = ({ message }): SetNotificationDataType => {
  return {
    type: SET_NOTIFICATION_DATA,
    payload: {
      position: "top-right",
      message: message || "Error has occurred",
      type: "error",
    },
  };
};

export const notify = (message: string, options: ToastOptions) => Notify(message, options);

export const notifyError = (err: any) => {
  let message;
  if (err && err.response && err.response.data) {
    const errorKeyArray = Object.keys(err.response.data);
    const errorMessageArray = Object.values(err.response.data);
    if (errorMessageArray.length && errorMessageArray[0]) {
      message = err.response.data?.detail?.message;
    }
  }
  Notify(message || "Error has occurred", {
    type: "error",
  });
};

export const notifySuccess = (message = "Error has occurred") => {
  Notify(message, {
    type: "success",
  });
};

export type AppThunk = ActionCreator<
  ThunkAction<Promise<boolean>, ApplicationState, null, Action<string>>
>;

export const showNotification = (payload: {
  position?: ToastPosition;
  type?: TypeOptions;
  message: string;
}): SetNotificationDataType => {
  return {
    type: SET_NOTIFICATION_DATA,
    payload,
  };
};

export const setErrorMessage = (err: any): SetNotificationDataType => {
  console.log("error", err);
  const message = err?.response?.data?.detail?.message || "Error has occurred";
  return {
    type: SET_NOTIFICATION_DATA,
    payload: {
      message,
      type: "error",
    },
  };
};

export const login =
  ({ values }) =>
  async (dispatch) => {
    try {
      dispatch(setIsSubmitting(true));

      // Convert form data object  to plain object
      // let formDataAsObject = Object.fromEntries(values.entries());
      // posting as multipart/formData
      const { data, status } = await network({}).post(api.login, values);
      if (status === 200 || status === 201) {
        if (data) {
          dispatch(setIsSubmitting(false));
          dispatch(setMe(data));
          sessionStorage.setItem("accessToken", data.access_token);
          sessionStorage.setItem("refreshToken", data.refresh_token);
          Notify("Login Successful", {
            type: "success",
          });
          return data;
        }
        return false;
      }
    } catch (error) {
      dispatch(setIsSubmitting(false));
      if (error.response) notifyError(error);
      return false;
    }
  };

export const uploadFile: AppThunk =
  ({ id, formData }) =>
  async (dispatch: Dispatch) => {
    try {
      const downloadStartTime = new Date().getTime() / 1000;
      let intervalId;
      let remainingTime;

      dispatch(setUploadingInfo({ count: 1 }));
      dispatch(setIsSubmitting(true));
      const { data, status } = await network({
        dispatch,
        onUploadProgress: (progressEvent: any) => {
          const { loaded, total } = progressEvent;
          const progressPercentage = total ? Math.round((loaded * 100) / total) : 0;

          intervalId = setInterval(() => {
            const downloadEndTime = new Date().getTime() / 1000;
            const timeElapsed = downloadEndTime - downloadStartTime;
            const downloadRate = loaded / timeElapsed; // bytes/sec
            remainingTime = total / downloadRate;
          }, 1000);

          dispatch(
            setUploadingInfo({
              progress: progressPercentage,
              remainingTime,
            }),
          );
        },
      }).post(`${api.getUserVideoUploadPath(id)}`, formData);

      if (status === 200 || (status > 200 && status < 300)) {
        if (data) {
          setTimeout(() => {
            clearInterval(intervalId);
            dispatch(setIsSubmitting(false));
            dispatch(setUploadingInfo({ count: 0, progress: 100 }));
            return true;
          }, 1000);
        }
      }
      return false;
    } catch (error) {
      notifyError(error);
      setTimeout(() => dispatch(setUploadingInfo({ progress: 0, count: 1 })), 1000);
      dispatch(setIsSubmitting(false));
      return false;
    }
  };
export const downloadFile: AppThunk = (url) => async (dispatch: Dispatch) => {
  try {
    const downloadStartTime = new Date().getTime() / 1000;
    dispatch(setDownloadingInfo({ count: 1 }));
    dispatch(setIsSubmitting(true));
    const { data, status } = await network({
      dispatch,
      responseType: "blob", // important for download
      onDownloadProgress: throttle((progressEvent: any) => {
        const { loaded, total } = progressEvent;
        const progressPercentage = total ? Math.round((loaded * 100) / total) : 0;
        const downloadEndTime = new Date().getTime() / 1000;
        const timeElapsed = downloadEndTime - downloadStartTime;
        const downloadRate = loaded / timeElapsed; // bytes/sec
        const remainingTime = total / downloadRate;
        dispatch(
          setDownloadingInfo({
            progress: progressPercentage,
            startTime: downloadStartTime,
            remainingTime,
          }),
        );
      }, 1000),
    }).get(`${url}`);

    if (status === 200 || (status > 200 && status < 300)) {
      if (data) {
        setTimeout(() => {
          downloadFromBlob(new Blob([data]), `${new Date().getTime()}`, `${getFileExtension(url)}`);
          dispatch(setIsSubmitting(false));
          dispatch(setDownloadingInfo({ count: 0, progress: 100 }));
          return true;
        }, 1000);
      }
    }
    return false;
  } catch (error) {
    notifyError(error);
    dispatch(setDownloadingInfo({ progress: 0, count: 1 }));
    dispatch(setIsSubmitting(false));
    return false;
  }
};

export const resetUploadState = () => async (dispatch) => {
  dispatch(setUploadingInfo({ progress: 0, count: 0 }));
};

export const logOut = () => async (dispatch) => {
  try {
    dispatch(setIsLoading(true));
    // logout from server
    await network({ dispatch }).post(api.logout, {
      refresh: sessionStorage.getItem("refreshToken"),
      access: sessionStorage.getItem("accessToken"),
    });

    logOutFromBrowser();
    dispatch(setIsLoading(true));
  } catch (error) {
    console.log(error);
  }
};

export const fetchMe =
  () =>
  async (dispatch: Dispatch): Promise<boolean> => {
    try {
      dispatch(setIsLoading(true));
      const { data, status } = await network({}).get(api.me);
      if (status === 200) {
        if (data) {
          dispatch(updateMe(data));
          dispatch(setIsLoading(false));
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

export const postForgotPassword: AppThunk =
  ({ values }) =>
  async (dispatch: Dispatch): Promise<boolean> => {
    try {
      dispatch(setIsSubmitting(true));
      const { data, status } = await network({ dispatch }).post(api.forgotPassword, values);

      if (status === 200 || (status > 200 && status < 300)) {
        dispatch(setIsSubmitting(false));
        window.location.pathname = app.auth.passwordResetLink;

        return true;
      }
      return false;
    } catch (error: any) {
      // error.response && dispatch(setErrorMessage(error));
      error.response && dispatch(setErrorMessage(error.response.data.detail));

      dispatch(setIsSubmitting(false));
      return false;
    }
  };

// export const changepassword =
//   ({ values }) =>
//   async (dispatch) => {
//     try {
//       dispatch(setIsSubmitting(true));

//       const { status, data } = await network({
//         dispatch,
//         requireToken: false,
//       }).patch(api.changepassword, values);

//       if (status === 200 || status > 200) {
//         if (data) {
//           const { token } = data;

//           sessionStorage.setItem("token", token);

//           dispatch(setIsSubmitting(false));

//           return true;
//         }
//         dispatch(setIsSubmitting(false));
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

// export const register =
//   ({ values }) =>
//   async (dispatch) => {
//     try {
//       dispatch(setIsSubmitting(true));
//       const requestOptions = {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           username: String(values.email).toLowerCase(),
//           password: values.password,
//           requester_app: "VRS",
//         }),
//         credentials: "omit",
//       };

//       const result = await fetch(envConfig.sso.url + api.ssoRegister, requestOptions);
//       const data = await result.json();

//       const status = result.status;
//       if (status === 200 || status === 201) {
//         if (data) {
//           dispatch(setIsSubmitting(false));
//           return data;
//         }
//       } else {
//         dispatch(setErrorResponse(data));
//         dispatch(setIsSubmitting(false));
//       }
//     } catch (error) {
//       dispatch(setIsSubmitting(false));
//       error.response && dispatch(setErrorMessage(error));
//     }
//   };
