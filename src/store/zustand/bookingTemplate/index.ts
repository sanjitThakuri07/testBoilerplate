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

const useBookingTemplateStore = create((set) => ({
  bookingTemplates: [],
  individualBookingTemplate: {},
  loading: false,

  // multiple response data
  fetchBookingTemplates: async ({ query, changeFormat }: any) => {
    set({ loading: true });
    const apiResponse = await fetchApI({
      url: url?.bookingTemplate + "/",
      setterFunction: (data: any) => {
        if (changeFormat) {
          //   const changeData = data?.map((opt: any) => ({
          //     value: opt.id,
          //     label: opt.name,
          //     phone_code: opt.phone_code,
          //   }));
          set({ bookingTemplates: data, loading: false });
        } else {
          set({ bookingTemplates: data || [], loading: false });
        }
      },
    });
    !apiResponse && set({ loading: false });
    return apiResponse;
  },

  fetchIndividualBookingTemplate: async ({ id }: any) => {
    set({ loading: true });
    const apiResponse = await fetchIndividualApi({
      url: url?.bookingTemplate,
      id: id,
      setterFunction: (data: any) => {
        set({ individualBookingTemplate: data, loading: false });
      },
    });
    !apiResponse && set({ loading: false });
    return apiResponse;
  },

  updateBookingTemplateStore: async ({ values, id, updateState, enqueueSnackbar }: any) => {
    set({ loading: true });
    const apiResponse = await putApiData({
      values: values,
      id,
      url: url?.bookingTemplate,
      // setterLoading: setLoading,
      enqueueSnackbar: enqueueSnackbar,
      setterFunction: (data: any) => {
        updateState?.(data);
        set((state: any) => {
          const filteredData = state?.bookingTemplates?.filter((data: any) => data?.id !== id);

          return {
            bookingTemplates: [{ ...data?.data, name: values?.name }, ...filteredData],
            individualBookingTemplate: data?.data,
            loading: false,
          };
        });
      },
    });
    !apiResponse && set({ loading: false });
    return apiResponse;
  },

  postBookingTemplate: async ({ values, id, updateState, enqueueSnackbar }: any) => {
    set({ loading: true });
    const apiResponse = await postApiData({
      values: values,
      url: "/" + url?.bookingTemplate + "/",
      // setterLoading: setLoading,
      enqueueSnackbar: enqueueSnackbar,
      setterFunction: (data: any) => {
        updateState?.(data);
        set((state: any) => {
          let datass = (data?.data || [])?.map((it: any) => ({ ...it, name: values?.[0]?.name }));
          return {
            individualBookingTemplate: {},
            bookingTemplates: [...(datass || []), ...state.bookingTemplates],
            loading: false,
          };
        });
      },
    });
    !apiResponse && set({ loading: false });
    return apiResponse;
  },

  removeBookingTemplate: async ({ values, enqueueSnackbar }: any) => {
    set({ loading: true });
    const apiResponse = await putApiData({
      values: values,
      url: url?.bookingTemplate + "/",
      // setterLoading: setLoading,
      enqueueSnackbar: enqueueSnackbar,
      setterFunction: (data: any) => {
        set((state: any) => {
          const filteredData = state?.bookingTemplates?.filter(
            (data: any) => !values?.config_ids?.includes(data?.id),
          );

          return {
            bookingTemplates: filteredData,
            individualBookingTemplate: {},
            loading: false,
          };
        });
      },
    });
    !apiResponse && set({ loading: false });
    return apiResponse;
  },
}));

export default useBookingTemplateStore;
