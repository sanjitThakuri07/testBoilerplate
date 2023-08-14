import { Reducer } from "redux";

import {
  createState,
  removeState,
  resetSearchState,
  setSearchState,
  updateState,
} from "src/utils/store";
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

import { DriverActionTypes, DriverState } from "./types";

const entity = "drivers";

export const initialState: DriverState = {
  isLoading: false,
  isSubmitting: false,

  driver: undefined,
  drivers: [],

  searchedDrivers: [],

  metadata: undefined,
};

const reducer: Reducer<DriverState> = (
  state = initialState,
  action: DriverActionTypes,
): DriverState => {
  switch (action.type) {
    case SET_IS_LOADING:
      return { ...state, isLoading: action.payload };

    case SET_IS_SUBMITTING:
      return { ...state, isSubmitting: action.payload };

    case SET_DRIVER_DATA:
      return { ...state, driver: action.payload };

    case SET_DRIVERS_DATA:
      return { ...state, drivers: action.payload };

    case SET_DRIVERS_METADATA:
      return { ...state, metadata: action.payload };

    case SET_SEARCHED_DRIVERS_DATA:
      return setSearchState({
        state,
        action,
        local: state.drivers,
        entity,
      });

    case RESET_SEARCHED_DRIVERS_DATA:
      return resetSearchState({
        state,
      });

    case CREATE_DRIVER_DATA:
      return createState({
        state,
        action,
        local: state.drivers,
        entity,
      });

    case UPDATE_DRIVER_DATA:
      return updateState({
        state,
        action,
        local: state.drivers,
        entity,
      });

    case REMOVE_DRIVER_DATA:
      return removeState({
        state,
        action,
        local: state.drivers,
        entity,
      });

    default:
      return state;
  }
};

export default reducer;
