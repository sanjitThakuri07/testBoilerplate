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

const useTerriotryStore = create((set) => ({
  terriotrys: [],
  individualTerriotry: {},
  loading: false,

  // multiple response data
  fetchTerriotrys: async ({ query, changeFormat }: any) => {
    set({ loading: true });
    const apiResponse = await fetchApI({
      url: url?.terriotry + "/",
      setterFunction: (data: any) => {
        if (changeFormat) {
          //   const changeData = data?.map((opt: any) => ({
          //     value: opt.id,
          //     label: opt.name,
          //     phone_code: opt.phone_code,
          //   }));
          set({ terriotrys: data, loading: false });
        } else {
          set({ terriotrys: data || [], loading: false });
        }
      },
    });
    !apiResponse && set({ loading: false });
    return apiResponse;
  },

  fetchIndividualTerriotry: async ({ id }: any) => {
    set({ loading: true });
    const apiResponse = await fetchIndividualApi({
      url: url?.terriotry,
      id: id,
      setterFunction: (data: any) => {
        set({ individualTerriotry: data, loading: false });
      },
    });
    !apiResponse && set({ loading: false });
    return apiResponse;
  },

  updateTerriotryStore: async ({ values, id, updateState, enqueueSnackbar }: any) => {
    set({ loading: true });
    const apiResponse = await putApiData({
      values: values,
      id,
      url: url?.terriotry,
      // setterLoading: setLoading,
      enqueueSnackbar: enqueueSnackbar,
      setterFunction: (data: any) => {
        updateState?.(data);
        set((state: any) => {
          const filteredData = state?.terriotrys?.filter((data: any) => data?.id !== id);

          return {
            terriotrys: [{ ...data?.data }, ...filteredData],
            individualTerriotry: data?.data,
            loading: false,
          };
        });
      },
    });
    !apiResponse && set({ loading: false });
    return apiResponse;
  },

  postTerriotry: async ({ values, id, updateState, enqueueSnackbar }: any) => {
    set({ loading: true });
    const apiResponse = await postApiData({
      values: values,
      url: "/" + url?.terriotry + "/",
      // setterLoading: setLoading,
      enqueueSnackbar: enqueueSnackbar,
      setterFunction: (data: any) => {
        updateState?.(data);
        set((state: any) => {
          return {
            individualTerriotry: {},
            terriotrys: [...(data?.data || []), ...state.terriotrys],
            loading: false,
          };
        });
      },
    });
    !apiResponse && set({ loading: false });
    return apiResponse;
  },

  removeTerriotry: async ({ values, enqueueSnackbar }: any) => {
    set({ loading: true });
    const apiResponse = await putApiData({
      values: values,
      url: url?.terriotry + "/",
      // setterLoading: setLoading,
      enqueueSnackbar: enqueueSnackbar,
      setterFunction: (data: any) => {
        set((state: any) => {
          const filteredData = state?.terriotrys?.filter(
            (data: any) => !values?.config_ids?.includes(data?.id),
          );

          return {
            terriotrys: filteredData,
            individualTerriotry: {},
            loading: false,
          };
        });
      },
    });
    !apiResponse && set({ loading: false });
    return apiResponse;
  },
}));

export default useTerriotryStore;
