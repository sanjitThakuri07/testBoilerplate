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

export interface DriverState {
  isLoading: boolean;
  isSubmitting: boolean;

  driver: any;
  drivers: any;

  searchedDrivers: any;

  metadata: any;
}

export type SetIsLoadingType = {
  type: typeof SET_IS_LOADING;
  payload: boolean;
};

export type SetIsSubmittingType = {
  type: typeof SET_IS_SUBMITTING;
  payload: boolean;
};

export type SetDriverDataType = {
  type: typeof SET_DRIVER_DATA;
  payload: any;
};

export type SetDriversDataType = {
  type: typeof SET_DRIVERS_DATA;
  payload: any;
};

export type SetDriversMetadataType = {
  type: typeof SET_DRIVERS_METADATA;
  payload: any;
};

export type SetSearchedDriversDataType = {
  type: typeof SET_SEARCHED_DRIVERS_DATA;
  payload: any;
};

export type ResetSearchedDriversDataType = {
  type: typeof RESET_SEARCHED_DRIVERS_DATA;
  payload: any;
};

export type CreateDriverDataType = {
  type: typeof CREATE_DRIVER_DATA;
  payload: any;
};

export type RemoveDriverDataType = {
  type: typeof REMOVE_DRIVER_DATA;
  payload: any;
};

export type UpdateDriverDataType = {
  type: typeof UPDATE_DRIVER_DATA;
  payload: any;
};

export type DriverActionTypes =
  | SetIsLoadingType
  | SetIsSubmittingType
  | SetDriverDataType
  | SetDriversDataType
  | SetDriversMetadataType
  | SetSearchedDriversDataType
  | ResetSearchedDriversDataType
  | CreateDriverDataType
  | RemoveDriverDataType
  | UpdateDriverDataType;
