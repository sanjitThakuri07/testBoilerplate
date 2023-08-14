import create from "zustand";
import {
  fetchApI,
  postApiData,
  putApiData,
  fetchExternalApI,
  deleteAPiData,
  fetchIndividualApi,
  patchApiData,
} from "src/modules/apiRequest/apiRequest";
import { url } from "src/utils/url";

const useInvoiceStore = create((set) => ({
  invoices: [],
  individualInvoice: {},
  loading: false,
  analytics: {},

  // multiple response data
  fetchInvoices: async ({ query, changeFormat }: any) => {
    set({ loading: true });
    const apiResponse = await fetchApI({
      url: url?.invoice + "/",
      setterFunction: (data: any) => {
        if (changeFormat) {
          //   const changeData = data?.map((opt: any) => ({
          //     value: opt.id,
          //     label: opt.name,
          //     phone_code: opt.phone_code,
          //   }));
          set({ invoices: data, loading: false });
        } else {
          set({ invoices: data || [], loading: false });
        }
      },
    });
    !apiResponse && set({ loading: false });
    return apiResponse;
  },

  fetchIndividualInvoice: async ({ id }: any) => {
    set({ loading: true });
    const apiResponse = await fetchIndividualApi({
      url: url?.invoice,
      id: id,
      setterFunction: (data: any) => {
        set({ individualInvoice: data, loading: false });
      },
    });
    !apiResponse && set({ loading: false });
    return apiResponse;
  },

  updateInvoiceStore: async ({ values, id, updateState, enqueueSnackbar }: any) => {
    set({ loading: true });
    const apiResponse = await putApiData({
      values: values,
      id,
      url: url?.invoice,
      // setterLoading: setLoading,
      enqueueSnackbar: enqueueSnackbar,
      setterFunction: (data: any) => {
        updateState?.(data);
        set((state: any) => {
          const filteredData = state?.invoices?.filter((data: any) => data?.id !== id);

          return {
            invoices: [{ ...data?.data, name: values?.name }, ...filteredData],
            individualInvoice: data?.data,
            loading: false,
          };
        });
      },
    });
    !apiResponse && set({ loading: false });
    return apiResponse;
  },

  postInvoice: async ({ values, id, updateState, enqueueSnackbar }: any) => {
    set({ loading: true });
    const apiResponse = await postApiData({
      values: values,
      url: "/" + url?.invoice + "/",
      // setterLoading: setLoading,
      enqueueSnackbar: enqueueSnackbar,
      setterFunction: (data: any) => {
        updateState?.(data);
        set((state: any) => {
          let datass = (data?.data || [])?.map((it: any) => ({ ...it, name: values?.[0]?.name }));
          return {
            individualInvoice: {},
            invoices: [...(datass || []), ...state.invoices],
            loading: false,
          };
        });
      },
    });
    !apiResponse && set({ loading: false });
    return apiResponse;
  },

  removeInvoice: async ({ values, enqueueSnackbar }: any) => {
    set({ loading: true });
    const apiResponse = await putApiData({
      values: values,
      url: url?.invoice + "/",
      // setterLoading: setLoading,
      enqueueSnackbar: enqueueSnackbar,
      setterFunction: (data: any) => {
        set((state: any) => {
          const filteredData = state?.invoices?.filter(
            (data: any) => !values?.config_ids?.includes(data?.id),
          );

          return {
            invoices: filteredData,
            individualInvoice: {},
            loading: false,
          };
        });
      },
    });
    !apiResponse && set({ loading: false });
    return apiResponse;
  },

  getAnalytics: async ({ query, changeFormat }: any) => {
    set({ loading: true });
    const apiResponse = await fetchApI({
      url: url?.invoiceAnalytics,
      setterFunction: (data: any) => {
        set({ analytics: data || [], loading: false });
      },
      getAll: true,
      queryParam: query,
    });
    !apiResponse && set({ loading: false });
    return apiResponse;
  },

  changeInvoiceStatus: async ({ enqueueSnackbar, id, values }: any) => {
    set({ loading: true });
    const apiResponse = await patchApiData({
      values,
      id: id,
      url: url?.changeInvoiceStatus,
      enqueueSnackbar: enqueueSnackbar,
      domain: "Status",
    });

    !apiResponse && set({ loading: false });
    return apiResponse;
  },
}));

export default useInvoiceStore;
