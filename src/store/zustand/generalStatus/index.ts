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
import { ACTION_TYPE } from "../actionType";

const useGeneralStatusStore = create((set) => ({
  tableDatas: {
    items: [],
    headers: [],
    page: 1,
    pages: 1,
    size: 1,
    total: 0,
    archivedCount: 0,
  },
  generalStatuss: [],
  individualGeneralStatus: {},
  loading: false,

  // multiple response data
  fetchGeneralStatuss: async ({ query, getAll = false, changeFormat, signal }: any) => {
    set({ loading: true });
    const apiResponse = await fetchApI({
      url: url?.generalStatus + "/",
      setterFunction: (data: any) => {
        set({
          generalStatuss: getAll ? data?.items || [] : data || [],
          tableDatas: getAll ? { ...data, archivedCount: data?.info?.archived_count || 0 } : {},
          loading: false,
        });
      },
      getAll,
      signal,
      queryParam: query,
    });
    !apiResponse && set({ loading: false });
    return apiResponse;
  },

  fetchIndividualGeneralStatus: async ({ id }: any) => {
    set({ loading: true });
    const apiResponse = await fetchIndividualApi({
      url: url?.generalStatus,
      id: id,
      setterFunction: (data: any) => {
        set({ individualGeneralStatus: data, loading: false });
      },
    });
    !apiResponse && set({ loading: false });
    return apiResponse;
  },

  updateGeneralStatusStore: async ({ values, id, updateState, enqueueSnackbar }: any) => {
    set({ loading: true });
    const apiResponse = await putApiData({
      values: values,
      id,
      url: url?.generalStatus,
      // setterLoading: setLoading,
      enqueueSnackbar: enqueueSnackbar,
      setterFunction: (data: any) => {
        updateState?.(data);
        set((state: any) => {
          const filteredData = state?.generalStatuss?.filter((data: any) => data?.id !== id);

          return {
            generalStatuss: [{ ...data?.data }, ...filteredData],
            individualGeneralStatus: data?.data,
            loading: false,
          };
        });
      },
    });
    !apiResponse && set({ loading: false });
    return apiResponse;
  },

  postGeneralStatus: async ({ values, id, updateState, enqueueSnackbar }: any) => {
    set({ loading: true });
    const apiResponse = await postApiData({
      values: values,
      url: "/" + url?.generalStatus + "/",
      // setterLoading: setLoading,
      enqueueSnackbar: enqueueSnackbar,
      setterFunction: (data: any) => {
        updateState?.(data);
        set((state: any) => {
          return {
            individualGeneralStatus: {},
            generalStatuss: [...(data?.data || []), ...state.generalStatuss],
            loading: false,
          };
        });
      },
    });
    !apiResponse && set({ loading: false });
    return apiResponse;
  },

  removeGeneralStatus: async ({ values, enqueueSnackbar }: any) => {
    set({ loading: true });
    const apiResponse = await putApiData({
      values: values,
      url: url?.generalStatus + "/",
      // setterLoading: setLoading,
      enqueueSnackbar: enqueueSnackbar,
      setterFunction: (data: any) => {
        set((state: any) => {
          const filteredData = state?.generalStatuss?.filter(
            (data: any) => !values?.config_ids?.includes(data?.id),
          );

          return {
            generalStatuss: filteredData,
            individualGeneralStatus: {},
            loading: false,
          };
        });
      },
    });
    !apiResponse && set({ loading: false });
    return apiResponse;
  },

  tableActionHandler: async ({ values, enqueueSnackbar, type, URL = url?.generalStatus }: any) => {
    set({ loading: true });
    let apiResponse = false;

    switch (type) {
      case ACTION_TYPE.DELETE:
        apiResponse = await deleteAPiData({
          values: values,
          url: url?.generalStatus + "/",
          // setterLoading: setLoading,
          enqueueSnackbar: enqueueSnackbar,
          getAll: true,
          setterFunction: (data: any) => {
            set((state: any) => {
              let tableDatas = state.tableDatas || {};
              let items = tableDatas?.items?.filter((data: any) => !values?.includes(data?.id));
              return {
                loading: false,
                tableDatas: {
                  ...(tableDatas || {}),
                  archivedCount: tableDatas?.archivedCount + values?.length || 0,
                  items,
                },
                generalStatuss: items,
              };
            });
          },
        });
        break;
      case ACTION_TYPE.RESTORE:
        apiResponse = await postApiData({
          values: values,
          url: `/${url?.generalStatus}/${url?.restore}`,
          // setterLoading: setLoading,
          enqueueSnackbar: enqueueSnackbar,
          setterFunction: (data: any) => {
            set((state: any) => {
              console.log({ data });
              const updateData = state?.tableDatas?.items?.filter(
                (data: any) => !values?.includes(data?.id),
              );
              const updatedTableData = {
                ...(state.tableDatas || {}),
                items: updateData,
                archivedCount: state.tableDatas?.archivedCount - values?.length || 0,
              };

              return {
                generalStatuss: updateData,
                individualGeneralStatus: {},
                tableDatas: updatedTableData,
                loading: false,
              };
            });
          },
        });
        break;
      case ACTION_TYPE.DUPLICATE:
        apiResponse = await postApiData({
          values: values,
          url: `/${url?.generalStatus}/${url?.duplicate}/${values?.id}`,
          // setterLoading: setLoading,
          enqueueSnackbar: enqueueSnackbar,
          setterFunction: (data: any) => {
            set((state: any) => {
              console.log({ data });
              const updateData = [...(data?.data || []), ...(state?.tableDatas?.items || [])];
              const updatedTableData = {
                ...(state.tableDatas || {}),
                items: updateData,
                archivedCount: state.tableDatas?.archivedCount - values?.length || 0,
              };

              return {
                generalStatuss: updateData,
                individualGeneralStatus: {},
                tableDatas: updatedTableData,
                loading: false,
              };
            });
          },
        });
        break;
      default:
        break;
    }

    !apiResponse && set({ loading: false });
    return apiResponse;
  },
}));

export default useGeneralStatusStore;
