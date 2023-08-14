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

const useInspectionStatusStore = create((set) => ({
  inspectionStatuss: [],
  individualInspectionStatus: {},
  loading: false,

  // multiple response data
  fetchInspectionStatuss: async ({ query, changeFormat }: any) => {
    set({ loading: true });
    const apiResponse = await fetchApI({
      url: url?.inspectionStatus + "/",
      setterFunction: (data: any) => {
        if (changeFormat) {
          set({ inspectionStatuss: data, loading: false });
        } else {
          set({ inspectionStatuss: data || [], loading: false });
        }
      },
      queryParam: query,
    });
    !apiResponse && set({ loading: false });
    return apiResponse;
  },

  fetchIndividualInspectionStatus: async ({ id }: any) => {
    set({ loading: true });
    const apiResponse = await fetchIndividualApi({
      url: url?.inspectionStatus,
      id: id,
      setterFunction: (data: any) => {
        set({ individualInspectionStatus: data, loading: false });
      },
    });
    !apiResponse && set({ loading: false });
    return apiResponse;
  },

  updateInspectionStatusStore: async ({ values, id, updateState, enqueueSnackbar }: any) => {
    set({ loading: true });
    const apiResponse = await putApiData({
      values: values,
      id,
      url: url?.inspectionStatus,
      // setterLoading: setLoading,
      enqueueSnackbar: enqueueSnackbar,
      setterFunction: (data: any) => {
        updateState?.(data);
        set((state: any) => {
          const filteredData = state?.inspectionStatuss?.filter((data: any) => data?.id !== id);

          return {
            inspectionStatuss: [{ ...data?.data }, ...filteredData],
            individualInspectionStatus: data?.data,
            loading: false,
          };
        });
      },
    });
    !apiResponse && set({ loading: false });
    return apiResponse;
  },

  postInspectionStatus: async ({ values, id, updateState, enqueueSnackbar }: any) => {
    set({ loading: true });
    const apiResponse = await postApiData({
      values: values,
      url: "/" + url?.inspectionStatus + "/",
      // setterLoading: setLoading,
      enqueueSnackbar: enqueueSnackbar,
      setterFunction: (data: any) => {
        updateState?.(data);
        set((state: any) => {
          return {
            individualInspectionStatus: {},
            inspectionStatuss: [...(data?.data || []), ...state.inspectionStatuss],
            loading: false,
          };
        });
      },
    });
    !apiResponse && set({ loading: false });
    return apiResponse;
  },

  removeInspectionStatus: async ({ values, enqueueSnackbar }: any) => {
    set({ loading: true });
    const apiResponse = await putApiData({
      values: values,
      url: url?.inspectionStatus + "/",
      // setterLoading: setLoading,
      enqueueSnackbar: enqueueSnackbar,
      setterFunction: (data: any) => {
        set((state: any) => {
          const filteredData = state?.inspectionStatuss?.filter(
            (data: any) => !values?.config_ids?.includes(data?.id),
          );

          return {
            inspectionStatuss: filteredData,
            individualInspectionStatus: {},
            loading: false,
          };
        });
      },
    });
    !apiResponse && set({ loading: false });
    return apiResponse;
  },
}));

export default useInspectionStatusStore;
