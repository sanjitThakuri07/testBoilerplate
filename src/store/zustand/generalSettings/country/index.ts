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

const useCountryStore = create((set) => ({
  countrys: [],
  individualCountry: {},
  loading: false,

  // multiple response data
  fetchCountrys: async ({ query, changeFormat }: any) => {
    set({ loading: true });
    const apiResponse = await fetchApI({
      url: url?.country + "/",
      setterFunction: (data: any) => {
        if (changeFormat) {
          //   const changeData = data?.map((opt: any) => ({
          //     value: opt.id,
          //     label: opt.name,
          //     phone_code: opt.phone_code,
          //   }));
          set({ countrys: data, loading: false });
        } else {
          set({ countrys: data || [], loading: false });
        }
      },
    });
    !apiResponse && set({ loading: false });
    return apiResponse;
  },

  fetchIndividualCountry: async ({ id }: any) => {
    set({ loading: true });
    const apiResponse = await fetchIndividualApi({
      url: url?.country,
      id: id,
      setterFunction: (data: any) => {
        set({ individualCountry: data, loading: false });
      },
    });
    !apiResponse && set({ loading: false });
    return apiResponse;
  },

  updateCountryStore: async ({ values, id, updateState, enqueueSnackbar }: any) => {
    set({ loading: true });
    const apiResponse = await putApiData({
      values: values,
      id,
      url: url?.country,
      // setterLoading: setLoading,
      enqueueSnackbar: enqueueSnackbar,
      setterFunction: (data: any) => {
        updateState?.(data);
        set((state: any) => {
          const filteredData = state?.countrys?.filter((data: any) => data?.id !== id);

          return {
            countrys: [{ ...data?.data, name: values?.name }, ...filteredData],
            individualCountry: data?.data,
            loading: false,
          };
        });
      },
    });
    !apiResponse && set({ loading: false });
    return apiResponse;
  },

  postCountry: async ({ values, id, updateState, enqueueSnackbar }: any) => {
    set({ loading: true });
    const apiResponse = await postApiData({
      values: values,
      url: "/" + url?.country + "/",
      // setterLoading: setLoading,
      enqueueSnackbar: enqueueSnackbar,
      setterFunction: (data: any) => {
        updateState?.(data);
        set((state: any) => {
          let datass = (data?.data || [])?.map((it: any) => ({ ...it, name: values?.[0]?.name }));
          return {
            individualCountry: {},
            countrys: [...(datass || []), ...state.countrys],
            loading: false,
          };
        });
      },
    });
    !apiResponse && set({ loading: false });
    return apiResponse;
  },

  removeCountry: async ({ values, enqueueSnackbar }: any) => {
    set({ loading: true });
    const apiResponse = await putApiData({
      values: values,
      url: url?.country + "/",
      // setterLoading: setLoading,
      enqueueSnackbar: enqueueSnackbar,
      setterFunction: (data: any) => {
        set((state: any) => {
          const filteredData = state?.countrys?.filter(
            (data: any) => !values?.config_ids?.includes(data?.id),
          );

          return {
            countrys: filteredData,
            individualCountry: {},
            loading: false,
          };
        });
      },
    });
    !apiResponse && set({ loading: false });
    return apiResponse;
  },
}));

export default useCountryStore;
