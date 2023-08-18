import {
  fetchApI,
  fetchExternalApI,
  postApiData,
  putApiData,
} from "src/modules/apiRequest/apiRequest";
import create from "zustand";

const useApiOptionsStore = create((set) => ({
  multipleResponseData: [],
  internalResponseData: {},
  globalResponseData: [],
  externalResponseData: [],
  individualResponseData: {},
  templateInternalResponseData: [],
  loading: false,

  // multiple response data
  fetchMultipleResponseData: async ({ query }: any) => {
    set({ loading: true });
    const apiResponse = await fetchApI({
      url: "multiple-response/",
      setterFunction: (data: any) => {
        set({ multipleResponseData: data, loading: false });
      },
    });
    !apiResponse && set({ loading: false });
    return apiResponse;
  },
  fetchTemplateInternalResponseData: async ({ query }: any) => {
    set({ loading: true });
    const apiResponse = await fetchApI({
      url: "internal-response/",
      setterFunction: (data: any) => {
        set({ templateInternalResponseData: data, loading: false });
      },
    });
    !apiResponse && set({ loading: false });
    return apiResponse;
  },

  updateMultipleResponseData: async ({ values, id, updateState, enqueueSnackbar }: any) => {
    set({ loading: true });
    return await putApiData({
      values: values,
      id,
      url: "multiple-response",
      // setterLoading: setLoading,
      enqueueSnackbar: enqueueSnackbar,
      setterFunction: (data: any) => {
        updateState?.(data);
        set((state: any) => {
          const filteredData = state?.multipleResponseData?.filter((data: any) => data?.id !== id);

          return { multipleResponseData: [{ ...data?.data }, ...filteredData], loading: false };
        });
      },
      domain: "Multiple Response",
    });
  },

  postMultipleResponseData: async ({ values, id, updateState, enqueueSnackbar }: any) => {
    set({ loading: true });
    return await postApiData({
      values: values,
      url: "/multiple-response/",
      // setterLoading: setLoading,
      enqueueSnackbar: enqueueSnackbar,
      setterFunction: (data: any) => {
        updateState?.(data);
        set((state: any) => {
          return {
            multipleResponseData: [{ ...data?.data }, ...state.multipleResponseData],
            loading: false,
          };
        });
      },
      domain: "Multiple Response",
    });
  },

  // internal response data
  fetchInternalResponseData: async ({
    key,
    url,
    requestApi = true,
    queryParam,
    replace = true,
  }: any) => {
    set({ loading: true });
    let apiResponse: any = false;
    if (requestApi) {
      apiResponse = await fetchApI({
        url: url,
        queryParam: queryParam,
        setterFunction: (data: any) => {
          set((state: any) => {
            if (key) {
              return {
                internalResponseData: { ...state.internalResponseData, [key]: data },
                loading: false,
              };
            }
            return { internalResponseData: {}, loading: false };
          });
        },
        replace,
      });
    } else {
      set((state: any) => ({
        loading: false,
        internalResponseData: { ...state.internalResponseData, [key]: [] },
      }));
    }
    !apiResponse && set({ loading: false });
    return apiResponse;
  },

  // global response data
  fetchGlobalResponseData: async ({ query }: any) => {
    set({ loading: true });
    await fetchApI({
      url: "global-response/",
      setterFunction: (data: any) => {
        set({ globalResponseData: data, loading: false });
      },
    });
  },

  updateGlobalResponseData: async ({ values, id, updateState, enqueueSnackbar }: any) => {
    set({ loading: true });
    return await putApiData({
      values: values,
      id,
      url: "global-response",
      // setterLoading: setLoading,
      // enqueueSnackbar: enqueueSnackbar,
      setterFunction: (data: any) => {
        updateState?.(data);
        set((state: any) => {
          const filteredData = state?.globalResponseData?.filter((data: any) => data?.id !== id);

          return { globalResponseData: [{ ...data?.data }, ...filteredData], loading: false };
        });
      },
      domain: "Multiple Response",
    });
  },

  postGlobalResponseData: async ({ values, id, updateState, enqueueSnackbar }: any) => {
    set({ loading: true });
    return await postApiData({
      values: values,
      url: "/global-response/",
      // setterLoading: setLoading,
      // enqueueSnackbar: enqueueSnackbar,
      setterFunction: (data: any) => {
        updateState?.(data);
        set((state: any) => {
          return {
            globalResponseData: [{ ...data?.data }, ...state.globalResponseData],
            loading: false,
          };
        });
      },
      domain: "Global Response",
    });
  },

  // external response data
  fetchExternalResponseData: async ({ key, url, apiOptions, apiQuery }: any) => {
    set({ loading: true });
    const apiResponse = await fetchApI({
      url: "external-response/",
      setterFunction: (data: any) => {
        set({ externalResponseData: data, loading: false });
      },
    });
    !apiResponse && set({ loading: false });
    return apiResponse;
  },

  fetchIndividualResponseData: async ({ key, url, apiOptions, apiQuery, token }: any) => {
    set({ loading: true });
    const apiResponse = await fetchExternalApI({
      url: apiOptions?.api + apiQuery,
      api_token: token || apiOptions?.api_token,
      setterFunction: (data: any) => {
        set((state: any) => {
          if (key) {
            return {
              individualResponseData: { ...data },
              loading: false,
            };
          }
          return { individualResponseData: {}, loading: false };
        });
      },
      replace: true,
    });
    !apiResponse && set({ loading: false });
    return apiResponse;
  },
}));

export default useApiOptionsStore;
