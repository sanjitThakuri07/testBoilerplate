import { Action, ActionCreator, Dispatch } from "redux";
import { ThunkAction } from "redux-thunk";

import api from "src/constants/api";

import { generateMeta, generateQuery } from "src/utils/store";
// import { setErrorMessage, setUploadingInfo } from 'store/app/actions';

import { defaultQuery } from "src/constants/query";
import { network } from "src/utils/network";
import {
  CREATE_DRIVER_DATA,
  REMOVE_DRIVER_DATA,
  RESET_SEARCHED_DRIVERS_DATA,
  SET_DRIVERS_DATA,
  SET_DRIVERS_METADATA,
  SET_DRIVER_DATA,
  SET_IS_LOADING,
  SET_IS_SUBMITTING,
  SET_SEARCHED_DRIVERS_DATA,
  UPDATE_DRIVER_DATA,
} from "./action-types";
import {
  CreateDriverDataType,
  DriverState,
  RemoveDriverDataType,
  ResetSearchedDriversDataType,
  SetDriverDataType,
  SetDriversDataType,
  SetDriversMetadataType,
  SetIsLoadingType,
  SetIsSubmittingType,
  SetSearchedDriversDataType,
  UpdateDriverDataType,
} from "./types";

export type AppThunk = ActionCreator<
  ThunkAction<Promise<boolean>, DriverState, null, Action<string>>
>;

export const setIsLoading = (payload): SetIsLoadingType => ({
  type: SET_IS_LOADING,
  payload,
});

export const setIsSubmitting = (payload): SetIsSubmittingType => ({
  type: SET_IS_SUBMITTING,
  payload,
});

export const setDriverData = (payload): SetDriverDataType => ({
  type: SET_DRIVER_DATA,
  payload,
});

export const setDriversData = (payload): SetDriversDataType => ({
  type: SET_DRIVERS_DATA,
  payload,
});

export const setDriversMetadata = (payload): SetDriversMetadataType => ({
  type: SET_DRIVERS_METADATA,
  payload,
});

export const setSearchedDriversData = (payload): SetSearchedDriversDataType => ({
  type: SET_SEARCHED_DRIVERS_DATA,
  payload,
});

export const resetSearchedDriversData = (payload): ResetSearchedDriversDataType => ({
  type: RESET_SEARCHED_DRIVERS_DATA,
  payload,
});

export const createDriverData = (payload): CreateDriverDataType => ({
  type: CREATE_DRIVER_DATA,
  payload,
});

export const removeDriverData = (payload): RemoveDriverDataType => ({
  type: REMOVE_DRIVER_DATA,
  payload,
});

export const updateDriverData = (payload): UpdateDriverDataType => ({
  type: UPDATE_DRIVER_DATA,
  payload,
});

export const fetchDriver: AppThunk =
  ({ driverId }) =>
  async (dispatch: Dispatch) => {
    try {
      dispatch(setIsLoading(true));
      const { data, status } = await network({ dispatch }).get(`${api.driver}${driverId}/`);

      if (status === 200 || (status > 200 && status < 300)) {
        if (data) {
          dispatch(setDriverData(data));
          dispatch(setIsLoading(false));
          return true;
        }
      }
      dispatch(setIsLoading(false));
      return false;
    } catch (error) {
      // error.response && dispatch(setErrorMessage(error));
      dispatch(setIsLoading(false));
      return false;
    }
  };

export const fetchDrivers: AppThunk =
  ({ query = defaultQuery, length = true, columns, searchable, search, accessToken }) =>
  async (dispatch: Dispatch): Promise<boolean> => {
    const link = generateQuery({
      url: api.driver,
      query,
      columns,
      searchable,
      length,
    });
    try {
      dispatch(setIsLoading(true));
      const { data: resData, status } = await network({ dispatch, accessToken }).get(link);
      const { data } = resData;
      if (status === 200 || (status > 200 && status < 300)) {
        if (data) {
          const metadata = generateMeta({ data: resData, query, results: data });

          search ? dispatch(setSearchedDriversData(data)) : dispatch(setDriversData(data));
          dispatch(setIsLoading(false));
          dispatch(setDriversMetadata(metadata));
          return true;
        }
      }
      return false;
    } catch (error) {
      // error.response && dispatch(setErrorMessage(error));
      dispatch(setIsLoading(false));
      return false;
    }
  };

export const createDriver: AppThunk =
  ({ values }) =>
  async (dispatch: Dispatch): Promise<boolean> => {
    try {
      dispatch(setIsSubmitting(true));
      const { data, status } = await network({ dispatch }).post(api.driver, values);

      if (status === 200 || (status > 200 && status < 300)) {
        dispatch(createDriverData(data));
        dispatch(setIsSubmitting(false));

        return true;
      }
      return false;
    } catch (error) {
      // error.response && dispatch(setErrorMessage(error));
      dispatch(setIsSubmitting(false));
      return false;
    }
  };

export const updateDriver: AppThunk =
  ({ driverId, values }) =>
  async (dispatch: Dispatch) => {
    try {
      dispatch(setIsSubmitting(true));
      const { data, status } = await network({ dispatch }).put(`${api.driver}${driverId}/`, values);

      if (status === 200 || (status > 200 && status < 300)) {
        if (data) {
          dispatch(updateDriverData(data));
          dispatch(setIsSubmitting(false));
          return true;
        }
      }
      return false;
    } catch (error) {
      // error.response && dispatch(setErrorMessage(error));
      dispatch(setIsSubmitting(false));
      return false;
    }
  };

export const updateDriverShiftInBulk: AppThunk =
  ({ values }) =>
  async (dispatch: Dispatch) => {
    try {
      dispatch(setIsSubmitting(true));
      const { data, status } = await network({ dispatch }).patch(`${api.driverShift}/`, values);
      if (status === 200 || (status > 200 && status < 300)) {
        dispatch(updateDriverData(data));
        dispatch(setIsSubmitting(false));
        return true;
      }
      return false;
    } catch (error) {
      // error.response && dispatch(setErrorMessage(error));
      dispatch(setIsSubmitting(false));
      return false;
    }
  };

export const deleteDriver: AppThunk =
  ({ driverId }) =>
  async (dispatch: Dispatch): Promise<boolean> => {
    try {
      dispatch(setIsSubmitting(true));
      const { status } = await network({ dispatch }).delete(`${api.driver}${driverId}/`);

      if (status === 200 || status > 200) {
        dispatch(removeDriverData({ id: driverId }));
        dispatch(setIsSubmitting(false));
        return true;
      }
      return false;
    } catch (error) {
      // error.response && dispatch(setErrorMessage(error));
      dispatch(setIsSubmitting(false));
      return false;
    }
  };

export const patchDriver: AppThunk =
  ({ driverId, values }) =>
  async (dispatch: Dispatch) => {
    try {
      dispatch(setIsSubmitting(true));
      const { data, status } = await network({ dispatch }).patch(
        `${api.driver}${driverId}/`,
        values,
      );

      if (status === 200 || (status > 200 && status < 300)) {
        if (data) {
          dispatch(updateDriverData(data));
          dispatch(setIsSubmitting(false));
          return true;
        }
      }
      return false;
    } catch (error) {
      // error.response && dispatch(setErrorMessage(error));
      dispatch(setIsSubmitting(false));
      return false;
    }
  };

export const uploadForm: AppThunk =
  ({ formData }) =>
  async (dispatch: Dispatch) => {
    try {
      // dispatch(setUploadingInfo({ count: 1 }));
      dispatch(setIsSubmitting(true));
      const { data, status } = await network({
        dispatch,
        onUploadProgress: (progressEvent) => {
          // dispatch(
          //   setUploadingInfo({
          //     progress: progressEvent.total
          //       ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
          //       : '.',
          //   }),
          // );
        },
      }).post(`${api.uploadForm}`, formData);
      if (status === 200 || (status > 200 && status < 300)) {
        if (data) {
          dispatch(setIsSubmitting(false));
          // setTimeout(() => dispatch(setUploadingInfo({ count: 0 })), 1000);
          return true;
        }
      }
      return false;
    } catch (error) {
      // error.response && dispatch(setErrorMessage(error));
      dispatch(setIsSubmitting(false));
      return false;
    }
  };
