import create from "zustand";
import {
  fetchApI,
  postApiData,
  putApiData,
  fetchExternalApI,
  deleteAPiData,
  fetchIndividualApi,
} from "src/modules/apiRequest/apiRequest";
import { url } from "src/utils/url";

const useLocationStore = create((set) => ({
  locations: [],
  individualLocation: {},
  loading: false,

  // multiple response data
  fetchLocations: async ({ query, changeFormat }: any) => {
    set({ loading: true });
    const apiResponse = await fetchApI({
      url: url?.location + "/",
      setterFunction: (data: any) => {
        if (changeFormat) {
          //   const changeData = data?.map((opt: any) => ({
          //     value: opt.id,
          //     label: opt.name,
          //     phone_code: opt.phone_code,
          //   }));
          set({ locations: data, loading: false });
        } else {
          set({ locations: data || [], loading: false });
        }
      },
    });
    !apiResponse && set({ loading: false });
    return apiResponse;
  },

  fetchIndividualLocation: async ({ id }: any) => {
    set({ loading: true });
    const apiResponse = await fetchIndividualApi({
      url: url?.location,
      id: id,
      setterFunction: (data: any) => {
        set({ individualLocation: data, loading: false });
      },
    });
    !apiResponse && set({ loading: false });
    return apiResponse;
  },

  updateLocationStore: async ({ values, id, updateState, enqueueSnackbar }: any) => {
    set({ loading: true });
    const apiResponse = await putApiData({
      values: values,
      id,
      url: url?.location,
      // setterLoading: setLoading,
      enqueueSnackbar: enqueueSnackbar,
      setterFunction: (data: any) => {
        updateState?.(data);
        set((state: any) => {
          const filteredData = state?.locations?.filter((data: any) => data?.id !== id);

          return {
            locations: [{ ...data?.data }, ...filteredData],
            individualLocation: data?.data,
            loading: false,
          };
        });
      },
    });
    !apiResponse && set({ loading: false });
    return apiResponse;
  },

  postLocation: async ({ values, id, updateState, enqueueSnackbar }: any) => {
    set({ loading: true });
    const apiResponse = await postApiData({
      values: values,
      url: "/" + url?.location + "/",
      // setterLoading: setLoading,
      enqueueSnackbar: enqueueSnackbar,
      setterFunction: (data: any) => {
        updateState?.(data);
        set((state: any) => {
          return {
            individualLocation: {},
            locations: [...(data?.data || []), ...state.locations],
            loading: false,
          };
        });
      },
    });
    !apiResponse && set({ loading: false });
    return apiResponse;
  },

  removeLocation: async ({ values, enqueueSnackbar }: any) => {
    set({ loading: true });
    const apiResponse = await putApiData({
      values: values,
      url: url?.location + "/",
      // setterLoading: setLoading,
      enqueueSnackbar: enqueueSnackbar,
      setterFunction: (data: any) => {
        set((state: any) => {
          const filteredData = state?.locations?.filter(
            (data: any) => !values?.config_ids?.includes(data?.id),
          );

          return {
            locations: filteredData,
            individualLocation: {},
            loading: false,
          };
        });
      },
    });
    !apiResponse && set({ loading: false });
    return apiResponse;
  },
}));

export default useLocationStore;
